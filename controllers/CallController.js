const config = require("../config/authConfig");
const User = require("../models/UserModel");
const Call = require("../models/CallModel");
const moment = require('moment');

// function to start a new call
const newCall = (req, res) => {
  const call = new Call({
    name: req.body.name,  
    date: moment().format("dddd, MMMM Do YYYY"),
    startTime: moment().format("h:mm:ss a"),
    endTime: "",
    hostUserId: req.userId,
    connectionId: req.body.connectionId,
    isActive: true,
    participants: [
        {
            userId: req.userId,
            isPresent: true,
            joinTime: moment().format("h:mm:ss a"),
            leftTime: "" 
        }
    ],
  });

  call.save()
    .then(
      res.status(200).send({
        message: "call started successfully",
        callId: call.id
      }) 
    )
    .catch(err =>{
      res.status(500).send({message: "failed to start call"})
      console.log(err)
    })
 };

// function to join a call
const joinCall = (req, res) => {
    Call.findById(req.params.id)
        .then(call => {
            if(call.isActive){
                call.participants.push({
                    userId: req.userId,
                    isPresent: true,
                    joinTime: moment().format("h:mm:ss a"),
                    leftTime: ""
                })
                call.save()
                .then(
                    res.status(200).send({
                        message: "Join request Sent",
                        connectionId: Call.connectionId
                    })
                )
                .catch(err =>{
                    res.status(500).send({message: "failed to sent join request"})
                    console.log(err)
                })
            }
            else {
                res.status(404).send({mesaage: "call has ended"})
            }
        })
        .catch(err =>{
            res.status(404).send({message: "Call not found"})
            console.log(err)
        })    
}

// function to leave a call
const leaveCall = (req, res) => {
    Call.findById(req.params.id)
        .then(call => {
            if(call.isActive){
                call.participants.findOne({
                    userId: req.userId
                })
                .then(participant => {
                    participant.isPresent = false,
                    participant.endTime = moment().format("h:mm:ss a")
                })
                .catch(err => {
                    res.status(404).send({message: "Participant not found"})
                    console.log(err)
                })
                call.save()
                .then(
                    res.status(200).send({
                        message: "Successfully left the call"
                    })
                )
                .catch(err =>{
                    res.status(500).send({message: "failed to leave the call"})
                    console.log(err)
                })
            }
            else {
                res.status(404).send({mesaage: "call has ended"})
            }
        })
        .catch(err =>{
            res.status(404).send({message: "Call not found"})
            console.log(err)
        })    
}

// function to end a call
const endCall = (req, res) => {
    Call.findById(req.params.id)
        .then(call => {
            if(call.hostUserId != req.userId){
                res.status(401).send({message: "Not authorized to end the call"})
            } 
            else{
                if(call.isActive){
                    call.isActive = false
                    call.participants.find()
                    .then(participant => {
                        participant.isPresent = false,
                        participant.endTime = moment().format("h:mm:ss a")
                    })
                    .catch(err => {
                        res.status(404).send({message: "No participants in this call"})
                        console.log(err)
                    })
                    call.save()
                    .then(
                        res.status(200).send({
                            message: "Successfully ended the call"
                        })
                    )
                    .catch(err =>{
                        res.status(500).send({message: "failed to end the call"})
                        console.log(err)
                    })
                }
                else {
                    res.status(404).send({mesaage: "call has already ended"})
                }
            }
        })
        .catch(err =>{
            res.status(404).send({message: "Call not found"})
            console.log(err)
        })    
}

// function to get all call details
// need to edit this,this wont work
const getAllCallDetails = (req, res) => {
    const allCalls = []
    Call.find()
    .then(
        call => {
            if(call.hostUserId === req.userId || call.participants.findOne({userId : req.userId})){
                allCalls.push({
                    callId: call.id, 
                    name: call.name,
                    date: call.date,
                    startTime: call.startTime,
                    endTime: call.endTime,
                    hostUserId: call.hostUserId,
                    connectionId: call.connectionId,
                    isActive: call.isActive,
                    participants: call.participants
                })
            }
            res.status(200).send({
                message: "Successfully ended the call",
                allCalls: allCalls
            })
    })
    .catch(err =>{
        res.status(500).send({message: "Some error occured"})
        console.log(err)
    })    
}

module.exports = {
  newCall,
  joinCall,
  leaveCall,
  endCall,
  getAllCallDetails
}