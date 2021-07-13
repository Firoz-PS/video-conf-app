import { combineReducers } from "redux";
import CallReducer from "./CallReducer";
import chatReducer from "./ChatReducer";
import ContactReducer from "./ContactReducer";

const RootReducer = combineReducers({
  calls: CallReducer,
  contacts: ContactReducer,
  chats: chatReducer,
});

export default RootReducer;
