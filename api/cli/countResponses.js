require('dotenv').config();

/**
 * Gets an individual survey response + answers belonging to that response
 */

const { countTotalResponses } = require('../build/src/model/surveyResponse');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question(`Survey ID: `, async (surveyId) => {
    const combined = await countTotalResponses(surveyId);

    console.log('---->', combined);

    readline.close();
});
