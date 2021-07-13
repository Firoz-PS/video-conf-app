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

const UpdateDetails = () => {
  const classes = useStyles()
  const { user, updateBasicDetails } = useContext(UserContext)
  const initialState = {
    firstName: `${user.firstName}`,
    lastName: `${user.lastName}`,
    email: `${user.email}`,
    phoneNo: `${user.phoneNo}`,
    organization: `${user.organization}`,
    dateOfBirth: `${user.dateOfBirth}`
  }
  const [values, setValues] = useState(initialState);
  const [isEditing, setIsEditing] = useState(false)

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleCancel =() => {
    setValues(initialState)
    setIsEditing(false)
  }

  const handleSaveDetails = () => {
    updateBasicDetails(values)
  }

  return (
    <form
      autoComplete="off"
      noValidate
      encType="multipart/form-data"
    >
      <Card>
        <CardHeader
          title="Edit Details"
          subheader="basic details except email can be edited"
          action={
            <IconButton aria-label="edit-profile" className={classes.editIcon} onClick={() => setIsEditing(true)}>
              <EditIcon />
            </IconButton>
        }    
        />
        <Divider />
        <CardContent>
        <Grid
          container
          spacing={3}
        >       
        <Grid
          item
          md={6}
          xs={12}
        >
          <TextField
            fullWidth
            label="First name"
            name="firstName"
            onChange={handleChange}
            value={values.firstName}
            variant="outlined"
            disabled={!isEditing}
          />
        </Grid>
        <Grid
          item
          md={6}
          xs={12}
        >
          <TextField
            fullWidth
            label="Last name"
            name="lastName"
            onChange={handleChange}
            value={values.lastName}
            variant="outlined"
            disabled={!isEditing}
          />
        </Grid>
        <Grid
          item
          md={6}
          xs={12}
        >
          <TextField
            fullWidth
            label="Email Address"
            helperText="You can't edit your email Id"
            name="email"
            onChange={handleChange}
            value={values.email}
            variant="outlined"
            disabled
          />
        </Grid>
        <Grid
          item
          md={6}
          xs={12}
        >
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNo"
            onChange={handleChange}
            value={values.phoneNo}
            variant="outlined"
            disabled={!isEditing}
          />
        </Grid> 
        <Grid
          item
          md={6}
          xs={12}
        >
          <TextField
            fullWidth
            label="Organization"
            name="organization"
            onChange={handleChange}
            value={values.organization}
            variant="outlined"
            disabled={!isEditing}
          />
        </Grid>
        <Grid
          item
          md={6}
          xs={12}
        >
          <TextField
            fullWidth
            label="Date of Birth"
            name="dateOfBirth"
            onChange={handleChange}
            value={values.dateOfBirth}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            type="date"
            disabled={!isEditing}
          />
        </Grid>
        </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Button
            color="primary"
            variant="contained"
            disabled={!isEditing}
            onClick={() => handleSaveDetails()}
          >
            Save details
          </Button>
          {isEditing &&           
            <Button
            color="primary"
            variant="outlined"
            onClick={() => handleCancel()}
          >
            Cancel
          </Button>}

        </Box>
      </Card>
    </form>
  );
};

export default UpdateDetails;