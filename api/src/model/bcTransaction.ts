// import { connection } from '../helper/db';
import { IBcTransction } from '../interface/db';
import { IBcTransactionPayload } from '../interface/payload';
import { create, get, update } from './base';

const table = 'bc_transaction';

export async function createBlockchainTransaction(data: IBcTransactionPayload): Promise<number | null> {
    return create(table, data);
}

export async function getBlockchainTransaction(transactionId: number): Promise<IBcTransction | null> {
    return get(table, transactionId);
}

export async function updateBlockchainTransaction(transactionId: number, data: any): Promise<boolean> {
    return update(table, transactionId, data);
}
