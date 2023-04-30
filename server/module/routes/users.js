// routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../UserModel");

router.get("/", async (req, res) => {
  const searchTerm = req.query.search || "";
  const users = await User.find({
    username: { $regex: searchTerm, $options: "i" },
  });
  res.json(users);
});

module.exports = router;
