import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  callPanel: {
    height: "90%",
    display: "flex",
  },
  Paper: {
    display: "flex",
    position: "relative"
    //minHeight: "100%",  
  },
  callBottomBar: {
    display: "flex",
    position: "absolute",
    bottom: theme.spacing(1),
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: "33vw",
    paddingRight: "31vw"
  },
  video: {
    maxHeight: "100%",
    maxWidth: "100%",
    borderRadius: theme.shape.borderRadius
  },
  chatDrawer: {
    maxHeight: "100%"
  },
  nameOnVideo: {
      position: "absolute",
      top: "0",
      left: "0",
      backgroundColor: "white",
      opacity: ".7",
      borderRadius: "4px 0 4px 0",
      padding: "0 4px"

  },
  // root: {
  //   width: '100%',
  // },
  container: {
    maxHeight: 440,
  },
}));

export default useStyles;