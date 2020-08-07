require('dotenv').config();

const moment = require('moment');
const dbHelper = require('../build/src/helper/db');

const duplicates = [
    '65459',
    '55139',
    '64651',
    '54752',
    '55799',
    '64945',
    '54481',
    '54480',
    '55033',
    '55555',
    '55608',
    '55776',
    '65369',
    '54708',
    '64447',
    '65231',
    '44462',
    '45014',
    '34616',
    '55552',
    '44410',
    '56351',
    '64479',
    '44467',
    '65966',
    '55898',
    '34537',
    '55862',
    '56073',
    '65851',
    '45253',
    '56270',
    '44446',
    '44460',
    '55440',
    '55489',
    '55548',
    '65677',
    '55901',
    '55094',
    '44362',
    '65292',
    '55545',
    '54564',
    '45055',
    '55234',
    '65696',
    '34613',
    '64393',
    '65101',
    '44421',
    '55551',
    '65283',
    '64719',
    '44405',
    '65744',
    '65047',
    '56461',
    '66106',
    '44974',
    '65580',
    '56439',
    '65615',
    '65189',
    '54400',
    '55002',
    '64937',
    '55726',
    '64994',
    '44526',
    '54451',
    '44376',
    '65109',
    '66114',
    '34402',
    '65120',
    '65131',
    '44710',
    '55043',
    '65367',
    '64661',
    '65557',
    '34526',
    '65699',
    '55088',
    '55573',
    '55296',
    // '55482',
    '55451',
    '44364',
    '55359',
    '55012',
    '55766',
    '65209',
    '55181',
    '55372',
    '54392',
    '56381',
    '65862',
    '34324',
    '65972',
    '55118',
    '65093',
];

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

async function mainCLI() {
    // const entries = await findEntries('55482');
    // console.log(entries[0].recorded_date, entries[1].recorded_date, entries[2].recorded_date);

    const deleting = [];

    for (const anEntry of duplicates) {
        const entries = await findEntries(anEntry);

        const moment1 = moment(entries[0].raw_response.values.recordedDate).unix();
        const moment2 = moment(entries[1].raw_response.values.recordedDate).unix();

        const deleteEntry = (moment1 > moment2) ? entries[0].id : entries[1].id;
        deleting.push(deleteEntry);

        console.log(entries[0].id, entries[0].raw_response.values.recordedDate, moment1, '|||', entries[1].id, entries[1].raw_response.values.recordedDate, moment2, '---->', deleteEntry);
    }

    console.log(JSON.stringify(deleting));
}

// Get both entries, delete one with later date.

async function findEntries(surveyId) {
    const bindings = surveyId.split('');

    return dbHelper.connection('survey_response')
        .select('*')
        .whereRaw(`raw_response@>'{"values":{"QID3_1": ${bindings[0]}}}'`)
        .whereRaw(`raw_response@>'{"values":{"QID3_2": ${bindings[1]}}}'`)
        .whereRaw(`raw_response@>'{"values":{"QID3_3": ${bindings[2]}}}'`)
        .whereRaw(`raw_response@>'{"values":{"QID3_4": ${bindings[3]}}}'`)
        .whereRaw(`raw_response@>'{"values":{"QID3_5": ${bindings[4]}}}'`)
        .then((rows) => {
            return rows ? rows : null;
        })
        .catch((error) => {
            console.log(error);

            return null;
        });
}

mainCLI();
