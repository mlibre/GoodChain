import { deleteFolder, initJsonFile } from "../core/utils.js";
import Wallet from "../core/wallet.js";

deleteFolder( "./assets/keys/" );

initJsonFile( "./assets/keys/user.json", Wallet.generateKeyPair() );
initJsonFile( "./assets/keys/miner.json", Wallet.generateKeyPair() );

