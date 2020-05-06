import * as crypto from 'crypto';
import { Validator } from 'node-input-validator';
import { prepareAndSendResponseToBlockchain } from '../../helper/blockchain';
import { buildCompositeGroupTree } from '../../helper/composites';
import { createTree } from '../../helper/hashing';
import { errorReply, successReply } from '../../helper/response';
import { generateJwt } from '../../helper/session';
import { getSurveyAnswersForProofs, normalizeAndInputSurveyResponse, recountResponseTotals } from '../../helper/surveyResponse';
import surveyValidator from '../../helper/validation/surveyValidator';
import { ISurveyWithSource } from '../../interface/db';
import { IFilterPayload, ISurveyMatchPasswordPayload, ISurveyPayload } from '../../interface/payload';
import { IResponse } from '../../interface/response';
import { getBlockchainTransaction } from '../../model/bcTransaction';
import { getQuestionGroups } from '../../model/questionGroup';
import * as surveyModel from '../../model/survey';
import { getAccessLevel } from '../../model/surveyAccessGroup';
import { checkIfSurveyHasComposites, getCompositesForSurvey } from '../../model/surveyComposite';
import { getSurveysInGroup } from '../../model/surveyGroup';
import { createQuestionFilter, deleteFiltersForSurvey } from '../../model/surveyQuestionFilter'
import { countTotalResponses, getResponseFromExternalId, getResponsesWithoutBcTransaction } from '../../model/surveyResponse';
import { pluginLoader } from '../../plugin/loader';
import { getFromCache, removeFromCache, setToCache } from '../../service/cacheService';

export async function getAsyncActionStatus(surveyId: number, actionType: string): Promise<IResponse> {
    switch (actionType) {
        case 'close':
        case 'importResponses':
            return successReply(await checkForActiveState(surveyId, actionType));
        default:
            return errorReply(404, 'E047');
    }
}

/**
 * Closing a survey prevents additional responses from being logged, disables the automatic data reload
 * on the frontend for charts/graphs, and helps ensures that all complex data associated with a survey is
 * cached for quicker retrieval moving forward.
 * 
 * When a survey is completed, we "close it" and perform the following tasks:
 * - Cross-check responses match with provider's responses.
 * - Cross-check that all responses were added to the blockchain.
 * - Mark the survey as active=false in the database to prevent future responses from being logged.
 * 
 * Note that Composites and TOC will naturally cache themselves once active=false.
 */
export async function closeSurvey(surveyId: number): Promise<IResponse> {
    const survey = await surveyModel.getSurveyWithGroup(surveyId);
    if (!survey) {
        return errorReply(404, 'E010');
    }

    const activeState = await checkForActiveState(surveyId, 'close');
    if (activeState) {
        return errorReply(409, 'E048');
    }

    const cacheKey = getImportCacheKey(surveyId, 'close');
    await setToCache(cacheKey, {
        timestamp: new Date(),
        stage: 'importing_responses',
    });

    // Async this functionality to prevent a response delay to the frontend.
    // Note that this process can take a VERY long time due to the joys
    // of blockchain block times. A sleep() tool helps to make sure the
    // event loop doesn't get blocked while all this is happening.
    // tslint:disable: no-floating-promises
    runResponseImport(survey, true).then(async (responsesAdded: number) => {
        await setToCache(cacheKey, {
            timestamp: new Date(),
            stage: 'sending_to_blockchain',
            responsesImported: responsesAdded
        });

        // This process needs to be separate from runResponseImport(), even with
        // the second input parameter set to false. It ensures that any responses
        // that didn't get sent to the BC from the web hook connection with the data
        // source are sent. Those would be ignored if we only ran runResponseImport().
        runMissingBcTransaction(surveyId).then(async (responsesSentToBlockchain: number) => {
            await setToCache(cacheKey, {
                timestamp: new Date(),
                stage: 'finalizing',
                responsesImported: responsesAdded,
                responsesSentToBlockchain: responsesSentToBlockchain,
            });

            await recountResponseTotals(surveyId);

            await surveyModel.updateSurvey(surveyId, { active: false });

            await removeFromCache(cacheKey);
        });
    });

    return successReply(null);
}

export async function countSurveyResponses(surveyId: number): Promise<IResponse> {
    const responses = await countTotalResponses(surveyId);
    if (!responses) {
        return errorReply(404, 'E010');
    }

    return successReply(responses);
}

export async function createSurvey(body: ISurveyPayload): Promise<IResponse> {
    const validationCheck = await surveyValidator(body);
    if (validationCheck.error) {
        return errorReply(validationCheck.httpCode, validationCheck.internalCode, validationCheck.errorList);
    }

    const listenerCode = crypto.randomBytes(24).toString('hex');

    const cleanedBody = generateModelBodyFromPayloadBodyForSurvey(body);
    cleanedBody['listener_code'] = listenerCode;

    const createSurveyResult = await surveyModel.createSurvey(cleanedBody);
    if (!createSurveyResult) {
        return errorReply(500, 'E004');
    }

    try {
        const plugin = pluginLoader(validationCheck.loaded.surveyGroup.source_plugin);

        await plugin.runHook('survey', 'create', {
            body: body,
            surveyId: createSurveyResult,
            surveyGroup: validationCheck.loaded.surveyGroup,
            listenerCode: listenerCode,
        });
    } catch (e) {
        console.log('Failed to import survey from plugin source', e);

        await surveyModel.deleteSurvey(createSurveyResult);

        return errorReply(500, 'E037');
    }

    return successReply(createSurveyResult, false, 201);
}

export async function deleteSurvey(surveyId: number): Promise<IResponse> {
    const deleteResult = await surveyModel.deleteSurvey(surveyId);
    if (!deleteResult) {
        return errorReply(500, 'E044');
    }

    return successReply(deleteResult);
}

export async function getAllSurveys(): Promise<IResponse> {
    return successReply(await surveyModel.getSurveys());
}

export async function getAuditProofData(surveyResponseId: number): Promise<IResponse> {
    const surveyAnswers = await getSurveyAnswersForProofs(surveyResponseId);
    if (!surveyAnswers) {
        return errorReply(404, 'E026');
    }

    const merkleTree = createTree(surveyAnswers);
    const bcTransactionData = await getBlockchainTransaction(surveyAnswers[0].bc_transaction_id);

    return successReply({
        surveyResponse: surveyAnswers[0],
        surveyResponseAnswer: surveyAnswers,
        merkleTree: merkleTree,
        merkleTreeString: merkleTree.toTreeString(),
        blockchain: bcTransactionData,
    });
}

export async function getSurvey(surveyId: number): Promise<IResponse> {
    const surveyData = await surveyModel.getSurveyWithGroup(surveyId);
    if (!surveyData) {
        return errorReply(404, 'E010');
    }

    return successReply({
        ...surveyData,
        responses: await countTotalResponses(surveyId)
    });
}

export async function getTableOfContents(surveyId: number): Promise<IResponse> {
    const cacheKey = `surveyToc_${surveyId}`;
    const cachedData = await getFromCache(cacheKey);
    if (cachedData) {
        return successReply(cachedData, true);
    }

    const survey = await surveyModel.getSurvey(surveyId);
    if (!survey) {
        return errorReply(404, 'E010');
    }

    const tableOfContents = {
        surveysInGroup: await getSurveysInGroup(survey.survey_group_id),
        hasComposites: await checkIfSurveyHasComposites(surveyId),
        compositeGroups: await buildCompositeGroupTree(surveyId),
        composites: await getCompositesForSurvey(surveyId),
        questionGroups: await getQuestionGroups(surveyId),
    };

    if (!survey.active) {
        await setToCache(cacheKey, tableOfContents, 600);
    }

    return successReply(tableOfContents);
}

export async function importSurveyResponses(surveyId: number): Promise<IResponse> {
    const survey = await surveyModel.getSurveyWithGroup(surveyId);
    if (!survey) {
        return errorReply(404, 'E010');
    }

    const activeState = await checkForActiveState(surveyId, 'importResponses');
    if (activeState) {
        return errorReply(403, 'E046', activeState);
    }

    const added = await runResponseImport(survey, false);

    return successReply(added);
}

/**
 * For unlocking additional survey_group access.
 * Note that this feature was deprecated but may be implemented in a future version.
 */
export async function matchPassword(surveyId: number, body: ISurveyMatchPasswordPayload): Promise<IResponse> {
    const validation = new Validator(body, {
        password: 'required',
    });
    const check = await validation.check();
    if (!check) {
        return errorReply(400, 'E014', validation.errors);
    }

    const surveyAccess = await getAccessLevel(surveyId, body.password);
    if (!surveyAccess) {
        return errorReply(400, 'E015');
    }

    const jwt = generateJwt({ permissionLevel: surveyAccess.id, questionAccess: surveyAccess.question_access });

    return successReply(jwt);
}

export async function updateSurvey(surveyId: number, body: ISurveyPayload): Promise<IResponse> {
    const validationCheck = await surveyValidator(body);
    if (validationCheck.error) {
        return errorReply(validationCheck.httpCode, validationCheck.internalCode, validationCheck.errorList);
    }

    const updated = await surveyModel.updateSurvey(surveyId, generateModelBodyFromPayloadBodyForSurvey(body));
    if (!updated) {
        return errorReply(500, 'E043', ['Internal error updating item at database level: please see logs.']);
    }

    return successReply(updated);
}

export async function updateSurveyFilters(surveyId: number, filters: IFilterPayload): Promise<IResponse> {
    // Delete all existing filters for survey.
    await deleteFiltersForSurvey(surveyId);

    // Now create the new filter entries.
    let count = 0;
    Object.keys(filters).forEach(async (key: any) => {
        await createQuestionFilter({
            survey_id: surveyId,
            question_id: +key,
            label: filters[key],
            order: count,
        });

        count += 1;
    });

    return successReply(filters);
}

async function checkForActiveState(surveyId: number, actionType: string = 'importResponses'): Promise<string | null> {
    return getFromCache(getImportCacheKey(surveyId, actionType));
}

function generateModelBodyFromPayloadBodyForSurvey(body: ISurveyPayload): any {
    return {
        active: body.active,
        survey_group_id: Number(body.surveyGroupId),
        external_source_id: body.externalSourceId,
        name: body.name,
        description: body.description ? body.description : null,
        start_at: body.startDate ? body.startDate : null,
        end_at: body.endDate ? body.endDate : null,
        metadata: {
            image: body.imageUrl ? body.imageUrl : null,
            icon: body.icon ? body.icon : null,
            custom_route_url: body.groupUrl ? body.groupUrl : null,
        },
    };
}

function getImportCacheKey(surveyId: number, action: string): string {
    return `survey_${action}_${surveyId}`;
}

async function runMissingBcTransaction(surveyId: number): Promise<number> {
    let totalUpdated = 0;

    const cacheStrategy = 'blockchainSync';
    await setToCache(getImportCacheKey(surveyId, cacheStrategy), {
        timestamp: new Date(),
        synced: 0,
    });

    const responsesMissingBcTransactions = await getResponsesWithoutBcTransaction(surveyId);
    if (responsesMissingBcTransactions) {
        for (const aResponse of responsesMissingBcTransactions) {
            await prepareAndSendResponseToBlockchain(aResponse.id);

            totalUpdated += 1;

            await setToCache(getImportCacheKey(surveyId, cacheStrategy), {
                timestamp: new Date(),
                synced: totalUpdated,
            });

            await sleep(7000);
        }
    }

    await removeFromCache(getImportCacheKey(surveyId, cacheStrategy));

    return totalUpdated;
}

async function runResponseImport(surveyObject: ISurveyWithSource, skipBlockchain: boolean = false): Promise<number> {
    const plugin = pluginLoader(surveyObject.source_plugin);

    let added = 0;

    const cacheStrategy = 'importResponses';
    await setToCache(getImportCacheKey(surveyObject.id, cacheStrategy), {
        timestamp: new Date(),
        imported: 0,
    });

    const surveyResponseIds: string[] | number[] | null = await plugin.runHook('survey', 'getResponses', {
        surveyId: surveyObject.external_source_id
    });
    if (!surveyResponseIds) {
        return added;
    }

    for (const externalResponseId of surveyResponseIds) {
        const responseAlreadyExists = await getResponseFromExternalId(surveyObject.id, externalResponseId);
        if (!responseAlreadyExists) {
            try {
                await normalizeAndInputSurveyResponse(surveyObject, {
                    SurveyID: surveyObject.external_source_id,
                    ResponseID: externalResponseId,
                }, skipBlockchain);

                added += 1;

                await setToCache(getImportCacheKey(surveyObject.id, cacheStrategy), {
                    timestamp: new Date(),
                    imported: added,
                });

                await sleep(skipBlockchain ? 50 : 750);
            } catch (e) {
                console.log(`Failed to input missing responses with external source ID ${externalResponseId}`);
            }
        }
    }

    await removeFromCache(getImportCacheKey(surveyObject.id, cacheStrategy));

    return added;
}

function sleep(millis: number): Promise<any> {
    // tslint:disable-next-line no-string-based-set-timeout
    return new Promise((resolve: any) => setTimeout(resolve, millis));
}
