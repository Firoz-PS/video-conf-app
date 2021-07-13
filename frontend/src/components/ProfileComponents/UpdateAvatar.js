import { useState, useContext } from 'react';
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
  Input
} from '@material-ui/core';
import {
  Edit as EditIcon ,
} from "@material-ui/icons";

// contexts
import UserContext from "../../context/AuthContext";

// styles
import useStyles from "./styles";
import UserAvatar from '../UserAvatar/UserAvatar';

const UpdateAvatar = () => {
  const classes = useStyles()
  const { user, updateAvatar } = useContext(UserContext)
  const [avatar, setAvatar] = useState(user.avatar)

  return (
      <Card>
        <CardHeader
          title="Your Profile"
          subheader="This is how your profile appears to others"  
        />
        <Divider />
        <CardContent className={classes.detailsCard}>
        <UserAvatar name={`${user.firstName} ${user.lastName}`} size={`90px`} />
        <Typography
          color="textPrimary"
          gutterBottom
          variant="h3"
        >
          {`${user.firstName} ${user.lastName}`} 
        </Typography>
        <Typography
          color="textSecondary"
          variant="body1"
          gutterBottom
        >
          Email : {user.email}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body1"
          gutterBottom
        >
          Phone Number: {user.phoneNo}
        </Typography>
        <Typography
        color="textSecondary"
        variant="body1"
        gutterBottom
      >
        Organization : {user.organization}
      </Typography>
      <Typography
      color="textSecondary"
      variant="body1"
      gutterBottom
    >
      Date of Birth : {user.dateOfBirth}
    </Typography>
        </CardContent>        
      </Card>
  );
};

export default UpdateAvatar;