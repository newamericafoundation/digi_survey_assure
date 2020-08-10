import * as request from 'superagent';
import { config } from '../../../../config';
import { cleanLanguageCode, removeHtml } from '../../../../helper/dataNormalizing';
import { IHookSurveyCreate } from '../../../../interface/hook';
import { createQuestion, getQuestionsOnSurvey } from '../../../../model/question';
import { createQuestionGroup } from '../../../../model/questionGroup';
import { createQuestionLanguage } from '../../../../model/questionLanguage';
import { createQuestionOption, getQuestionOptionFromRawValue } from '../../../../model/questionOption';
import { createQuestionOptionLanguage } from '../../../../model/questionOptionLanguage';
import { addSurveyMetadata } from '../../../../model/survey';

/**
 * Auto-imports questions for the survey.
 * Creates an event listener for the survey.
 * Imports language data, if available, for questions and question options.
 * 
 * @link https://api.qualtrics.com/reference
 */
export async function run(pluginConfig: any, data: IHookSurveyCreate): Promise<any> {
    const questionResult = await generateSurveyStructure(data.body.externalSourceId, data.surveyId, pluginConfig);
    if (!questionResult) {
        throw new Error('Survey could not be imported, see logs');
    }

    const listenResult = await createListener(data.body.externalSourceId, data.surveyId, data.listenerCode, pluginConfig);

    return {
        surveyQuestions: questionResult,
        listener: listenResult,
    };
}

async function generateSurveyStructure(qualtricsSurveyId: string, surveyId: number, pluginConfig: any): Promise<any> {
    try {
        const qualtricsFlowsRequest = await getFlows(qualtricsSurveyId, pluginConfig);

        const qualtricsBlocks: string[] = createBlocks(qualtricsFlowsRequest);

        let groupOrder = 0;
        const blockQuestionGroupMapping = [];
        for (const aBlock of qualtricsBlocks) {
            const qualtricsBlockRequest = await getBlock(qualtricsSurveyId, aBlock, pluginConfig);

            const questionGroupId = await createQuestionGroup({
                survey_id: surveyId,
                name: qualtricsBlockRequest.Description,
                order: groupOrder += 1,
            });

            const questionIds = qualtricsBlockRequest.BlockElements.filter((aBlockData: any) => {
                return aBlockData.Type === 'Question';
            });

            blockQuestionGroupMapping.push({
                questionGroupId,
                questionIds,
            });
        }

        const questions = await getQuestions(qualtricsSurveyId, pluginConfig);

        let counter = 0;
        // Loop blocks
        for (const aGrouping of blockQuestionGroupMapping) {
            // Loop questions in block
            for (const aQuestionId of aGrouping.questionIds) {
                const aQuestion = questions.elements.find((aReceivedQuestion: any) => {
                    return aReceivedQuestion.QuestionID === aQuestionId.QuestionID;
                });

                if (aQuestion) {
                    if (aQuestion.QuestionType === 'Matrix') {
                        const questionAnswers = Object.keys(aQuestion.Answers);

                        const metadata = (questionAnswers.length >= 10) ? { spanEntireRow: true } : {};

                        const questionChoices = Object.keys(aQuestion.Choices);
                        for (const aSubQuestion of questionChoices) {
                            const internalQuestionId = await createQuestion({
                                question_group_id: aGrouping.questionGroupId,
                                question_type_id: 1,
                                survey_id: surveyId,
                                external_source_id: `${aQuestion.QuestionID}_${aSubQuestion}`,
                                text: `${removeHtml(aQuestion.QuestionText)} ${removeHtml(aQuestion.Choices[aSubQuestion].Display)}`,
                                rawData: aQuestion,
                                metadata: metadata,
                                order: counter += 1,
                            });

                            let optionOrder = 0;
                            for (const rawAnswer of questionAnswers) {
                                await createQuestionOption({
                                    question_id: internalQuestionId,
                                    raw_value: getRawValue(aQuestion.RecodeValues, +rawAnswer),
                                    legible_value: removeHtml(aQuestion.Answers[rawAnswer].Display),
                                    order: optionOrder += 1,
                                });
                            }
                        }
                    } else {
                        if ('Choices' in aQuestion) {
                            const questionChoices = Object.keys(aQuestion.Choices);

                            const metadata = (questionChoices.length >= 10) ? { spanEntireRow: true } : {};

                            const internalQuestionId = await createQuestion({
                                question_group_id: aGrouping.questionGroupId,
                                question_type_id: 1,
                                survey_id: surveyId,
                                external_source_id: aQuestion.QuestionID,
                                text: removeHtml(aQuestion.QuestionText),
                                rawData: aQuestion,
                                metadata: metadata,
                                order: counter += 1
                            });

                            let optionOrder = 0;
                            for (const rawAnswer of questionChoices) {
                                await createQuestionOption({
                                    question_id: internalQuestionId,
                                    raw_value: getRawValue(aQuestion.RecodeValues, +rawAnswer),
                                    legible_value: removeHtml(aQuestion.Choices[rawAnswer].Display),
                                    order: optionOrder += 1
                                });
                            }
                        }
                    }
                }
            }
        }

        // Process language data for all questions
        const detectedLanguages = await processLanguageData(surveyId);
        if (detectedLanguages.indexOf(config.DEFAULT_LOCALE) < 0) { detectedLanguages.unshift(config.DEFAULT_LOCALE); }
        await addSurveyMetadata(surveyId, 'languages', JSON.stringify(detectedLanguages));

        return questions.elements;
    } catch (e) {
        console.log('Error importing survey', e);

        return null;
    }
}

async function processLanguageData(surveyId: number): Promise<string[]> {
    const allLanguages = [];
    const allQuestions = await getQuestionsOnSurvey(surveyId, false);
    for (const aQuestion of allQuestions) {
        const languages = Object.keys(aQuestion.rawData.Language);
        for (const languageCode of languages) {
            const sanitizedLanguageCode = cleanLanguageCode(languageCode);

            if (!allLanguages.includes(sanitizedLanguageCode)) { allLanguages.push(sanitizedLanguageCode); }

            const languageDetails = aQuestion.rawData.Language[languageCode];

            await createQuestionLanguage({
                question_id: aQuestion.id,
                language: sanitizedLanguageCode,
                text: removeHtml(languageDetails.QuestionText)
            });

            // Loop choices in this language.
            if (languageDetails.Choices) {
                const choices = Object.keys(languageDetails.Choices);
                for (const choiceKey of choices) {
                    const recodedKey = ("RecodeValues" in aQuestion.rawData && choiceKey in aQuestion.rawData.RecodeValues)
                        ? aQuestion.rawData.RecodeValues[choiceKey]
                        : choiceKey;

                    const internalChoiceId = await getQuestionOptionFromRawValue(aQuestion.id, recodedKey);
                    if (internalChoiceId) {
                        await createQuestionOptionLanguage({
                            question_option_id: internalChoiceId.id,
                            language: sanitizedLanguageCode,
                            text: removeHtml(languageDetails.Choices[choiceKey].Display)
                        });
                    }
                }
            }
        }
    }

    return allLanguages;
}

async function createListener(qualtricsSurveyId: string, internalSurveyId: number, listenerCode: string, pluginConfig: any): Promise<any> {
    try {
        console.log('-- Creating listener on -->', `${config.APP_API_URL}/listener/${internalSurveyId}/${listenerCode}`);

        const listener = await request
            .post(`${pluginConfig.apiUrl}/eventsubscriptions`)
            .send({
                "topics": `surveyengine.completedResponse.${qualtricsSurveyId}`,
                "publicationUrl": `${config.APP_API_URL}/listener/${internalSurveyId}/${listenerCode}`,
                "encrypt": false
            })
            .set('Content-type', 'application/json')
            .set('X-API-Token', pluginConfig.apiSecretKey);

        return listener.body;
    } catch (e) {
        console.log('Error creating survey listener', e);

        return null;
    }
}

async function getFlows(qualtricsSurveyId: string, pluginConfig: any): Promise<any> {
    const qualtricsFlowsRequest: request.Response = await request
        .get(`${pluginConfig.apiUrl}/survey-definitions/${qualtricsSurveyId}/flow`)
        .set('Content-type', 'application/json')
        .set('X-API-Token', pluginConfig.apiSecretKey);

    if (qualtricsFlowsRequest.body && "error" in qualtricsFlowsRequest.body.meta) {
        console.log('There was an error importing the survey - flows failed to retrieve:', qualtricsFlowsRequest.body.meta.error.errorMessage);

        return null;
    } else {
        return qualtricsFlowsRequest.body.result;
    }
}

function createBlocks(qualtricsFlows: any): string[] {
    return qualtricsFlows.Flow.map((aFlow: any) => {
        if (aFlow.Type === 'Block' || aFlow.Type === 'Standard') { return aFlow.ID; }
    });
}

/**
 * Sometimes RecodeValues has key -> value, sometimes just values.
 * Bad Qualtrics, bad!
 * getRawValue(aQuestion.RecodeValues, rawAnswer)
 * aQuestion.RecodeValues ? aQuestion.RecodeValues[rawAnswer] : rawAnswer,
 */
function getRawValue(recodeValues: any, rawAnswer: number): number {
    if (!recodeValues) {
        return rawAnswer;
    }

    /*
    I honestly don't know if this is right, Qualtrics is a mess.
    
    Clear "Object" Example (which says if I get 0, it means 2, ie "no"):

        "Choices": {
            "1": { "Display": "&nbsp;Yes" },
            "2": { "Display": "&nbsp;No" }
        },
        "RecodeValues": {
            "1": 1,
            "2": "0"
        },

    A Confusing "Array" Example (does this mean if I get a 1, it displays a 0?? That's what I'm assuming):
    The problem is that I can't use a key like above, so what if the RecodesValues are out of 
    order? Is that a thing Qualtrics would do? I have no clue.

        "Choices":[
            { "Display":"0" },
            { "Display":"1" },
            { "Display":"2" },
            { "Display":"3" },
            { "Display":"4" },
            { "Display":"5" },
            { "Display":"6" },
            { "Display":"7" },
            { "Display":"8" },
            { "Display":"9" },
            { "Display":"10" }
        ],

        "RecodeValues":[ "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11" ],
    */
    if (Array.isArray(recodeValues)) {
        return rawAnswer - 1;
    } else {
        return recodeValues[rawAnswer];
    }
}

async function getBlock(qualtricsSurveyId: string, blockId: string, pluginConfig: any): Promise<any> {
    const qualtricsBlockRequest: request.Response = await request
        .get(`${pluginConfig.apiUrl}/survey-definitions/${qualtricsSurveyId}/blocks/${blockId}`)
        .set('Content-type', 'application/json')
        .set('X-API-Token', pluginConfig.apiSecretKey);

    if ("error" in qualtricsBlockRequest.body.meta) {
        console.log('There was an error importing the survey - block failed to retrieve:', qualtricsBlockRequest.body.meta.error.errorMessage);

        return null;
    } else {
        return qualtricsBlockRequest.body.result;
    }
}

async function getQuestions(qualtricsSurveyId: string, pluginConfig: any): Promise<any> {
    const questions: request.Response = await request
        .get(`${pluginConfig.apiUrl}/survey-definitions/${qualtricsSurveyId}/questions`)
        .set('Content-type', 'application/json')
        .set('X-API-Token', pluginConfig.apiSecretKey);

    if ("error" in questions.body.meta) {
        return null;
    }

    return questions.body.result;
}
