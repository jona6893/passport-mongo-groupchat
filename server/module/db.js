const { MongoClient } = require("mongodb");

let db;

async function connectDB() {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  db = client.db(process.env.DB_NAME);

  return db;
}

module.exports = { connectDB };
