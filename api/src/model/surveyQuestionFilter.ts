import { connection } from '../helper/db';
import { ISurveyQuestionFilter } from '../interface/db';
import { create } from './base';

const table = 'survey_question_filter';

export async function createQuestionFilter(body: any): Promise<number | null> {
    return create(table, body);
}

export async function deleteFiltersForSurvey(surveyId: number): Promise<boolean> {
    return connection(table)
        .where('survey_id', '=', surveyId)
        .del()
        .then((_result: any) => {
            return true;
        })
        .catch((error: any) => {
            console.log('DELETE error:', table, error);

            return false;
        });
}

export async function getSurveyFilterQuestions(surveyId: number): Promise<ISurveyQuestionFilter[] | null> {
    return connection(table)
        .where('survey_id', '=', surveyId)
        .orderBy('order', 'asc')
        .then((rows: any) => {
            return rows ? rows : null;
        })
        .catch((error: any) => {
            console.log('getSurveyFilterQuestions error:', table, error);

            return null;
        });
}
