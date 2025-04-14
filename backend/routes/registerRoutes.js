const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, fullName, email, contact, password, confirmPassword } =
    req.body;

  console.log("Request body:", req.body);
  console.log("Request files:", req.files);
  if (
    !username ||
    !fullName ||
    !email ||
    !contact ||
    !password ||
    !confirmPassword  
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "Passwords don't match!" });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePicPath;
    if (req.files && req.files.profilePic) {
      const file = req.files.profilePic;
      const validImageTypes = ["image/png", "image/jpeg"];

      console.log("File received:", file);

      if (!validImageTypes.includes(file.mimetype)) {
        return res.status(400).json({
          message: "Invalid file type. Only PNG and JPEG are allowed.",
        });
      }

      if (file.size > 10 * 1024 * 1024) {
        return res
          .status(400)
          .json({ message: "File size exceeds 10MB limit." });
      }

      const uploadDir = path.join(__dirname, "../../uploads");
      const filename = `${Date.now()}-${file.name}`;
      profilePicPath = path.join("uploads", filename);

      console.log(
        "Saving file to:",
        path.join(__dirname, "../../uploads", filename)
      );
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      await file.mv(path.join(__dirname, "../../uploads", filename));
      console.log("File saved successfully");
    } else {
      console.log("No file uploaded");
    }

    const newUser = new User({
      username,
      fullName,
      email,
      contact,
      password: hashedPassword,
      profilePic: profilePicPath || "",
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: "Account Created!" });
  } catch (error) {
    console.error("Error saving user:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "That user already exists!" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
