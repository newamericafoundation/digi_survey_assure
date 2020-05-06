import { IQuestionType } from '../interface/db';
import { get } from './base';

const table = 'question_type';

export async function getQuestionType(surveyId: number, getField: string = 'id'): Promise<IQuestionType | null> {
    return get(table, surveyId, getField);
}
