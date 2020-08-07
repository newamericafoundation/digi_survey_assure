const surveyModel = require('../../build/src/model/survey');
const listenerController = require('../../build/src/http/controller/listener');

/**
 * Note: this will skip sending to the blockchain by default unless variable
 * below is changed.
 */
const skipBlockchain = true;

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

require('dotenv').config();

const fileLocation = () => {
    return new Promise((resolve, reject) => {
        readline.question('What is the path to the JSON file to import? ', (answer) => {
            resolve(answer);
        });
    });
}

const surveyId = () => {
    return new Promise((resolve, reject) => {
        readline.question('What is the internal survey ID we are importing into? ', (answer) => {
            resolve(answer);
        });
    });
}

// Survey 48
// ../../../import20191217-rids.json
// ../../../temp_rids.json
const mainCLI = async () => {
    const file = await fileLocation();
    const sid = await surveyId();

    const path = `${__dirname}/${file}`;
    const json = require(path);

    console.log(`-----> ${path}`);

    const survey = await surveyModel.getSurvey(sid);
    if (!survey) { console.log('Could not find survey...'); process.exit(); }

    for (const rid of json) {
        // A "mock" payload to use with the listener controller to simulate the real time
        // data connections between qualtrics and our platform. One per RID.
        const qualtricsPayload = {
            "Topic": "harvard.surveyengine.completedResponse.xxx",
            "Status": "Complete",
            "ResponseID": rid,
            "ResponseEventContext": "",
            "SurveyID": survey.external_source_id,
            // "CompletedDate": "2019-03-01 08:01:10",
            "BrandID": "",
            "RecipientID": "",
        };

        // Skips the blockchain by default.
        const addResponse = await listenerController.registerSurveyResponse(sid, survey.listener_code, qualtricsPayload, skipBlockchain);
        if (addResponse.error && addResponse.code === 'E023') {
            console.log('SURVEY IS NOT ACITVE');

            process.exit();
        }

        console.log('->', qualtricsPayload, addResponse);

        if (skipBlockchain) {
            await sleep(50); // For qualtrics
        } else {
            await sleep(10000); // For qualtrics + blockchain
        }
    }

    console.log("\n\n\nDone import, wait for blockchain replys...");
}

async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

mainCLI();
