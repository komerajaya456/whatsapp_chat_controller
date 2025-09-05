const mongoose = require("mongoose");
const { MongoStore } = require("wwebjs-mongo");

// This function handles the connection and returns the store
async function connectDB() {
  try {
    // connect to the database
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "whatsappwebsession",
    });
    console.log("✅ MongoDB connected:", process.env.MONGO_URI);
    console.log("🗄️  Using databasess:", process.env.MONGO_DB);

    // Return the store instance after a successful connection
    return new MongoStore({
      mongoose: mongoose,
      collectionName: "sessions"
    });

  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}

// Export the function so it can be used in your main file
module.exports = connectDB;
