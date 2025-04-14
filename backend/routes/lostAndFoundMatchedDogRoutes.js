const express = require("express");
const LostDog = require("../models/LostDog");
const FoundDog = require("../models/FoundDog");
const Stats = require("../models/Stats");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const PetIdCounter = require("../models/PetIdCounter");

// ============================================= Directory setup for lost and found dog images
const lostDogsDir = path.join(__dirname, "../../uploads/lostDogs");
const foundDogsDir = path.join(__dirname, "../../uploads/foundDogs");

if (!fs.existsSync(lostDogsDir)) {
  fs.mkdirSync(lostDogsDir, { recursive: true });
}
if (!fs.existsSync(foundDogsDir)) {
  fs.mkdirSync(foundDogsDir, { recursive: true });
}

// ============================================ Lost Dog Profile Route
router.post("/lostdog", async (req, res) => {
  console.log("Request Headers:", req.headers);
  console.log("Request Body:", req.body);
  console.log("Request Files:", req.files);

  const { name, breed, size, gender, location, details, category } = req.body;

  if (!name || !breed || !size || !gender || !location || !category) {
    console.log("Missing required fields:", {
      name,
      breed,
      size,
      gender,
      location,
      category,
    });
    return res
      .status(400)
      .json({ message: "All fields except details are required!" });
  }

  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ message: "No token provided!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
    const userId = decoded.userId;

    // ============================================= PetIdCounter for unique petId generation
    const petIdCounter = await PetIdCounter.findOneAndUpdate(
      {},
      { $inc: { nextPetId: 1 } },
      { new: true, upsert: true }
    );
    const petId = petIdCounter.nextPetId;

    let imagePath;
    if (req.files && req.files.dogImage) {
      const file = req.files.dogImage;
      console.log("File Details:", {
        name: file.name,
        mimetype: file.mimetype,
        size: file.size,
      });

      const validImageTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validImageTypes.includes(file.mimetype)) {
        console.log("Invalid file type:", file.mimetype);
        return res.status(400).json({
          message: "Invalid file type. Only PNG, JPEG, and JPG are allowed.",
        });
      }

      if (file.size > 10 * 1024 * 1024) {
        console.log("File size too large:", file.size);
        return res
          .status(400)
          .json({ message: "File size exceeds 10MB limit." });
      }

      const filename = `${Date.now()}-${file.name}`;
      imagePath = `/uploads/lostDogs/${filename}`;
      const fullPath = path.join(lostDogsDir, filename);

      console.log("Attempting to save image to:", fullPath);
      try {
        await file.mv(fullPath);
        console.log("Image successfully saved to:", fullPath);
      } catch (mvError) {
        console.error("Error moving file:", mvError);
        return res
          .status(500)
          .json({ message: "Failed to save image", error: mvError.message });
      }
    }

    const lostDogProfile = new LostDog({
      petId,
      name,
      breed,
      size,
      gender,
      location,
      details: details || undefined,
      category,
      imagePath: imagePath || undefined,
      userId,
    });

    const savedLostDog = await lostDogProfile.save();
    console.log("Saved Lost Dog:", savedLostDog);

    req.io.emit("newLostDog", savedLostDog);

    res.status(201).json({
      message: "Lost dog profile created successfully!",
      lostDog: savedLostDog,
    });
  } catch (error) {
    console.error("Error saving lost dog profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ============================================ Found Dog Profile Route
router.post("/founddog", async (req, res) => {
  console.log("Request Headers:", req.headers);
  console.log("Request Body:", req.body);
  console.log("Request Files:", req.files);

  const { breed, size, gender, location, details, category } = req.body;

  if (!breed || !size || !gender || !location || !category) {
    console.log("Missing required fields:", {
      breed,
      size,
      gender,
      location,
      category,
    });
    return res
      .status(400)
      .json({ message: "All fields except details are required!" });
  }

  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ message: "No token provided!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
    const userId = decoded.userId;

    // =============================================  PetIdCounter for unique petId generation
    const petIdCounter = await PetIdCounter.findOneAndUpdate(
      {},
      { $inc: { nextPetId: 1 } },
      { new: true, upsert: true }
    );
    const petId = petIdCounter.nextPetId;

    let imagePath;
    if (req.files && req.files.dogImage) {
      const file = req.files.dogImage;
      console.log("File Details:", {
        name: file.name,
        mimetype: file.mimetype,
        size: file.size,
      });

      const validImageTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validImageTypes.includes(file.mimetype)) {
        console.log("Invalid file type:", file.mimetype);
        return res.status(400).json({
          message: "Invalid file type. Only PNG, JPEG, and JPG are allowed.",
        });
      }

      if (file.size > 10 * 1024 * 1024) {
        console.log("File size too large:", file.size);
        return res
          .status(400)
          .json({ message: "File size exceeds 10MB limit." });
      }

      const filename = `${Date.now()}-${file.name}`;
      imagePath = `/uploads/foundDogs/${filename}`;
      const fullPath = path.join(foundDogsDir, filename);

      console.log("Attempting to save image to:", fullPath);
      try {
        await file.mv(fullPath);
        console.log("Image successfully saved to:", fullPath);
      } catch (mvError) {
        console.error("Error moving file:", mvError);
        return res
          .status(500)
          .json({ message: "Failed to save image", error: mvError.message });
      }
    }

    const foundDogProfile = new FoundDog({
      petId,
      breed,
      size,
      gender,
      location,
      details: details || undefined,
      category,
      imagePath: imagePath || undefined,
      userId,
    });

    const savedFoundDog = await foundDogProfile.save();
    console.log("Saved Found Dog:", savedFoundDog);

    req.io.emit("newFoundDog", savedFoundDog);

    res.status(201).json({
      message: "Found dog profile created successfully!",
      foundDog: savedFoundDog,
    });
  } catch (error) {
    console.error("Error saving found dog profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ============================================ Fetch All Lost Dogs Route
router.get("/lostdog", async (req, res) => {
  try {
    const lostDogs = await LostDog.find().populate("userId", "fullName").exec();
    res.status(200).json({ lostDogs });
  } catch (error) {
    console.error("Error fetching lost dogs:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ============================================ Fetch All Found Dogs Route
// Replace the existing /founddog GET route
router.get("/founddog", async (req, res) => {
  try {
    const foundDogs = await FoundDog.find()
      .populate("userId", "fullName contact") // Updated to include 'contact'
      .exec();
    res.status(200).json({ foundDogs });
  } catch (error) {
    console.error("Error fetching found dogs:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ============================================ Delete Both Lost and Found Dogs Route
router.delete("/delete-match", async (req, res) => {
  const { petId1, petId2 } = req.body; // petId1 is for lost dog, petId2 for found dog
  try {
    const deletedLostDog = await LostDog.findOneAndDelete({ petId: petId1 });
    const deletedFoundDog = await FoundDog.findOneAndDelete({ petId: petId2 });

    if (!deletedLostDog || !deletedFoundDog) {
      return res.status(404).json({ message: "One or both dogs not found" });
    }

    if (deletedLostDog.imagePath) {
      const lostDogImagePath = path.join(
        __dirname,
        "../../uploads",
        deletedLostDog.imagePath
      );
      if (fs.existsSync(lostDogImagePath)) {
        fs.unlinkSync(lostDogImagePath);
        console.log("Deleted lost dog image:", lostDogImagePath);
      }
    }

    if (deletedFoundDog.imagePath) {
      const foundDogImagePath = path.join(
        __dirname,
        "../../uploads",
        deletedFoundDog.imagePath
      );
      if (fs.existsSync(foundDogImagePath)) {
        fs.unlinkSync(foundDogImagePath);
        console.log("Deleted found dog image:", foundDogImagePath);
      }
    }

    const stats = await Stats.findOne();
    if (stats) {
      stats.reunitedCount += 1;
      await stats.save();
    } else {
      const newStats = new Stats({ reunitedCount: 1 });
      await newStats.save();
    }

    req.io.emit("matchDeleted", { petId1, petId2 });

    res
      .status(200)
      .json({ message: "Both dogs have been deleted successfully!" });
  } catch (error) {
    console.error("Error deleting dogs:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ============================================ Mark a Dog as Reunited
router.put("/mark-reunited/:petId", async (req, res) => {
  const { petId } = req.params;
  try {
    const foundDog = await FoundDog.findOne({ petId });
    const lostDog = await LostDog.findOne({ petId });

    if (foundDog) {
      if (foundDog.reunited) {
        return res
          .status(400)
          .json({ message: "This dog is already marked as reunited" });
      }
      foundDog.reunited = true;
      await foundDog.save();
      console.log("Marked found dog as reunited:", foundDog);
    } else if (lostDog) {
      if (lostDog.reunited) {
        return res
          .status(400)
          .json({ message: "This dog is already marked as reunited" });
      }
      lostDog.reunited = true;
      await lostDog.save();
      console.log("Marked lost dog as reunited:", lostDog);
    } else {
      return res.status(404).json({ message: "Dog not found!" });
    }

    const stats = await Stats.findOne();
    if (stats) {
      stats.reunitedCount += 1;
      await stats.save();
    } else {
      const newStats = new Stats({ reunitedCount: 1 });
      await newStats.save();
    }

    req.io.emit("dogReunited", { petId });
    res.status(200).json({ message: "Dog has been marked as reunited!" });
  } catch (error) {
    console.error("Error marking dog as reunited:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ============================================ Fetch All Reunited Dogs Route
router.get("/reunited-dogs", async (req, res) => {
  try {
    const reunitedLostDogs = await LostDog.find({ reunited: true })
      .populate("userId", "fullName")
      .exec();
    const reunitedFoundDogs = await FoundDog.find({ reunited: true })
      .populate("userId", "fullName")
      .exec();
    const reunitedDogs = [...reunitedLostDogs, ...reunitedFoundDogs];
    console.log("Fetched reunited dogs:", reunitedDogs.length);
    res.status(200).json({ reunitedDogs });
  } catch (error) {
    console.error("Error fetching reunited dogs:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ============================================ Update Lost Dog
router.put("/lostdog/:petId", async (req, res) => {
  const { petId } = req.params;
  const { name, breed, gender, location } = req.body;

  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided!" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const lostDog = await LostDog.findOne({ petId, userId });
    if (!lostDog)
      return res
        .status(404)
        .json({ message: "Lost dog not found or not authorized!" });

    lostDog.name = name || lostDog.name;
    lostDog.breed = breed || lostDog.breed;
    lostDog.gender = gender || lostDog.gender;
    lostDog.location = location || lostDog.location;

    if (req.files && req.files.dogImage) {
      const file = req.files.dogImage;
      const validImageTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validImageTypes.includes(file.mimetype)) {
        return res.status(400).json({
          message: "Invalid file type. Only PNG, JPEG, and JPG are allowed.",
        });
      }
      if (file.size > 10 * 1024 * 1024) {
        return res
          .status(400)
          .json({ message: "File size exceeds 10MB limit." });
      }

      if (lostDog.imagePath) {
        const oldImagePath = path.join(
          __dirname,
          "../../uploads",
          lostDog.imagePath
        );
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }

      const filename = `${Date.now()}-${file.name}`;
      const imagePath = `/uploads/lostDogs/${filename}`;
      const fullPath = path.join(lostDogsDir, filename);
      await file.mv(fullPath);
      lostDog.imagePath = imagePath;
    }

    const updatedLostDog = await lostDog.save();
    req.io.emit("updatedLostDog", updatedLostDog);

    res.status(200).json(updatedLostDog);
  } catch (error) {
    console.error("Error updating lost dog:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ============================================ Update Found Dog
router.put("/founddog/:petId", async (req, res) => {
  const { petId } = req.params;
  console.log("Received PUT request for founddog with petId:", petId);
  const { breed, gender, location } = req.body;

  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided!" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const foundDog = await FoundDog.findOne({ petId, userId });
    if (!foundDog) {
      console.log("Found dog not found or unauthorized for petId:", petId);
      return res
        .status(404)
        .json({ message: "Found dog not found or not authorized!" });
    }

    foundDog.breed = breed || foundDog.breed;
    foundDog.gender = gender || foundDog.gender;
    foundDog.location = location || foundDog.location;

    if (req.files && req.files.dogImage) {
      const file = req.files.dogImage;
      const validImageTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validImageTypes.includes(file.mimetype)) {
        return res.status(400).json({
          message: "Invalid file type. Only PNG, JPEG, and JPG are allowed.",
        });
      }
      if (file.size > 10 * 1024 * 1024) {
        return res
          .status(400)
          .json({ message: "File size exceeds 10MB limit." });
      }

      if (foundDog.imagePath) {
        const oldImagePath = path.join(
          __dirname,
          "../../uploads",
          foundDog.imagePath
        );
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }

      const filename = `${Date.now()}-${file.name}`;
      const imagePath = `/uploads/foundDogs/${filename}`;
      const fullPath = path.join(foundDogsDir, filename);
      await file.mv(fullPath);
      foundDog.imagePath = imagePath;
    }

    const updatedFoundDog = await foundDog.save();
    req.io.emit("updatedFoundDog", updatedFoundDog);

    res.status(200).json(updatedFoundDog);
  } catch (error) {
    console.error("Error updating found dog:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
