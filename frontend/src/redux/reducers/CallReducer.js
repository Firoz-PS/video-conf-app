const initialState = {
  CallList: [],
};

const callReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SOCKET_ID": {
      state.CallList.push(action.payload.call);
      return {
        ...state,
      };
    }
    case "ADD_MY_STREAM": {
      const { myStream } = action.payload;
      return {
        ...state,
        myStream,
      };
    }
    case "INCOMING_CALL": {
      const { call } = action.payload;
      return {
        ...state,
        call,
      };
    }
    case "START_CALL": {
      state.CallList.push(action.payload.call);
      return {
        ...state,
      };
    }
    case "JOIN_CALL": {
      state.CallList.push(action.payload.call);
      return {
        ...state,
      };
    }
    case "ANSWER_CALL": {
      state.CallList[0].participants.push(action.payload.participant);
      return {
        ...state,
      };
    }
    case "REMOVE_PARTCIPANT": {
      state.CallList[0].participants.splice(
        state.CallList[0].participants.findIndex(
          (participant) => participant.userId === action.payload.userId,
        ),
        1,
      );
      return {
        ...state,
      };
    }
    case "LEAVE_CALL": {
      return {
        ...state,
        callId: null,
        mySocketId: null,
      };
    }
    case "END_CALL": {
      return {
        ...state,
        callId: null,
        mySocketId: null,
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default callReducer;
