import { ISurveyGroup } from './db';
import { ISurveyPayload } from './payload';

export interface IHookSurveyCreate {
    body: ISurveyPayload;
    surveyId: number;
    surveyGroup: ISurveyGroup;
    listenerCode: string;
}

export interface IHookGetResponses {
    raw: any;
    responseIds: any[];
}
