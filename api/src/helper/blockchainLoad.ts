import * as ethers from 'ethers';
import * as fs from 'fs';
import { config } from '../config';

export function getProvider(): any {
    try {
        if (config.INFURA_PROJECT_ID) {
            return new ethers.providers.InfuraProvider(config.BLOCKCHAIN_PROVIDER_NETWORK, config.INFURA_PROJECT_ID);
        } else {
            return ethers.getDefaultProvider(config.BLOCKCHAIN_PROVIDER_NETWORK);
        }
    } catch (e) {
        console.log('Failed to grab blockchain provider', e);

        return null;
    }
}

export function getWallet(inputProvider: any): any {
    try {
        return new ethers.Wallet(config.BLOCKCHAIN_WALLET_PRIVATE_KEY, inputProvider);
    } catch (e) {
        console.log('Failed to get blockchain wallet', e);

        return null;
    }
}

export function loadContract(): any {
    try {
        const nodeCommandDirectory = process.cwd();
        const bytecode = fs.readFileSync(`${nodeCommandDirectory}/contracts/SurveyMapping_sol_SurveyMapping.bin`, 'binary');
        const abi = fs.readFileSync(`${nodeCommandDirectory}/contracts/SurveyMapping_sol_SurveyMapping.abi`, 'utf8');

        return {
            abi,
            bytecode,
        };
    } catch (e) {
        console.log('Failed to load blockchain contracts', e);

        return null;
    }
}
