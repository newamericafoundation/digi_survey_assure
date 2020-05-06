import { connection } from '../helper/db';
import { ISurveyComposite } from '../interface/db';
import { create, deleteRow, get, update } from './base';

const table = 'survey_composite';

export async function createComposite(body: any): Promise<number | null> {
    return create(table, body);
}

export async function checkIfSurveyHasComposites(surveyId: number): Promise<boolean> {
    return connection(table)
        .count('* as count')
        .where('survey_id', '=', surveyId)
        .then((rows: any) => {
            return Number(rows[0].count) >= 1 ? true : false;
        })
        .catch((error: any) => {
            console.log('GET LIST error:', table, error);

            return false;
        });
}

export async function deleteComposite(compositeId: number): Promise<boolean> {
    return deleteRow(table, compositeId);
}

export async function getComposite(surveyCompositeId: number): Promise<ISurveyComposite | null> {
    return get(table, surveyCompositeId);
}

export async function getCompositeItemsInGroup(surveyCompositeGroupId: number): Promise<ISurveyComposite[] | null> {
    return connection(table)
        .where('survey_composite_group_id', '=', surveyCompositeGroupId)
        .orderBy('order', 'asc')
        .then((rows: any) => {
            return rows ? rows : null;
        })
        .catch((error: any) => {
            console.log('GET LIST error:', table, error);

            return null;
        });
}

export async function getCompositesForSurvey(surveyId: number): Promise<ISurveyComposite[] | null> {
    return connection(table)
        .where('survey_id', '=', surveyId)
        .orderBy('order', 'asc')
        .then((rows: any) => {
            return rows ? rows : null;
        })
        .catch((error: any) => {
            console.log('GET LIST error:', table, error);

            return null;
        });
}

export async function updateComposite(compositeId: number, data: any, getField: string = 'id'): Promise<boolean> {
    return update(table, compositeId, data, getField);
}
