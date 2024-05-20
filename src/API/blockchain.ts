import Blockchain from "../library/main.js";
import Consensus from "../library/pow-consensus.js";
const consensus = new Consensus();
import { initJsonFile, createKeyPair } from "../library/utils.js";
import { name, dbPath, minerKeysFile, hostUrl, nodesList } from "./config.js";

const minerKeys = initJsonFile( minerKeysFile, createKeyPair() );
export default new Blockchain({
	dbPath,
	nodes: {
		list: nodesList,
		hostUrl
	},
	chainName: name,
	minerKeys,
	consensus
});