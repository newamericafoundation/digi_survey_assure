import * as moment from 'moment';
import { errorReply, successReply } from '../../helper/response';
import { normalizeAndInputSurveyResponse } from '../../helper/surveyResponse';
import { ISurveyWithSource } from '../../interface/db';
import { IResponse } from './../../interface/response';
import { getSurveyWithGroup } from './../../model/survey';

export async function registerSurveyResponse(surveyId: number, listenerCode: string, body: any, skipBlockchain: boolean = false): Promise<IResponse> {
    const survey: ISurveyWithSource = await getSurveyWithGroup(surveyId);
    if (!survey) { return errorReply(404, 'E002'); }
    if (survey.listener_code !== listenerCode) { return errorReply(404, 'E008'); }
    if (!survey.active) { return errorReply(401, 'E023'); }
    if (survey.start_at && moment(survey.start_at).unix > moment().unix) { return errorReply(401, 'E024'); }
    if (survey.end_at && moment(survey.end_at).unix < moment().unix) { return errorReply(401, 'E025'); }

    try {
        return successReply(await normalizeAndInputSurveyResponse(survey, body, skipBlockchain));
    } catch (e) {
        console.log('Error normalizing survey data', e);

        return errorReply(500, e);
    }
}
