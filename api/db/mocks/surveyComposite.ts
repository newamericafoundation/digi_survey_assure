import { ISurveyComposite } from '../../src/interface/db';

/**
 * formula defaults to "average" and maps to the plugin formula name.
 */
export const surveyCompositeMock: ISurveyComposite[] = [{
    id: 1,
    survey_id: 2,
    name: "Workplace Positivity",
    description: "Metric to determine overall positive feelings.",
    filters: null,
    order: 1,
    created_at: "2019-12-13 19:34:00.197277+00",
    updated_at: "2019-12-13 19:34:00.197277+00",
    formula: "average",
    metadata: {},
}, {
    id: 2,
    survey_id: 2,
    name: "Workplace Positivity (Female)",
    description: "Metric to determine overall positive feelings for females.",
    filters: { "1": "2" },
    order: 2,
    created_at: "2019-12-13 19:34:00.197277+00",
    updated_at: "2019-12-13 19:34:00.197277+00",
    formula: "average",
    metadata: {},
}, {
    id: 3,
    survey_id: 2,
    name: "Workplace Positivity (Mean)",
    description: "Metric to determine overall positive feelings based on a mean cutoff.",
    filters: null,
    order: 3,
    created_at: "2019-12-13 19:34:00.197277+00",
    updated_at: "2019-12-13 19:34:00.197277+00",
    formula: "meanCutoff",
    metadata: { "cutoff": 3 },
}];
