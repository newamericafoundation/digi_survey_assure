import * as request from 'superagent';
import { IQualtricsListenerPayload } from '../interface';

interface IGetResponse {
    surveyId: string;
    responseId: string;
}

/**
 * @link https://api.qualtrics.com/reference#getresponse-1
 */
export async function run(pluginConfig: any, body: IGetResponse): Promise<IQualtricsListenerPayload | null> {
    try {
        const qualtricsRequest: request.Response = await request
            .get(`${pluginConfig.apiUrl}/surveys/${body.surveyId}/responses/${body.responseId}`)
            .set('Content-type', 'application/json')
            .set('X-API-Token', pluginConfig.apiSecretKey);

        if (!qualtricsRequest || (qualtricsRequest.body && "error" in qualtricsRequest.body.meta)) {
            console.log('There was an error getting survey response:', qualtricsRequest.body.meta.error.errorMessage);

            return null;
        }

        return qualtricsRequest.body.result;
    } catch (e) {
        return null;
    }
}
