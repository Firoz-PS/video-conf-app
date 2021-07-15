import React, { useState, useEffect, useCallback, useContext } from "react";

// material UI
import {
  Divider,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Typography,
  CircularProgress,
  Paper,
  InputBase,
} from "@material-ui/core";
import { Send as SendIcon } from "@material-ui/icons";

// react perfect scroll bar
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";

// redux
import { useDispatch, useSelector } from "react-redux";
import { fetchChatDetails, sendMessage } from "../../redux/actions/ChatActions";

// context
import UserContext from "../../context/UserContext";
import { socket } from "../../context/UserContext";

// styles
import useStyles from "./styles";

// components
import UserAvatar from "../UserAvatar/UserAvatar";

const ChatBox = () => {
  var classes = useStyles();
  const dispatch = useDispatch();

  // global state
  const { user } = useContext(UserContext);
  const { SelectedContact } = useSelector((state) => state.contacts);
  const { ChatContent } = useSelector((state) => state.chats);

  // local state
  const [isLoading, setIsLoading] = useState(null);
  const [message, setMessage] = useState("");

  const chatBottomRef = document.querySelector("#chat-scroll");

  // function to fetch all the contacts in the beginning
  useEffect(() => {
    setIsLoading(true);
    {
      SelectedContact[0] &&
        dispatch(fetchChatDetails(SelectedContact[0].chatId)).then(() => {
          setIsLoading(false);
          scrollToBottom();
        });
    }
  }, [SelectedContact[0]]);

  // function to update the chat once a user sends a message
  useEffect(() => {
    socket.on("updateChat", () => {
      {
        SelectedContact[0] &&
          dispatch(fetchChatDetails(SelectedContact[0].chatId));
      }
    });
  });

  // function to scroll to the bootom of the chats
  const scrollToBottom = useCallback(() => {
    if (chatBottomRef) {
      chatBottomRef.scrollTo({
        top: chatBottomRef.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatBottomRef]);

  // function to initiate scrolling to the bottom of a chat
  useEffect(() => {
    scrollToBottom();
  }, [ChatContent, scrollToBottom]);

  // function to send a message
  const sendMessageOnEnter = (event) => {
    if (
      event.key === "Enter" ||
      (event.type === "click" && !event.shiftKey && message !== "")
    ) {
      dispatch(
        sendMessage(
          SelectedContact[0].chatId,
          `${user.firstName} ${user.lastName}`,
          message.trim(),
        ),
      );
      socket.emit("messageSent");
      setMessage("");
    }
  };

  return (
    <Card className={classes.cardBody} fullWidth>
      <CardHeader
        avatar={
          SelectedContact[0] && (
            <UserAvatar name={SelectedContact[0].userName} size={`40px`} />
          )
        }
        title={SelectedContact[0] && SelectedContact[0].userName}
        className={classes.header}
      />
      <Divider />
      <CardContent className={classes.chatBoxContent}>
        <div className={classes.messagesContainer}>
          <PerfectScrollbar id="chat-scroll">
            {/*Displays if no contact is selected*/}
            {!SelectedContact[0] && (
              <Typography align="center">
                Select a contact to start chatting{" "}
              </Typography>
            )}

            {/*Displays while loading*/}
            {SelectedContact[0] && isLoading && <CircularProgress size={60} />}

            {/*Displays if we are chatting with that user for the first time*/}
            {SelectedContact[0] && !isLoading && !ChatContent[0] && (
              <Typography align="center">
                start chatting with {SelectedContact[0].userName}
              </Typography>
            )}

            {/*Displays the chats with the user*/}
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
        <Divider />

        {/*Input area for sending message, displays if a contact is selected*/}
        {SelectedContact[0] && (
          <Paper className={classes.input}>
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
            <IconButton
              color="primary"
              aria-label="send"
              onClick={sendMessageOnEnter}
            >
              <SendIcon />
            </IconButton>
          </Paper>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatBox;
