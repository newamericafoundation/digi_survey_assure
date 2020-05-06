import { ISurvey, ISurveyGroup } from './db';

interface IBaseValidator {
    error: boolean;
    httpCode?: number;
    internalCode?: string;
    errorList?: any;
}

export interface ISurveyGroupValidator extends IBaseValidator {
    loaded: null;
}

export interface ISurveyValidator extends IBaseValidator {
    loaded: {
        surveyGroup: ISurveyGroup;
    };
}

export interface ISurveyCompositeGroupValidator extends IBaseValidator {
    loaded: {
        survey: ISurvey;
    };
}

export interface ISurveyCompositeValidator extends IBaseValidator {
    loaded: null;
}
