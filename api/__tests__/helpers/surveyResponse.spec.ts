import { compareResponseArrays } from '../../src/helper/surveyResponse';

describe('Survey Response Helper', () => {
    test('It should return the difference between two arrays', async () => {
        const externalSourceIds = ['abc_001', 'abc_002', 'abc_003', 'abc_004', 'abc_005', 'abc_006'];
        const internalSourceIds = ['abc_002', 'abc_004', 'abc_005'];

        const results = compareResponseArrays(externalSourceIds, internalSourceIds);

        expect(results).toMatchObject(['abc_001', 'abc_003', 'abc_006']);
    });
});