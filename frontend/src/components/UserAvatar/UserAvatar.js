import React from "react";
import { useTheme } from "@material-ui/styles";

// styles
import useStyles from "./styles";
import { Typography } from "@material-ui/core";

// components

export default function UserAvatar({ color = "primary", ...props }) {
  var classes = useStyles();
  var theme = useTheme();

  var letters = props.name
    .split(" ")
    .map(word => word[0])
    .join("");

  return (
    <div
      className={classes.avatar}
      style={{ backgroundColor: theme.palette.secondary.dark, width: props.size, height: props.size }}
    >
      <Typography className={classes.text}>{letters}</Typography>
    </div>
  );
}
