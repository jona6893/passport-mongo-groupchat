const { connectDB } = require("../module/db");
const { ObjectId } = require("mongodb");


class User {
  static async findOne(query) {
    const db = await connectDB();
    return db.collection("users").findOne(query);
  }

  static async findById(id) {
    const db = await connectDB();
    const collection = db.collection("users");
    const user = await collection.findOne({ _id: new ObjectId(id) });
    return user;
  }

  static async create(data) {
    const db = await connectDB();
    return db.collection("users").insertOne(data);
  }
}

module.exports = User;