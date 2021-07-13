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
import { useHistory } from 'react-router';

const DeleteAccount = () => {
  const history = useHistory()
  const classes = useStyles()
  const { user, deleteAccount, userSignOut } = useContext(UserContext)
  const initialState = {
    password: "",
    deleteText: "",
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
    deleteAccount(values.password)
    setValues(initialState)
    setIsEditing(false)
    userSignOut(history)
  }

  const handleOpenModal = () => {
      if(values.deleteText === "delete account"){
        setIsModalOpen(true)
      }
  }

  return (
    <form
      autoComplete="off"
      noValidate
      encType="multipart/form-data"
    >
    {isModalOpen &&       
    <Dialog 
    open={true}
    TransitionComponent={Transition}
    onClose={handleCancel} 
    aria-labelledby="form-dialog-title"
    >
    <DialogTitle id="form-dialog-title">Confirm Account Delete</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Enter your current password to confirm Account Delete
      </DialogContentText>
      <TextField
      fullWidth
      label="Password"
      name="password"
      onChange={handleChange}
      value={values.password}
      variant="outlined"
      type="password"
    />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCancel} color="danger">
        Cancel
      </Button>
      <Button onClick={handleSaveDetails} color="primary">
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
}
      <Card>
        <CardHeader
          title="Delete Account"
          subheader={`Type "delete account" in the below box to delete`}
          action={
            <IconButton aria-label="delete-account" className={classes.editIcon} onClick={() => setIsEditing(true)}>
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
          md={12}
          xs={12}
        >
          <TextField
            fullWidth
            label="Type here..."
            name="deleteText"
            onChange={handleChange}
            value={values.deleteText}
            variant="outlined"
            disabled={!isEditing}
          />
        </Grid>
        </Grid>
        </CardContent>
        <Divider />
          <Button
            color="secondary"
            variant="contained"
            disabled={!isEditing}
            onClick={() => handleOpenModal()}
          >
            Delete Account
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
    </form>
  );
};

export default DeleteAccount;