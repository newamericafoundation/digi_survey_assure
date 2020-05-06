import { Validator } from 'node-input-validator';
import { ISurveyCompositeGroupPayload } from '../../interface/payload';
import { ISurveyCompositeGroupValidator } from '../../interface/validator';
import { getSurvey } from '../../model/survey';

export default async function (inputData: ISurveyCompositeGroupPayload, surveyId: number): Promise<ISurveyCompositeGroupValidator> {
    const validation = new Validator(inputData, {
        name: 'required',
        subcategory: 'integer',
        order: 'integer',
    });
    const check = await validation.check();
    if (!check) {
        return {
            error: true,
            httpCode: 400,
            internalCode: 'E004',
            errorList: validation.errors,
            loaded: {
                survey: null,
            },
        };
    }

    const surveyData = await getSurvey(surveyId);
    if (!surveyData) {
        return {
            error: true,
            httpCode: 400,
            internalCode: 'E002',
            errorList: null,
            loaded: {
                survey: null,
            },
        };
    }

    return {
        error: false,
        loaded: {
            survey: surveyData,
        },
    };
}
