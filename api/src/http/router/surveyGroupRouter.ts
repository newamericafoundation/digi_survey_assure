import * as Koa from 'koa';
import * as Router from 'koa-router';
import { sendResponse } from '../../helper/response';
import { checkPermissions, permissionDeniedResponse } from '../../helper/session';
import {
    createSurveyGroup,
    deleteSurveyGroup,
    getList,
    getSurveyGroup,
    getSurveysInGroup,
    updateSurveyGroup
} from '../controller/surveyGroup';

const surveyGroupRouter = new Router({ prefix: '/api/v1/surveyGroup' });
const permissionGroupName = 'surveyGroup';

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Permissioned Routes
 */
surveyGroupRouter.delete('/:surveyGroupId', async (ctx: Koa.Context) => {
    try {
        checkPermissions(ctx, permissionGroupName, 'delete', [ctx.params.surveyGroupId]);

        sendResponse(ctx, await deleteSurveyGroup(ctx.params.surveyGroupId));
    } catch (e) {
        sendResponse(ctx, permissionDeniedResponse());
    }
});

surveyGroupRouter.post('/', async (ctx: Koa.Context) => {
    try {
        checkPermissions(ctx, permissionGroupName, 'create', []);

        sendResponse(ctx, await createSurveyGroup(ctx.request.body));
    } catch (e) {
        sendResponse(ctx, permissionDeniedResponse());
    }
});

surveyGroupRouter.put('/:surveyGroupId', async (ctx: Koa.Context) => {
    try {
        checkPermissions(ctx, permissionGroupName, 'update', [ctx.params.surveyGroupId]);

        sendResponse(ctx, await updateSurveyGroup(ctx.params.surveyGroupId, ctx.request.body));
    } catch (e) {
        sendResponse(ctx, permissionDeniedResponse());
    }
});

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Public Routes
 */
surveyGroupRouter.get(`/:surveyGroupId`, async (ctx: Koa.Context) => {
    sendResponse(ctx, await getSurveyGroup(ctx.params.surveyGroupId));
});

surveyGroupRouter.get(`/:surveyGroupId/surveys`, async (ctx: Koa.Context) => {
    sendResponse(ctx, await getSurveysInGroup(ctx.params.surveyGroupId));
});

surveyGroupRouter.get(`/`, async (ctx: Koa.Context) => {
    sendResponse(ctx, await getList());
});

export default surveyGroupRouter;
