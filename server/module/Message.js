const { connectDB } = require("./db");
const { ObjectId } = require("mongodb");

class Message {
  static async create(data) {
    const db = await connectDB();
    return db.collection("messages").insertOne(data);
  }

  static async findByRoomId(roomId) {
    const db = await connectDB();
    const messages = await db
      .collection("messages")
      .find({ roomId: roomId })
      .toArray();
    return messages;
  }
}

module.exports = Message;
