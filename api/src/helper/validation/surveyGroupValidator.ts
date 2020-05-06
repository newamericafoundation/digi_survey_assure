import { Validator } from 'node-input-validator';
import { ISurveyGroupPayload } from '../../interface/payload';
import { ISurveyGroupValidator } from '../../interface/validator';

export default async function (inputData: ISurveyGroupPayload): Promise<ISurveyGroupValidator> {
    const validation = new Validator(inputData, {
        title: 'required|maxLength:100',
        sourcePlugin: 'required',
        imageUrl: 'url',
        groupUrl: 'alphaDash',
    });

    const check = await validation.check();
    if (!check) {
        return {
            error: true,
            httpCode: 400,
            internalCode: 'E004',
            errorList: validation.errors,
            loaded: null,
        };
    }

    return {
        error: false,
        loaded: null,
    };
}
