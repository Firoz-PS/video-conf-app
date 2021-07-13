import React from 'react';
import { Grid } from "@material-ui/core";

// components
import UpdateDetails from '../../components/ProfileComponents/UpdateDetails';
import UpdateAvatar from '../../components/ProfileComponents/UpdateAvatar';

export default function Profile() {
    return (
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <UpdateAvatar />
            </Grid>
            <Grid item xs={8}>
                <UpdateDetails />
            </Grid>
        </Grid>
            
    )
}

