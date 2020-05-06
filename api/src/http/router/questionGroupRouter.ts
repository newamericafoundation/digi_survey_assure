import * as Koa from 'koa';
import * as Router from 'koa-router';
import { sendResponse } from '../../helper/response';
import { checkPermissions, getJwt, getPermissionList, permissionDeniedResponse } from '../../helper/session';
import { getQuestionGroup, getQuestionGroups, listQuestionsInGroup, updateQuestionGroupPrivacy } from '../controller/questionGroup';

const questionGroupRouter = new Router({ prefix: '/api/v1/questionGroup' });
const permissionGroupName = 'questionGroup';

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Permissioned Routes 
 */
questionGroupRouter.post(`/:questionGroupId/makePrivate`, async (ctx: Koa.Context) => {
    try {
        checkPermissions(ctx, permissionGroupName, 'privacy', [ctx.params.questionGroupId]);

        sendResponse(ctx, await updateQuestionGroupPrivacy(ctx.params.questionGroupId));
    } catch (e) {
        console.log(e);

        sendResponse(ctx, permissionDeniedResponse());
    }
});

questionGroupRouter.post(`/:questionGroupId/makePublic`, async (ctx: Koa.Context) => {
    try {
        checkPermissions(ctx, permissionGroupName, 'privacy', [ctx.params.questionGroupId]);

        sendResponse(ctx, await updateQuestionGroupPrivacy(ctx.params.questionGroupId, false));
    } catch (e) {
        console.log(e);

        sendResponse(ctx, permissionDeniedResponse());
    }
});

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Public Routes
 */
questionGroupRouter.get(`/:questionGroupId/questions`, async (ctx: Koa.Context) => {
    const jwt = getJwt(ctx);

    const questions = await listQuestionsInGroup(ctx.params.questionGroupId, getPermissionList(jwt));

    sendResponse(ctx, questions);
});

questionGroupRouter.get(`/:questionGroupId/questions/aggregated`, async (ctx: Koa.Context) => {
    const jwt = getJwt(ctx);

    const questions = await listQuestionsInGroup(ctx.params.questionGroupId, getPermissionList(jwt));

    sendResponse(ctx, questions);
});

questionGroupRouter.get(`/:questionGroupId`, async (ctx: Koa.Context) => {
    const questionGroup = await getQuestionGroup(ctx.params.questionGroupId);

    sendResponse(ctx, questionGroup);
});

questionGroupRouter.get(`/survey/:surveyId`, async (ctx: Koa.Context) => {
    const listOfQuestionGroups = await getQuestionGroups(ctx.params.surveyId);

    sendResponse(ctx, listOfQuestionGroups);
});

export default questionGroupRouter;
