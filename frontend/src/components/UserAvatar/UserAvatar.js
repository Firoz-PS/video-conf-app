import React from "react";

// material UI
import { useTheme } from "@material-ui/styles";
import { Typography } from "@material-ui/core";

// styles
import useStyles from "./styles";

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
