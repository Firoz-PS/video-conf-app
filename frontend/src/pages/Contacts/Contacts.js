import React from "react";
import { Grid } from "@material-ui/core";

// components
import ViewContacts from "../../components/ContactsComponents/ViewContacts";
import ManageInvites from "../../components/ContactsComponents/ManageInvites";
import ViewContactDetails from "../../components/ContactsComponents/ViewContactDetails";

export default function Contacts() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <ViewContacts />
      </Grid>
      <Grid item xs={4}>
        <ManageInvites />
      </Grid>
      <Grid item xs={4}>
        <ViewContactDetails />
      </Grid>
    </Grid>
  );
}
