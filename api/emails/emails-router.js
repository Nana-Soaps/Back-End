const express = require("express");
const router = express.Router();
const formData = require("form-data");
const API_KEY = process.env.MAILGUN_API;
const DOMAIN = "sandbox4fda88026b4f4a90802767d78050e4af.mailgun.org";
const mail_gun = require("mailgun-js")({ apiKey: API_KEY, domain: DOMAIN });

const data = {
  from: "Marat Kotik <mkotik@test.com>",
  //   to: "foo@example.com, bar@example.com",
  to: "mkotik97@gmail.com",
  subject: "Your MJELS order #111-1234",
  text: "Your order with MJELS has been placed. You should expect delivery in 3-4 business days.",
  template: "order_template",
  "h:X-Mailgun-Variables": { test: "THIS_IS_TEST_VAR" },
};

// client.messages
//   .create(DOMAIN, messageData)
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.error(err);
//   });

router.post("/", async (req, res, next) => {
  try {
    mail_gun.messages().send(data, (err, body) => {
      if (err) {
        console.dir(err);
        next(err);
      } else {
        console.log(body);
        res.status(200).json({ message: "email successfully sent" });
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
