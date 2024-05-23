import Blockchain from "../library/main.js";
import Consensus from "../library/pow-consensus.js";
import Transaction from "../library/transaction.js";
import { createKeyPair, deleteFile, deleteFolder, initJsonFile } from "../library/utils.js";
deleteFolder("assets/db/");
deleteFile("./assets/keys/miner.json");
deleteFile("./assets/keys/user.json");
const userKeys = initJsonFile("./assets/keys/user.json", createKeyPair());
const minerKeys = initJsonFile("./assets/keys/miner.json", createKeyPair());
const blockchain = new Blockchain({
    dbPath: "./assets/db/",
    nodes: {
        list: ["http://127.0.0.1:3001"],
        hostUrl: "http://127.0.0.1:3000"
    },
    chainName: "GoodChain",
    minerKeys,
    consensus: new Consensus()
});
blockchain.mineNewBlock();
const trx = new Transaction({
    from: minerKeys.publicKey,
    to: userKeys.publicKey,
    amount: 50,
    fee: 0,
    transaction_number: 1
});
trx.sign(minerKeys.privateKey);
const blockNumber = blockchain.addTransaction(trx.data);
blockchain.mineNewBlock();
console.log("Mined block :", blockNumber, blockchain.chain.latestBlock);
const trx2 = new Transaction({
    from: userKeys.publicKey,
    to: "user3",
    amount: 5,
    fee: 0.3,
    transaction_number: 1
});
trx2.sign(userKeys.privateKey);
blockchain.addTransaction(trx2.data);
blockchain.mineNewBlock();
console.log("Latest Block :", blockchain.chain.latestBlock);
console.log("Wallets : ", blockchain.wallet);
console.log("chain validation:", blockchain.chain.validateChain());
//# sourceMappingURL=init.js.map