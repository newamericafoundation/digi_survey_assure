import { Validator } from 'node-input-validator';
import { getPluginList } from '../../helper/plugins';
import { ISurveyCompositePayload } from '../../interface/payload';
import { ISurveyCompositeValidator } from '../../interface/validator';

export default async function (inputData: ISurveyCompositePayload): Promise<ISurveyCompositeValidator> {
    const validation = new Validator(inputData, {
        name: 'required',
        formula: 'required',
        survey_composite_group_id: 'integer',
        order: 'integer',
        cutoff: 'requiredIf:formula,meanCutoff',
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

    // Does the requested plugin exist?
    const pluginTypes = getPluginList('formula');
    if (!pluginTypes.includes(inputData.formula)) {
        return {
            error: true,
            httpCode: 404,
            internalCode: 'E040',
            errorList: null,
            loaded: null,
        };
    }

    // Ensure there are enough numerators.
    if (inputData.composite_items.length < 2) {
        return {
            error: true,
            httpCode: 400,
            internalCode: 'E042',
            errorList: null,
            loaded: null,
        };
    }

    return {
        error: false,
        loaded: null,
    };
}
