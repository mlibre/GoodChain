import { createKeyPair, deleteFolder, initJsonFile } from "../src/library/utils.js";

deleteFolder( "./assets/keys/" );

initJsonFile( "./assets/keys/user.json", createKeyPair() );
initJsonFile( "./assets/keys/miner.json", createKeyPair() );

