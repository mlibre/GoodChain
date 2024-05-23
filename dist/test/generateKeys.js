import { deleteFolder, initJsonFile } from "../library/utils.js";
import Wallet from "../library/wallet.js";
deleteFolder("./assets/keys/");
initJsonFile("./assets/keys/user.json", Wallet.generateKeyPair());
initJsonFile("./assets/keys/miner.json", Wallet.generateKeyPair());
//# sourceMappingURL=generateKeys.js.map