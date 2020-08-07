require('dotenv').config();

const { pluginLoader } = require('../build/src/plugin/loader');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question(`What is your Survey ID?`, async (surveyId) => {
    try {
        const plugin = pluginLoader('qualtrics');

        const surveyResponseIds = await plugin.runHook('survey', 'getResponses', {
            surveyId: surveyId
        });

        console.log('--surveyResponseIds-->', surveyResponseIds);
    } catch (e) {
        console.log('FAILED:', e);
    }

    readline.close();
});

