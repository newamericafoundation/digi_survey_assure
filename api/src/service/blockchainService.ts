import * as ethers from 'ethers';
import * as fs from 'fs';
import { config } from '../config';
import { createBlockchainTransaction } from './../model/bcTransaction';
import { updateSurveyResponseById } from './../model/surveyResponse';

const loadedContract = loadContract();
const provider = getProvider();
const contract = new ethers.Contract(config.BLOCKCHAIN_CONTRACT_ADDRESS, loadedContract.abi, provider);
const wallet = getWallet(provider);
const contractWithSigner = contract.connect(wallet);

contractWithSigner.on("LogSurveyRegistered", async (surveyResponseId: string, hash: string, eventReceipt: any) => {
    console.log('-> Blockchain event received:', eventReceipt.transactionHash);

    try {
        const bcTransId = await createBlockchainTransaction({
            tx_id: eventReceipt.transactionHash,
            receipt: eventReceipt,
            network: config.BLOCKCHAIN_PROVIDER_NETWORK,
            merkle_root: hash
        });

        await updateSurveyResponseById(Number(surveyResponseId), {
            bc_transaction_id: bcTransId
        });

        console.log(`-> Updated ${surveyResponseId}, receipt ID ${bcTransId}`);
    } catch (e) {
        console.log('==> Error processing blockchain event:', surveyResponseId, hash, eventReceipt.transactionHash);
    }
});

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

export async function sendHashToBlockchain(surveyResponseId: string, hash: string): Promise<any> {
    try {
        console.log(`----> Sent hash ${hash} to blockchain for ID ${surveyResponseId}`);

        return contractWithSigner.RegisterSurvey(surveyResponseId, hash);
    } catch (e) {
        console.log('Failed to send', e);

        return null;
    }
}
