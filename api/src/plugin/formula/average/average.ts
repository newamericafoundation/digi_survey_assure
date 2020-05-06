import { getQuestionResults } from '../../../helper/surveyResponse';
import { IQuestionOption, ISurveyComposite, ISurveyCompositeItem } from '../../../interface/db'
import { getQuestion } from '../../../model/question';
import { getQuestionOptions } from '../../../model/questionOption';
import { BaseFormula } from '../BaseFormula';
import { IFormula, IFormulaReturn } from '../interface';

class BasicAverage extends BaseFormula implements IFormula {
    public constructor() {
        super();
        this.explainer = 'Calculated by getting the percent of respondents who selected a response within the applicable data set for each question and then averages the percentages of all questions together to form a composite percentage.';
    }

    public async calculate(_composite: ISurveyComposite, compositeItems: ISurveyCompositeItem[], useFilters: any = ''): Promise<IFormulaReturn> {
        let combine = 0;
        const questionAnswers = {};
        const applicableQuestionOptions = [];
        const uniqueQuestion = [];
        const uniqueQuestionResults = {};
        const totalAnswerToQuestion = {};

        for (const item of compositeItems) {
            if (!uniqueQuestion.includes(item.question_id)) {
                const results = await getQuestionResults(item.question_id, useFilters);

                // Get the total number of answers for a specific question.
                //
                // Each composite item represents one question option that we include in the composite.
                // Given that composites include multiple questions, when applying filters, the total
                // responses will be different from question to question.
                totalAnswerToQuestion[item.question_id] = results.reduce((total: number, currentObject: IQuestionOption) => {
                    return total + currentObject.times_selected;
                }, 0);

                uniqueQuestionResults[item.question_id] = results;
                uniqueQuestion.push(item.question_id);
            }

            if (!(item.question_id in questionAnswers)) {
                questionAnswers[item.question_id] = 0;
            }

            applicableQuestionOptions.push(item.question_option_id);

            const thisResult = uniqueQuestionResults[item.question_id].filter((anOption: IQuestionOption) => anOption.id === item.question_option_id);

            const timesSelected = thisResult[0].times_selected;

            const totalResponsesForSurvey = totalAnswerToQuestion[item.question_id];

            const numerator = item.weight * timesSelected;

            questionAnswers[item.question_id] += numerator;

            combine += ((numerator / totalResponsesForSurvey) * 100);
        }

        // May want to make this reusable along with one in meanCutoff formula
        const returnQuestionData = [];
        for (const questionId of uniqueQuestion) {
            const questionData = await getQuestion(questionId);

            const questionOptionData = await getQuestionOptions(questionId);

            const questionComposite = ((questionAnswers[questionId] / totalAnswerToQuestion[questionId]) * 100);

            returnQuestionData.push({
                composite: questionComposite.toFixed(2),
                question: questionData,
                questionOptions: questionOptionData.filter((anOption: IQuestionOption) => {
                    return applicableQuestionOptions.includes(anOption.id);
                })
            });
        }

        return {
            total: combine / uniqueQuestion.length,
            questions: returnQuestionData,
            totalResponsesFactoredByQuestion: totalAnswerToQuestion,
            explainer: this.explainer,
        };
    }
}

export function getPlugin(): BasicAverage {
    return new BasicAverage();
}
