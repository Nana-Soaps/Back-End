const express = require("express");
const Orders = require("./orders-model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const orders = await Orders.getOrders();
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
});

const calculateOrderAmount = (items) => {
  return 50;
};

router.post("/stripe-payment", async (req, rex, next) => {
  const { items } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "usd",
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
