//
// Imports
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("./module/passport"); // Import the passport configuration
const routes = require("./module/routes"); // Import the routes
const MongoDBStore = require("connect-mongodb-session")(session);
const { connectDB } = require("./module/db");
const User = require("./module/Users");
const mongoose = require("mongoose");
const Message = require("./module/Message");
const { ChatRoom, addMessage, getMessages } = require("./module/ChatRoom");
const userRouter = require("./module/routes/users");
const path = require("path");
require("dotenv").config();

const app = express();
//
// Socket io setups
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
//
// App declarations
app.use(cors({ origin: "http://localhost:3001", credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//
//
app.use("/users", userRouter);
//
// Passport configuration
app.use(
  session({
    secret: "your-session-secret",
    resave: false,
    saveUninitialized: false,
    store: new MongoDBStore({
      uri: process.env.MONGODB_URI,
      databaseName: process.env.DB_NAME,
      collection: "sessions",
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
// Use routes from the 'modules/routes.js' file
app.use(routes);
//
// Allow propper image urls instead of local file directory.
app.use("/images", express.static(path.join(__dirname, "images")));

//
// mongoose configuration
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false, // Disable mongoose buffering
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

//
// Connect to the MongoDB server
connectDB()
  .then(() => {
    //console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

//
// Socket.io
io.on("connection", (socket) => {
  console.log("A user connected");

  // Join chat room event
  socket.on("joinRoom", ({ roomId, userId }) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
  });

  // Handle chat messages
  socket.on(
    "chatMessage",
    async ({ roomId, userId, userName, content, imageUrl }) => {
      try {
        // If an image is present, change the imageUrl to the correct URL
        if (imageUrl) {
          imageUrl = `http://localhost:3000/images/${path.basename(imageUrl)}`;
        }

        await addMessage(roomId, userId, userName, content, imageUrl);
        io.to(roomId).emit("message", { userId, userName, content, imageUrl }); // Include imageUrl here
      } catch (error) {
        console.error("Error saving message:", error);
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});


// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
