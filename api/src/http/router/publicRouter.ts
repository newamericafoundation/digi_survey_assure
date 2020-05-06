import * as Koa from 'koa';
import * as Router from 'koa-router';
import { sendResponse, successReply } from '../../helper/response';
import { IResponse } from '../../interface/response';
import { authenticateAdmin } from '../controller/auth';
import { registerSurveyResponse } from '../controller/listener';

const publicRouter = new Router({ prefix: '/api/v1' });

publicRouter.get('/ping', async (ctx: Koa.Context) => {
    sendResponse(ctx, successReply('pong'));
});

/**
 * This is for administrative authentication.
 */
publicRouter.post('/auth', async (ctx: Koa.Context) => {
    sendResponse(ctx, await authenticateAdmin(ctx.request.body));
});

/**
 * Listener calls come from survey data sources when a response
 * is registered on their end. Effectively, these are webhooks
 * sent from your data source provider to this platform.
 */
publicRouter.post('/listener/:surveyId/:listenerCode', async (ctx: Koa.Context) => {
    const registerSurveyResult: IResponse = await registerSurveyResponse(ctx.params.surveyId, ctx.params.listenerCode, ctx.request.body);

    sendResponse(ctx, registerSurveyResult);
});

export default publicRouter;
