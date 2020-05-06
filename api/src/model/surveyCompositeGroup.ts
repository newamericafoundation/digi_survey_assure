import { connection } from '../helper/db';
import { ISurveyCompositeGroup } from '../interface/db';
import { create, deleteRow, get, update } from './base';

const table = 'survey_composite_group';

export async function createCompositeGroup(data: any): Promise<number | null> {
    return create(table, data);
}

export async function deleteCompositeGroup(compositeId: number): Promise<boolean> {
    return deleteRow(table, compositeId);
}

export async function getRootCompositeGroupsForSurvey(surveyId: number): Promise<ISurveyCompositeGroup[] | null> {
    return connection(table)
        .where('survey_id', '=', surveyId)
        .orderByRaw('subcategory asc NULLS FIRST')
        .orderBy('order', 'asc')
        .then((rows: any) => {
            return rows ? rows : null;
        })
        .catch((error: any) => {
            console.log('GET LIST error:', table, error);

            return null;
        });
}

export async function getCompositeGroup(compositeGroupId: number): Promise<ISurveyCompositeGroup | null> {
    return get(table, compositeGroupId);
}

export async function getCompositeGroupSubcategories(compositeGroupId: number): Promise<ISurveyCompositeGroup | null> {
    return connection(table)
        .where('subcategory', '=', compositeGroupId)
        .orderBy('order', 'asc')
        .then((rows: any) => {
            return rows ? rows : null;
        })
        .catch((error: any) => {
            console.log('GET LIST error:', table, error);

            return null;
        });
}

export async function updateCompositeGroup(compositeGroupId: number, data: any, getField: string = 'id'): Promise<boolean> {
    return update(table, compositeGroupId, data, getField);
}
