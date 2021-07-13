const initialState = {
  ChatContent: [],
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_CHAT": {
      state.ChatContent = action.payload.chat.chatContent;
      return {
        ...state,
      };
    }
    case "SEND_MESSAGE": {
      state.ChatContent = action.payload.chat.chatContent;
      return {
        ...state,
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default chatReducer;
