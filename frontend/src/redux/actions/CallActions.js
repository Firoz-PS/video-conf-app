import axios from "axios";

import { API_URL } from "../../config/config";

// function to remove a participant from call list
export const removeMeFromParticipants = (userId) => (dispatch) => {
  dispatch({
    type: "REMOVE_PARTCIPANT",
    payload: userId,
  });
  return Promise.resolve();
};

// function to start a new call
export const startCall = (myName, callName, mySocketId) => async (dispatch) => {
  const res = await axios.post(API_URL + "/api/call/start", {
    callName,
    mySocketId,
    myName,
  });
  dispatch({
    type: "START_CALL",
    payload: res.data,
  });
  return Promise.resolve();
};

// function to request the host to join the meeting
export const joinCall = (myName, callId, mySocketId) => async (dispatch) => {
  const res = await axios.put(API_URL + `/api/call/join/${callId}`, {
    myName,
    mySocketId,
  });
  dispatch({
    type: "JOIN_CALL",
    payload: res.data,
  });
  return Promise.resolve();
};

// function to accept a join request
export const acceptJoinRequest = (callId, myUserId) => async (dispatch) => {
  const res = await axios.get(API_URL + `/api/call/answer/${callId}`, {
    participantUserId: myUserId,
  });
  dispatch({
    type: "ANSWER_CALL",
    payload: res.data,
  });
  return Promise.resolve();
};

// function to reject a user from joining the call
export const rejectJoinRequest = (callId, myUserId) => async (dispatch) => {
  const res = await axios.put(API_URL + `/api/call/reject/${callId}`, {
    participantUserId: myUserId,
  });
  return Promise.resolve();
};

// function to just leave from the call
export const leaveCall = async (callId) => (dispatch) => {
  axios.put(API_URL + `/api/call/leave/${callId}`);
  dispatch({
    type: "LEAVE_CALL",
  });
};

// function to end a call
export const endCall = async (callId) => (dispatch) => {
  axios.put(API_URL + `/api/user/end/${callId}`);
  dispatch({
    type: "END_CALL",
  });
};
