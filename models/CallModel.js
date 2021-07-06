const mongoose = require("mongoose");

const Call = mongoose.model(
  "Call",
  new mongoose.Schema({
    callName: String,  
    date: String,
    startTime: String,
    endTime: String,
    hostUserId: String,
    isActive: Boolean,
    participants: [
      {
        userId: String,
        userSocketId: String,
        userName: String,
        userStream: String,
        isPresent: Boolean,
        joinTime: String,
        leftTime: String,
      }
    ]
  })
);

module.exports = Call;