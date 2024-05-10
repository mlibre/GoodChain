import { deleteFoler, initJsonFile, createKeyPair } from "../library/utils";

deleteFoler( "./assets/keys/" );


initJsonFile<{ publicKey: string; privateKey: string }>( "./assets/keys/user.json", createKeyPair() );
initJsonFile<{ publicKey: string; privateKey: string }>( "./assets/keys/miner.json", createKeyPair() );

