import { ISurveyCompositeItem } from '../../src/interface/db';

/**
 * weight: (not applicable to all formulas) controls how much this selection effects the overall composite score relative to others; defaults to 1.
 */
export const surveyCompositeItemMock: ISurveyCompositeItem[] = [{
    id: 1,
    survey_composite_id: 1,
    question_id: 3,
    question_option_id: 8,
    weight: 1,
}, {
    id: 2,
    survey_composite_id: 1,
    question_id: 3,
    question_option_id: 9,
    weight: 1,
}, {
    id: 3,
    survey_composite_id: 1,
    question_id: 4,
    question_option_id: 13,
    weight: 1,
}, {
    id: 4,
    survey_composite_id: 1,
    question_id: 4,
    question_option_id: 14,
    weight: 1,
}, {
    id: 5,
    survey_composite_id: 3,
    question_id: 3,
    question_option_id: null,
    weight: 1,
}, {
    id: 6,
    survey_composite_id: 3,
    question_id: 4,
    question_option_id: null,
    weight: 1,
}];
