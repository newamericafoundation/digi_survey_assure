import * as request from 'superagent';
import { INormalizerClass, IRegisterResponse } from '../../../interface/plugin';
import { getQuestionFromExternalId } from '../../../model/question';
import { getQuestionOptionFromRawValue } from '../../../model/questionOption';
import { getSurvey } from '../../../model/survey';
import { BaseNormalizerClass } from '../BaseNormalizer';
import { config } from './config';
import { runExclusionRules } from './data/exclude';
import { IQualtricsListenerPayload } from './interface';

class Qualtrics extends BaseNormalizerClass implements INormalizerClass {
    private _responseMetadata: any;
    private _responseRecordedDate: string;
    private _responseExternalId: string | number;

    public constructor() {
        super();

        this.config = config;
    }

    public async normalizeData(data: IQualtricsListenerPayload): Promise<IRegisterResponse[]> {
        const surveyResponseRequest: request.Response = await this.fetchSurveyResponseFromSource(data.SurveyID, data.ResponseID);

        const cleanData = runExclusionRules(surveyResponseRequest);
        if (!cleanData) { return []; }

        this._responseMetadata = cleanData;
        this._responseRecordedDate = cleanData.values.recordedDate;
        this._responseExternalId = data.ResponseID;

        const internalSurveyId = await getSurvey(data.SurveyID, 'external_source_id');
        if (!internalSurveyId) {
            console.log(`Could not find internal survey ID for data normalization using external survey source ID ${data.SurveyID}`);

            return [];
        }

        const formattedAnswers = [];
        for (const questionId of cleanData.displayedFields) {
            const question = await getQuestionFromExternalId(internalSurveyId.id, questionId);
            if (!question) { continue; }

            const submittedValue = cleanData.values[questionId];
            if (submittedValue || submittedValue === 0) {
                const questionOption = await getQuestionOptionFromRawValue(question.id, submittedValue);
                if (!questionOption) { continue; }

                formattedAnswers.push({
                    questionId: question.id,
                    questionOptionId: questionOption.id,
                });
            } else {
                continue;
            }
        }

        return formattedAnswers;
    }

    public simulateResponseBody(surveyId: string, responseId: string): IQualtricsListenerPayload {
        return {
            SurveyID: surveyId,
            ResponseID: responseId,
        };
    }

    private async fetchSurveyResponseFromSource(surveyId: string, responseId: string): Promise<any> {
        return request
            .get(`${this.config.apiUrl}/surveys/${surveyId}/responses/${responseId}`)
            .set('Content-type', 'application/json')
            .set('X-API-Token', this.config.apiSecretKey)
            .then((res: any) => {
                // res.body, res.headers, res.status
                if (res.status === 200) {
                    return res.body.result;
                } else {
                    console.log('There was an error importing the survey - survey response failed to retrieve from source:', JSON.stringify(res));

                    return null;
                }
            })
            .catch((err: any) => {
                console.log('There was an error importing the survey - survey response failed to retrieve from source:', err.message);

                return null;
            });
    }

    get responseExternalId(): any { return this._responseExternalId; }
    set responseExternalId(externalId: any) { this._responseExternalId = externalId; }
    get responseMetadata(): any { return this._responseMetadata; }
    set responseMetadata(metadata: any) { this._responseMetadata = metadata; }
    get responseRecordedDate(): string { return this._responseRecordedDate; }
    set responseRecordedDate(recordedDate: string) { this._responseRecordedDate = recordedDate; }
}

export function getPlugin(): Qualtrics {
    return new Qualtrics();
}
