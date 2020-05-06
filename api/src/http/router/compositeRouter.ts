import * as Koa from 'koa';
import * as Router from 'koa-router';
import { sendResponse } from '../../helper/response';
import { checkPermissions, permissionDeniedResponse } from '../../helper/session';
import {
    calculateComposite,
    createComposite,
    deleteComposite,
    getComposite,
    getCompositeItems,
    getSurveyComposites,
    updateComposite
} from '../controller/composite';

const compositeRouter = new Router({ prefix: '/api/v1/survey' });
const permissionGroupName = 'composite';

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Permissioned Routes
 */
compositeRouter.delete(`/:surveyId/composite/:compositeId`, async (ctx: Koa.Context) => {
    try {
        checkPermissions(ctx, permissionGroupName, 'delete', [ctx.params.compositeId]);

        sendResponse(ctx, await deleteComposite(ctx.params.compositeId));
    } catch (e) {
        console.log(e);

        sendResponse(ctx, permissionDeniedResponse());
    }
});

compositeRouter.post(`/:surveyId/composite`, async (ctx: Koa.Context) => {
    try {
        checkPermissions(ctx, permissionGroupName, 'create', [ctx.params.surveyId]);

        sendResponse(ctx, await createComposite(ctx.params.surveyId, ctx.request.body));
    } catch (e) {
        console.log(e);

        sendResponse(ctx, permissionDeniedResponse());
    }
});

compositeRouter.put(`/:surveyId/composite/:compositeId`, async (ctx: Koa.Context) => {
    try {
        checkPermissions(ctx, permissionGroupName, 'update', [ctx.params.compositeId]);

        sendResponse(ctx, await updateComposite(ctx.params.surveyId, ctx.params.compositeId, ctx.request.body));
    } catch (e) {
        console.log(e);

        sendResponse(ctx, permissionDeniedResponse());
    }
});

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Public Routes
 */
compositeRouter.get('/:surveyId/composite', async (ctx: Koa.Context) => {
    sendResponse(ctx, await getSurveyComposites(ctx.params.surveyId));
});

compositeRouter.get('/:surveyId/composite/:compositeId/items', async (ctx: Koa.Context) => {
    sendResponse(ctx, await getCompositeItems(ctx.params.compositeId));
});

compositeRouter.get('/:surveyId/composite/:compositeId/calculate', async (ctx: Koa.Context) => {
    const filters = ('filter' in ctx.request.query) ? ctx.request.query.filter : null;

    sendResponse(ctx, await calculateComposite(ctx.params.compositeId, filters));
});

compositeRouter.get('/:surveyId/composite/:compositeId', async (ctx: Koa.Context) => {
    sendResponse(ctx, await getComposite(ctx.params.compositeId));
});

export default compositeRouter;
