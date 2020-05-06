import * as Koa from 'koa';
import * as Router from 'koa-router';
import { sendResponse } from '../../helper/response';
import { checkPermissions, permissionDeniedResponse } from '../../helper/session';
import { getFiltersForSurvey } from '../controller/filter';
import { getQuestionOnSurvey } from '../controller/question';
import { getQuestionGroups } from '../controller/questionGroup';
import {
    closeSurvey,
    countSurveyResponses,
    createSurvey,
    deleteSurvey,
    getAllSurveys,
    getAsyncActionStatus,
    getAuditProofData,
    getSurvey,
    getTableOfContents,
    importSurveyResponses,
    matchPassword,
    updateSurvey,
    updateSurveyFilters
} from '../controller/survey';

const surveyRouter = new Router({ prefix: '/api/v1/survey' });
const permissionGroupName = 'survey';

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Permissioned Routes 
 */
surveyRouter.delete(`/:surveyId`, async (ctx: Koa.Context) => {
    try {
        checkPermissions(ctx, permissionGroupName, 'delete', [ctx.params.surveyId]);

        sendResponse(ctx, await deleteSurvey(ctx.params.surveyId));
    } catch (e) {
        console.log(e);

        sendResponse(ctx, permissionDeniedResponse());
    }
});

surveyRouter.post(`/:surveyId/close`, async (ctx: Koa.Context) => {
    try {
        checkPermissions(ctx, permissionGroupName, 'close', [ctx.params.surveyId]);

        sendResponse(ctx, await closeSurvey(ctx.params.surveyId));
    } catch (e) {
        console.log(e);

        sendResponse(ctx, permissionDeniedResponse());
    }
});

surveyRouter.post('/:surveyId/filters', async (ctx: Koa.Context) => {
    try {
        checkPermissions(ctx, permissionGroupName, 'filters', [ctx.params.surveyId]);

        sendResponse(ctx, await updateSurveyFilters(ctx.params.surveyId, ctx.request.body));
    } catch (e) {
        console.log(e);

        sendResponse(ctx, permissionDeniedResponse());
    }
});

surveyRouter.get(`/:surveyId/status/:statusType`, async (ctx: Koa.Context) => {
    try {
        checkPermissions(ctx, permissionGroupName, 'read', [ctx.params.surveyId]);

        sendResponse(ctx, await getAsyncActionStatus(ctx.params.surveyId, ctx.params.statusType));
    } catch (e) {
        console.log(e);

        sendResponse(ctx, permissionDeniedResponse());
    }
});

surveyRouter.post(`/:surveyId/importResponses`, async (ctx: Koa.Context) => {
    try {
        checkPermissions(ctx, permissionGroupName, 'importResponses', [ctx.params.surveyId]);

        sendResponse(ctx, await importSurveyResponses(ctx.params.surveyId));
    } catch (e) {
        console.log(e);

        sendResponse(ctx, permissionDeniedResponse());
    }
});

surveyRouter.post('/', async (ctx: Koa.Context) => {
    try {
        checkPermissions(ctx, permissionGroupName, 'create', []);

        sendResponse(ctx, await createSurvey(ctx.request.body));
    } catch (e) {
        console.log(e);

        sendResponse(ctx, permissionDeniedResponse());
    }
});

surveyRouter.put('/:surveyId', async (ctx: Koa.Context) => {
    try {
        checkPermissions(ctx, permissionGroupName, 'update', [ctx.params.surveyId]);

        sendResponse(ctx, await updateSurvey(ctx.params.surveyId, ctx.request.body));
    } catch (e) {
        console.log(e);

        sendResponse(ctx, permissionDeniedResponse());
    }
});

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Public Routes
 */
surveyRouter.get('/response/:responseId/proof', async (ctx: Koa.Context) => {
    sendResponse(ctx, await getAuditProofData(ctx.params.responseId));
});

surveyRouter.get(`/`, async (ctx: Koa.Context) => {
    sendResponse(ctx, await getAllSurveys());
});

surveyRouter.get(`/:surveyId`, async (ctx: Koa.Context) => {
    sendResponse(ctx, await getSurvey(ctx.params.surveyId));
});

surveyRouter.get('/:surveyId/filters', async (ctx: Koa.Context) => {
    sendResponse(ctx, await getFiltersForSurvey(ctx.params.surveyId));
});

surveyRouter.get('/:surveyId/responseCount', async (ctx: Koa.Context) => {
    sendResponse(ctx, await countSurveyResponses(ctx.params.surveyId));
});

surveyRouter.get('/:surveyId/toc', async (ctx: Koa.Context) => {
    sendResponse(ctx, await getTableOfContents(ctx.params.surveyId));
});

// Request a JWT with higher access levels.
surveyRouter.post('/:surveyId/requestAccess', async (ctx: Koa.Context) => {
    sendResponse(ctx, await matchPassword(ctx.params.surveyId, ctx.request.body));
});

surveyRouter.get(`/:surveyId/questions`, async (ctx: Koa.Context) => {
    sendResponse(ctx, await getQuestionOnSurvey(ctx.params.surveyId));
});

surveyRouter.get(`/:surveyId/questionGroups`, async (ctx: Koa.Context) => {
    sendResponse(ctx, await getQuestionGroups(ctx.params.surveyId));
});

export default surveyRouter;
