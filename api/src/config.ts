export const config = {
    /**
     * General App configuration
     */
    APP_API_URL: getEnvVariable('APP_API_URL', 'http://localhost:4000/api/v1'),
    APP_SECRET: getEnvVariable('APP_SECRET', 'N0t_A_Gr3at_Secr3t!'),
    DEBUG: getEnvVariable('DEBUG', 'false'),
    DEFAULT_CHARTING_PLUGIN: getEnvVariable('DEFAULT_CHARTING_PLUGIN', 'chartjs'),
    DEFAULT_LOCALE: getEnvVariable('DEFAULT_LOCALE', 'en'),
    JWT_SECRET: getEnvVariable('JWT_SECRET'),
    NODE_ENV: getEnvVariable('NODE_ENV', 'production'),
    PORT: getEnvVariable('PORT', '4000'),
    PROJECT_NAME: getEnvVariable('PROJECT_NAME', 'Survey Assure'),

    /**
     * Blockchain-related Configuration
     */
    BLOCKCHAIN_CONTRACT_ADDRESS: getEnvVariable('BLOCKCHAIN_CONTRACT_ADDRESS'),
    BLOCKCHAIN_PROVIDER_NETWORK: getEnvVariable('BLOCKCHAIN_PROVIDER_NETWORK', 'kovan'),
    BLOCKCHAIN_WALLET_PRIVATE_KEY: getEnvVariable('BLOCKCHAIN_WALLET_PRIVATE_KEY'),
    INFURA_PROJECT_ID: getEnvVariable('INFURA_PROJECT_ID', null),
    INFURA_PROJECT_SECRET: getEnvVariable('INFURA_PROJECT_SECRET', null),

    /**
     * Data-layer Configuration
     */
    CACHE_SERVICE: getEnvVariable('CACHE_SERVICE', 'database'),
    DATABASE_URL: getEnvVariable('DATABASE_URL', null),
    DATABASE_USE_SSL: getEnvVariable('DATABASE_USE_SSL', 'false'),
    PGDATABASE: getEnvVariable('PGDATABASE', ''),
    PGHOST: getEnvVariable('PGHOST', 'localhost'),
    PGPORT: getEnvVariable('PGPORT', '5423'),
    PGPASSWORD: getEnvVariable('PGPASSWORD', ''),
    PGUSER: getEnvVariable('PGUSER', ''),
    REDIS_URL: getEnvVariable('REDIS_URL', 'redis://localhost:6379'),

    /**
     * Survey-provided Configuration
     * Example: Qualtrics, Survey Money, etc.
     */
    SURVEY_DATA_PROVIDER_URL: getEnvVariable('SURVEY_DATA_PROVIDER_URL'),
    SURVEY_DATA_PROVIDER_CRED1: getEnvVariable('SURVEY_DATA_PROVIDER_CRED1'),
    SURVEY_DATA_PROVIDER_CRED2: getEnvVariable('SURVEY_DATA_PROVIDER_CRED2'),
    SURVEY_DATA_PROVIDER_MISC1: getEnvVariable('SURVEY_DATA_PROVIDER_MISC1'),
    SURVEY_DATA_PROVIDER_MISC2: getEnvVariable('SURVEY_DATA_PROVIDER_MISC2'),
};

function getEnvVariable(key: string, defaultValue?: string): string {
    return key in process.env ? (process.env[key] || defaultValue) : defaultValue;
}
