const Call = require("../models/CallModel");
const moment = require("moment");

// function to start a new call
const newCall = (req, res) => {
  const call = new Call({
    callName: req.body.callName,
    date: moment().format("dddd, MMMM Do YYYY"),
    startTime: moment().format("h:mm:ss a"),
    endTime: "",
    hostUserId: req.userId,
    isActive: true,
    participants: [
      {
        userId: req.userId,
        userSocketId: req.body.mySocketId,
        userName: req.body.myName,
        userStream: "",
        isPresent: true,
        joinTime: moment().format("h:mm:ss a"),
        leftTime: "",
      },
    ],
  });

  call
    .save()
    .then(
      res.status(200).send({
        message: "call started successfully",
        call: call,
      })
    )
    .catch((err) => {
      res.status(500).send({ message: "failed to start call" });
      console.log(err);
    });
};

// function to join a call
const joinCall = (req, res) => {
  Call.findById(req.params.id)
    .then((call) => {
      if (call.isActive) {
        const participant = {
          userId: req.userId,
          userSocketId: req.body.mySocketId,
          userName: req.body.myName,
          userStream: "",
          isPresent: true,
          joinTime: moment().format("h:mm:ss a"),
          leftTime: "",
        };
        call.participants.push(participant);
        call
          .save()
          .then(
            res.status(200).send({
              message: "Join request Sent",
              call: call,
            })
          )
          .catch((err) => {
            res.status(500).send({ message: "Accepted the request to join" });
            console.log(err);
          });
      } else {
        res.status(404).send({ mesaage: "call has ended" });
      }
    })
    .catch((err) => {
      res.status(404).send({ message: "Call not found" });
      console.log(err);
    });
};

// function to reject a call
const rejectJoinRequest = (req, res) => {
  Call.findById(req.params.id)
    .then((call) => {
      if (call.isActive) {
        const initialLength = call.participants.length;
        call.participants.splice(
          call.participants.findIndex(
            (participant) => participant.userId === req.body.participantUserId
          ),
          1
        );
        call.save();
        if (call.participants.length != initialLength) {
          res.status(200).send({
            message: "Successfully rejected the join request",
          });
        } else {
          res.status(404).send({ message: "Participant not found" });
        }
      } else {
        res.status(404).send({ mesaage: "call has ended" });
      }
    })
    .catch((err) => {
      res.status(404).send({ message: "Call not found" });
      console.log(err);
    });
};

// function to answer call
const acceptJoinRequest = (req, res) => {
  var newParticipant = {};
  Call.findById(req.params.id)
    .then((call) => {
      if (call.isActive) {
        call.participants.map((participant) => {
          if (participant.userId == req.body.participantUserId) {
            newParticipant = participant;
          }
        });
        if (newParticipant == {}) {
          res.status(404).send({ message: "Participant not found" });
        } else {
          res.status(200).send({
            message: "Successfully accepted the request to join",
            participant: newParticipant,
          });
        }
      } else {
        res.status(404).send({ mesaage: "call has ended" });
      }
    })
    .catch((err) => {
      res.status(404).send({ message: "Call not found" });
      console.log(err);
    });
};

// function to leave a call
const leaveCall = (req, res) => {
  Call.findById(req.params.id)
    .then((call) => {
      if (call.isActive) {
        call.participants
          .findOne({
            userId: req.userId,
          })
          .then((participant) => {
            (participant.isPresent = false),
              (participant.endTime = moment().format("h:mm:ss a"));
          })
          .catch((err) => {
            res.status(404).send({ message: "Participant not found" });
            console.log(err);
          });
        call
          .save()
          .then(
            res.status(200).send({
              message: "Successfully left the call",
            })
          )
          .catch((err) => {
            res.status(500).send({ message: "failed to leave the call" });
            console.log(err);
          });
      } else {
        res.status(404).send({ mesaage: "call has ended" });
      }
    })
    .catch((err) => {
      res.status(404).send({ message: "Call not found" });
      console.log(err);
    });
};

// function to end a call
const endCall = (req, res) => {
  Call.findById(req.params.id)
    .then((call) => {
      if (call.hostUserId != req.userId) {
        res.status(401).send({ message: "Not authorized to end the call" });
      } else {
        if (call.isActive) {
          call.isActive = false;
          call.participants
            .find()
            .then((participant) => {
              (participant.isPresent = false),
                (participant.endTime = moment().format("h:mm:ss a"));
            })
            .catch((err) => {
              res.status(404).send({ message: "No participants in this call" });
              console.log(err);
            });
          call
            .save()
            .then(
              res.status(200).send({
                message: "Successfully ended the call",
              })
            )
            .catch((err) => {
              res.status(500).send({ message: "failed to end the call" });
              console.log(err);
            });
        } else {
          res.status(404).send({ mesaage: "call has already ended" });
        }
      }
    })
    .catch((err) => {
      res.status(404).send({ message: "Call not found" });
      console.log(err);
    });
};

module.exports = {
  newCall,
  joinCall,
  acceptJoinRequest,
  rejectJoinRequest,
  leaveCall,
  endCall,
};
