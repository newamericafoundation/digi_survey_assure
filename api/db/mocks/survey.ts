import { ISurvey } from '../../src/interface/db';

export const surveyMock: ISurvey[] = [{
    "id": 1,
    "survey_group_id": 1,
    "name": "Test Survey Group",
    "external_source_id": 'ABC123',
    "description": "Test description",
    "listener_code": "ABC123",
    "url": "",
    "metadata": {
        languages: ['en', 'es']
    },
    "created_at": "2019-05-13 12:00:00",
    "updated_at": "2019-05-13 12:00:00",
    "start_at": "2019-05-13 12:00:00",
    "end_at": "2019-05-20 12:00:00",
    "active": true,
}];
