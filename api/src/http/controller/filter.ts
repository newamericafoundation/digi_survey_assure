import { errorReply, successReply } from '../../helper/response';
import { ISurveyFiltersResponse } from '../../interface/augmented';
import { IResponse } from '../../interface/response';
import { getQuestionOptions } from '../../model/questionOption';
import { getSurveyFilterQuestions } from '../../model/surveyQuestionFilter';

export async function getFiltersForSurvey(surveyId: number): Promise<IResponse> {
    const surveyFilters = await getSurveyFilterQuestions(surveyId);
    if (!surveyFilters) {
        return errorReply(404, 'E018');
    }

    const finalReply: ISurveyFiltersResponse[] = [];
    for (const aFilter of surveyFilters) {
        const questionOptions = await getQuestionOptions(aFilter.question_id);

        finalReply.push({
            filter: aFilter,
            options: questionOptions,
        });
    }

    return successReply(finalReply);
}
