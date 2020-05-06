import { getFilteredResults } from '../../../helper/surveyResponse';
import { ISurveyResponseWithBlockchain } from '../../../interface/augmented';
import { IQuestionOption, ISurveyComposite, ISurveyCompositeItem } from '../../../interface/db'
import { getQuestion } from '../../../model/question';
import { getQuestionOptions } from '../../../model/questionOption';
import { getSurveyResponses } from '../../../model/surveyResponse';
import { getAnswersForSurveyResponseForQuestions } from '../../../model/surveyResponseAnswer';
import { BaseFormula } from '../BaseFormula';
import { IFormula, IFormulaReturn } from '../interface';

/**
 * "Mean Cutoff" Formula
 * 
 * General Information
 * - survey_composite_item table controls which questions are added into the formula, the individual question options
 *      don't matter since it takes the average across all the questions in the set.
 * 
 * Database requirements:
 * - survey_composite.metadata.cutoff -> The value all the responses need to be at or above to be included in the final data set.
 * 
 * Step 1: get the applicable list of survey responses.
 *         -> No filters? Get all survey responses.
 *         -> Filters? Get filtered down applicable data set.
 *         --> NOTE: This uses a WHERE IN statement and at scale will not work well. CACHING is not optional at scale.
 *                   Implement it post-survey completion.
 * 
 * Step 2: Combine total of answers to questions in each survey response and get the average. If this is above
 *         the cutoff number, add it to the final dataset.
 *         --> NOTE: If they didn't answer a question in the set that isn't factored in.
 * 
 * Step 3: Once the final data set is created, do a standard average of all the above means/averages, divide
 *         by the total responses in the final data set.
 */
class MeanCutoff extends BaseFormula implements IFormula {
    public constructor() {
        super();
        this.explainer = 'Percentage of respondents whose average score across all questions, that make up the composite and which they answered, meet the criteria for the composite (average of %cutoff% or above).';
    }

    public async calculate(composite: ISurveyComposite, compositeItems: ISurveyCompositeItem[], useFilters: any = ''): Promise<IFormulaReturn> {
        if (!composite.metadata.cutoff) {
            throw new Error('No cutoff value detected for Mean Cutoff formula.');
        }

        const totalAnswerToQuestion = {};
        const questionAnswersWithinCutoffRange = {};
        const applicableQuestionOptions = [];
        const includedQuestionSet = [];
        for (const anItem of compositeItems) {
            if (!includedQuestionSet.includes(anItem.question_id)) {
                includedQuestionSet.push(anItem.question_id);
                totalAnswerToQuestion[anItem.question_id] = 0;
            }

            applicableQuestionOptions.push(anItem.question_option_id);

            if (!(anItem.question_id in questionAnswersWithinCutoffRange)) {
                questionAnswersWithinCutoffRange[anItem.question_id] = 0;
            }
        }

        const finalDataSetMeans = [];
        const skippedResponses = [];
        let filteredSurveyResponseIds = [];

        if (useFilters) {
            filteredSurveyResponseIds = await getFilteredResults(useFilters);
        } else {
            const surveyResponses = await getSurveyResponses(composite.survey_id);

            filteredSurveyResponseIds = surveyResponses.map((value: ISurveyResponseWithBlockchain) => { return value.id; });
        }

        for (const surveyResponseId of filteredSurveyResponseIds) {
            // Grab the question option that this person chose for the questions in includedQuestionSet
            // Use the raw_value of that question option to see if it is at or above the
            const personsAnswers = await getAnswersForSurveyResponseForQuestions(surveyResponseId, includedQuestionSet);

            let totalQuestionsAnswered = 0;
            let thisResponseTotal = 0;
            for (const anAnswer of personsAnswers) {
                if (!anAnswer.raw_value) { continue; }

                const value = (typeof anAnswer.raw_value === 'string') ? parseFloat(anAnswer.raw_value) : anAnswer.raw_value;

                // This is for a breakdown of each individual question. Required for the question percentages.
                if (value >= composite.metadata.cutoff) {
                    questionAnswersWithinCutoffRange[anAnswer.question_id] += 1;
                }

                totalQuestionsAnswered += 1;
                totalAnswerToQuestion[anAnswer.question_id] += 1;
                thisResponseTotal += value;
            }

            const average = thisResponseTotal / totalQuestionsAnswered;

            if (average >= composite.metadata.cutoff) {
                finalDataSetMeans.push(average);
            } else {
                skippedResponses.push({
                    surveyResponseId,
                    average
                });
            }
        }

        // May want to make this reusable along with one in average formula
        const returnQuestionData = [];
        for (const aQuestion of includedQuestionSet) {
            const questionData = await getQuestion(aQuestion);

            const questionOptionData = await getQuestionOptions(aQuestion);

            // Total for this question 
            const questionComposite = (questionAnswersWithinCutoffRange[aQuestion] / totalAnswerToQuestion[aQuestion]) * 100;

            returnQuestionData.push({
                composite: parseFloat(questionComposite.toFixed(2)),
                question: questionData,
                questionOptions: questionOptionData.filter((anOption: IQuestionOption) => {
                    return applicableQuestionOptions.includes(anOption.id);
                })
            });
        }

        const totalOfAverages = finalDataSetMeans.reduce((a: number, b: number) => a + b, 0);

        const averageMean = totalOfAverages / finalDataSetMeans.length;
        const finalValue = (finalDataSetMeans.length / filteredSurveyResponseIds.length) * 100;

        return {
            total: finalValue,
            questions: returnQuestionData,
            totalResponsesFactoredByQuestion: totalAnswerToQuestion,
            explainer: this.macros(this.explainer, { "cutoff": composite.metadata.cutoff }),
            metadata: {
                averageMean: averageMean,
                skippedResponses: skippedResponses,
            }
        };
    }
}

export function getPlugin(): MeanCutoff {
    return new MeanCutoff();
}
