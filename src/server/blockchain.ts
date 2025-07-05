import Blockchain from "../core/main.js";
import Wallet from "../core/wallet.js";
import Consensus from "../core/pow-consensus.js";
import { initJsonFile } from "../core/utils.js";
import { name, dbPath, minerKeysFile, hostUrl, nodesList } from "./config.js";
const consensus = new Consensus();

const minerKeys = initJsonFile( minerKeysFile, Wallet.generateKeyPair() );

const blockchain = new Blockchain({
	dbPath,
	nodes: {
		list: nodesList,
		hostUrl
	},
	chainName: name,
	minerPublicKey: minerKeys.publicKey,
	consensus
});
await blockchain.init();

export default blockchain;