require('dotenv').config();

const surveyController = require('../build/src/http/controller/survey');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const surveySourceId = () => {
    return new Promise((resolve, reject) => {
        readline.question('Survey Source ID? ', (answer) => {
            resolve(answer);
        });
    });
}

const surveyGroupId = () => {
    return new Promise((resolve, reject) => {
        readline.question('Survey Group ID to import into? ', (answer) => {
            resolve(answer);
        });
    });
}

const surveyName = () => {
    return new Promise((resolve, reject) => {
        readline.question('Name of this survey?  ', (answer) => {
            resolve(answer);
        });
    });
}

const mainCLI = async () => {
    const id = await surveySourceId();
    const groupId = await surveyGroupId();
    const name = await surveyName();
    console.log(`Importing survey ID ${id} with name ${name} into group ${groupId}...`);

    const created = await surveyController.create({
        survey_group_id: groupId,
        name: name,
        external_source_id: id
    });

    console.log(created);

    readline.close();
}

mainCLI();
