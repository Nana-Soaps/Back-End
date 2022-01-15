const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const productsRouter = require("./products/products-router");
const ordersRouter = require("./orders/orders-router");
const emailsRouter = require("./emails/emails-router");

const server = express();
server.use(express.json());
server.use(helmet());
server.use(cors());

server.use("/api/products", productsRouter);
server.use("/api/orders", ordersRouter);
server.use("/api/emails", emailsRouter);

server.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
  });
});

module.exports = server;
