const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();


// ============================================ Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Incorrect username!" });
    }

    if (user.banned) {
      return res.status(403).json({ message: "Your account has been banned. Please contact support." });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password!" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, fullName: user.fullName },
      process.env.JWT_SECRET
    );

    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
