import { connection } from '../helper/db';
import { IQuestionLanguage } from '../interface/db';
import { create } from './base';

const table = 'question_option_language';

export async function createQuestionOptionLanguage(data: any): Promise<number | null> {
    return create(table, data);
}

export async function getQuestionOptionLanguage(questionOptionId: number, language: string): Promise<IQuestionLanguage | null> {
    return connection(table)
        .where('question_option_id', questionOptionId)
        .where('language', language)
        .then((rows: any) => {
            return rows[0] ? rows[0] : null;
        })
        .catch((error: any) => {
            console.log('GET error:', error);

            return null;
        });
}
