// ChatRoomModel.js
const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const ChatRoomModel = mongoose.model("ChatRoom", ChatRoomSchema);

module.exports = ChatRoomModel;
