import React from 'react';
import { Grid } from "@material-ui/core";

// styles
import useStyles from "./styles";

// components
import ChatContacts from '../../components/ChatComponents/ChatContacts';
import ChatBox from '../../components/ChatComponents/ChatBox';

export default function Chat() {
    var classes = useStyles();

    return (
            <Grid container spacing={1} className={classes.chatPanel}>
            <Grid item xs={3}>
                <ChatContacts />
            </Grid>
            <Grid item xs={9}>
                <ChatBox />
            </Grid>
            </Grid>

            
    )
}