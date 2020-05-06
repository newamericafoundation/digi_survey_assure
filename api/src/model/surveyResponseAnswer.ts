import { connection } from '../helper/db';
import { IQuestionOption, ISurveyResponseAnswer } from '../interface/db';
import { ISurveyResponseAnswerPayload } from '../interface/payload';
import { create, get } from './base';

const table = 'survey_response_answer';

export async function countTimesAQuestionOptionWasSelected(questionId: number, questionOptionId: number): Promise<number> {
    return connection(table)
        .count('*')
        .where('question_id', questionId)
        .where('question_option_id', questionOptionId)
        .then((results: any) => {
            return parseInt(results[0].count, 10);
        })
        .catch((error: any) => {
            console.log(error);

            return 0;
        });
}

export async function createSurveyResponseAnswer(data: ISurveyResponseAnswerPayload): Promise<number | null> {
    return create(table, data);
}

export async function getSurveyResponseAnswer(surveyResponseAnswerId: number): Promise<number | null> {
    return get(table, surveyResponseAnswerId, 'external_source_id');
}

export async function getAnswersForSurveyResponseForQuestions(surveyResponseId: number, questionIds: number[]): Promise<IQuestionOption[] | null> {
    return connection<IQuestionOption[]>(table)
        .select('question_option.*')
        .join('question_option', 'question_option.id', '=', 'survey_response_answer.question_option_id')
        .where('survey_response_answer.survey_response_id', '=', surveyResponseId)
        .whereIn('survey_response_answer.question_id', questionIds)
        .then((rows: any) => {
            return rows ? rows : null;
        })
        .catch((error: any) => {
            console.log('GET LIST error:', table, error);

            return null;
        });
}

export async function getAnswersForSurveyResponseForQuestion(surveyResponseId: number, questionId: number): Promise<IQuestionOption | null> {
    return connection<IQuestionOption[]>(table)
        .select('question_option.*')
        .join('question_option', 'question_option.id', '=', 'survey_response_answer.question_option_id')
        .where('survey_response_answer.survey_response_id', '=', surveyResponseId)
        .where('survey_response_answer.question_id', '=', questionId)
        .limit(1)
        .then((rows: any) => {
            return rows[0] ? rows[0] : null;
        })
        .catch((error: any) => {
            console.log('GET LIST error:', table, error);

            return null;
        });
}

export async function getAnswersForSurveyResponse(surveyResponseId: number): Promise<ISurveyResponseAnswer[] | null> {
    return connection<ISurveyResponseAnswer[]>(table)
        .where('survey_response_id', '=', surveyResponseId)
        .then((rows: any) => {
            return rows ? rows : null;
        })
        .catch((error: any) => {
            console.log('GET LIST error:', table, error);

            return null;
        });
}

/**
 * Takes an arrays of `survey_response.id` and counts how many times each question
 * option was selected for those response IDs alone. Used primarily in filtering.
 * 
 * @param questionOptionId
 * @param includedSurveyResponseIds 
 */
export async function getFilteredQuestionOptionCount(questionOptionId: number, includedSurveyResponseIds: number[]): Promise<number> {
    return connection(table)
        .count('*')
        .whereIn('survey_response_id', includedSurveyResponseIds)
        .where('question_option_id', questionOptionId)
        .limit(1)
        .then((results: any) => {
            return parseInt(results[0].count, 10);
        })
        .catch((error: any) => {
            console.log(error);

            return 0;
        });
}

/**
 * Primarily used for filtering, this gets a list of all survey response IDs that
 * selected a specific answer to a question. For example, if the question was 
 * "What is your gender?" this would let us filter answers to show only what
 * all females who submitted the survey replied.
 * 
 * @param questionId 
 * @param questionOptionId 
 */
export async function getResponsesThatSelectedQuestionOptionId(questionOptionId: number): Promise<ISurveyResponseAnswer[] | null> {
    return connection(table)
        .select('survey_response_id')
        .where('question_option_id', '=', questionOptionId)
        .then((rows: any) => {
            return rows ? rows : null;
        })
        .catch((error: any) => {
            console.log('getResponsesThatSelectedQuestionOptionId error:', table, error);

            return null;
        });
}
