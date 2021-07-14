import React, { useState, useContext, useEffect } from "react";

// material UI
import {
  IconButton,
  ListItemSecondaryAction,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Card,
  Typography,
  CardContent,
  CardHeader,
  Divider,
  Tabs,
  Tab,
} from "@material-ui/core";
import {
  CheckCircleOutlineRounded as CheckIcon,
  CancelOutlined as CancelIconOutlined,
  Cancel as CancelIcon,
} from "@material-ui/icons";

// react perfect scrollbar
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  addContact,
  removeInviteSent,
  removeInviteReceived,
  fetchContactInfo,
} from "../../redux/actions/ContactActions";

// context
import UserContext from "../../context/AuthContext";
import { socket } from "../../context/AuthContext";

// component
import UserAvatar from "../UserAvatar/UserAvatar";

// styles
import useStyles from "./styles";

const ManageInvites = () => {
  var classes = useStyles();
  const dispatch = useDispatch();

  // global state
  const { user, ViewUserDetails } = useContext(UserContext);
  const { InvitesSent, InvitesReceived } = useSelector(
    (state) => state.contacts,
  );

  // local state
  const [activeTabId, setActiveTabId] = useState(0);

  // function to view the details of a contact when a user clicks on one
  const viewDetails = (userId) => {
    ViewUserDetails(userId);
  };

  // function to fetch the details when the contact list is updated
  useEffect(() => {
    socket.on("updateContact", () => {
      dispatch(fetchContactInfo(user.contactInfosId)).then(() => {
      });
    });
  });

  return (
    <Card>
      <CardHeader title="Invites" />
      <Divider />
      <CardContent className={classes.content}>
        <Tabs
          value={activeTabId}
          onChange={(id) => setActiveTabId(id)}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Received" classes={{ root: classes.tab }} />
          <Tab label="Sent" classes={{ root: classes.tab }} />
        </Tabs>

        {/*Invites received tab*/}
        {activeTabId === 0 && (
          <PerfectScrollbar>
            <List>
              {!InvitesReceived[0] && (
                <Typography align="center">No invites received </Typography>
              )}
              {InvitesReceived[0] &&
                InvitesReceived.map((item) => (
                  <ListItem
                    button
                    key={item._id}
                    onClick={() => viewDetails(item.userId)}
                  >
                    <ListItemAvatar>
                      <UserAvatar name={item.userName} size={`40px`} />
                    </ListItemAvatar>
                    <ListItemText primary={item.userName} />
                    <ListItemSecondaryAction>
                      <IconButton
                        variant="contained"
                        color="primary"
                        edge="end"
                        onClick={() => {
                          dispatch(
                            addContact(
                              user.contactInfosId,
                              item.userId,
                              item.userName,
                              item.userAvatar,
                              `${user.firstName} ${user.lastName}`,
                              user.avatar,
                              "fromInvites",
                            ),
                          );
                          socket.emit("contactListUpdated");
                        }}
                      >
                        <CheckIcon />
                      </IconButton>
                      <IconButton
                        variant="contained"
                        color="secondary"
                        edge="end"
                        onClick={() => {
                          dispatch(
                            removeInviteReceived(
                              user.contactInfosId,
                              item.userId,
                            ),
                          );
                          socket.emit("contactListUpdated");
                        }}
                      >
                        <CancelIconOutlined />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
            </List>
          </PerfectScrollbar>
        )}

        {/*Invites sent tab*/}
        {activeTabId === 1 && (
          <PerfectScrollbar>
            <List>
              {!InvitesSent[0] && (
                <Typography align="center">No invites sent </Typography>
              )}
              {InvitesSent[0] &&
                InvitesSent.map((item) => (
                  <ListItem
                    button
                    key={item._id}
                    onClick={() => viewDetails(item.userId)}
                  >
                    <ListItemAvatar>
                      <UserAvatar name={item.userName} size={`40px`} />
                    </ListItemAvatar>
                    <ListItemText primary={item.userName} />
                    <ListItemSecondaryAction>
                      <Button
                        variant="contained"
                        color="secondary"
                        edge="end"
                        size="small"
                        className={classes.button}
                        startIcon={<CancelIcon />}
                        onClick={() => {
                          dispatch(
                            removeInviteSent(user.contactInfosId, item.userId),
                          );
                          socket.emit("contactListUpdated");
                        }}
                      >
                        CANCEL
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
                
            </List>
          </PerfectScrollbar>
        )}
      </CardContent>
    </Card>
  );
};

export default ManageInvites;
