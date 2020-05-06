import { questionMock } from '../../../../db/mocks/question';
import { questionOptionMock } from '../../../../db/mocks/questionOption';
import { surveyMock } from '../../../../db/mocks/survey';
import { config } from '../../../../src/plugin/normalizer/qualtrics/config';
import { getPlugin } from '../../../../src/plugin/normalizer/qualtrics/qualtrics';

jest.mock('../../../../src/model/survey', () => ({
    getSurvey: jest.fn().mockReturnValueOnce(surveyMock[0])
}));

jest.mock('../../../../src/model/question', () => ({
    getQuestionFromExternalId: jest.fn()
        .mockReturnValueOnce(questionMock[0])
        .mockReturnValueOnce(questionMock[1])
}));

jest.mock('../../../../src/model/questionOption', () => ({
    getQuestionOptionFromRawValue: jest.fn()
        .mockReturnValueOnce(questionOptionMock[1])
        .mockReturnValueOnce(questionOptionMock[4])
}));

const sampleListenerPayload = {
    Topic: "company.surveyengine.completedResponse.ABC123",
    Status: "Complete",
    SurveyID: "ABC123",
    RecipientID: "",
    ResponseEventContext: "",
    ResponseID: "R_000001",
    CompletedDate: "2020-01-29 19:24:36",
    BrandID: "harvard",
};

// finished
const sampleResponse = {
    "responseId": "R_000001",
    "values": {
        "startDate": "2019-12-13T17:08:14Z",
        "endDate": "2019-12-13T17:08:24Z",
        "status": 0,
        "ipAddress": "12.12.12.123",
        "progress": 100,
        "duration": 9,
        "finished": 1,
        "recordedDate": "2019-12-13T17:08:24.476Z",
        "locationLatitude": "100.6464996338",
        "locationLongitude": "-100.9412002563",
        "distributionChannel": "anonymous",
        "userLanguage": "EN",
        "QID1": 2,
        "QID1_DO": ["1", "2"],
        "QID2": 2,
        "QID2_DO": ["1", "2", "3"],
    },
    "labels": {
        "status": "IP Address",
        "finished": "True",
        "QID1": "Female",
        "QID1_DO": ["Male", "Female"],
        "QID2": "Factory Worker",
        "QID2_DO": ["Floor Manager", "Factory Worker", "Factory Executive"],
    },
    "displayedFields": ["QID1", "QID2"],
    "displayedValues": {
        "QID1": [1, 2],
        "QID2": [1, 2, 3],
    }
};

const sampleNormalizedData = [
    { questionId: 1, questionOptionId: 2 },
    { questionId: 2, questionOptionId: 5 }
];

describe('Qualtrics Plugin', () => {
    const classInstance = getPlugin();
    // @ts-ignore
    const mockedFunction = classInstance.fetchSurveyResponseFromSource = jest.fn();

    test('It should set the plugin config correctly', async () => {
        expect(classInstance.config).toEqual(config);
    });

    test('It should fail if a non-existant hook is run', async () => {
        try {
            // tslint:disable-next-line
            classInstance.runHook('survey', 'fakeAction');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    test('It should reject an unfinished response', async () => {
        sampleResponse.values.finished = 0;
        mockedFunction.mockReturnValueOnce(sampleResponse);

        return classInstance.normalizeData(sampleListenerPayload).then((result: any) => {
            expect(result).toHaveLength(0);
        });
    });

    test('It should normalize data correctly', async () => {
        sampleResponse.values.finished = 1;
        mockedFunction.mockReturnValueOnce(sampleResponse);

        return classInstance.normalizeData(sampleListenerPayload).then((result: any) => {
            expect(result).toMatchObject(sampleNormalizedData);

            expect(classInstance.responseExternalId).toBe('R_000001');

            expect(classInstance.responseMetadata).toMatchObject(sampleResponse);

            expect(classInstance.responseRecordedDate).toBe('2019-12-13T17:08:24.476Z');
        });
    });
});
