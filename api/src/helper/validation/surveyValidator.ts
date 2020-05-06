import { Validator } from 'node-input-validator';
import { ISurveyPayload } from '../../interface/payload';
import { ISurveyValidator } from '../../interface/validator';
import { getSurveyGroup } from '../../model/surveyGroup';

export default async function (inputData: ISurveyPayload): Promise<ISurveyValidator> {
    const validation = new Validator(inputData, {
        name: 'required',
        surveyGroupId: 'required|integer',
        externalSourceId: 'required',
        imageUrl: 'url',
        groupUrl: 'alphaDash',
        active: 'boolean',
    });

    const check = await validation.check();
    if (!check) {
        return {
            error: true,
            httpCode: 400,
            internalCode: 'E004',
            errorList: validation.errors,
            loaded: {
                surveyGroup: null,
            }
        };
    }

    const surveyGroupData = await getSurveyGroup(inputData.surveyGroupId);
    if (!surveyGroupData) {
        return {
            error: true,
            httpCode: 404,
            internalCode: 'E005',
            errorList: null,
            loaded: {
                surveyGroup: null,
            }
        };
    }

    return {
        error: false,
        loaded: {
            surveyGroup: surveyGroupData
        },
    };
}
