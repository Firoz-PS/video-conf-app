import React from "react";
import { Grid } from "@material-ui/core";

// components
import LiveCall from "../../components/CallComponents/LiveCall";
import CallStarter from "../../components/CallComponents/StartOrJoinCall";

const Call = ({ isCallActive }) => {
  return (
    <Grid container spacing={2}>
      {isCallActive && <LiveCall />}
      {!isCallActive && (
        <>
          <CallStarter />
        </>
      )}
    </Grid>
  );
};

export default Call;
