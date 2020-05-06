import { sendHashToBlockchain } from './../service/blockchainService';
import { getMerkleRoot } from './hashing';
import { getSurveyAnswersForProofs } from './surveyResponse';

export async function prepareAndSendResponseToBlockchain(surveyResponseId: number): Promise<any> {
    const surveyAnswers = await getSurveyAnswersForProofs(surveyResponseId);
    const merkleTreeRoot = getMerkleRoot(surveyAnswers);

    return sendHashToBlockchain(surveyResponseId.toString(), merkleTreeRoot);
}
