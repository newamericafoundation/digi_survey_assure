import { config } from '../config';
import { IQuestionOption, ISurveyWithSource } from '../interface/db';
import { IRegisterResponse } from '../interface/plugin';
import { getQuestionsOnSurvey } from '../model/question';
import { getQuestionOptions, increaseTimesSelected, updateQuestionOption } from '../model/questionOption';
import { createSurveyResponse, getSurveyResponse } from '../model/surveyResponse';
import {
    countTimesAQuestionOptionWasSelected,
    createSurveyResponseAnswer,
    getAnswersForSurveyResponse,
    getFilteredQuestionOptionCount,
    getResponsesThatSelectedQuestionOptionId
} from '../model/surveyResponseAnswer';
import { pluginLoader } from '../plugin/loader';
import { prepareAndSendResponseToBlockchain } from './blockchain';
import { md5Hex } from './hashing';
import { translateQuestionOption } from './localization';

/**
 * Takes an array of external source IDs grabbed from the source via a plugin hook (sourceIds)
 * and compares that to a list of external source IDs saved locally in our database (internalIds).
 * Returns the elements that exist in sourceIds but not in the internalIds.
 * 
 * @param sourceIds Array of response IDs grabbed from the source itself (IE: qualtrics, survey monkey).
 * @param internalIds Array of survey_response.external_source_id
 */
export function compareResponseArrays(sourceIds: any[], internalIds: any[]): any[] {
    return sourceIds.filter((aResponseId: any) => {
        if (internalIds.indexOf(aResponseId) === -1) {
            return true;
        } else {
            return false;
        }
    });
}

/**
 * Primary mechanism for getting filtered question results. Filtered results
 * means only grab responses that selected a specific value for a specific
 * question. An example would be getting all responses which replied to the
 * "what is your gender?" question with "female".
 * 
 * @param questionId 
 * @param filters An object with mapping: [f]survey_question_filter.id -> question_option.id (as string)
 *                Example: { f3: '15023', f4: '15991' }
 */
export async function getQuestionResults(questionId: number, filters: any = {}, locale: string = config.DEFAULT_LOCALE): Promise<IQuestionOption[]> {
    const questionOptions = await getQuestionOptions(questionId);
    if (locale !== config.DEFAULT_LOCALE) {
        for (let aQuestionOption of questionOptions) {
            aQuestionOption = await translateQuestionOption(aQuestionOption, locale);
        }
    }

    if (!filters) {
        return questionOptions;
    }

    const filteredSurveyResponseIds = await getFilteredResults(filters);

    for (const anOption of questionOptions) {
        anOption.times_selected = await getFilteredQuestionOptionCount(anOption.id, filteredSurveyResponseIds);
    }

    return questionOptions;
}

/**
 * Returns a list of survey_response.id that selected the options we are filtering against.
 * 
 * @param filters
 */
export async function getFilteredResults(filters: any): Promise<any> {
    const filteredLists = [];
    for (const key of Object.keys(filters)) {
        if (filters[key]) {
            const responseIds = await getResponsesThatSelectedQuestionOptionId(filters[key]);

            const responseIdArray = responseIds.map((entry: any) => { return entry.survey_response_id; });

            if (responseIds.length > 0) {
                filteredLists.push(responseIdArray);
            }
        }
    }

    // Find the intersection of all the survey responses that selected the question
    // option we are filtering against and send that back for result compilation.
    return filteredLists.length > 0 ? filteredLists.reduce((a: any, b: any) => a.filter((c: any) => b.includes(c))) : [];
}

/**
 * Designed to build an array which contains the survey response data and all the survey
 * response answers. Used primarily with merkle trees and merkle proofs.
 * 
 * @param surveyResponseId 
 */
export async function getSurveyAnswersForProofs(surveyResponseId: number): Promise<any> {
    const surveyResponseData = await getSurveyResponse(surveyResponseId);

    // By their nature, the "updated_at" date and "metadata" change,
    // therefore we can't include them in proofs.
    delete surveyResponseData.metadata;
    delete surveyResponseData.updated_at;

    const answers = await getAnswersForSurveyResponse(surveyResponseId);

    return [surveyResponseData, ...answers];
}

/**
 * Normalizes a survey response via a plugin and then inputs the normalized
 * data into our local database.
 * 
 * "body" is listed as "any" to accomodate various data source formats for this data.
 * Please see the normalizer plugin you are working with for more information
 * on the expected body format.
 */
export async function normalizeAndInputSurveyResponse(survey: ISurveyWithSource, body: any, skipBlockchain: boolean = false): Promise<number> {
    const plugin = pluginLoader(survey.source_plugin);

    const normalizedData: IRegisterResponse[] = await plugin.normalizeData(body);
    if (normalizedData.length > 0) {
        const confirmationHash = md5Hex(JSON.stringify(normalizedData));

        // Unique DB constraint makes this fail if `external_source_id` duplicates.
        const surveyResponseId = await createSurveyResponse({
            survey_id: survey.id,
            external_source_id: plugin.responseExternalId,
            raw_response: plugin.responseMetadata,
            recorded_at: plugin.responseRecordedDate,
            confirmation_hash: confirmationHash,
        });
        if (!surveyResponseId) {
            throw new Error('E007');
        }

        for (const surveyAnswer of normalizedData) {
            await createSurveyResponseAnswer({
                survey_response_id: surveyResponseId,
                question_id: surveyAnswer.questionId,
                question_option_id: surveyAnswer.questionOptionId,
            });

            await increaseTimesSelected(surveyAnswer.questionOptionId);
        }

        if (!skipBlockchain) {
            await prepareAndSendResponseToBlockchain(surveyResponseId);
        }

        return surveyResponseId;
    } else {
        throw new Error('E017');
    }
}

export async function recountResponseTotals(surveyId: number): Promise<boolean> {
    const questionsOnSurvey = await getQuestionsOnSurvey(surveyId);

    for (const question of questionsOnSurvey) {
        const questionOption = await getQuestionOptions(question.id);

        for (const anOption of questionOption) {
            const timesSelected = await countTimesAQuestionOptionWasSelected(question.id, anOption.id);

            await updateQuestionOption(anOption.id, { times_selected: timesSelected });
        }
    }

    return true;
}
