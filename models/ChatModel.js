const mongoose = require("mongoose");

const Chat = mongoose.model(
  "Chat",
  new mongoose.Schema({
    chatContent: [
      {
        userId: String,
        userName: String,
        text: String,
        time: String
    }
  ]

  })
);

module.exports = Chat;