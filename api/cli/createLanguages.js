/**
 * Takes languages pre-February 10th, 2020 and updates them to be
 * compatible with the multi-lingual support.
 * 
 * THERE IS NO NEED TO RUN THIS IF YOU INSTALLED AFTER THAT DATE!
 */

require('dotenv').config();
const humanReadable = require('he');

const baseModel = require('../build/src/model/base');
const questionOptionModel = require('../build/src/model/questionOption');

function clean(input) {
    return humanReadable.decode(input.replace(/<[^>]+>/g, '').trim());
}

function cleanLanguageCode(input) {
    return input.toLowerCase().trim();
}

async function runCLI() {
    const allQuestions = await baseModel.getList('question');
    // const allLanguages = [];

    // Loop questions
    for (const aQuestion of allQuestions) {
        // Loop languages
        const languages = Object.keys(aQuestion.metadata.Language);
        for (const languageCode of languages) {
            // if (!allLanguages.includes(languageCode)) {
            //     allLanguages.push(languageCode);
            // }

            const languageDetails = aQuestion.metadata.Language[languageCode];

            console.log(`--question--> ${languageCode}: ${clean(languageDetails.QuestionText)}`);

            await baseModel.create('question_language', {
                question_id: aQuestion.id,
                language: cleanLanguageCode(languageCode),
                text: clean(languageDetails.QuestionText)
            });

            // Loop choices in this language.
            if (languageDetails.Choices) {
                const choices = Object.keys(languageDetails.Choices);
                for (const choiceKey of choices) {
                    const recodedKey = ("RecodeValues" in aQuestion.metadata && choiceKey in aQuestion.metadata.RecodeValues)
                        ? aQuestion.metadata.RecodeValues[choiceKey]
                        : choiceKey;

                    const internalChoiceId = await questionOptionModel.getQuestionOptionFromRawValue(aQuestion.id, recodedKey);
                    if (internalChoiceId) {
                        console.log(`--option--> ${internalChoiceId.id}: ${clean(languageDetails.Choices[choiceKey].Display)}`);

                        // Todo: input into question_option_language
                        await baseModel.create('question_option_language', {
                            question_option_id: internalChoiceId.id,
                            language: cleanLanguageCode(languageCode),
                            text: clean(languageDetails.Choices[choiceKey].Display)
                        });
                    }
                }
            }
        }
    }

    console.log("\n\n\n-------------------- Done!");
    process.exit();
}

runCLI();
