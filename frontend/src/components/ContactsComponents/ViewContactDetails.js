import { useState, useContext, useEffect } from "react";

// material UI
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Divider,
  Typography,
} from "@material-ui/core";

// contexts
import UserContext from "../../context/AuthContext";

import { useDispatch, useSelector } from "react-redux";
import {
  removeContact,
  fetchContactInfo,
} from "../../redux/actions/ContactActions";

// styles
import useStyles from "./styles";

// component
import UserAvatar from "../UserAvatar/UserAvatar";

// context
import { socket } from "../../context/AuthContext";

const ViewContactDetails = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  // global state
  const { user, viewUser } = useContext(UserContext);

  // function to fetch details when the contact list changes
  useEffect(() => {
    socket.on("updateContact", () => {
      dispatch(fetchContactInfo(user.contactInfosId)).then(() => {});
    });
  });

  return (
    <Card>
      <CardHeader title="Contact Details" />
      <Divider />
      <CardContent className={classes.userDetailsCard}>
        {/*displays when no contact is selected*/}
        {!viewUser.id && (
          <Typography>Select a contact to view details </Typography>
        )}

        {/*displays the details of the user*/}
        {viewUser.id && (
          <div>
            <UserAvatar
              name={`${viewUser.firstName} ${viewUser.lastName}`}
              size={`90px`}
            />
            <Typography color="textPrimary" gutterBottom variant="h3">
              {`${viewUser.firstName} ${viewUser.lastName}`}
            </Typography>
            <Typography color="textSecondary" variant="body1" gutterBottom>
              Email : {viewUser.email}
            </Typography>
            <Typography color="textSecondary" variant="body1" gutterBottom>
              Phone Number: {viewUser.phoneNo}
            </Typography>
            <Typography color="textSecondary" variant="body1" gutterBottom>
              Organization : {viewUser.organization}
            </Typography>
            <Typography color="textSecondary" variant="body1" gutterBottom>
              Date of Birth : {viewUser.dateOfBirth}
            </Typography>
            <Divider />
            <CardActions>
              <Button
                color="secondary"
                type="submit"
                variant="contained"
                onClick={() => {
                  dispatch(removeContact(user.contactInfosId, viewUser.id));
                  socket.emit("contactListUpdated");
                }}
              >
                Remove from contacts
              </Button>
            </CardActions>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ViewContactDetails;
