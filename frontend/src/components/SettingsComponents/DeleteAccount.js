import React, { useState, useContext } from "react";
import { useHistory } from "react-router";

// material UI
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@material-ui/core";
import { Edit as EditIcon } from "@material-ui/icons";

// contexts
import UserContext from "../../context/UserContext";

// styles
import useStyles from "./styles";

const DeleteAccount = () => {
  const history = useHistory();
  const classes = useStyles();
  const { deleteAccount, userSignOut } = useContext(UserContext);

  // local state
  const initialState = {
    password: "",
    deleteText: "",
  };
  const [values, setValues] = useState(initialState);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // function for the transition of modal
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  // function to change the values in the 'values' state
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  // function to cancel delete account operation
  const handleCancel = () => {
    setIsModalOpen(false);
    setValues(initialState);
    setIsEditing(false);
  };

  // function to delete the account
  const handleDeleteAccount = () => {
    setIsModalOpen(false);
    deleteAccount(values.password);
    setValues(initialState);
    setIsEditing(false);
    userSignOut(history);
  };

  // function to open the model asking for current password
  const handleOpenModal = () => {
    if (values.deleteText === "delete account") {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {/*modal asking for current password*/}
      {isModalOpen && (
        <Dialog
          open={true}
          TransitionComponent={Transition}
          onClose={handleCancel}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Confirm Account Delete
          </DialogTitle>
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
            <Button onClick={handleDeleteAccount} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/*Delete Account card*/}
      <Card>
        <CardHeader
          title="Delete Account"
          subheader={`Type "delete account" in the below box to delete`}
          action={
            <IconButton
              aria-label="delete-account"
              className={classes.editIcon}
              onClick={() => setIsEditing(true)}
            >
              <EditIcon />
            </IconButton>
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
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
        {isEditing && (
          <Button
            color="primary"
            variant="outlined"
            onClick={() => handleCancel()}
          >
            Cancel
          </Button>
        )}
      </Card>
    </>
  );
};

export default DeleteAccount;
