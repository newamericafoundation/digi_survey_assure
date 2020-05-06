import { errorReply, successReply } from '../../src/helper/response';

const testData = {
    randomKey: 'Random Value',
};

const successMock = {
    metadata: {
        fromCache: false,
        httpCode: 200,
    },
    body: {
        error: false,
        code: 'S001',
        data: testData,
    }
};

const errorMock = {
    metadata: {
        fromCache: false,
        httpCode: 500,
    },
    body: {
        error: true,
        code: 'E010',
        data: ['Could not find survey.']
    }
};

describe('API Response', () => {
    test('It should send a properly formatted success response', async () => {
        const response = successReply(testData);

        expect(response).toMatchObject(successMock);
    });

    test('It should send a properly formatted error response', async () => {
        const response = errorReply(500, 'E010', ['Could not find survey.']);

        expect(response).toMatchObject(errorMock);
    });
});