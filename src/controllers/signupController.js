// controllers/signupController.js
const getPool = require("../db/db.js");

const signupController = async (req, res, next) => {
  const pool = getPool();
  const { name, email, phone, signupip, signupdeviceid } = req.body;

  // 🧱 Basic validations
  if (!name || !email || !phone) {
    return res.status(400).json({
      status: false,
      message: "All fields (name, email, phone) are required",
    });
  }

  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({
      status: false,
      message: "Phone number must be 10 digits",
    });
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({
      status: false,
      message: "Invalid email format",
    });
  }

  try {
    // 🔎 Check if user already exists
    const existing = await pool.query(
      "SELECT userid FROM users WHERE phone = $1 OR email = $2 LIMIT 1",
      [phone, email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        status: false,
        message: "User already exists with this phone or email",
      });
    }

    // 🧾 Insert new user with IP + Device ID
    const result = await pool.query(
      `INSERT INTO users (name, email, phone, signupip, signupdeviceid, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING name, email, phone, signupip, signupdeviceid, created_at`,
      [name.trim(), email.trim().toLowerCase(), phone.trim(), signupip || "Unknown", signupdeviceid || "Unknown"]
    );

    const user = result.rows[0];

    // ✅ Success
    return res.status(201).json({
      status: true,
      message: "Signup successful",
      data: user,
    });
  } catch (error) {
    console.error("Error in signupController:", error);
    next(error);
  }
};

module.exports = { signupController };
