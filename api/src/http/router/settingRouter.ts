import * as Koa from 'koa';
import * as Router from 'koa-router';
import { sendResponse } from '../../helper/response';
import { checkPermissions, permissionDeniedResponse } from '../../helper/session';
import { getPlugins, getPrivateContent, invalidateCache } from '../../http/controller/setting';

const settingRouter = new Router({ prefix: '/api/v1/setting' });
const permissionGroupName = 'setting';

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Permissioned Routes 
 */
settingRouter.get(`/privacy/content`, async (ctx: Koa.Context) => {
    try {
        checkPermissions(ctx, permissionGroupName, 'getPrivate', []);

        sendResponse(ctx, await getPrivateContent());
    } catch (e) {
        console.log(e);

        sendResponse(ctx, permissionDeniedResponse());
    }
});

settingRouter.post(`/cache/invalidate`, async (ctx: Koa.Context) => {
    try {
        checkPermissions(ctx, permissionGroupName, 'cache', []);

        sendResponse(ctx, await invalidateCache());
    } catch (e) {
        console.log(e);

        sendResponse(ctx, permissionDeniedResponse());
    }
});

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Public Routes
 */
settingRouter.get('/plugin/:pluginType', async (ctx: Koa.Context) => {
    sendResponse(ctx, await getPlugins(ctx.params.pluginType));
});

export default settingRouter;
