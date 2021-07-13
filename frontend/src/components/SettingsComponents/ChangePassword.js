import React, { useState, useContext } from 'react';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from '@material-ui/core';
import {
  Edit as EditIcon ,
} from "@material-ui/icons";

// contexts
import UserContext from "../../context/AuthContext";

// styles
import useStyles from "./styles";

import { useSnackbar } from 'notistack';

const ChangePassword = () => {
  const classes = useStyles()
  const { user, updatePassword } = useContext(UserContext)
  const initialState = {
    OldPassword: "",
    newPassword: "",
    confirmPassword: "",
  }
  const [values, setValues] = useState(initialState);
  const [isEditing, setIsEditing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleCancel =() => {
    setIsModalOpen(false)
    setValues(initialState)
    setIsEditing(false)
  }

  const handleSaveDetails = () => {
    setIsModalOpen(false)
    updatePassword(values.OldPassword, values.newPassword)
    setValues(initialState)
    setIsEditing(false)
  }

  const handleOpenModal = () => {
      if(values.newPassword === values.confirmPassword){
        setIsModalOpen(true)
      }
  }

  return (
    <>
    <Dialog 
    open={isModalOpen}
    TransitionComponent={Transition}
    onClose={handleCancel} 
    aria-labelledby="form-dialog-title"
    >
    <DialogTitle id="form-dialog-title">Confirm Password Change</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Enter your current password to confirm password change
      </DialogContentText>
      <TextField
      fullWidth
      label="Current Password"
      name="OldPassword"
      onChange={handleChange}
      value={values.OldPassword}
      variant="outlined"
      type="password"
    />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCancel} color="secondary">
        Cancel
      </Button>
      <Button onClick={handleSaveDetails} color="primary">
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
      <Card>
        <CardHeader
          title="Change Password"
          subheader="You can change your password here"
          action={
            <IconButton aria-label="edit-password" className={classes.editIcon} onClick={() => setIsEditing(true)}>
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
            label="New Password"
            name="newPassword"
            onChange={handleChange}
            value={values.newPassword}
            variant="outlined"
            disabled={!isEditing}
            type="password"
          />
        </Grid>
        <Grid
          item
          md={6}
          xs={12}
        >
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            onChange={handleChange}
            value={values.confirmPassword}
            variant="outlined"
            disabled={!isEditing}
            type="password"
          />
        </Grid>
        </Grid>
        </CardContent>
        <Divider />
          <Button
            color="primary"
            variant="contained"
            disabled={!isEditing}
            onClick={() => handleOpenModal()}
          >
            Save Password
          </Button>
          {isEditing &&           
            <Button
            color="primary"
            variant="outlined"
            onClick={() => handleCancel()}
          >
            Cancel
          </Button>}
      </Card>
    </>
  );
};

export default ChangePassword;