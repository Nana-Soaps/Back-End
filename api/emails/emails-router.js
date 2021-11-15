const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    res.status(200).json({ message: "works" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
