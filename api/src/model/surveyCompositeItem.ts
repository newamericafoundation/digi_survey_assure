import { connection } from '../helper/db';
import { ISurveyCompositeItem } from '../interface/db';
import { create } from './base';

const table = 'survey_composite_item';

export async function createCompositeItem(body: any): Promise<number | null> {
    return create(table, body);
}

export async function deleteCompositeItemsForComposite(compositeId: number): Promise<boolean> {
    return connection(table)
        .where('survey_composite_id', '=', compositeId)
        .del()
        .then((_result: any) => {
            return true;
        })
        .catch((error: any) => {
            console.log('DELETE error:', table, error);

            return false;
        });
}

export async function getCompositeItems(surveyCompositeId: number): Promise<ISurveyCompositeItem[] | null> {
    return connection(table)
        .where('survey_composite_id', '=', surveyCompositeId)
        .then((rows: any) => {
            return rows ? rows : null;
        })
        .catch((error: any) => {
            console.log('GET LIST error:', table, error);

            return null;
        });
}
