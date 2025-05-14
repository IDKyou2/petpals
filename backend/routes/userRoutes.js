const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const router = express.Router();

// ============================================ User Profile Update Route
router.put("/user/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authentication token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const { fullName, contact } = req.body;

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (contact) updateData.contact = contact;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        fullName: updatedUser.fullName,
        contact: updatedUser.contact,
        profilePic: updatedUser.profilePic
          ? `/uploads/${path.basename(updatedUser.profilePic)}`
          : "/uploads/default-user.png",
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ============================================ User Profile Route
router.get("/user/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      // User details //
      fullName: userData.fullName,
      contact: userData.contact,
      email: userData.email,
      username: userData.username,
      profilePic: userData.profilePic
        ? `/uploads/${path.basename(userData.profilePic)}`
        : "/uploads/default-user.png",
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ============================================ New Route: Get user info by userId
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId format" });
  }

  try {
    const user = await User.findById(userId).select(
      "fullName email contact location profilePic"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Error fetching user data" });
  }
});

// ============================================ Get total users count
router.get("/total-users", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.json({ totalUsers });
  } catch (error) {
    console.error("Error fetching total users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ============================================ Get all users
router.get("/all-users", async (req, res) => {
  try {
    const users = await User.find({}, "fullName profilePic contact");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ============================================ Ban or Unban a User
router.put("/user/:userId/ban", async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId format" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.banned = !user.banned;
    await user.save();

    res.status(200).json({
      message: user.banned ? "User has been banned" : "User has been unbanned",
      banned: user.banned,
    });
  } catch (error) {
    console.error("Error banning/unbanning user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ============================================ Unban User Route
router.put("/user/unban/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.banned = false;
    await user.save();

    res.status(200).json({ message: "User unbanned successfully" });
  } catch (error) {
    console.error("Error unbanning user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
