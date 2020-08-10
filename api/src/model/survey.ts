import { connection } from '../helper/db';
import { ISurvey, ISurveyWithSource } from '../interface/db';
import { addMetadata, create, deleteRow, get, getList, update } from './base';

const table = 'survey';

export async function addSurveyMetadata(surveyId: number, key: string, value: any): Promise<boolean> {
    return addMetadata(table, surveyId, key, value);
}

export async function createSurvey(data: any): Promise<number | null> {
    return create(table, data);
}

export async function deleteSurvey(surveyId: number | string, getField: string = 'id'): Promise<boolean> {
    return deleteRow(table, surveyId, getField);
}

export async function getSurveys(): Promise<ISurvey[] | null> {
    return getList(table, 'name', 'asc');
}

export async function getSurvey(surveyId: number | string, getField: string = 'id'): Promise<ISurvey | null> {
    return get(table, surveyId, getField);
}

export async function getSurveyWithGroup(surveyId: number): Promise<ISurveyWithSource | null> {
    return connection<ISurveyWithSource>(table)
        .select(
            'survey.*',
            'survey_group.name as surveyGroupName',
            'survey_group.description as surveyGroupDescription',
            'survey_group.metadata as surveyGroupMetadata',
            'survey_group.source_plugin'
        )
        .join('survey_group', 'survey_group.id', '=', 'survey.survey_group_id')
        .where('survey.id', surveyId)
        .orderBy('survey.created_at', 'asc')
        .limit(1)
        .then((rows: any) => {
            return rows[0] ? rows[0] : null;
        })
        .catch((error: any) => {
            console.log(error);

            return null;
        });
}

export async function updateSurvey(surveyId: number, data: any, getField: string = 'id'): Promise<boolean> {
    return update(table, surveyId, data, getField);
}
