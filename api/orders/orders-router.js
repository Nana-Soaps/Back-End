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

router.post("/payment", async (req, res, next) => {
  let { amount, id } = req.body;
  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "soap item",
      payment_method: id,
      confirm: true,
      metadata: {
        name: "Barry Wells",
      },
      // customer: "Barry Mills",
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