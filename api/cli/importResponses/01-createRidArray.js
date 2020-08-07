const surveyModel = require('../../build/src/model/survey');
const fs = require('fs');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * INSTRUCTIONS
 * 
 * Purpose: This utility will create a JSON file of all survey response IDs within Qualtrics.
 * 
 * Directions: Before we can generate the JSON file, we need to export a JSON file from Qualtrics.
 * - Use the qualtrics API to export a JSON format file.
 * - Use that file as the primary import for this utility.
 * - Once we have generated the RID file, move on to step 2 "02-importRides.js".
 */

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

const exportFileName = () => {
    return new Promise((resolve, reject) => {
        readline.question('What should we name the file we are exporting RIDs to?', (answer) => {
            resolve(answer);
        });
    });
}

// Todo: create date mapping file.
// Survey 48
// ../../../poland-export.json
const responseIds2019 = [];

const mainCLI = async () => {
    const file = await fileLocation();
    const sid = await surveyId();
    const fileNameOutput = await exportFileName();

    const path = `${__dirname}/${file}`;
    const json = require(path);

    console.log(`-----> ${path}`);

    const survey = await surveyModel.getSurvey(sid);
    if (!survey) { console.log('Could not find survey...'); process.exit(); }

    console.log(survey);

    for (const response of json.responses) {
        responseIds2019.push(response.responseId);
    }

    const responseIds = JSON.stringify(responseIds2019);

    console.log(responseIds);

    fs.writeFile(fileNameOutput, responseIds, (err) => {
        if (err) {
            console.log(err);

            process.exit();
        }

        console.log('File written...');
    });

    readline.close();
}

mainCLI();
