import React from 'react';
import { Grid } from "@material-ui/core";

// components
import ChangePassword from '../../components/SettingsComponents/ChangePassword';
import DeleteAccount from '../../components/SettingsComponents/DeleteAccount';


export default function Settings() {
    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <ChangePassword />
            </Grid>
            <Grid item xs={6}>
                <DeleteAccount />
            </Grid>
        </Grid>
            
    )
}

