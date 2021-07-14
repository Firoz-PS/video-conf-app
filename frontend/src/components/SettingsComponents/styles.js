import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({ 
  editIcon: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:hover" : {
        backgroundColor: theme.palette.primary.dark,
    }
  }
}));
