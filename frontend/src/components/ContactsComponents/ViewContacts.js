import React, { useEffect, useState, useContext } from "react";

//material UI
import {
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Card,
  Typography,
  Fab,
  CardContent,
  CardHeader,
  Divider,
  ListItemSecondaryAction,
  Button,
  Paper,
  InputBase,
  IconButton,
} from "@material-ui/core";
import {
  PersonAdd as PersonAddIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from "@material-ui/icons";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  fetchContactInfo,
  addInvite,
} from "../../redux/actions/ContactActions";

// react perfect scrollbar
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";

// context
import UserContext from "../../context/UserContext";
import { socket } from "../../context/UserContext";

// styles
import useStyles from "./styles";

// component
import UserAvatar from "../UserAvatar/UserAvatar";

const ViewContacts = () => {
  var classes = useStyles();
  const dispatch = useDispatch();

  // global state
  const { user, searchUser, searchResult, ViewUserDetails } = useContext(
    UserContext,
  );
  const { Contacts } = useSelector((state) => state.contacts);

  // local state
  const [isLoading, setIsLoading] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // function to fetch contacts in the beginning
  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchContactInfo(user.contactInfosId)).then(() => {
      setIsLoading(false);
    });
  }, []);

  // function to fetch details when the contact list changes
  useEffect(() => {
    socket.on("updateContact", () => {
      setIsLoading(true);
      dispatch(fetchContactInfo(user.contactInfosId)).then(() => {
        setIsLoading(false);
      });
    });
  });

  // function to view the users details
  const viewDetails = (userId) => {
    ViewUserDetails(userId);
  };

  // function to search for a user based on email
  const handleSearch = (event) => {
    if (event.key === "Enter" || (event.type === "click" && !event.shiftKey)) {
      setIsLoading(true);
      searchUser(searchValue, user.contactInfosId).then(() => {
        setIsLoading(false);
      });
    }
  };

  // function to set the activity as searching
  const handlefindContact = () => {
    setIsSearching(true);
  };

  // function to set the activity as not searching
  const handleCancelSearch = () => {
    setIsSearching(false);
  };

  return (
    <>
      <Card>
        <CardHeader
          title={!isSearching && "Contacts"}
          action={
            isSearching && (
              <Paper className={classes.searchInput}>
                <InputBase
                  placeholder="search here ..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyUp={handleSearch}
                  className={classes.searchField}
                />
                <IconButton
                  color="primary"
                  aria-label="search"
                  onClick={handleSearch}
                >
                  <SearchIcon />
                </IconButton>
                <Divider className={classes.divider} orientation="vertical" />
                <IconButton
                  color="secondary"
                  aria-label="cancel"
                  onClick={handleCancelSearch}
                >
                  <CancelIcon />
                </IconButton>
              </Paper>
            )
          }
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <List>
              {/*displays the loader*/}
              {isLoading && <CircularProgress size={60} />}

              {/*if their are no contacts this displays*/}
              {!isLoading && !isSearching && !Contacts[0] && (
                <Typography align="center">
                  No contacts added, click on the button below to send invite{" "}
                </Typography>
              )}

              {/*displays the contacts*/}
              {!isLoading &&
                !isSearching &&
                Contacts[0] &&
                Contacts.map((contact) => (
                  <ListItem
                    button
                    key={contact.id}
                    onClick={() => viewDetails(contact.userId)}
                  >
                    <ListItemAvatar>
                      <UserAvatar name={contact.userName} size={`40px`} />
                    </ListItemAvatar>
                    <ListItemText primary={contact.userName} />
                  </ListItem>
                ))}

              {/*displays the search result*/}
              {!isLoading &&
                isSearching &&
                searchResult[0] &&
                searchResult.map((item) => (
                  <ListItem
                    button
                    key={item._id}
                    onClick={() => viewDetails(item.userId)}
                  >
                    <ListItemAvatar>
                      <UserAvatar name={item.userName} size={`40px`} />
                    </ListItemAvatar>
                    <ListItemText primary={item.userName} />

                    {/*if the search result is not an existing contact it displays the add button*/}
                    {!item.isUserAContact && (
                      <ListItemSecondaryAction>
                        <Button
                          variant="contained"
                          color="primary"
                          edge="end"
                          size="small"
                          className={classes.button}
                          startIcon={<AddIcon />}
                          onClick={() => {
                            dispatch(
                              addInvite(
                                user.contactInfosId,
                                item.userId,
                                item.userName,
                                item.avatar,
                                `${user.firstName} ${user.lastName}`,
                                user.avatar,
                              ),
                            );
                            socket.emit("contactListUpdated");
                          }}
                        >
                          ADD
                        </Button>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                ))}
            </List>
          </PerfectScrollbar>
          <Fab
            color="primary"
            aria-label="add"
            className={classes.newChatButton}
            onClick={handlefindContact}
          >
            <PersonAddIcon />
          </Fab>
        </CardContent>
      </Card>
    </>
  );
};

export default ViewContacts;
