import * as Koa from 'koa';
import * as Router from 'koa-router';
import { config } from '../../config';
import { getLocale } from '../../helper/localization';
import { sendResponse } from '../../helper/response';
import { checkPermissions, getJwt, getPermissionList, permissionDeniedResponse } from '../../helper/session';
import {
    getAnswerToSingleQuestionForResponseId,
    getAuditData,
    getFormattedData,
    getQuestion,
    getQuestionWithOptions,
    makeQuestionSpanEntireRow,
    updateQuestionPrivacy
} from '../controller/question';

const questionRouter = new Router({ prefix: '/api/v1/question' });
const permissionGroupName = 'question';

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Permissioned Routes 
 */
questionRouter.post(`/:questionId/makePrivate`, async (ctx: Koa.Context) => {
    try {
        checkPermissions(ctx, permissionGroupName, 'privacy', [ctx.params.questionId]);

        sendResponse(ctx, await updateQuestionPrivacy(ctx.params.questionId));
    } catch (e) {
        console.log(e);

        sendResponse(ctx, permissionDeniedResponse());
    }
});

questionRouter.post(`/:questionId/makePublic`, async (ctx: Koa.Context) => {
    try {
        checkPermissions(ctx, permissionGroupName, 'privacy', [ctx.params.questionId]);

        sendResponse(ctx, await updateQuestionPrivacy(ctx.params.questionId, false));
    } catch (e) {
        console.log(e);

        sendResponse(ctx, permissionDeniedResponse());
    }
});

questionRouter.post(`/:questionId/spanEntireRow`, async (ctx: Koa.Context) => {
    try {
        checkPermissions(ctx, permissionGroupName, 'spanEntireRow', [ctx.params.questionId]);

        sendResponse(ctx, await makeQuestionSpanEntireRow(ctx.params.questionId));
    } catch (e) {
        console.log(e);

        sendResponse(ctx, permissionDeniedResponse());
    }
});

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Public Routes
 */

questionRouter.get('/:questionId/response/:responseId', async (ctx: Koa.Context) => {
    const questionData = await getAnswerToSingleQuestionForResponseId(ctx.params.questionId, ctx.params.responseId, getLocale(ctx));

    sendResponse(ctx, questionData);
});

questionRouter.get('/:questionId/options', async (ctx: Koa.Context) => {
    const questionData = await getQuestionWithOptions(ctx.params.questionId);

    sendResponse(ctx, questionData);
});

questionRouter.get('/:questionId/audit', async (ctx: Koa.Context) => {
    const filters = ('filter' in ctx.request.query) ? ctx.request.query.filter : null;

    const auditData = await getAuditData(ctx.params.questionId, filters);

    sendResponse(ctx, auditData);
});

questionRouter.get(`/:questionId/:type/:plugin*`, async (ctx: Koa.Context) => {
    const plugin = ctx.params.plugin ? ctx.params.plugin : config.DEFAULT_CHARTING_PLUGIN;

    const jwt = getJwt(ctx);
    const permissionList = getPermissionList(jwt);

    const aggregate = ctx.params.type === 'aggregate' ? true : false;

    // Filters are sent as a query string array:
    // Example: filter[f3]=15020&...
    // "f3" represents the survey_question_filter.id with an added "f" which is later stripped.
    // "15020" represents the question_option.id that we are filtering by.
    const filters = ('filter' in ctx.request.query) ? ctx.request.query.filter : null;

    const questionData = await getFormattedData(ctx.params.questionId, plugin, permissionList, aggregate, filters, getLocale(ctx));

    sendResponse(ctx, questionData);
});

questionRouter.get('/:questionId', async (ctx: Koa.Context) => {
    const questionData = await getQuestion(ctx.params.questionId);

    sendResponse(ctx, questionData);
});

export default questionRouter;
