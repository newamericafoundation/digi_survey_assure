import { questionOptionMock } from '../../../db/mocks/questionOption';
import { surveyQuestionFilterMock } from '../../../db/mocks/surveyQuestionFilter';
import { errorReply, successReply } from '../../../src/helper/response';
import { getFiltersForSurvey } from '../../../src/http/controller/filter';

jest.mock('../../../src/model/surveyQuestionFilter', () => ({
    getSurveyFilterQuestions: jest.fn()
        .mockReturnValueOnce(null)
        .mockReturnValueOnce([
            surveyQuestionFilterMock[0],
            surveyQuestionFilterMock[1]
        ])
}));

jest.mock('../../../src/model/questionOption', () => ({
    listQuestionOptions: jest.fn()
        .mockReturnValueOnce([
            questionOptionMock[0],
            questionOptionMock[1],
        ])
        .mockReturnValueOnce([
            questionOptionMock[2],
            questionOptionMock[3],
            questionOptionMock[4],
        ])
}));

const failedReponse = errorReply(404, 'E018');

const successPayload = [{
    filter: surveyQuestionFilterMock[0],
    options: [
        questionOptionMock[0],
        questionOptionMock[1],
    ],
}, {
    filter: surveyQuestionFilterMock[1],
    options: [
        questionOptionMock[2],
        questionOptionMock[3],
        questionOptionMock[4],
    ],
}];

const successResponse = successReply(successPayload);

describe('Filter Controller', () => {
    test('It should fail if a survey ID does not exist.', async () => {
        const filters = await getFiltersForSurvey(10);

        expect(filters).toEqual(failedReponse);
    });

    test('It should return survey filters correctly.', async () => {
        const filters = await getFiltersForSurvey(1);

        expect(filters).toEqual(successResponse);
    });
});
