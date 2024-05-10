import { deleteFolder, initJsonFile, createKeyPair } from "../library/utils.js";

deleteFolder( "./assets/keys/" );

initJsonFile( "./assets/keys/user.json", createKeyPair() );
initJsonFile( "./assets/keys/miner.json", createKeyPair() );

