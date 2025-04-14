const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const loginRoutes = require("./routes/loginRoutes");
const registerRoutes = require("./routes/registerRoutes");
const lostDogRoutes = require("./routes/lostDogRoutes");
const foundDogRoutes = require("./routes/foundDogRoutes");
const lostAndFoundMatchedDogRoutes = require("./routes/lostAndFoundMatchedDogRoutes");
const chatRoutes = require("./routes/chatRoutes");
const suggestionRoutes = require("./routes/suggestionRoutes");
const Chat = require("./models/Chat");
const PrivateChat = require("./models/PrivateChat");
const User = require("./models/User");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:8081",
      "http://localhost:8080",
      "http://10.0.2.2:8081",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ["websocket", "polling"],
});

dotenv.config();
app.use(express.json());
app.use(fileUpload());

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:8081",
      "http://localhost:8080",
      "http://10.0.2.2:8081",
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(
  "/proxy/kaggle",
  createProxyMiddleware({
    target: "https://www.kaggle.com",
    changeOrigin: true,
    pathRewrite: { "^/proxy/kaggle": "" },
    onProxyRes: (proxyRes) => {
      proxyRes.headers["Access-Control-Allow-Origin"] = "*";
      proxyRes.headers["Access-Control-Allow-Methods"] =
        "GET, POST, PUT, DELETE";
      proxyRes.headers["Access-Control-Allow-Headers"] =
        "Content-Type, Authorization";
    },
  })
);

const uploadsDir = path.join(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsDir), (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB (Port 5000)"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use("/api/auth", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/register", registerRoutes);
app.use("/api", lostDogRoutes);
app.use("/api", foundDogRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api", suggestionRoutes);
app.use("/api/lostfound", lostAndFoundMatchedDogRoutes);

io.on("connection", (socket) => {
  console.log("A user connected to 5000:", socket.id);

  socket.on("send_forum_message", async (messageData) => {
    console.log("Received forum message on 5000:", messageData);
    try {
      const newMessage = new Chat({
        from: messageData.from,
        text: messageData.text,
        timestamp: messageData.timestamp,
      });
      await newMessage.save();
      console.log("Forum message saved on 5000:", newMessage);
      const allMessages = await Chat.find().sort({ createdAt: 1 });
      const messagesWithProfilePics = await Promise.all(
        allMessages.map(async (msg) => {
          const user = await User.findOne({ fullName: msg.from });
          return {
            ...msg._doc,
            profilePic: user
              ? user.profilePic
                ? `/uploads/${path.basename(user.profilePic)}`
                : "/uploads/default-user.png"
              : "/uploads/default-user.png",
          };
        })
      );
      const messageCount = await Chat.countDocuments();
      console.log(
        "Broadcasting forum messages from 5000:",
        messagesWithProfilePics.length,
        "Count:",
        messageCount
      );
      io.emit("receive_forum_message", {
        messages: messagesWithProfilePics,
        count: messageCount,
      });
    } catch (err) {
      console.error("Error saving forum message on 5000:", err);
      socket.emit("message_error", { error: "Failed to save forum message" });
    }
  });

  // ============================== Updated private chat message handler
  socket.on("send_private_message", async (messageData) => {
    console.log("Received private message on 5000:", messageData);
    try {
      const newMessage = new PrivateChat({
        from: messageData.from,
        to: messageData.to,
        text: messageData.text,
        timestamp: messageData.timestamp,
      });
      await newMessage.save();
      console.log("Private message saved on 5000:", newMessage);

      // Fetch sender's profile pic
      const user = await User.findOne({ fullName: newMessage.from });
      const messageWithProfilePic = {
        ...newMessage._doc,
        profilePic: user
          ? user.profilePic
            ? `/uploads/${path.basename(user.profilePic)}`
            : "/uploads/default-user.png"
          : "/uploads/default-user.png",
      };

      // Emit only the new message
      console.log(
        "Broadcasting single private message from 5000 to",
        `${messageData.from}_${messageData.to} and ${messageData.to}_${messageData.from}`
      );
      io.emit(
        `private_message_${messageData.from}_${messageData.to}`,
        messageWithProfilePic
      );
      io.emit(
        `private_message_${messageData.to}_${messageData.from}`,
        messageWithProfilePic
      );
    } catch (err) {
      console.error("Error saving private message on 5000:", err);
      socket.emit("message_error", { error: "Failed to save private message" });
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("User disconnected from 5000:", socket.id, "Reason:", reason);
  });

  socket.on("error", (error) => {
    console.error("Socket error on 5000:", error);
  });
});

server.listen(5000, () => {
  console.log("Mobile Server is running on port 5000");
});
