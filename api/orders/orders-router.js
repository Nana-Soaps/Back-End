const express = require("express");
const Orders = require("./orders-model");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const orders = await Orders.getOrders();
    res.status(200).json(orders);
  } catch (err) {
    next(err); //ttest
  }
});

module.exports = router;
