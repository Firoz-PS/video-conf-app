import axios from "axios";
import { useSnackbar } from "notistack";

import { API_URL } from "../../config/config";

const showSnackbar = () => () => {
  const { enqueueSnackbar } = useSnackbar();
  enqueueSnackbar("message");
};

// function to select a contact for chatting
export const selectContact = (userId) => async (dispatch, getState) => {
  let { contacts } = getState();
  const selectedContact = await contacts.Contacts.filter((contact) => {
    if (contact.userId == userId) {
      return contact;
    }
  });
  dispatch({
    type: "SELECT_CONTACT",
    payload: selectedContact,
  });
  return Promise.resolve();
};

// function to fetch all contact details in the beginning
export const fetchContactInfo = (contactId) => async (dispatch) => {
  const res = await axios.get(API_URL + `/api/contacts/${contactId}`);
  dispatch({
    type: "FETCH_CONTACT",
    payload: res.data,
  });
  return Promise.resolve();
};

// function to add a contact
export const addContact = (
  contactId,
  userId,
  userName,
  avatar,
  myName,
  myAvatar,
  type,
) => async (dispatch) => {
  const res = await axios.put(
    API_URL + `/api/contacts/addContact/${contactId}`,
    {
      userId,
      userName,
      avatar,
      myName,
      myAvatar,
      type,
    },
  );
  dispatch({
    type: "ADD_CONTACT",
    payload: res.data,
  });
  return Promise.resolve();
};

// function to send an invite
export const addInvite = (
  contactId,
  userId,
  userName,
  avatar,
  myName,
  myAvatar,
  type,
) => async (dispatch) => {
  const res = await axios.put(
    API_URL + `/api/contacts/addInvite/${contactId}`,
    {
      userId,
      userName,
      avatar,
      myName,
      myAvatar,
      type,
    },
  );
  dispatch({
    type: "ADD_INVITE",
    payload: res.data,
  });
  showSnackbar();
  return Promise.resolve();
};

// function to remove a contact from the contacts list
export const removeContact = (contactId, userId) => async (dispatch) => {
  const res = await axios.put(
    API_URL + `/api/contacts/removeContact/${contactId}`,
    {
      userId,
    },
  );
  dispatch({
    type: "REMOVE_CONTACT",
    payload: res.data,
  });
  return Promise.resolve();
};

// function to cancel an invite sent
export const removeInviteSent = (contactId, userId) => async (dispatch) => {
  const res = await axios.put(
    API_URL + `/api/contacts/removeInviteSent/${contactId}`,
    {
      userId,
    },
  );
  dispatch({
    type: "REMOVE_INVITE_SENT",
    payload: res.data,
  });
  return Promise.resolve();
};

// function to reject an invite received
export const removeInviteReceived = (contactId, userId) => async (dispatch) => {
  const res = await axios.put(
    API_URL + `/api/contacts/removeInviteReceived/${contactId}`,
    {
      userId,
    },
  );
  dispatch({
    type: "REMOVE_INVITE_RECEIVED",
    payload: res.data,
  });
  return Promise.resolve();
};
