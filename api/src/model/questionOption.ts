import { connection } from '../helper/db';
import { IQuestionOption } from '../interface/db';
import { create, update } from './base';

const table = 'question_option';

export async function createQuestionOption(data: any): Promise<number | null> {
    return create(table, data);
}

export async function getQuestionOptionFromRawValue(questionId: number, rawValue: number | string): Promise<IQuestionOption | null> {
    return connection<IQuestionOption>(table)
        .where('question_id', '=', questionId)
        .where('raw_value', '=', rawValue)
        .then((rows: any) => {
            return rows[0] ? rows[0] : null;
        })
        .catch((error: any) => {
            console.log(error);

            return null;
        });
}

export async function getQuestionOptions(questionId: number): Promise<IQuestionOption[] | null> {
    return connection<IQuestionOption[]>(table)
        .where('question_id', questionId)
        .orderBy('order', 'asc')
        .then((rows: any) => {
            return rows ? rows : null;
        })
        .catch((error: any) => {
            console.log(error);

            return null;
        });
}

export async function increaseTimesSelected(questionOptionId: number): Promise<number | null> {
    return connection(table)
        .where('id', questionOptionId)
        .increment('times_selected', 1)
        .limit(1)
        .returning('times_selected')
        .then((updatedRows: any) => {
            return updatedRows[0] ? updatedRows[0].times_selected : null;
        })
        .catch((error: any) => {
            console.log(error);

            return null;
        });
}

export async function updateQuestionOption(id: number, data: any): Promise<boolean> {
    return update(table, id, data);
}
