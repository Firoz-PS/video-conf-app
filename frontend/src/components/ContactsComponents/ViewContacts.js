import React, { useEffect, useState, useContext } from "react";
import {
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Card,
  AppBar,
  Typography,
  Fab,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  ListItemSecondaryAction,
  Button,
  Paper,
  InputBase,
  IconButton
} from "@material-ui/core";
import { 
    PersonAdd as PersonAddIcon,
    Cancel as CancelIcon,
    Search as SearchIcon,
    Add as AddIcon 
} from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchContactInfo,
  addContact,
  addInvite,
  // ViewContactDetails,
} from "../../redux/actions/ContactActions";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import UserContext from "../../context/AuthContext";

// styles
import useStyles from "./styles";

import UserAvatar from "../UserAvatar/UserAvatar";

import { socket } from "../../context/AuthContext";


const ViewContacts = () => {
  var classes = useStyles();
  const dispatch = useDispatch();
  const { user, searchUser, searchResult, ViewUserDetails } = useContext(UserContext);
  const { Contacts } = useSelector((state) => state.contacts);
  const [isLoading, setIsLoading] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchContactInfo(user.contactInfosId)).then(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    socket.on("updateContact", () => {
      setIsLoading(true);
      dispatch(fetchContactInfo(user.contactInfosId)).then(() => {
        setIsLoading(false);
      });
    });
  });

  const viewDetails = (userId) => {
    ViewUserDetails(userId)
  };

  const handleSearch = (event) => {
    if(event.key === "Enter" || event.type === "click" && !event.shiftKey){
        setIsLoading(true);
        searchUser(searchValue, user.contactInfosId)
        .then(() =>{
          setIsLoading(false)
        }
        )
      }
  };

  const handlefindContact = (e) => {
    setIsSearching(true)
};


const handleCancelSearch = (e) => {
    setIsSearching(false)
};

  return (
    <>
      <Card>
        <CardHeader 
        title={!isSearching && "Contacts"} 
        action={isSearching &&
            <Paper className={classes.searchInput}>
        <InputBase 
        placeholder="search here ..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyUp={handleSearch}
        className={classes.searchField}
        />
      <IconButton color="primary" aria-label="search" onClick={handleSearch}>
        <SearchIcon />
      </IconButton>
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton color="secondary" aria-label="cancel" onClick={handleCancelSearch}>
      <CancelIcon />
    </IconButton>
        </Paper>
        } />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <List>
              {isLoading && <CircularProgress size={60} />}
              {!isLoading && !isSearching && !Contacts[0] && <Typography align="center">No contacts added, click on the button below to send invite </Typography>}
              {!isLoading &&
                !isSearching &&
                Contacts[0] &&
                Contacts.map((contact) => (
                  <ListItem button key={contact.id} onClick={() => viewDetails(contact.userId)}>
                    <ListItemAvatar>
                    <UserAvatar name={contact.userName} size={`40px`} />
                    </ListItemAvatar>
                    <ListItemText primary={contact.userName} />
                  </ListItem>
                ))}
                {!isLoading &&
                  isSearching &&
                  searchResult[0] &&
                  searchResult.map((item) => (
                    <ListItem button key={item._id} onClick={() => viewDetails(item.userId)}>
                      <ListItemAvatar>
                      <UserAvatar name={item.userName} size={`40px`} />
                      </ListItemAvatar>
                      <ListItemText primary={item.userName} />
                      {!item.isUserAContact &&                      
                        <ListItemSecondaryAction>
                        <Button
                        variant="contained"
                        color="primary"
                        edge="end"
                        size="small"
                        className={classes.button}
                        startIcon={<AddIcon />}
                        onClick={() => {
                          dispatch(addInvite(
                            user.contactInfosId,
                            item.userId,
                            item.userName,
                            item.avatar,
                            `${user.firstName} ${user.lastName}`,
                            user.avatar
                            ))
                            socket.emit("contactListUpdated")
                        }                         
                        }
                      >
                        ADD
                      </Button>
                      </ListItemSecondaryAction>}
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
