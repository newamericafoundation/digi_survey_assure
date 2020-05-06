import * as Koa from 'koa';
import * as Router from 'koa-router';
import { sendResponse } from '../../helper/response';
import { checkPermissions, permissionDeniedResponse } from '../../helper/session';
import {
    createCompositeGroup,
    deleteCompositeGroup,
    getCompositeGroup,
    getCompositeGroupsForSurvey,
    getCompositeGroupTree,
    getCompositesInCompositeGroup,
    reorderCompositesInCompositeGroup,
    updateCompositeGroup
} from '../controller/compositeGroup';

const compositeGroupRouter = new Router({ prefix: '/api/v1/survey' });
const permissionGroupName = 'compositeGroup';

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Permissioned Routes
 */
compositeGroupRouter.delete(`/:surveyId/compositeGroup/:compositeGroupId`, async (ctx: Koa.Context) => {
    try {
        checkPermissions(ctx, permissionGroupName, 'delete', [ctx.params.compositeGroupId]);

        sendResponse(ctx, await deleteCompositeGroup(ctx.params.compositeGroupId));
    } catch (e) {
        console.log(e);

        sendResponse(ctx, permissionDeniedResponse());
    }
});

compositeGroupRouter.post(`/:surveyId/compositeGroup/:compositeGroupId/reorder`, async (ctx: Koa.Context) => {
    try {
        checkPermissions(ctx, permissionGroupName, 'reorder', [ctx.params.compositeGroupId]);

        sendResponse(ctx, await reorderCompositesInCompositeGroup(ctx.request.body));
    } catch (e) {
        console.log(e);

        sendResponse(ctx, permissionDeniedResponse());
    }
});

compositeGroupRouter.post(`/:surveyId/compositeGroup`, async (ctx: Koa.Context) => {
    try {
        checkPermissions(ctx, permissionGroupName, 'create', [ctx.params.surveyId]);

        sendResponse(ctx, await createCompositeGroup(ctx.params.surveyId, ctx.request.body));
    } catch (e) {
        console.log(e);

        sendResponse(ctx, permissionDeniedResponse());
    }
});

compositeGroupRouter.put(`/:surveyId/compositeGroup/:compositeGroupId`, async (ctx: Koa.Context) => {
    try {
        checkPermissions(ctx, permissionGroupName, 'update', [ctx.params.compositeGroupId]);

        sendResponse(ctx, await updateCompositeGroup(ctx.params.surveyId, ctx.params.compositeGroupId, ctx.request.body));
    } catch (e) {
        console.log(e);

        sendResponse(ctx, permissionDeniedResponse());
    }
});

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Public Routes
 */
compositeGroupRouter.get('/:surveyId/compositeGroup', async (ctx: Koa.Context) => {
    sendResponse(ctx, await getCompositeGroupsForSurvey(ctx.params.surveyId));
});

compositeGroupRouter.get('/:surveyId/compositeGroup/:compositeGroupId/composites', async (ctx: Koa.Context) => {
    sendResponse(ctx, await getCompositesInCompositeGroup(ctx.params.compositeGroupId));
});

compositeGroupRouter.get('/:surveyId/compositeGroup/:compositeGroupId/tree', async (ctx: Koa.Context) => {
    sendResponse(ctx, await getCompositeGroupTree(ctx.params.compositeGroupId));
});

compositeGroupRouter.get('/:surveyId/compositeGroup/:compositeGroupId', async (ctx: Koa.Context) => {
    sendResponse(ctx, await getCompositeGroup(ctx.params.compositeGroupId));
});

export default compositeGroupRouter;
