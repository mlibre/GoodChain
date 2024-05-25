import Blockchain from "../library/main.js";
import Wallet from "../library/wallet.js";
import Consensus from "../library/pow-consensus.js";
import { initJsonFile } from "../library/utils.js";
import { name, dbPath, minerKeysFile, hostUrl, nodesList } from "./config.js";
const consensus = new Consensus();
const minerKeys = initJsonFile(minerKeysFile, Wallet.generateKeyPair());
export default new Blockchain({
    dbPath,
    nodes: {
        list: nodesList,
        hostUrl
    },
    chainName: name,
    minerPublicKey: minerKeys.publicKey,
    consensus
});
//# sourceMappingURL=blockchain.js.map