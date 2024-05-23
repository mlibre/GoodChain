import Blockchain from "../library/main.js";
import Consensus from "../library/pow-consensus.js";
const consensus = new Consensus();
import { initJsonFile } from "../library/utils.js";
import Wallet from "../library/wallet.js";
import { name, dbPath, minerKeysFile, hostUrl, nodesList } from "./config.js";
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