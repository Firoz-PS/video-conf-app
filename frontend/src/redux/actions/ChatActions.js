import axios from "axios";

import { API_URL } from "../../config/config";

// function to fetch all the chat details at the beginning
export const fetchChatDetails = (chatId) => async (dispatch) => {
  const res = await axios.get(API_URL + `/api/chat/${chatId}`);
  dispatch({
    type: "FETCH_CHAT",
    payload: res.data,
  });
  return Promise.resolve();
};

// function to send a message
export const sendMessage = (chatId, myName, text) => async (dispatch) => {
  const res = await axios.put(API_URL + `/api/chat/${chatId}`, {
    myName,
    text,
  });
  dispatch({
    type: "SEND_MESSAGE",
    payload: res.data,
  });
  return Promise.resolve();
};
