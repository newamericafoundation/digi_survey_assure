import { connection } from '../helper/db';
import { IQuestionGroup } from '../interface/db';
import { create, get, update } from './base';

const table = 'question_group';

export async function createQuestionGroup(data: any): Promise<number | null> {
    return create(table, data);
}

export async function getPrivateQuestionGroups(): Promise<IQuestionGroup[] | null> {
    return connection(table)
        .where('display', false)
        .orderBy('survey_id', 'asc')
        .orderBy('order', 'asc')
        .orderBy('name', 'asc')
        .then((rows: any) => {
            return rows ? rows : null;
        })
        .catch((error: any) => {
            console.log('GET LIST error:', table, error);

            return null;
        });
}

export async function getQuestionGroup(questionGroupId: number): Promise<IQuestionGroup | null> {
    return get(table, questionGroupId);
}

export async function getQuestionGroups(surveyId: number): Promise<IQuestionGroup[] | null> {
    return connection<IQuestionGroup[]>(table)
        .where('survey_id', surveyId)
        .where('display', true)
        .orderBy('order', 'asc')
        .then((rows: any) => {
            return rows ? rows : null;
        })
        .catch((error: any) => {
            console.log(error);

            return null;
        });
}

export async function updateQuestionGroup(questionGroupId: number, data: any): Promise<boolean> {
    return update(table, questionGroupId, data);
}
