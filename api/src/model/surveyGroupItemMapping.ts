import { ISurveyGroupItemMapping } from '../interface/db';
import { get } from './base';

const table = 'survey_group_item_mapping';

export async function getSurveyGroupItemMapping(questionId: number): Promise<ISurveyGroupItemMapping | null> {
    return get(table, questionId, 'question_id');
}
