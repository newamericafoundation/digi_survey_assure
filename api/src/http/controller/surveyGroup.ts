import { errorReply, successReply } from '../../helper/response';
import surveyGroupValidator from '../../helper/validation/surveyGroupValidator';
import { ISurveyGroupPayload } from '../../interface/payload';
import { IResponse } from '../../interface/response';
import { checkIfSurveyHasComposites } from '../../model/surveyComposite';
import * as surveyGroupModel from '../../model/surveyGroup';

export async function createSurveyGroup(body: ISurveyGroupPayload): Promise<IResponse> {
    const validationCheck = await surveyGroupValidator(body);
    if (validationCheck.error) {
        return errorReply(validationCheck.httpCode, validationCheck.internalCode, validationCheck.errorList);
    }

    const surveyGroupId = await surveyGroupModel.createSurveyGroup(generateModelBodyFromPayloadBodyForSurveyGroup(body));

    if (!surveyGroupId) {
        return errorReply(500, 'E036', ['Internal error creating item at database level: please see logs.']);
    }

    return successReply(surveyGroupId, false, 201);
}

export async function deleteSurveyGroup(surveyGroupId: number): Promise<IResponse> {
    const deleteResult = await surveyGroupModel.deleteSurveyGroup(surveyGroupId);
    if (!deleteResult) {
        return errorReply(500, 'E044');
    }

    return successReply(deleteResult);
}

export async function getList(): Promise<IResponse> {
    const questionGroups = await surveyGroupModel.getSurveyGroups();
    if (!questionGroups) {
        return errorReply(404, 'E011');
    }

    return successReply(questionGroups);
}

export async function getSurveyGroup(surveyGroupId: number): Promise<IResponse> {
    const surveyGroup = await surveyGroupModel.getSurveyGroup(surveyGroupId);
    if (!surveyGroup) {
        return errorReply(404, 'E005');
    }

    return successReply(surveyGroup);
}

export async function getSurveysInGroup(groupId: number): Promise<IResponse> {
    const surveys = await surveyGroupModel.getSurveysInGroup(groupId);

    const finalReturn = [];
    for (const survey of surveys) {
        const hasComposites = await checkIfSurveyHasComposites(survey.id);

        finalReturn.push({
            ...survey,
            has_composites: hasComposites
        });
    }

    return successReply(finalReturn);
}

export async function updateSurveyGroup(surveyGroupId: number, body: ISurveyGroupPayload): Promise<IResponse> {
    const validationCheck = await surveyGroupValidator(body);
    if (validationCheck.error) {
        return errorReply(validationCheck.httpCode, validationCheck.internalCode, validationCheck.errorList);
    }

    const updated = await surveyGroupModel.updateSurveyGroup(surveyGroupId, generateModelBodyFromPayloadBodyForSurveyGroup(body));
    if (!updated) {
        return errorReply(500, 'E043', ['Internal error updating item at database level: please see logs.']);
    }

    return successReply(updated);
}

function generateModelBodyFromPayloadBodyForSurveyGroup(body: ISurveyGroupPayload): any {
    return {
        name: body.title,
        description: ('description' in body) ? body.description : null,
        source_plugin: body.sourcePlugin,
        metadata: {
            image: ('imageUrl' in body) ? body.imageUrl : null,
            custom_route_url: ('groupUrl' in body) ? body.groupUrl : null,
        },
    };
}
