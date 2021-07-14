import React from "react";
import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

// material UI
import {
  Grid,
  Button,
  Card,
  CardHeader,
  CardContent,
  Divider,
  CardActions,
  TextField,
} from "@material-ui/core";

// redux
import { useDispatch, useSelector } from "react-redux";
import { startCall, joinCall } from "../../redux/actions/CallActions";

// context
import { socket } from "../../context/AuthContext";
import UserContext from "../../context/AuthContext";

export default function CallStarter() {
  const dispatch = useDispatch();
  const { user } = useContext(UserContext);
  const history = useHistory();

  // global state
  const { CallList } = useSelector((state) => state.calls);

  // local state
  const [callId, setCallId] = useState("");
  const [callName, setCallName] = useState("New Call");


  // function to start a call
  const startCallHandler = () => {
    dispatch(
      startCall(`${user.firstName} ${user.lastName}`, callName, socket.id),
    ).then(() => {
      history.push(`/app/call/${CallList[0]._id}`);
    });
  };

  // function to join a call
  const joinCallHandler = () => {
    dispatch(
      joinCall(`${user.firstName} ${user.lastName}`, callId, socket.id),
    ).then(() => {
      history.push(`/app/call/${callId}`);
    });
  };

  return (
    <>
    {/*Start call card*/}
      <Grid item xs={6}>
        <Card>
          <CardHeader title="Start Call" />
          <Divider />
          <CardContent>
            <TextField
              fullWidth
              label="Enter Call Name"
              name="callName"
              helperText="Enter a Name for the call, by default it will be 'New Call'"
              variant="outlined"
              value={callName}
              onChange={(e) => setCallName(e.target.value)}
            />
            <Divider />
            <CardActions>
              <Button
                color="primary"
                variant="contained"
                onClick={() => startCallHandler()}
              >
                Start Call
              </Button>
            </CardActions>
          </CardContent>
        </Card>
      </Grid>

    {/*Join call card*/}
      <Grid item xs={6}>
        <Card>
          <CardHeader title="Join Call" />
          <Divider />
          <CardContent>
            <TextField
              fullWidth
              label="Enter Call ID"
              name="callId"
              helperText="Enter a call ID to join a call"
              variant="outlined"
              value={callId}
              onChange={(e) => setCallId(e.target.value)}
            />
            <Divider />
            <CardActions>
              <Button
                color="primary"
                variant="contained"
                onClick={() => joinCallHandler()}
              >
                Join Call
              </Button>
            </CardActions>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}
