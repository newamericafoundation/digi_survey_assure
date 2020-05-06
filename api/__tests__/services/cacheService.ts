import { config } from '../../src/config';
import { getFromCache, removeFromCache, setToCache } from '../../src/service/cacheService';

jest.mock('../../src/model/cache', () => ({
    createCache: jest.fn().mockReturnValue(1),
    deleteCache: jest.fn().mockReturnValue(true),
    getCache: jest.fn()
        .mockReturnValueOnce({
            id: 1,
            key: "fakeKey",
            value: "\"fakeValue\"",
            created_at: "2020-01-27 15:57:08.765954-05",
            expires_at: "2090-01-28 15:57:08-05",
        })
        .mockReturnValueOnce({
            id: 2,
            key: "fakeKey",
            value: "\"fakeValue\"",
            created_at: "2000-01-27 15:57:08.765954-05",
            expires_at: "2000-01-28 15:57:08-05",
        })
}));

describe('Cache Service', () => {
    test('It should not set anything if no strategy is selected.', async () => {
        const setValue = await setToCache('fakeKey', 'fakeValue');

        expect(setValue).toBeFalsy();
    });

    test('It should not get anything if no strategy is selected.', async () => {
        const setValue = await getFromCache('fakeKey');

        expect(setValue).toBeNull();
    });

    test('It should not remove anything if no strategy is selected.', async () => {
        const setValue = await removeFromCache('fakeKey');

        expect(setValue).toBeFalsy();
    });

    // Database strategy
    test('It should set to DB if the database strategy is selected', async () => {
        config.CACHE_SERVICE = 'database';

        const setValue = await setToCache('fakeKey', 'fakeValue');

        expect(setValue).toBeTruthy();
    });

    test('It should get from the DB if the database strategy is selected', async () => {
        config.CACHE_SERVICE = 'database';

        const setValue = await getFromCache('fakeKey');

        expect(setValue).toEqual('fakeValue');
    });

    test('It should not return a value if the key is expired', async () => {
        config.CACHE_SERVICE = 'database';

        const setValue = await getFromCache('fakeKey');

        expect(setValue).toBeNull();
    });

    test('It should get from the DB if the database strategy is selected', async () => {
        config.CACHE_SERVICE = 'database';

        const setValue = await removeFromCache('fakeKey');

        expect(setValue).toBeTruthy();
    });
});
