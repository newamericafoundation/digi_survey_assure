import * as ethers from 'ethers';
import { config } from '../config';
import { getProvider, getWallet, loadContract } from './../helper/blockchainLoad';
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

export async function sendHashToBlockchain(surveyResponseId: string, hash: string): Promise<any> {
    try {
        console.log(`----> Sent hash ${hash} to blockchain for ID ${surveyResponseId}`);

        return contractWithSigner.RegisterSurvey(surveyResponseId, hash);
    } catch (e) {
        console.log('Failed to send', e);

        return null;
    }
}
