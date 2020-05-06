import { connection } from '../helper/db';

export async function addMetadata(
    table: string,
    id: number | string,
    entryKey: string,
    entryValue: string,
    getField: string = 'id'
): Promise<boolean> {
    return connection.raw(`UPDATE ?? SET metadata = (CASE
            WHEN metadata -> ? IS NOT NULL
            THEN jsonb_set(metadata, '{??}', ?::jsonb)
            WHEN metadata -> ? IS NULL
            THEN jsonb_insert(metadata, '{??}', ?::jsonb)
        END) WHERE ?? = ?`, [table, entryKey, entryKey, entryValue, entryKey, entryKey, entryValue, getField, id])
        .then((updatedRows: any) => {
            return updatedRows ? true : false;
        })
        .catch((error: any) => {
            console.log(error);

            return false;
        });
}

export async function create(table: string, data: any): Promise<number | null> {
    return connection(table)
        .insert(data)
        .returning(['id'])
        .then((rows: any) => {
            return rows[0] ? rows[0].id : null;
        })
        .catch((error: any) => {
            console.log('CREATE error:', table, error);

            return null;
        });
}

export async function deleteRow(table: string, id: number | string, getField: string = 'id'): Promise<boolean> {
    return connection(table)
        .where(getField, '=', id)
        .del()
        .then((_result: any) => {
            return true;
        })
        .catch((error: any) => {
            console.log('DELETE error:', table, error);

            return false;
        });
}

export async function get(table: string, id: number | string, getField: string = 'id'): Promise<any | null> {
    return connection(table)
        .where(getField, id)
        .then((rows: any) => {
            return rows[0] ? rows[0] : null;
        })
        .catch((error: any) => {
            console.log('GET error:', table, id, error);

            return null;
        });
}

export async function getList(table: string, orderBy: string = 'id', orderDirection: string = 'asc'): Promise<any | null> {
    return connection(table)
        .orderBy(orderBy, orderDirection)
        .then((rows: any) => {
            return rows ? rows : null;
        })
        .catch((error: any) => {
            console.log('GET LIST error:', table, error);

            return null;
        });
}

export async function update(table: string, id: number | string, data: any, getField: string = 'id'): Promise<boolean> {
    return connection(table)
        .where(getField, id)
        .update(data)
        .limit(1)
        .then((updatedRows: any) => {
            return updatedRows ? true : false;
        })
        .catch((error: any) => {
            console.log(error);

            return false;
        });
}
