const mongoose = require("mongoose");// Replace with the correct path to the ChatRoom model


const ChatRoomSchema = new mongoose.Schema({
  isGroup: {
    type: Boolean,
    required: true,
  },
  name: [String],
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      userName: String,
      content: String,
      imageUrl: {
        type: String,
        default: null,
      },
      timestamp: Date,
    },
  ],
});

const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);

const addMessage = async (roomId, userId, userName, content, imageUrl) => {
  return ChatRoom.updateOne(
    { _id: roomId },
    {
      $push: {
        messages: {
          sender: userId,
          userName,
          content,
          imageUrl,
          timestamp: new Date(),
        },
      },
    }
  );
};

const getMessages = async (roomId) => {
  const chatRoom = await ChatRoom.findById(roomId);
  return chatRoom.messages;
};



const createDirectChat = async (userId1, userId2, name1, name2) => {
  const chatRoomData = {
    isGroup: false,
    users: [userId1, userId2],
    name: [name1, name2],
  };

  const newChatRoom = new ChatRoom(chatRoomData);
  await newChatRoom.save();
  return newChatRoom;
};


const addUserToChatRoom = async (roomId, userId, username) => {
  const update = {
    $push: {
      users: userId,
      name: username,
    },
  };
  return ChatRoom.updateOne({ _id: roomId }, update);
};


const removeUserFromChatRoom = async (roomId, userId, username) => {
  return ChatRoom.updateOne({ _id: roomId }, { $pull: { users: userId,name: username, } });
};

// Find an existing direct chat room between two users
async function findDirectChat(userId1, userId2) {
  const chatRoom = await ChatRoom.findOne({
    isGroup: false,
    users: { $all: [userId1, userId2], $size: 2 },
  });
  return chatRoom;
}
module.exports = {
  ChatRoom,
  addMessage,
  findDirectChat,
  getMessages,
  createDirectChat,
  addUserToChatRoom,
  removeUserFromChatRoom,
};
