import { IQuestion } from '../../src/interface/db';

export const questionMock: IQuestion[] = [{
    "id": 1,
    "question_group_id": 1,
    "question_type_id": 1,
    "survey_id": 1,
    "external_source_id": "QID1",
    "text": "What is your gender?",
    "metadata": {},
    "rawData": {
        "Choices": {
            "1": {
                "Display": "Male"
            },
            "2": {
                "Display": "Female"
            }
        },
        "Language": [],
        "Selector": "SAVR",
        "QuestionID": "QID1",
        "Validation": {
            "Settings": {
                "Type": "None",
                "ForceResponse": "OFF",
                "ForceResponseType": "ON"
            }
        },
        "ChoiceOrder": [
            1,
            2
        ],
        "SubSelector": "TX",
        "NextAnswerId": 1,
        "NextChoiceId": 3,
        "QuestionText": "What is you sex?",
        "QuestionType": "MC",
        "Configuration": {
            "QuestionDescriptionOption": "UseText"
        },
        "DataExportTag": "Q1",
        "QuestionDescription": "What is you sex?",
        "QuestionText_Unsafe": "What is you sex?"
    },
    "order": 1,
    "public": true,
}, {
    "id": 2,
    "question_group_id": 1,
    "question_type_id": 1,
    "survey_id": 1,
    "external_source_id": "QID2",
    "text": "What is your occupation within the factory?",
    "metadata": {},
    "rawData": {
        "Choices": {
            "1": { "Display": "Floor Manager" },
            "2": { "Display": "Factory Worker" },
            "3": { "Display": "Factory Executive" }
        },
        "Language": [],
        "Selector": "SAVR",
        "QuestionID": "QID2",
        "Validation": {
            "Settings": {
                "Type": "None", "ForceResponse": "OFF", "ForceResponseType": "ON"
            }
        },
        "ChoiceOrder": ["1", "2", "3"],
        "SubSelector": "TX",
        "NextAnswerId": 1,
        "NextChoiceId": 4,
        "QuestionText": "What is your occupation within the factory?",
        "QuestionType": "MC",
        "Configuration": { "QuestionDescriptionOption": "UseText" },
        "DataExportTag": "Q2",
        "QuestionDescription": "What is your occupation within the factory?",
        "QuestionText_Unsafe": "What is your occupation within the factory?"
    },
    "order": 2,
    "public": true,
}, {
    "id": 3,
    "question_group_id": 1,
    "question_type_id": 1,
    "survey_id": 1,
    "external_source_id": "QID3",
    "text": "Have you experienced any form of abuse while working at the factory?",
    "metadata": {},
    "rawData": {
        "Choices": {
            "1": { "Display": "Definitely yes" },
            "2": { "Display": "Probably yes" },
            "3": { "Display": "Might or might not" },
            "4": { "Display": "Probably not" },
            "5": { "Display": "Definitely not" }
        },
        "Language": [],
        "Selector": "SAVR",
        "QuestionID": "QID3",
        "Validation": {
            "Settings": {
                "Type": "None",
                "ForceResponse": "OFF",
                "ForceResponseType": "ON"
            }
        },
        "ChoiceOrder": ["1", "2", "3", "4", "5"],
        "SubSelector": "TX",
        "NextAnswerId": 1,
        "NextChoiceId": 6,
        "QuestionText": "Have you experienced any form of abuse while working at the factory?",
        "QuestionType": "MC",
        "Configuration": { "QuestionDescriptionOption": "UseText" },
        "DataExportTag": "Q3",
        "QuestionDescription": "Have you experienced any form of abuse while working at the factory?",
        "QuestionText_Unsafe": "Have you experienced any form of abuse while working at the factory?"
    },
    "order": 3,
    "public": false,
}, {
    "id": 4,
    "question_group_id": 1,
    "question_type_id": 1,
    "survey_id": 1,
    "external_source_id": "QID4",
    "text": "Do you feel safe within your work environment (emotionally, physically, etc.)?",
    "metadata": {
        "spanEntireRow": true
    },
    "rawData": {
        "Choices": {
            "1": { "Display": "Definitely yes" },
            "2": { "Display": "Probably yes" },
            "3": { "Display": "Might or might not" },
            "4": { "Display": "Probably not" },
            "5": { "Display": "Definitely not" }
        },
        "Language": [],
        "Selector": "SAVR",
        "QuestionID": "QID4",
        "Validation": {
            "Settings": {
                "Type": "None",
                "ForceResponse": "OFF",
                "ForceResponseType": "ON"
            }
        },
        "ChoiceOrder": ["1", "2", "3", "4", "5"],
        "SubSelector": "TX",
        "NextAnswerId": 1,
        "NextChoiceId": 6,
        "QuestionText": "Do you feel safe within your work environment (emotionally, physically, etc.)?",
        "QuestionType": "MC",
        "Configuration": { "QuestionDescriptionOption": "UseText" },
        "DataExportTag": "Q4",
        "QuestionDescription": "Do you feel safe within your work environment (emotionally, physically, etc.)?",
        "QuestionText_Unsafe": "Do you feel safe within your work environment (emotionally, physically, etc.)?"
    },
    "order": 4,
    "public": false,
}];
