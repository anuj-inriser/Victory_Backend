const express = require("express");

const saveToken = (req, res) => {
  const { authToken, refreshToken, feedToken } = req.body;

  if (!authToken || !refreshToken || !feedToken) {
    return res.status(400).json({ message: "All 3 tokens are required" });
  }

  // Store tokens in session
  req.session.tokens = { authToken, refreshToken, feedToken };
  req.session.save((err) => {
    if (err) return res.status(500).json({ message: "Error saving session" });
    res.json({ message: "Tokens saved successfully!", expiresIn: "28 hours" });
  });
};

module.exports = { saveToken };
