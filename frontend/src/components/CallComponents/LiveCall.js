import React from "react";
import { useContext, useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";

// material UI
import {
  Grid,
  Paper,
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@material-ui/core";
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  CallEnd,
  Chat,
  FileCopy
} from "@material-ui/icons";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  acceptJoinRequest,
  rejectJoinRequest,
  removeMeFromParticipants,
} from "../../redux/actions/CallActions";
import {
  addContact,
  selectContact,
  fetchContactInfo
} from "../../redux/actions/ContactActions";

// Peer.js
import Peer from "simple-peer";

// context
import UserContext from "../../context/AuthContext";
import { socket } from "../../context/AuthContext";

// styles
import useStyles from "./styles";

// components
import ChatBox from "../ChatComponents/ChatBox";



const LiveCall = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  // global state
  const { CallList } = useSelector((state) => state.calls);
  const { user } = useContext(UserContext);

  // local state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callRejected, setCallRejected] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [call, setCall] = useState({});
  const [mic, setMic] = useState(true);
  const [video, setVideo] = useState(true);
  const [userName, setUserName] = useState(null);
  const [otherUserId, setOtherUserId] = useState(null)

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  // function for the transition of modal
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  // function to update the contactslist when a user calls 
  useEffect(() => {
    socket.on("updateContact", () => {
      dispatch(fetchContactInfo(user.contactInfosId)).then(() => {
      });
    });
  });

  // function to ask for camera and mic permissions and also to set the value of 'call' state when a user calls
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      });

    socket.on("callUser", ({ from, myName, signal, myUserId }) => {
      setCall({ isReceivingCall: true, from, myName, signal, myUserId });
    });
  }, []);

  // function to call a user, it will execute only for the user 'joining' the call and not for the one who 'starts'
  useEffect(() => {
    if(CallList[0].participants[1]){
      callUser(CallList[0].participants[0].userSocketId);
    }
  }, [stream])

  // function to toggle the open status of chat box
  const toggleDrawerOpen = () => {
    if(otherUserId){
      dispatch(selectContact(otherUserId))
    }
    else {
      dispatch(selectContact(call.myUserId))
    }
    setDrawerOpen(!drawerOpen);
  };

  // function to mute or unmute mic
  const muteUnmute = () => {
    setMic(!mic);
    myVideo.current.srcObject.getAudioTracks()[0].enabled = !mic;
  };

  // function to turn on or off the video
  const playStop = () => {
    setVideo(!video)
    myVideo.current.srcObject.getVideoTracks()[0].enabled = !video;
  };

  // function to reject a join request from a user
  const handleDisagree = () => {
    dispatch(rejectJoinRequest(CallList[0]._id, call.myUserId)).then(() => {
      rejectCall();
    });
  };

  // function to accept a join request from a user
  const handleAgree = () => {
    dispatch(acceptJoinRequest(CallList[0]._id, call.myUserId)).then(() => {
      answerCall();
    });
  };

  // function that executes when a join request is rejected
  const rejectCall = () => {
    setCallRejected(true);
    socket.emit("rejectCall", { to: call.from });
  };

  // function that executes when a join request is accepted
  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answerCall", {
        signal: data,
        to: call.from,
        myName: `${user.firstName} ${user.lastName}`,
        myId: user.id,
        myAvatar: user.avatar
      });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  // function to request the host to join a call
  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: socket.id,
        myName: `${user.firstName} ${user.lastName}`,
        myUserId: user.id,
      });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", ({ signal, myName, myId, myAvatar }) => {
      setCallAccepted(true);
      setUserName(myName);
      peer.signal(signal);
      dispatch(addContact(
        user.contactInfosId,
        myId,
        myName,
        myAvatar,
        `${user.firstName} ${user.lastName}`,
        user.avatar,
        "fromCall"
        ))
        setOtherUserId(myId)
        socket.emit("contactListUpdated")
    });

    socket.on("callRejected", () => {
      setCallAccepted(true);
      dispatch(removeMeFromParticipants(user.id)
    );
    });

    connectionRef.current = peer;
  };

  // function to leave a call
  const leaveCall = () => {
    setCallEnded(true);
    { connectionRef.ref && connectionRef.current.destroy() }
    history.push("/app/call/");
  };

  return (
    <>
      <Grid item xs>
        <Grid
          container
          spacing={1}
          justify="center"
          alignItems="stretch"
          className={classes.callPanel}
        >

        {/*The video of the User plays here once the stream is set*/}
          {stream && (
            <Grid item xs={12} md={6}>
              <Paper className={classes.Paper}>
                <Typography variant="h5" className={classes.nameOnVideo}>
                  {`${user.firstName} ${user.lastName}`}
                </Typography>
                <video
                  playsInline
                  muted
                  ref={myVideo}
                  autoPlay
                  className={classes.video}
                />
              </Paper>
            </Grid>
          )}

          {/*The video of the newly joined user plays here once the request is accepted*/}
          {callAccepted && !callEnded && (
            <Grid item xs={12} md={6}>
              <Paper className={classes.Paper}>
                <Typography variant="h5" className={classes.nameOnVideo}>
                  {call.myName || userName}
                </Typography>
                <video
                  playsInline
                  ref={userVideo}
                  autoPlay
                  className={classes.video}
                />
              </Paper>
            </Grid>
          )}

          {/*This shows the modal when the host is receiving a join equest*/}
          {call.isReceivingCall && !callAccepted && !callRejected && (
            <Dialog
              open={true}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleDisagree}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle>{"Accept or Reject join request"}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {call.myName} wants to join this call. Do you want to accept
                  this request
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDisagree} color="secondary">
                  Reject
                </Button>
                <Button onClick={handleAgree} color="primary">
                  Accept
                </Button>
              </DialogActions>
            </Dialog>
          )}

          {/*toolbar at the bottom containing all the tools available in the call*/}
          <Grid item xs={12}>
            <Paper className={classes.callBottomBar} justify="center">
            <IconButton onClick={() => {navigator.clipboard.writeText(CallList[0]._id)}}>
            <FileCopy />
          </IconButton>
              <IconButton onClick={muteUnmute}>
                {mic ? <Mic /> : <MicOff color="secondary"/>}
              </IconButton>
              <IconButton onClick={playStop}>
                {video ? <Videocam /> : <VideocamOff color="secondary"/>}
              </IconButton>
              <IconButton onClick={leaveCall} color="secondary">
                <CallEnd />
              </IconButton>
              <IconButton onClick={toggleDrawerOpen}>
                <Chat />
              </IconButton>
            </Paper>
          </Grid>
        </Grid>
      </Grid>

      {/*Chat Box Component*/}
      {drawerOpen && 
        <Grid item xs={3}>
          <ChatBox />
      </Grid>
      }

    </>
  );
};

export default LiveCall;
