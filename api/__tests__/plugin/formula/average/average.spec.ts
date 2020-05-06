import { questionMock } from '../../../../db/mocks/question';
import { questionOptionMock } from '../../../../db/mocks/questionOption';
import { surveyCompositeMock } from '../../../../db/mocks/surveyComposite';
import { surveyCompositeItemMock } from '../../../../db/mocks/surveyCompositeItem';
import { getPlugin } from '../../../../src/plugin/formula/average/average';

jest.mock('../../../../src/helper/surveyResponse', () => ({
    getQuestionResults: jest.fn()
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

// Question ID 2, Options 8/9
const compositeId1 = surveyCompositeMock[0];
const compositeId1Items = [
    surveyCompositeItemMock[0],
    surveyCompositeItemMock[1],
    surveyCompositeItemMock[2],
    surveyCompositeItemMock[3]
];
const compositeId1Expectation = {
    "total": 40,
    "questions": [
        {
            "composite": "40.00",
            "question": {
                "id": 3, "question_group_id": 1, "question_type_id": 1, "survey_id": 1, "external_source_id": "QID3", "text": "Have you experienced any form of abuse while working at the factory?",
                "metadata": {},
                "rawData": { "Choices": { "1": { "Display": "Definitely yes" }, "2": { "Display": "Probably yes" }, "3": { "Display": "Might or might not" }, "4": { "Display": "Probably not" }, "5": { "Display": "Definitely not" } }, "Language": [], "Selector": "SAVR", "QuestionID": "QID3", "Validation": { "Settings": { "Type": "None", "ForceResponse": "OFF", "ForceResponseType": "ON" } }, "ChoiceOrder": ["1", "2", "3", "4", "5"], "SubSelector": "TX", "NextAnswerId": 1, "NextChoiceId": 6, "QuestionText": "Have you experienced any form of abuse while working at the factory?", "QuestionType": "MC", "Configuration": { "QuestionDescriptionOption": "UseText" }, "DataExportTag": "Q3", "QuestionDescription": "Have you experienced any form of abuse while working at the factory?", "QuestionText_Unsafe": "Have you experienced any form of abuse while working at the factory?" }, "order": 3, "public": false
            }, "questionOptions": [{ "id": 8, "question_id": 3, "raw_value": 3, "legible_value": "Might or might not", "times_selected": 60, "order": 3 }, { "id": 9, "question_id": 3, "raw_value": 4, "legible_value": "Probably not", "times_selected": 100, "order": 3 }]
        },
        {
            "composite": "40.00",
            "question": {
                "id": 4, "question_group_id": 1, "question_type_id": 1, "survey_id": 1, "external_source_id": "QID4", "text": "Do you feel safe within your work environment (emotionally, physically, etc.)?",
                "metadata": {
                    "spanEntireRow": true
                },
                "rawData": { "Choices": { "1": { "Display": "Definitely yes" }, "2": { "Display": "Probably yes" }, "3": { "Display": "Might or might not" }, "4": { "Display": "Probably not" }, "5": { "Display": "Definitely not" } }, "Language": [], "Selector": "SAVR", "QuestionID": "QID4", "Validation": { "Settings": { "Type": "None", "ForceResponse": "OFF", "ForceResponseType": "ON" } }, "ChoiceOrder": ["1", "2", "3", "4", "5"], "SubSelector": "TX", "NextAnswerId": 1, "NextChoiceId": 6, "QuestionText": "Do you feel safe within your work environment (emotionally, physically, etc.)?", "QuestionType": "MC", "Configuration": { "QuestionDescriptionOption": "UseText" }, "DataExportTag": "Q4", "QuestionDescription": "Do you feel safe within your work environment (emotionally, physically, etc.)?", "QuestionText_Unsafe": "Do you feel safe within your work environment (emotionally, physically, etc.)?" }, "order": 4, "public": false
            }, "questionOptions": [{ "id": 13, "question_id": 4, "raw_value": 3, "legible_value": "Might or might not", "times_selected": 60, "order": 3 }, { "id": 14, "question_id": 4, "raw_value": 4, "legible_value": "Probably not", "times_selected": 100, "order": 3 }]
        }],
    "totalResponsesFactoredByQuestion": { "3": 400, "4": 400 },
    "explainer": "Calculated by getting the percent of respondents who selected a response within the applicable data set for each question and then averages the percentages of all questions together to form a composite percentage."
};

describe('Average Formula Plugin', () => {
    test('It should average the data correctly.', async () => {
        const averageFormula = getPlugin();

        return averageFormula.calculate(compositeId1, compositeId1Items).then((result: any) => {
            expect(result).toEqual(compositeId1Expectation);

            expect(result.total).toEqual(40);
        });
    });
});
