import http from "http";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { hostPort, hostAddress } from "./config.js";
import { convertErrorToObject } from "./utils.js";
import "./blockchain.js";
import chainRouter from "./routes/chain.js";
import blockRouter from "./routes/block.js";
import walletRouter from "./routes/wallet.js";
import transactionRouter from "./routes/transaction.js";
import mineRouter from "./routes/mine.js";
import nodeRouter from "./routes/node.js";
const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("port", hostPort);
app.use("/chain", chainRouter);
app.use("/block", blockRouter);
app.use("/wallet", walletRouter);
app.use("/transaction", transactionRouter);
app.use("/mine", mineRouter);
app.use("/nodes", nodeRouter);
app.use(errorHandler);
const server = http.createServer(app);
server.listen({ port: hostPort, host: hostAddress });
server.on("error", onError);
server.on("listening", onListening);
function onListening() {
    console.log("Listening on", server.address().address, server.address().port);
}
function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }
    switch (error.code) {
        case "EACCES":
            console.error(`${hostPort} requires elevated privileges`);
            process.exit(1);
        // eslint-disable-next-line no-fallthrough
        case "EADDRINUSE":
            console.error(`${hostPort} is already in use`);
            process.exit(1);
        // eslint-disable-next-line no-fallthrough
        default:
            throw error;
    }
}
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).send(convertErrorToObject(err));
}
//# sourceMappingURL=app.js.map