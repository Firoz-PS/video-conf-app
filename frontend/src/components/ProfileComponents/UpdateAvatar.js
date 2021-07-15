import { useContext } from 'react';

// material UI
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from '@material-ui/core';

// contexts
import UserContext from "../../context/UserContext";

// styles
import useStyles from "./styles";

// components
import UserAvatar from '../UserAvatar/UserAvatar';

const UpdateAvatar = () => {
  const classes = useStyles()

  // global state
  const { user } = useContext(UserContext)

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