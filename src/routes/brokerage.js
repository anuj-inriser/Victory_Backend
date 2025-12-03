const express = require("express");
const router = express.Router();

router.get("/brokerage", async (req, res) => {
  const { price, quantity } = req.query;

  const p = parseFloat(price) || 0;
  const q = parseInt(quantity) || 0;

  const orderValue = p * q;

  const angelOneBrokerage = Math.min(orderValue * 0.0005, 20); // example
  const externalCharges = orderValue * 0.0002;  // example
  const taxes = orderValue * 0.0001;           // example

  res.json({
    success: true,
    angelOneBrokerage,
    externalCharges,
    taxes,
  });
});

module.exports = router;
