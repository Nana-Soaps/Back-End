const express = require("express");
const router = express.Router();
const mailchimpTx = require("@mailchimp/mailchimp_transactional")(
  process.env.MAILCHIMP_API
);

router.get("/", async (req, res, next) => {
  try {
    const response = await mailchimpTx.users.ping();
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
