// Load environment variables from the .env file.

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("WhatsApp bot is running 🚀"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





require('dotenv').config();

const { Client, RemoteAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Import the database connection function from the other file
const connectDB = require("./config/mongoconnect");
const mongoose = require("mongoose");
const { MongoStore } = require("wwebjs-mongo");

async function startBot() {
  try {
    // Wait for the MongoStore to be created by the connectDB function
    const store = await connectDB();

    // Now that the store is ready, initialize the client
    // const client = new Client({
    //   // IMPORTANT: Add these arguments to fix the "Execution context destroyed" error
    //   puppeteer: {
    //     args: ['--no-sandbox', '--disable-setuid-sandbox']
    //   },
    //   authStrategy: new RemoteAuth({
    //     store: store,
    //     backupSyncIntervalMs: 300000
    //   })
    // });
    const client = new Client({
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- important in containers
      '--disable-gpu'
    ],
  },
  authStrategy: new RemoteAuth({
    store: store,
    backupSyncIntervalMs: 300000,
  }),
});


    // Events
    client.on("ready", () => {
      console.log("✅ WhatsApp client is ready! Session restored.");
    });

client.on("auth_failure", msg => console.error("❌ AUTH ERROR:", msg));
client.on("disconnected", reason => console.error("❌ Client disconnected:", reason));


    client.on("qr", qr => {
      console.log("Scan this QR to log in:");
      qrcode.generate(qr, { small: true });
    });
    
    client.on('remote_session_saved', () => {
      console.log("✅ Remote session saved to MongoDB.");
    });

    client.on("message", async chat => {
      const contact = await chat.getContact();
      console.log(`${chat.from} : ${chat.body} ${contact.pushname}`);
       chat.reply("hi there");
      client.sendMessage(chat.from, "hello");
    });

    // Start the client
    client.initialize();

  } catch (err) {
    console.error("❌ Failed to start the bot:", err.message);
  }
}

// Call the function to start the entire process
startBot();
