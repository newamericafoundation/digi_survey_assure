import { questionMock } from '../../../../db/mocks/question';
import { questionOptionMock } from '../../../../db/mocks/questionOption';
import { surveyCompositeMock } from '../../../../db/mocks/surveyComposite';
import { surveyCompositeItemMock } from '../../../../db/mocks/surveyCompositeItem';
import { surveyResponseMock } from '../../../../db/mocks/surveyResponse';
import { getPlugin } from '../../../../src/plugin/formula/meanCutoff/meanCutoff';

jest.mock('../../../../src/model/surveyResponse', () => ({
    getSurveyResponses: jest.fn().mockReturnValueOnce([
        surveyResponseMock[0],
        surveyResponseMock[1],
        surveyResponseMock[2],
        surveyResponseMock[3],
        surveyResponseMock[4],
        surveyResponseMock[5],
        surveyResponseMock[6],
        surveyResponseMock[7],
        surveyResponseMock[8],
        surveyResponseMock[9],
    ])
}));

jest.mock('../../../../src/model/surveyResponseAnswer', () => ({
    getAnswersForSurveyResponseForQuestions: jest.fn()
        .mockReturnValueOnce([questionOptionMock[6], questionOptionMock[13]])
        .mockReturnValueOnce([questionOptionMock[6], questionOptionMock[13]])
        .mockReturnValueOnce([questionOptionMock[7], questionOptionMock[11]])
        .mockReturnValueOnce([questionOptionMock[9]])
        .mockReturnValueOnce([questionOptionMock[9], questionOptionMock[12]])
        .mockReturnValueOnce([questionOptionMock[8], questionOptionMock[14]])
        .mockReturnValueOnce([questionOptionMock[9], questionOptionMock[13]])
        .mockReturnValueOnce([questionOptionMock[10]])
        .mockReturnValueOnce([questionOptionMock[5], questionOptionMock[14]])
        .mockReturnValueOnce([questionOptionMock[9]])
}));

jest.mock('../../../../src/model/question', () => ({
    getQuestion: jest.fn()
        .mockReturnValueOnce(questionMock[2])
        .mockReturnValueOnce(questionMock[3])
}));

jest.mock('../../../../src/model/questionOption', () => ({
    listQuestionOptions: jest.fn()
        .mockReturnValueOnce([
            questionOptionMock[5],
            questionOptionMock[6],
            questionOptionMock[7],
            questionOptionMock[8],
            questionOptionMock[9]
        ])
        .mockReturnValueOnce([
            questionOptionMock[10],
            questionOptionMock[11],
            questionOptionMock[12],
            questionOptionMock[13],
            questionOptionMock[14]
        ])
}));

const compositeId3 = surveyCompositeMock[2];
const compositeId3Items = [
    surveyCompositeItemMock[4],
    surveyCompositeItemMock[5],
];
const compositeId3Expectation = {
    "total": 80,
    "questions": [
        {
            "composite": 66.67,
            "question": {
                "id": 3,
                "question_group_id": 1,
                "question_type_id": 1,
                "survey_id": 1,
                "external_source_id": "QID3",
                "text": "Have you experienced any form of abuse while working at the factory?",
                "metadata": {},
                "rawData": { "Choices": { "1": { "Display": "Definitely yes" }, "2": { "Display": "Probably yes" }, "3": { "Display": "Might or might not" }, "4": { "Display": "Probably not" }, "5": { "Display": "Definitely not" } }, "Language": [], "Selector": "SAVR", "QuestionID": "QID3", "Validation": { "Settings": { "Type": "None", "ForceResponse": "OFF", "ForceResponseType": "ON" } }, "ChoiceOrder": ["1", "2", "3", "4", "5"], "SubSelector": "TX", "NextAnswerId": 1, "NextChoiceId": 6, "QuestionText": "Have you experienced any form of abuse while working at the factory?", "QuestionType": "MC", "Configuration": { "QuestionDescriptionOption": "UseText" }, "DataExportTag": "Q3", "QuestionDescription": "Have you experienced any form of abuse while working at the factory?", "QuestionText_Unsafe": "Have you experienced any form of abuse while working at the factory?" }, "order": 3, "public": false
            },
            "questionOptions": []
        },
        {
            "composite": 75,
            "question": {
                "id": 4,
                "question_group_id": 1,
                "question_type_id": 1,
                "survey_id": 1,
                "external_source_id": "QID4",
                "text": "Do you feel safe within your work environment (emotionally, physically, etc.)?",
                "metadata": {
                    "spanEntireRow": true
                },
                "rawData": { "Choices": { "1": { "Display": "Definitely yes" }, "2": { "Display": "Probably yes" }, "3": { "Display": "Might or might not" }, "4": { "Display": "Probably not" }, "5": { "Display": "Definitely not" } }, "Language": [], "Selector": "SAVR", "QuestionID": "QID4", "Validation": { "Settings": { "Type": "None", "ForceResponse": "OFF", "ForceResponseType": "ON" } }, "ChoiceOrder": ["1", "2", "3", "4", "5"], "SubSelector": "TX", "NextAnswerId": 1, "NextChoiceId": 6, "QuestionText": "Do you feel safe within your work environment (emotionally, physically, etc.)?", "QuestionType": "MC", "Configuration": { "QuestionDescriptionOption": "UseText" }, "DataExportTag": "Q4", "QuestionDescription": "Do you feel safe within your work environment (emotionally, physically, etc.)?", "QuestionText_Unsafe": "Do you feel safe within your work environment (emotionally, physically, etc.)?" }, "order": 4, "public": false
            },
            "questionOptions": []
        }
    ],
    "totalResponsesFactoredByQuestion": { "3": 9, "4": 8 },
    "explainer": "Percentage of respondents whose average score across all questions, that make up the composite and which they answered, meet the criteria for the composite (average of 3 or above).",
    "metadata": {
        "averageMean": 4,
        "skippedResponses": [
            { "surveyResponseId": 3, "average": 2.5 },
            { "surveyResponseId": 8, "average": 1 }
        ]
    }
};

describe('Mean Cutoff Formula Plugin', () => {
    test('It should calculate the composite correctly.', async () => {
        const meanCutoffFormula = getPlugin();

        return meanCutoffFormula.calculate(compositeId3, compositeId3Items).then((result: any) => {
            expect(result).toEqual(compositeId3Expectation);
            expect(result.questions[0].composite).toEqual(66.67);
            expect(result.questions[1].composite).toEqual(75);
            expect(result.total).toEqual(80);
        });
    });
});
