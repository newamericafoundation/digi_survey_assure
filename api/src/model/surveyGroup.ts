import { connection } from '../helper/db';
import { ISurvey, ISurveyGroup } from '../interface/db';
import { create, deleteRow, get, getList, update } from './base';

const table = 'survey_group';

export async function createSurveyGroup(data: any): Promise<number | null> {
    return create(table, data);
}

export async function deleteSurveyGroup(surveyId: number | string): Promise<boolean> {
    return deleteRow(table, surveyId);
}
export async function getSurveyGroup(surveyGroupId: number): Promise<ISurveyGroup | null> {
    return get(table, surveyGroupId);
}

export async function getSurveyGroups(): Promise<ISurveyGroup[] | null> {
    return getList(table);
}

export async function getSurveysInGroup(groupId: number): Promise<ISurvey[] | null> {
    return connection('survey')
        .where('survey_group_id', '=', groupId)
        .orderBy('created_at', 'asc')
        .then((rows: any) => {
            return rows ? rows : null;
        })
        .catch((error: any) => {
            console.log('GET LIST error:', table, error);

            return null;
        });
}

export async function updateSurveyGroup(surveyGroupId: number, data: any, getField: string = 'id'): Promise<boolean> {
    return update(table, surveyGroupId, data, getField)
}
