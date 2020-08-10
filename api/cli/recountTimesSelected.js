require('dotenv').config();

const questionModel = require('../build/src/model/question');
const questionOptionsModel = require('../build/src/model/questionOption');
const surveyResponseAnswer = require('../build/src/model/surveyResponseAnswer');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question(`Input survey ID to recount:`, async (surveyId) => {
    const questionsOnSurvey = await questionModel.getQuestionsOnSurvey(surveyId);

    for (const question of questionsOnSurvey) {
        const questionOption = await questionOptionsModel.getQuestionOptions(question.id);

        for (const anOption of questionOption) {
            const timesSelected = await surveyResponseAnswer.countTimesAQuestionOptionWasSelected(question.id, anOption.id);

            const update = await questionOptionsModel.updateQuestionOption(anOption.id, { times_selected: timesSelected });

            console.log(`--> Question ID ${question.id}, option ID ${anOption.id} with value "${anOption.legible_value}" was selected ${timesSelected} time(s); Updated? ${update}`);
        }
    }

    readline.close();
});
