import Blockchain from "../library/main.js";
import Wallet from "../library/wallet.js";
import Consensus from "../library/pow-consensus.js";
import { initJsonFile } from "../library/utils.js";
import { name, dbPath, minerKeysFile, hostUrl, nodesList } from "./config.js";
const consensus = new Consensus();
const minerKeys = initJsonFile(minerKeysFile, Wallet.generateKeyPair());
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
//# sourceMappingURL=blockchain.js.map