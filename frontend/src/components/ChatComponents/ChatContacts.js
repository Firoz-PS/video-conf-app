import React, { useContext, useState, useEffect } from "react";

// material UI
import {
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Card,
  Typography,
  CardContent,
  CardHeader,
  Divider,
} from "@material-ui/core";

// react perfect scrollbar
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  fetchContactInfo,
  selectContact,
} from "../../redux/actions/ContactActions";

// context
import UserContext from "../../context/AuthContext";

// styles
import useStyles from "./styles";

// components
import UserAvatar from "../UserAvatar/UserAvatar";

const ChatContacts = () => {
  var classes = useStyles();
  const dispatch = useDispatch();
  const { user } = useContext(UserContext);

  // global state
  const { Contacts } = useSelector((state) => state.contacts);

  // local state
  const [isLoading, setIsLoading] = useState(null);

  // function to fetch all the contacts at the beginning
  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchContactInfo(user.contactInfosId)).then(() => {
      setIsLoading(false);
    });
  }, []);

  // fuction to select a contact for chatting
  const selectContactHandler = (userId) => {
    dispatch(selectContact(userId));
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <UserAvatar
            name={`${user.firstName} ${user.lastName}`}
            size={`40px`}
          />
        }
        title={`${user.firstName} ${user.lastName}`}
        className={classes.header}
      />
      <Divider />
      <CardContent className={classes.chatContactsContent}>
        <PerfectScrollbar>
          <List>

            {/*Displays while loading*/}
            {isLoading && <CircularProgress size={60} />}

            {/*Displays if the user doesn't have any contacts*/}
            {!isLoading && !Contacts[0] && (
              <Typography align="center">
                No contacts added, go to contacts page to add new contacts
              </Typography>
            )}

            {/*Displays the contacts*/}
            {!isLoading &&
              Contacts &&
              Contacts.map((contact) => (
                <ListItem
                  button
                  key={contact._id}
                  onClick={() => selectContactHandler(contact.userId)}
                >
                  <ListItemAvatar>
                    <UserAvatar name={contact.userName} size={`40px`} />
                  </ListItemAvatar>
                  <ListItemText primary={contact.userName} />
                </ListItem>
              ))}
              
          </List>
          <Divider />
        </PerfectScrollbar>
      </CardContent>
    </Card>
  );
};

export default ChatContacts;
