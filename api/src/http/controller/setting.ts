import { getPluginList } from '../../helper/plugins';
import { successReply } from '../../helper/response';
import { IResponse } from '../../interface/response';
import { deleteEntireCache } from '../../model/cache';
import { getPrivateQuestions } from '../../model/question';
import { getPrivateQuestionGroups } from '../../model/questionGroup';

export async function getPlugins(pluginType: string): Promise<IResponse> {
    return successReply(getPluginList(pluginType));
}

export async function getPrivateContent(): Promise<IResponse> {
    return successReply({
        questions: await getPrivateQuestions(),
        questionGroups: await getPrivateQuestionGroups(),
    });
}

export async function invalidateCache(): Promise<IResponse> {
    return successReply(await deleteEntireCache());
}
