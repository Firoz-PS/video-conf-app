import { useState, useContext, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Divider,
  Grid,
  TextField,
  Typography,
  Avatar,
  IconButton,
  Input,
  CircularProgress
} from '@material-ui/core';
import {
  Edit as EditIcon ,
} from "@material-ui/icons";

// contexts
import UserContext from "../../context/AuthContext";

import { useDispatch, useSelector } from "react-redux";

// styles
import useStyles from "./styles";
import UserAvatar from '../UserAvatar/UserAvatar';
import { removeContact, fetchContactInfo } from '../../redux/actions/ContactActions';

import { socket } from "../../context/AuthContext";


const ViewContactDetails = () => {
  const classes = useStyles()
  const { user, viewUser } = useContext(UserContext)
  const dispatch = useDispatch();
  const { ContactToView } = useSelector((state) => state.contacts);
  const [isLoading, setIsLoading] = useState(null);

  useEffect(() => {
    socket.on("updateContact", () => {
      setIsLoading(true);
      dispatch(fetchContactInfo(user.contactInfosId)).then(() => {
        setIsLoading(false);
      });
    });
  });

  return (
      <Card>
        <CardHeader
          title="Contact Details"
        />
        <Divider />
        <CardContent className={classes.userDetailsCard}>
        {!viewUser.id && 
          <Typography>Select a contact to view details </Typography>
        }
        {viewUser.id && 
          <div>
          <UserAvatar name={`${viewUser.firstName} ${viewUser.lastName}`} size={`90px`} />
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h3"
          >
            {`${viewUser.firstName} ${viewUser.lastName}`} 
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
            gutterBottom
          >
            Email : {viewUser.email}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
            gutterBottom
          >
            Phone Number: {viewUser.phoneNo}
          </Typography>
          <Typography
          color="textSecondary"
          variant="body1"
          gutterBottom
        >
          Organization : {viewUser.organization}
        </Typography>
        <Typography
        color="textSecondary"
        variant="body1"
        gutterBottom
      >
        Date of Birth : {viewUser.dateOfBirth}
      </Typography>
      <Divider />
          <CardActions>
          <Button
            color="secondary"
            type="submit"
            variant="contained"
            onClick={() => {
              dispatch(removeContact(
                user.contactInfosId,
                viewUser.id,
                ))
                socket.emit("contactListUpdated")
            }                         
            }          
            >
          Remove from contacts
          </Button>
          </CardActions>
          </div>
        }
        </CardContent>      
      </Card>
  );
};

export default ViewContactDetails;