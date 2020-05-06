import { config } from '../../config';
import { translateQuestion, translateQuestionOption } from '../../helper/localization';
import { errorReply, successReply } from '../../helper/response';
import { getQuestionResults } from '../../helper/surveyResponse';
import { IResponse } from '../../interface/response';
import * as questionModel from '../../model/question';
import { getQuestionOptions } from '../../model/questionOption';
import { getQuestionType } from '../../model/questionType';
import { getSurvey } from '../../model/survey';
import { getSurveyGroup } from '../../model/surveyGroup';
import { getSurveyGroupItemMapping } from '../../model/surveyGroupItemMapping';
import { getSurveyResponsesForSurveyWithBlockchainData } from '../../model/surveyResponse';
import { getAnswersForSurveyResponseForQuestion } from '../../model/surveyResponseAnswer';
import { pluginLoader } from '../../plugin/loader';

export async function getFormattedData(
    questionId: number,
    plugin: string,
    permissionList: number[] = [],
    aggregate: boolean = false,
    filters: any = {},
    locale: string = config.DEFAULT_LOCALE
): Promise<IResponse> {
    const questionData = await questionModel.getQuestion(questionId);
    if (!questionData) {
        return errorReply(404, 'E009');
    }

    const question = (locale !== config.DEFAULT_LOCALE)
        ? await translateQuestion(questionData, locale)
        : await questionModel.getQuestion(questionId);
    if (!question) { return errorReply(404, 'E009'); }

    if (!question.public && permissionList[0] !== 0 && !permissionList.includes(question.id)) {
        return errorReply(400, 'E016');
    }

    const pluginInstance = pluginLoader(plugin, 'visualizer');
    if (!pluginInstance) { return errorReply(404, 'E003'); }

    const survey = await getSurvey(question.survey_id);
    const questionType = await getQuestionType(question.question_type_id);

    const dataSets = [{
        survey: survey,
        question: question,
        options: await getQuestionResults(question.id, filters, locale),
    }];

    if (aggregate) {
        const mappings = await getSurveyGroupItemMapping(questionId);
        if (mappings) {
            for (const aMapping of mappings.mapped_questions) {
                const mappedQuestion = await questionModel.getQuestion(aMapping);

                dataSets.push({
                    survey: await getSurvey(mappedQuestion.survey_id),
                    question: mappedQuestion,
                    options: await getQuestionResults(aMapping, filters, locale),
                });
            }
        }
    }

    const formattedData = pluginInstance.generateChartData(
        questionType.mapping_class ? questionType.mapping_class : "bar",
        dataSets,
        filters ? true : false
    );

    return successReply(formattedData);
}

export async function getAnswerToSingleQuestionForResponseId(questionId: number, surveyResponseId: number, locale: string = config.DEFAULT_LOCALE): Promise<IResponse> {
    const data = (locale !== config.DEFAULT_LOCALE)
        ? await translateQuestionOption(await getAnswersForSurveyResponseForQuestion(surveyResponseId, questionId), locale)
        : await getAnswersForSurveyResponseForQuestion(surveyResponseId, questionId);

    return successReply(data);
}

export async function getAuditData(questionId: number, _filters: any = {}): Promise<IResponse> {
    const question = await questionModel.getQuestion(questionId);
    if (!question) {
        return errorReply(404, 'E009');
    }

    // DB constrains make it impossible for these not to be true. No need for additional checks.
    const survey = await getSurvey(question.survey_id);

    return successReply({
        question: question,
        survey: survey,
        group: await getSurveyGroup(survey.survey_group_id),
        responses: await getSurveyResponsesForSurveyWithBlockchainData(question.survey_id),
    });
}

export async function getQuestion(questionId: number): Promise<IResponse> {
    const question = await questionModel.getQuestion(questionId);
    if (!question) {
        return errorReply(404, 'E009');
    }

    return successReply(question);
}

export async function getQuestionOnSurvey(surveyId: number): Promise<IResponse> {
    const questions = await questionModel.getQuestionsOnSurvey(surveyId, true);
    if (!questions) {
        return errorReply(404, 'E039');
    }

    return successReply(questions);
}

export async function getQuestionWithOptions(questionId: number): Promise<IResponse> {
    const question = await questionModel.getQuestion(questionId);
    if (!question) {
        return errorReply(404, 'E009');
    }

    return successReply({
        question: question,
        options: await getQuestionOptions(questionId),
    });
}

export async function makeQuestionSpanEntireRow(questionId: number): Promise<IResponse> {
    const question = await questionModel.getQuestion(questionId);
    if (!question) {
        return errorReply(404, 'E009');
    }

    const newSpacing = (question.metadata && 'spanEntireRow' in question.metadata && question.metadata.spanEntireRow) ? false : true;

    const updateResult = await questionModel.addQuestionMetadata(questionId, 'spanEntireRow', newSpacing);

    if (!updateResult) {
        return errorReply(500, 'E009');
    }

    return successReply(updateResult);
}

export async function updateQuestionPrivacy(questionId: number, makePrivate: boolean = true): Promise<IResponse> {
    const updateResult = (makePrivate)
        ? await questionModel.updateQuestion(questionId, { public: false })
        : await questionModel.updateQuestion(questionId, { public: true });

    if (!updateResult) {
        return errorReply(500, 'E009');
    }

    return successReply(updateResult);
}
