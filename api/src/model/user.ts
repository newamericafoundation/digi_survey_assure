import { connection } from '../helper/db';
import { IUser } from '../interface/db';

const table = 'user';

export async function getUserByUsername(username: string): Promise<IUser | null> {
    return connection(table)
        .where('username', username)
        .limit(1)
        .then((rows: any) => {
            return rows[0] ? rows[0] : null;
        })
        .catch((error: any) => {
            console.log('GET error:', table, error);

            return null;
        });
}
