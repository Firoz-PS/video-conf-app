import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Icon,
  Divider,
  TextField,
  Avatar,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Typography,
  Badge,
  CircularProgress
} from "@material-ui/core";
import { MoreVert as MoreVertIcon, Send as SendIcon } from "@material-ui/icons";

import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";

import { useDispatch, useSelector } from "react-redux";
import { fetchChatDetails, sendMessage } from "../../redux/actions/ChatActions";
import UserContext from "../../context/AuthContext";
import { socket } from "../../context/AuthContext";


// styles
import useStyles from "./styles";
import { Paper } from "@material-ui/core";
import { InputBase } from "@material-ui/core";

import UserAvatar from "../UserAvatar/UserAvatar";


const ChatBox = () => {
  var classes = useStyles();
  const dispatch = useDispatch();
  const { user } = useContext(UserContext);
  const { SelectedContact } = useSelector((state) => state.contacts);
  const { ChatContent } = useSelector((state) => state.chats);
  const [isLoading, setIsLoading] = useState(null);

  const [message, setMessage] = useState("");
  const chatBottomRef = document.querySelector("#chat-scroll");


  useEffect(() => {
    setIsLoading(true);
    {
      SelectedContact[0] &&
        dispatch(fetchChatDetails(SelectedContact[0].chatId))
        .then(() => {
          setIsLoading(false);
          scrollToBottom();
        });
    }

  }, [SelectedContact[0]]);
  
useEffect(() => {
  socket.on("updateChat", () => {
    {SelectedContact[0] && dispatch(fetchChatDetails(SelectedContact[0].chatId)) }   
});
})
  const sendMessageOnEnter = (event) => {
      if(event.key === "Enter" || event.type === "click" && !event.shiftKey && message !== ""){
                dispatch(sendMessage(SelectedContact[0].chatId, `${user.firstName} ${user.lastName}`, message.trim()))
                socket.emit("messageSent")
          setMessage("");
      }
  };

  const scrollToBottom = useCallback(() => {
    if (chatBottomRef) {
      chatBottomRef.scrollTo({
        top: chatBottomRef.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatBottomRef]);

  useEffect(() => {
    scrollToBottom();
  }, [ChatContent, scrollToBottom]);

  return (
      <Card className={classes.cardBody} fullWidth>
      <CardHeader
        avatar={SelectedContact[0] && 
          <UserAvatar name={SelectedContact[0].userName} size={`40px`} />
        }
        // action={
        //   <IconButton aria-label="settings">
        //     <MoreVertIcon />
        //   </IconButton>
        // }
        title={SelectedContact[0] && SelectedContact[0].userName}
        className={classes.header}
      />
      <Divider />
      <CardContent className={classes.chatBoxContent}>
      <div className={classes.messagesContainer}>
        <PerfectScrollbar id="chat-scroll">
          {!SelectedContact[0] && (
            <Typography align="center">Select a contact to start chatting </Typography>
          )}
          {SelectedContact[0] && isLoading && <CircularProgress size={60} />}
          {SelectedContact[0] && !isLoading && !ChatContent[0] && (
            <Typography align="center">
              start chatting with {SelectedContact[0].userName}
            </Typography>
          )}
          {SelectedContact[0] &&
            !isLoading &&
            ChatContent[0] &&
            ChatContent.map((item) => (
              <div
                className={
                  user.id == item.userId
                    ? classes.myMessage
                    : classes.theirMessage
                }
              >
                <div>
                  <Card
                    className={
                      user.id == item.userId
                        ? classes.myMessageCard
                        : classes.theirMessageCard
                    }
                  >
                    {item.text}
                  </Card>
                </div>
              </div>
            ))}
        </PerfectScrollbar>
        </div>
        <Divider/>
        {SelectedContact[0] && <Paper className={classes.input}>
        <InputBase 
        placeholder="Type here ..."
        multiline
        rowsMax={4}
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyUp={sendMessageOnEnter}
        className={classes.sendMessageField}
        />
      <IconButton color="primary" aria-label="send" onClick={sendMessageOnEnter}>
        <SendIcon />
      </IconButton>
        </Paper>
      }
        
      </CardContent>
    </Card>
  );
};

export default ChatBox;
