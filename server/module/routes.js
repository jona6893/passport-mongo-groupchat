const express = require("express");
const router = express.Router();
const passport = require("./passport"); // Import the passport configuration
var LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const User = require("./UserModel");
const upload = require("./multerConfig");
const optimizeImage = require("./imageOptimization");
const {
  ChatRoom,
  addMessage,
  findDirectChat,
  getMessages,
  createDirectChat,
  addUserToChatRoom,
  removeUserFromChatRoom,
} = require("./ChatRoom");
const Message = require("./Message");
//check if the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ isAuthenticated: false });
}

router.post(
  "/login",
  express.json(),
  passport.authenticate("local", {
    successRedirect: "http://localhost:3001/", // Update this to the main page route
    failureRedirect: "http://localhost:3001/login",
  })
);

// Example register route
router.post("/register", express.json(), async (req, res) => {
  console.log("Register");
  const { username, email, password } = req.body;

  // Check if the username already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(409).send("Username already exists");
  }

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user and add it to your user data
  const newUser = {
    username,
    email,
    password: hashedPassword,
  };
  await User.create(newUser);

  // Send a success response
  res.status(201).send("User registered successfully");
});

//
// Get user information
router.get("/auth-check", ensureAuthenticated, (req, res) => {
  res
    .status(200)
    .json({ user: { username: req.user.username, id: req.user._id } });
});

// Example logout route
router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      // Handle error
      console.error("Failed to logout:", err);
      res.status(500).send("Failed to logout");
    } else {
      // Successful logout
      console.log("Logged out successfully");
      res.send("Logged out!");
    }
  });
});

//* ---------- Chat Functionality ----------*/

// Get all messages from Chatroom
// Get all messages from a chat room
router.get("/chatrooms/:roomId/messages", async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const messages = await getMessages(roomId);
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Error fetching messages" });
  }
});
//
// Get all chat rooms
router.get("/chatrooms", ensureAuthenticated, async (req, res) => {
  try {
    const chatRooms = await ChatRoom.find().populate("users", "username");
    res.json(chatRooms);
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching chat rooms." });
  }
});
//
//
// Get chat rooms associated with a specific user ID
router.get("/chatrooms/user/:userId", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.params.userId;
    const chatRooms = await ChatRoom.find({ users: userId }).populate(
      "users",
      "username"
    );
    res.json(chatRooms);
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching chat rooms." });
  }
});

// Create a new chat room
router.post("/chatroom", ensureAuthenticated, async (req, res) => {
  const { name } = req.body;
  const chatRoom = new ChatRoom({ name });
  await chatRoom.save();
  res.status(201).json(chatRoom);
});
//
//
// Get chat room details
router.get("/chatroom/:id", ensureAuthenticated, async (req, res) => {
  const chatRoom = await ChatRoom.findById(req.params.id).populate(
    "users",
    "username"
  );
  if (!chatRoom) {
    return res.status(404).json({ message: "Chat room not found" });
  }
  res.json(chatRoom);
});
//
//
// Add user to a chat room
router.post("/chatroom/:id/join", ensureAuthenticated, async (req, res) => {
  const chatRoom = await ChatRoom.findById(req.params.id);
  if (!chatRoom) {
    return res.status(404).json({ message: "Chat room not found" });
  }
  chatRoom.users.push(req.user._id);
  await chatRoom.save();
  res.json(chatRoom);
});
//
//
// Remove user from a chat room
router.post("/chatroom/:id/leave", ensureAuthenticated, async (req, res) => {
  const chatRoom = await ChatRoom.findById(req.params.id);
  if (!chatRoom) {
    return res.status(404).json({ message: "Chat room not found" });
  }
  chatRoom.users.pull(req.user._id);
  await chatRoom.save();
  res.json(chatRoom);
});
//
//
// Create a direct chat between two users
router.post("/chatrooms/direct", async (req, res) => {
  const { userId1, userId2, name1, name2 } = req.body;

  const chatRoom = await createDirectChat(userId1, userId2, name1, name2);
  res.json(chatRoom);
});
//
//
// Check if a chat room exists between two users
router.get('/chatrooms/direct/:userId1/:userId2', async (req, res) => {
  const { userId1, userId2 } = req.params;
  const chatRoom = await findDirectChat(userId1, userId2);
  res.json(chatRoom);
});
//
//
// Add a user to a chat room
router.post("/chatroom/:roomId/add-user", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId, username } = req.body;
    await addUserToChatRoom(roomId, userId, username);
    res.json({ message: "User added to chat room successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add user to chat room." });
  }
});
//
//
// Remove a user from a chat room
router.post("/chatroom/:roomId/removeUser", async (req, res) => {
  const { roomId } = req.params;
  const { userId, username } = req.body;
  await removeUserFromChatRoom(roomId, userId, username);
  res.json({ message: "User removed from chat room" });
});
//
//
// Add a new route to handle image uploads
router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const optimizedImage = await optimizeImage(req.file.path);

    // Do something with the optimizedImage path, like saving it to the database

    res.status(200).json({ message: 'Image uploaded and optimized', optimizedImage });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Error uploading image' });
  }
});

module.exports = router;
