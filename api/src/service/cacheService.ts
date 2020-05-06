import * as moment from 'moment';
import * as redis from 'redis';
import { promisify } from 'util';
import { config } from '../config';
import { md5Hex } from '../helper/hashing';
import { createCache, deleteCache, getCache } from '../model/cache';

export async function getFromCache(key: string): Promise<any> {
    const hashKey = generateCacheKey(key);

    switch (config.CACHE_SERVICE) {
        case 'database':
            return getCacheFromDb(hashKey);
        case 'redis':
            return getCacheFromRedis(hashKey, redis.createClient(config.REDIS_URL || null));
        default:
            return null;
    }
}

export async function setToCache(key: string, data: any, expirationInSeconds: number = 86400): Promise<boolean> {
    const hashKey = generateCacheKey(key);

    switch (config.CACHE_SERVICE) {
        case 'database':
            return cacheDb(hashKey, data, expirationInSeconds);
        case 'redis':
            return cacheRedis(hashKey, data, expirationInSeconds, redis.createClient(config.REDIS_URL || null));
        default:
            return false;
    }
}

export async function removeFromCache(key: string): Promise<boolean> {
    const hashKey = generateCacheKey(key);

    switch (config.CACHE_SERVICE) {
        case 'database':
            return removeCacheDb(hashKey);
        case 'redis':
            return removeCacheRedis(hashKey, redis.createClient(config.REDIS_URL || null));
        default:
            return false;
    }
}

/**
 * Database Strategy
 */
async function cacheDb(key: string, data: any, expirationInSeconds: number): Promise<boolean> {
    const expirationDate = moment().add(expirationInSeconds, 'seconds').format('YYYY-MM-DD HH:mm:ss');

    // This maintains parity with how Redis would work when you attempt
    // to set a key that already exists.
    await removeCacheDb(key);

    const cacheDbId = await createCache({
        key: key,
        value: prepForStorage(data),
        expires_at: expirationDate,
    });

    return (cacheDbId) ? true : false;
}

async function getCacheFromDb(key: string): Promise<any> {
    const row = await getCache(key);

    if (row) {
        const today = moment().unix();
        const expiration = moment(row.expires_at).unix();

        if (today >= expiration) {
            await removeCacheDb(key);

            return null;
        } else {
            return JSON.parse(row.value);
        }
    } else {
        return null;
    }
}

async function removeCacheDb(key: string): Promise<boolean> {
    return deleteCache(key);
}

/**
 * Redis Strategy
 */
async function cacheRedis(key: string, data: any, expirationInSeconds: number, client: any): Promise<boolean> {
    const redisSet = promisify(client.set).bind(client);

    return redisSet(key, prepForStorage(data), 'EX', expirationInSeconds);
}

async function getCacheFromRedis(key: string, client: any): Promise<string | null> {
    const redisGet = promisify(client.get).bind(client);

    const value = await redisGet(key);

    return value ? JSON.parse(value) : null;
}

async function removeCacheRedis(key: string, client: any): Promise<boolean> {
    const redisDelete = promisify(client.del).bind(client);

    return redisDelete(key);
}

/**
 * Shared functionality
 */
function generateCacheKey(inputKey: string): string {
    return md5Hex(inputKey);
}

function prepForStorage(input: any): string {
    return JSON.stringify(input);
}
