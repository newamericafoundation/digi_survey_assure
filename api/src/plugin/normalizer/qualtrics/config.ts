import { config as appConfig } from '../../../config';

export const config = {
    apiSecretKey: appConfig.SURVEY_DATA_PROVIDER_CRED1,
    apiUrl: appConfig.SURVEY_DATA_PROVIDER_URL,
    removeKeysFromAnswer: [
        'ipAddress',
        'locationLatitude',
        'locationLongitude',
    ]
};
