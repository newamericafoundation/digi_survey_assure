import { errorReply, successReply } from '../../helper/response';
import { IQuestion } from '../../interface/db';
import { IResponse } from '../../interface/response';
import { getQuestionsInGroup, updateQuestionsInGroupPrivacy } from '../../model/question';
import * as questionGroupModel from '../../model/questionGroup';

export async function getQuestionGroup(questionGroupId: number): Promise<IResponse> {
    const questionGroup = await questionGroupModel.getQuestionGroup(questionGroupId);
    if (!questionGroup) {
        return errorReply(404, 'E012');
    }

    return successReply(questionGroup);
}

export async function getQuestionGroups(surveyId: number): Promise<IResponse> {
    const questionGroups = await questionGroupModel.getQuestionGroups(surveyId);
    if (!questionGroups) {
        return errorReply(404, 'E011');
    }

    return successReply(questionGroups);
}

export async function listQuestionsInGroup(questionGroupId: number, permissionList: number[]): Promise<IResponse> {
    const publicOnly = permissionList.length ? false : true;

    const questions = await getQuestionsInGroup(questionGroupId, publicOnly);
    if (!questions) {
        return errorReply(404, 'E013');
    }

    const finalResult = (!publicOnly && permissionList[0] !== 0)
        ? questions.filter((aQuestion: IQuestion) => aQuestion.public || permissionList.includes(aQuestion.id))
        : questions;

    return successReply(finalResult);
}

export async function updateQuestionGroupPrivacy(questionGroupId: number, makePrivate: boolean = true): Promise<IResponse> {
    const questionGroup = await questionGroupModel.getQuestionGroup(questionGroupId);
    if (!questionGroup) {
        return errorReply(404, 'E012');
    }

    await updateQuestionsInGroupPrivacy(questionGroupId, makePrivate);

    const updateResult = await questionGroupModel.updateQuestionGroup(questionGroupId, {
        display: (makePrivate) ? false : true,
    });
    if (!updateResult) {
        return errorReply(500, 'E045');
    }

    return successReply(true);
}
