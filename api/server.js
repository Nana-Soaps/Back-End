const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const productsRouter = require("./products/products-router");
const ordersRouter = require("./orders/orders-router");
const emailsRouter = require("./emails/emails-router");

const whitelist = ["http://localhost:3000/", "http://www.otherexample.com"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed"));
    }
  },
};
const server = express();
server.use(express.json());
server.use(helmet());
server.use(cors(corsOptions));

server.use("/api/products", productsRouter);
server.use("/api/orders", ordersRouter);
server.use("/api/emails", emailsRouter);

server.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
  });
  I;
});

module.exports = server;
