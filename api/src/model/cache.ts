import { connection } from '../helper/db';
import { ICache } from '../interface/db';
import { ICachePayload } from '../interface/payload';
import { create, deleteRow, get } from './base';

const table = 'cache';

export async function createCache(data: ICachePayload): Promise<number | null> {
    return create(table, data);
}

export async function deleteCache(key: string, getField: string = 'key'): Promise<boolean> {
    return deleteRow(table, key, getField);
}

export async function deleteEntireCache(): Promise<boolean> {
    return connection(table)
        .truncate()
        .then((_result: any) => {
            return true;
        })
        .catch((error: any) => {
            console.log('DELETE error:', table, error);

            return false;
        });
}

export async function getCache(key: number | string, getField: string = 'key'): Promise<ICache | null> {
    return get(table, key, getField);
}
