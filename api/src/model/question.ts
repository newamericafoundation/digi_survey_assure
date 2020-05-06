import { connection } from '../helper/db';
import { IQuestion } from '../interface/db';
import { addMetadata, create, get, update } from './base';

const table = 'question';

export async function addQuestionMetadata(surveyId: number, key: string, value: any): Promise<boolean> {
    return addMetadata(table, surveyId, key, value);
}

export async function createQuestion(data: any): Promise<number | null> {
    return create(table, data);
}

export async function getPrivateQuestions(): Promise<IQuestion[] | null> {
    return connection(table)
        .where('public', false)
        .orderBy('survey_id', 'asc')
        .orderBy('order', 'asc')
        .orderBy('text', 'asc')
        .then((rows: any) => {
            return rows ? rows : null;
        })
        .catch((error: any) => {
            console.log('GET LIST error:', table, error);

            return null;
        });
}

export async function getQuestion(questionId: number): Promise<IQuestion | null> {
    return get(table, questionId);
}

export async function getQuestionFromExternalId(surveyId: number, externalId: string): Promise<IQuestion | null> {
    return connection<IQuestion[]>(table)
        .where('external_source_id', externalId)
        .where('survey_id', surveyId)
        .orderBy('order', 'asc')
        .then((rows: any) => {
            return rows[0] ? rows[0] : null;
        })
        .catch((error: any) => {
            console.log(error);

            return null;
        });

}

export async function getQuestionsInGroup(questionGroupId: number, publicOnly: boolean = true): Promise<IQuestion[] | null> {
    return connection<IQuestion[]>(table)
        .where('question_group_id', questionGroupId)
        .orderBy('order', 'asc')
        .modify((queryBuilder: any) => {
            if (publicOnly) {
                queryBuilder.where('public', '=', true);
            }
        })
        .then((rows: any) => {
            return rows ? rows : null;
        })
        .catch((error: any) => {
            console.log(error);

            return null;
        });
}

export async function getQuestionsOnSurvey(surveyId: number, publicOnly: boolean = true): Promise<IQuestion[] | null> {
    return connection<IQuestion[]>(table)
        .where('survey_id', surveyId)
        .orderBy('question_group_id', 'asc')
        .orderBy('order', 'asc')
        .modify((queryBuilder: any) => {
            if (publicOnly) {
                queryBuilder.where('public', '=', true);
            }
        })
        .then((rows: any) => {
            return rows ? rows : null;
        })
        .catch((error: any) => {
            console.log(error);

            return null;
        });
}

export async function updateQuestion(questionId: number, data: any): Promise<boolean> {
    return update(table, questionId, data);
}

export async function updateQuestionsInGroupPrivacy(questionGroupId: number, makePrivate: boolean = true): Promise<boolean> {
    return connection(table)
        .where('question_group_id', questionGroupId)
        .update({
            public: (makePrivate) ? false : true,
        })
        .limit(1)
        .then((updatedRows: any) => {
            return updatedRows ? true : false;
        })
        .catch((error: any) => {
            console.log(error);

            return false;
        });
}
