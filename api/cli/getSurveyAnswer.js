require('dotenv').config();

/**
 * Gets an individual survey response + answers belonging to that response
 */

const { getSurveyAnswersForProofs } = require('../src/helper/surveyResponse');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question(`Input survey response ID: `, async (surveyResponseId) => {
    const combined = await getSurveyAnswersForProofs(surveyResponseId);

    console.dir(JSON.stringify(combined));

    readline.close();
});
