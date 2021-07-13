const mongoose = require("mongoose");

const Contact = mongoose.model(
  "Contact",
  new mongoose.Schema({
    contacts: [
      {
        userId: String,
        chatId: String,
        userName: String,
        userAvatar: {
          data: Buffer,
          contentType: String
        },        
        isContactOnline: Boolean,
        lastChatTime: String
      }
    ],
    invitesSent: [
      {
        userId: String,
        userName: String,
        userAvatar: {
          data: Buffer,
          contentType: String
        },      
      }
    ],
    invitesReceived: [
        {
          userId: String,
          userName: String,
          userAvatar: {
            data: Buffer,
            contentType: String
          },        
        }
      ]
  })
);

module.exports = Contact;