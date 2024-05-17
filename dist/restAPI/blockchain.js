import Blockchain from "../library/main";
import Consensus from "../library/pow-consensus";
const consensus = new Consensus();
import { initJsonFile, createKeyPair } from "../library/utils";
import { name, dbPath, minerKeysFile, hostUrl, nodesList } from "./config";
const minerKeys = initJsonFile(minerKeysFile, createKeyPair());
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
//# sourceMappingURL=blockchain.js.map