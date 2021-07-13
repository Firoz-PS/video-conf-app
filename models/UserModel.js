const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phoneNo: String,
    password: String,
    organization: String,
    dateOfBirth: String,
    avatar: {
      data: Buffer,
      contentType: String
    },
    theme: String,
    color: String,
    accessToken: String,
    isDeleted: Boolean,
    isOnline: Boolean,
    contactInfosId: String
  })
);

module.exports = User;