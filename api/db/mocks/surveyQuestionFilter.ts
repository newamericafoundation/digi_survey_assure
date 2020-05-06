import { ISurveyQuestionFilter } from '../../src/interface/db';

export const surveyQuestionFilterMock: ISurveyQuestionFilter[] = [{
    id: 1,
    survey_id: 1,
    question_id: 1,
    label: "Gender",
    order: 1,
}, {
    id: 2,
    survey_id: 1,
    question_id: 2,
    label: "Occupation",
    order: 2,
}];
