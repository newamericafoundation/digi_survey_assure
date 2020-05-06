import { errorReply, successReply } from '../../helper/response';
import compositeValidator from '../../helper/validation/compositeValidator';
import { ISurveyCompositePayload } from '../../interface/payload';
import { IResponse } from '../../interface/response';
import { getSurvey } from '../../model/survey';
import * as surveyCompositeModel from '../../model/surveyComposite';
import * as surveyCompositeItemModel from '../../model/surveyCompositeItem';
import { IFormulaReturn } from '../../plugin/formula/interface';
import { pluginLoader } from '../../plugin/loader';
import { getFromCache, setToCache } from '../../service/cacheService';

export async function createComposite(surveyId: number, body: ISurveyCompositePayload): Promise<IResponse> {
    const validationCheck = await compositeValidator(body);
    if (validationCheck.error) {
        return errorReply(validationCheck.httpCode, validationCheck.internalCode, validationCheck.errorList);
    }

    const compositeId = await surveyCompositeModel.createComposite(generateModelBodyFromPayloadBodyForComposite(surveyId, body));
    if (!compositeId) {
        return errorReply(500, 'E041');
    }

    const finalItemIds = await createCompositeItems(compositeId, body.composite_items);

    return successReply({
        id: compositeId,
        itemIds: finalItemIds,
    }, false, 201);
}

export async function calculateComposite(surveyCompositeId: number, filters: any = ''): Promise<IResponse> {
    const cacheKey = `composite_${surveyCompositeId}_${filters}`;
    const cachedData = await getFromCache(cacheKey);
    if (cachedData) {
        return successReply(cachedData, true);
    }

    const composite = await surveyCompositeModel.getComposite(surveyCompositeId);
    if (!composite) {
        return errorReply(404, 'E020');
    }

    const compositeItems = await surveyCompositeItemModel.getCompositeItems(surveyCompositeId);
    if (!compositeItems) {
        return errorReply(404, 'E019');
    }

    // Custom filters (dropdowns from the frontend) always take precedence over preset filters.
    const useFilters = filters ? filters : composite.filters;

    try {
        const plugin = pluginLoader(composite.formula ? composite.formula : 'average', 'formula');

        const formulaOutput: IFormulaReturn = await plugin.calculate(composite, compositeItems, useFilters);

        const finalData = {
            overview: composite,
            explainer: formulaOutput.explainer,
            total: formulaOutput.total.toFixed(2),
            totalResponsesFactoredByQuestion: formulaOutput.totalResponsesFactoredByQuestion,
            questions: formulaOutput.questions,
        };

        const survey = await getSurvey(composite.survey_id);
        if (!survey.active) {
            await setToCache(cacheKey, finalData);
        }

        return successReply(finalData);
    } catch (e) {
        console.log('Failed to run formula on composite data.', e);

        return errorReply(500, 'E027');
    }
}

export async function deleteComposite(compositeId: number): Promise<IResponse> {
    const deleteResult = await surveyCompositeModel.deleteComposite(compositeId);
    if (!deleteResult) {
        return errorReply(500, 'E044');
    }

    return successReply(compositeId);
}

export async function getComposite(surveyCompositeId: number): Promise<IResponse> {
    const composite = await surveyCompositeModel.getComposite(surveyCompositeId);
    if (!composite) {
        return errorReply(404, 'E020');
    }

    return successReply(composite);
}

export async function getCompositeItems(surveyCompositeId: number): Promise<IResponse> {
    const compositeItems = await surveyCompositeItemModel.getCompositeItems(surveyCompositeId);
    if (!compositeItems) {
        return errorReply(404, 'E019');
    }

    return successReply(compositeItems);
}

export async function getSurveyComposites(surveyId: number): Promise<IResponse> {
    const composites = await surveyCompositeModel.getCompositesForSurvey(surveyId);
    if (!composites) {
        return errorReply(404, 'E021');
    }

    return successReply(composites);
}

/**
 * We may need to delete cached versions of this composite here.
 * This is a point of process, not an overlooked technical spec:
 * Should a composite be editable after a survey is closed?
 */
export async function updateComposite(surveyId: number, compositeId: number, body: ISurveyCompositePayload): Promise<IResponse> {
    const validationCheck = await compositeValidator(body);
    if (validationCheck.error) {
        return errorReply(validationCheck.httpCode, validationCheck.internalCode, validationCheck.errorList);
    }

    const updateStatus = await surveyCompositeModel.updateComposite(compositeId, generateModelBodyFromPayloadBodyForComposite(surveyId, body));
    if (!updateStatus) {
        return errorReply(500, 'E043', ['Internal error updating item at database level: please see logs.']);
    }

    // Delete all existing composite items so that we can recreate them.
    await surveyCompositeItemModel.deleteCompositeItemsForComposite(compositeId);

    // Now recreate them.
    const finalItemIds = await createCompositeItems(compositeId, body.composite_items);

    return successReply({
        id: compositeId,
        itemIds: finalItemIds,
    });
}

function generateModelBodyFromPayloadBodyForComposite(surveyId: number, body: ISurveyCompositePayload): any {
    const finalMetadata = {};
    if (body.formula === 'meanCutoff') {
        finalMetadata['cutoff'] = body.cutoff;
    }

    return {
        survey_id: surveyId,
        name: body.name,
        formula: body.formula,
        survey_composite_group_id: body.survey_composite_group_id ? body.survey_composite_group_id : null,
        description: body.description ? body.description : null,
        filters: null,
        order: body.order ? body.order : null,
        metadata: finalMetadata,
    };
}

async function createCompositeItems(compositeId: number, compositeItems: any): Promise<any[]> {
    const finalItemIds: number[] = [];
    const alreadyAdded: number[] = [];

    Object.keys(compositeItems).forEach(async (key: string) => {
        const selectedOptions = compositeItems[key];

        for (const anOption of selectedOptions) {
            if (alreadyAdded.includes(+anOption)) {
                continue;
            }

            const itemId = await surveyCompositeItemModel.createCompositeItem({
                survey_composite_id: compositeId,
                question_id: +key,
                weight: 1,
                question_option_id: +anOption,
            });

            alreadyAdded.push(+anOption);
            finalItemIds.push(itemId);
        }
    });

    return finalItemIds;
}
