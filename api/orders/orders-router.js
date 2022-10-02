const express = require("express");
const Orders = require("./orders-model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { checkOrder, checkBag, checkIdExists } = require("./orders-middleware");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const orders = await Orders.getOrders();
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
});

router.get("/shipping-options", async (req, res, next) => {
  try {
    const options = await Orders.getShippingOptions();
    res.status(200).json(options);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const order = await Orders.getOrderById(id);
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
});

router.post("/", checkOrder, checkBag, async (req, res, next) => {
  const { order, bag } = req.body;
  try {
    const newOrder = await Orders.postOrder(order, bag);
    res.status(201).json(newOrder);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", checkIdExists, async (req, res, next) => {
  const { id } = req.params;
  try {
    const updatedOrders = await Orders.updateOrder(id, req.body);
    res.status(200).json(updatedOrders);
  } catch (err) {
    next(err);
  }
});

router.post("/payment", async (req, res, next) => {
  let { amount, id, first_name, last_name } = req.body;
  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: `${first_name} ${last_name}`,
      payment_method: id,
      confirm: true,
      metadata: {
        ...req.body,
      },
    });
    console.log("Payment", payment);
    res.status(200).json({
      message: "payment successful",
      success: true,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
