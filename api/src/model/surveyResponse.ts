import { connection } from '../helper/db';
import { ISurveyResponseWithBlockchain } from '../interface/augmented';
import { ISurveyResponse } from '../interface/db';
import { ISurveyResponsePayload } from '../interface/payload';
import { create, get, update } from './base';

const table = 'survey_response';

export async function countTotalResponses(surveyId: number): Promise<number> {
    return connection(table)
        .where('survey_id', surveyId)
        .then((results: any) => {
            return results.length > 0 ? parseInt(results[0].count, 10) : 0;
        })
        .catch((error: any) => {
            console.log(error);

            return 0;
        });
}

export async function createSurveyResponse(data: ISurveyResponsePayload): Promise<number | null> {
    return create(table, data);
}

export async function getResponseFromExternalId(surveyId: number, externalId: string | number): Promise<ISurveyResponse | null> {
    return connection(table)
        .where('survey_id', surveyId)
        .where('external_source_id', externalId)
        .limit(1)
        .then((results: any) => {
            return results[0];
        })
        .catch((error: any) => {
            console.log(error);

            return null;
        });
}

export async function getResponsesWithoutBcTransaction(surveyId: number): Promise<ISurveyResponse[] | null> {
    return connection<ISurveyResponse[]>(table)
        .where('survey_id', surveyId)
        .whereNull('bc_transaction_id')
        .then((rows: any) => {
            return rows ? rows : null;
        })
        .catch((error: any) => {
            console.log(error);

            return null;
        });
}

export async function getSurveyResponse(surveyResponseId: number): Promise<ISurveyResponse | null> {
    return get(table, surveyResponseId);
}

export async function getSurveyResponses(surveyId: number): Promise<ISurveyResponse[] | null> {
    return connection<ISurveyResponseWithBlockchain[]>(table)
        .where('survey_id', surveyId)
        .then((rows: any) => {
            return rows ? rows : null;
        })
        .catch((error: any) => {
            console.log(error);

            return null;
        });
}

export async function getSurveyResponsesForSurveyWithBlockchainData(surveyId: number): Promise<ISurveyResponseWithBlockchain[] | null> {
    return connection<ISurveyResponseWithBlockchain[]>(table)
        .select(
            'survey_response.*',
            'bc_transaction.tx_id',
            'bc_transaction.receipt',
            'bc_transaction.network',
            'bc_transaction.merkle_root',
            'bc_transaction.created_at as date_sent_to_chain',
        )
        .join('bc_transaction', 'bc_transaction.id', '=', 'survey_response.bc_transaction_id')
        .where('survey_response.survey_id', surveyId)
        .then((rows: any) => {
            return rows ? rows : null;
        })
        .catch((error: any) => {
            console.log(error);

            return null;
        });
}

export async function updateSurveyResponseById(id: number, data: any): Promise<boolean> {
    return update(table, id, data);
}
