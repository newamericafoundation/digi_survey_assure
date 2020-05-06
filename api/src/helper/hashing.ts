import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { SHA256 } from 'crypto-js';
import * as merkletreejs from 'merkletreejs';

export function sha256(input: string): string {
    return createHash('sha256').update(input).digest('base64');
}

export function sha256Hex(input: string): string {
    return createHash('sha256').update(input).digest('hex');
}

export function hashPassword(input: string): string {
    return bcrypt.hashSync(input, 10);
}

export function comparePasswords(savedPassword: string, inputPassword: string): boolean {
    return bcrypt.compareSync(inputPassword, savedPassword) ? true : false;
}

export function md5Hex(input: string): string {
    return createHash('md5').update(input).digest("hex");
}

export function getMerkleRoot(merkleTorontoLeafs: any[]): string {
    return createTree(merkleTorontoLeafs).getRoot().toString('hex');
}

export function createTree(merkleTorontoLeafs: any[]): any {
    const leaves = merkleTorontoLeafs.map((questionHash: any) => {
        return SHA256(getString(questionHash));
    });

    return new merkletreejs.MerkleTree(leaves, SHA256);
}

export function merkleProof(merkleTorontoLeafs: any[], merkleRoot: string, proofLeaf: any): boolean {
    const tree = createTree(merkleTorontoLeafs);
    const leaf = SHA256(getString(proofLeaf));
    const proof = tree.getProof(leaf);

    return tree.verify(proof, leaf, merkleRoot);
}

function getString(input: any): string {
    return (typeof input === 'string') ? input : JSON.stringify(input);
}
