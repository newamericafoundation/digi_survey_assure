import { buildCompositeGroupTree } from '../../helper/composites';
import { errorReply, successReply } from '../../helper/response';
import compositeGroupValidator from '../../helper/validation/compositeGroupValidator';
import { ISurveyCompositeGroup } from '../../interface/db';
import { ISurveyCompositeGroupPayload } from '../../interface/payload';
import { IResponse } from '../../interface/response';
import * as surveyCompositeModel from '../../model/surveyComposite';
import * as surveyCompositeGroupModel from '../../model/surveyCompositeGroup';

export async function createCompositeGroup(surveyId: number, body: ISurveyCompositeGroupPayload): Promise<IResponse> {
    const validationCheck = await compositeGroupValidator(body, surveyId);
    if (validationCheck.error) {
        return errorReply(validationCheck.httpCode, validationCheck.internalCode, validationCheck.errorList);
    }

    const createData = await surveyCompositeGroupModel.createCompositeGroup(generateModelBodyFromPayloadBodyForCompositeGroup(body, surveyId));
    if (!createData) { return errorReply(500, 'E038'); }

    return successReply(createData, false, 201);
}

export async function deleteCompositeGroup(compositeGroupId: number): Promise<IResponse> {
    const deleteResult = await surveyCompositeGroupModel.deleteCompositeGroup(compositeGroupId);
    if (!deleteResult) {
        return errorReply(500, 'E044');
    }

    return successReply(deleteResult);
}

export async function getCompositeGroup(compositeGroupId: number): Promise<IResponse> {
    const compositeGroup = await surveyCompositeGroupModel.getCompositeGroup(compositeGroupId);
    if (!compositeGroup) {
        return errorReply(404, 'E030');
    }

    return successReply(compositeGroup);
}

export async function getCompositeGroupsForSurvey(surveyId: number): Promise<IResponse> {
    const compositeGroups = await surveyCompositeGroupModel.getRootCompositeGroupsForSurvey(surveyId);
    if (!compositeGroups) {
        return errorReply(404, 'E029');
    }

    return successReply(compositeGroups);
}

export async function getCompositeGroupTree(compositeGroupId: number): Promise<IResponse> {
    const compositeGroup = await surveyCompositeGroupModel.getCompositeGroup(compositeGroupId);
    if (!compositeGroup) {
        return errorReply(404, 'E030');
    }

    const baseCompositeGroups = await buildCompositeGroupTree(compositeGroup.survey_id);

    return successReply(baseCompositeGroups.filter((aGroup: ISurveyCompositeGroup) => aGroup.id === +compositeGroupId));
}

export async function getCompositesInCompositeGroup(compositeGroupId: number): Promise<IResponse> {
    return successReply(await surveyCompositeModel.getCompositeItemsInGroup(compositeGroupId));
}

export async function reorderCompositesInCompositeGroup(body: any): Promise<IResponse> {
    if (!('order' in body)) {
        return errorReply(400, 'E004');
    }

    let order = 0;
    for (const compositeId of body.order) {
        await surveyCompositeModel.updateComposite(compositeId, { order: order });

        order += 1;
    }

    return successReply(order);
}

export async function updateCompositeGroup(surveyId: number, compositeGroupId: number, body: ISurveyCompositeGroupPayload): Promise<IResponse> {
    const validationCheck = await compositeGroupValidator(body, surveyId);
    if (validationCheck.error) {
        return errorReply(validationCheck.httpCode, validationCheck.internalCode, validationCheck.errorList);
    }

    const updated = await surveyCompositeGroupModel.updateCompositeGroup(
        compositeGroupId,
        generateModelBodyFromPayloadBodyForCompositeGroup(body, surveyId)
    );
    if (!updated) {
        return errorReply(500, 'E043', ['Internal error updating item at database level: please see logs.']);
    }

    return successReply(updated);
}

function generateModelBodyFromPayloadBodyForCompositeGroup(body: ISurveyCompositeGroupPayload, surveyId: number): any {
    return {
        survey_id: surveyId,
        name: body.name,
        order: body.order ? body.order : null,
        subcategory: body.subcategory ? body.subcategory : null,
        metadata: {
            description: body.description ? body.description : null,
            icon: body.icon ? body.icon : null,
            bgColor: body.bgColor ? body.bgColor : null,
        }
    };
}
