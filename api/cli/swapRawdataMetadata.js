require('dotenv').config();

const baseModel = require('../build/src/model/base');

const mainCLI = async () => {
    const listQuestions = await baseModel.getList('question');
    for (const question of listQuestions) {
        await baseModel.update('question', question.id, {
            metadata: null,
            rawData: question.metadata,
        });
    }

    readline.close();
}

mainCLI();
