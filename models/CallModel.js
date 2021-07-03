const mongoose = require("mongoose");

const Call = mongoose.model(
  "Call",
  new mongoose.Schema({
    name: String,  
    date: String,
    startTime: String,
    endTime: String,
    hostUserId: String,
    connectionId: String,
    isActive: Boolean,
    participants: [
      {
        userId: String,
        isPresent: Boolean,
        joinTime: String,
        leftTime: String,
      }
    ]
  })
);

module.exports = Call;