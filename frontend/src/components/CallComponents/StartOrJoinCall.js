import React from "react";
import { useState, useContext, useEffect } from "react";
import UserContext from "../../context/AuthContext";
import { useHistory } from "react-router-dom";
import {
  Grid,
  Paper,
  Input,
  Button,
  Card,
  CardHeader,
  CardContent,
  Divider,
  CardActions,
  TextField,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { startCall, joinCall } from "../../redux/actions/CallActions";
import { socket } from "../../context/AuthContext";

// styles
import useStyles from "./styles";

export default function CallStarter({
  mySocketId,
  callAccepted,
  name,
  setName,
  callEnded,
  leaveCall,
  callUser,
}) {
  var classes = useStyles();
  const dispatch = useDispatch();
  const { user } = useContext(UserContext);
  const { CallList } = useSelector((state) => state.calls);
  // const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);
  const [callId, setCallId] = useState("");
  const [callName, setCallName] = useState("New Call");

  const history = useHistory();

  const startCallHandler = () => {
    dispatch(
      startCall(`${user.firstName} ${user.lastName}`, callName, socket.id),
    ).then(() => {
      history.push(`/app/call/${CallList[0]._id}`);
    });
  };

  const joinCallHandler = () => {
    dispatch(
      joinCall(`${user.firstName} ${user.lastName}`, callId, socket.id),
    ).then(() => {
      history.push(`/app/call/${callId}`);
    });
  };

  return (
    <>
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
