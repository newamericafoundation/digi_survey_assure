const ethers = require('ethers');
const blockchainService = require('../build/src/service/blockchainService');

require('dotenv').config();

/**
 * Standard compiled contract code. If you need to recompile for any reason, you can run the following
 * from this folder within your console:
 * 
 * solcjs --bin SurveyMapping.sol
 * solcjs --abi SurveyMapping.sol
 */
const contractDetails = blockchainService.loadContract();
const provider = blockchainService.getProvider();
const wallet = blockchainService.getWallet(provider);

/**
 * ASYNC function for the deployment of our contract. This will output the
 * transactrion hash as well as the contract's address. The contract's address
 * will be required by the application moving forward.
 * 
 * An example of a contract address might be "0x2bD9aAa2953F988153c8629926D22A6a5F69b14E".
 * An example of a transaction hash might be "0x159b76843662a15bd67e482dcfbee55e8e44efad26c5a614245e12a00d4b1a51".
 */
(async () => {
    try {
        let factory = new ethers.ContractFactory(contractDetails.abi, contractDetails.bytecode, wallet);

        let contract = await factory.deploy();

        console.log('--- Your Contact Address --->', contract.address);
        console.log('--- Your transaction hash --->', contract.deployTransaction.hash);

        await contract.deployed()

        console.log("Contract deployed!\n\n* * * *\n\nREMEMBER TO COPY AND PASTE YOUR CONTRACT ADDRESS (ABOVE) INTO YOUR ENV VARS BEFORE DEPLOYING THE APPLICATION!\n\n");
    } catch (e) {
        console.log('There was an error deploying your contract:', e);
    }
})();
