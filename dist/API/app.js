"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const http_1 = tslib_1.__importDefault(require("http"));
const express_1 = tslib_1.__importDefault(require("express"));
const cookie_parser_1 = tslib_1.__importDefault(require("cookie-parser"));
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const config_js_1 = require("./config.js");
const utils_js_1 = require("./utils.js");
require("./blockchain.js");
const chain_js_1 = tslib_1.__importDefault(require("./routes/chain.js"));
const block_js_1 = tslib_1.__importDefault(require("./routes/block.js"));
const wallet_js_1 = tslib_1.__importDefault(require("./routes/wallet.js"));
const transaction_js_1 = tslib_1.__importDefault(require("./routes/transaction.js"));
const mine_js_1 = tslib_1.__importDefault(require("./routes/mine.js"));
const node_js_1 = tslib_1.__importDefault(require("./routes/node.js"));
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.set("port", config_js_1.hostPort);
app.use("/chain", chain_js_1.default);
app.use("/block", block_js_1.default);
app.use("/wallet", wallet_js_1.default);
app.use("/transaction", transaction_js_1.default);
app.use("/mine", mine_js_1.default);
app.use("/nodes", node_js_1.default);
app.use(errorHandler);
const server = http_1.default.createServer(app);
server.listen({ port: config_js_1.hostPort, host: config_js_1.hostAddress });
server.on("error", onError);
server.on("listening", onListening);
function onListening() {
    console.log("Listening on", server.address().address, server.address().port);
}
function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(`${config_js_1.hostPort} requires elevated privileges`);
            if (!process.exit(1)) {
                console.error("Cant Exit");
            }
            break;
        case "EADDRINUSE":
            console.error(`${config_js_1.hostPort} is already in use`);
            if (!process.exit(1)) {
                console.error("Cant Exit");
            }
            break;
        default:
            throw error;
    }
}
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).send((0, utils_js_1.convertErrorToSimpleObj)(err));
}
//# sourceMappingURL=app.js.map