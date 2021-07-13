import React, { useState, useContext } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";

// styles
import useStyles from "./styles";

// context
import UserContext from "../../context/AuthContext";

function Login(props) {
  var classes = useStyles();

  // global states
  const { userSignUp, userSignIn } = useContext(UserContext);

  // local states
  const [isLoading, setIsLoading] = useState(false);
  const [activeTabId, setActiveTabId] = useState(0);
  const [signupFirstNameValue, setSignupFirstNameValue] = useState("");
  const [signupLastNameValue, setSignupLastNameValue] = useState("");
  const [signupEmailValue, setSignupEmailValue] = useState("");
  const [signupPasswordValue, setSignupPasswordValue] = useState("");
  const [signupConfirmPasswordValue, setSignupConfirmPasswordValue] = useState("");
  const [loginEmailValue, setLoginEmailValue] = useState("");
  const [loginPasswordValue, setLoginPasswordValue] = useState("");

  // function to signUp a user
  const sigUpHandler = () => {
    setIsLoading(true);
    if (signupPasswordValue == signupConfirmPasswordValue) {
      userSignUp(
        signupFirstNameValue,
        signupLastNameValue,
        signupEmailValue,
        signupPasswordValue,
        props.history,
        setIsLoading,
      ).then(() => {
        setIsLoading(false);
      });
    }
  };

  // function to signIn a user
  const signInHandler = () => {
    setIsLoading(true)
    userSignIn(
      loginEmailValue,
      loginPasswordValue,
      props.history,
      setIsLoading,
    ).then(() => {
      setIsLoading(true)
    })
  }

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
        <Typography className={classes.logotypeText} align="center">
          Welcome to Teams Clone
        </Typography>
      </div>
      <div className={classes.formContainer}>
        <div className={classes.form}>
          <Tabs
            value={activeTabId}
            onChange={(e, id) => setActiveTabId(id)}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Login" classes={{ root: classes.tab }} />
            <Tab label="New User" classes={{ root: classes.tab }} />
          </Tabs>
          {activeTabId === 0 && (
            <React.Fragment>
              <Typography variant="h1" className={classes.greeting}>
                Welcome back!
              </Typography>
              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={loginEmailValue}
                onChange={(e) => setLoginEmailValue(e.target.value)}
                margin="normal"
                placeholder="Email Adress"
                type="email"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={loginPasswordValue}
                onChange={(e) => setLoginPasswordValue(e.target.value)}
                margin="normal"
                placeholder="Password"
                type="password"
                fullWidth
              />
              <div className={classes.formButtons}>
                {isLoading ? (
                  <CircularProgress size={26} className={classes.loginLoader} />
                ) : (
                  <Button
                    disabled={
                      loginEmailValue.length === 0 ||
                      loginPasswordValue.length === 0
                    }
                    onClick={signInHandler}
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                  >
                    Login
                  </Button>
                )}
              </div>
            </React.Fragment>
          )}
          {activeTabId === 1 && (
            <React.Fragment>
              <Typography variant="h2" className={classes.subGreeting}>
                Create your account
              </Typography>
              <TextField
                id="firstName"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={signupFirstNameValue}
                onChange={(e) => setSignupFirstNameValue(e.target.value)}
                margin="normal"
                placeholder="First Name"
                type="text"
                fullWidth
              />
              <TextField
                id="lastName"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={signupLastNameValue}
                onChange={(e) => setSignupLastNameValue(e.target.value)}
                margin="normal"
                placeholder="Last Name"
                type="text"
                fullWidth
              />
              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={signupEmailValue}
                onChange={(e) => setSignupEmailValue(e.target.value)}
                margin="normal"
                placeholder="Email Adress"
                type="email"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={signupPasswordValue}
                onChange={(e) => setSignupPasswordValue(e.target.value)}
                margin="normal"
                placeholder="Password"
                type="password"
                fullWidth
              />
              <TextField
                id="confirmPassword"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={signupConfirmPasswordValue}
                onChange={(e) => setSignupConfirmPasswordValue(e.target.value)}
                margin="normal"
                placeholder="Confirm Password"
                type="password"
                fullWidth
              />
              <div className={classes.creatingButtonContainer}>
                {isLoading ? (
                  <CircularProgress size={26} />
                ) : (
                  <Button
                    onClick={sigUpHandler}
                    disabled={
                      signupEmailValue.length === 0 ||
                      signupPasswordValue.length === 0 ||
                      signupConfirmPasswordValue.length === 0 ||
                      signupFirstNameValue.length === 0 ||
                      signupLastNameValue.length === 0
                    }
                    size="large"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className={classes.createAccountButton}
                  >
                    Create your account
                  </Button>
                )}
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </Grid>
  );
}

export default withRouter(Login);
