import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({ 
  editIcon: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:hover" : {
        backgroundColor: theme.palette.primary.dark,
    }
  },
  hiddenInput: {
    display: "none"  
  },
  content: {
    height: "75vh",
    position: "relative"  
  },
  userDetailsCard: {
    height: "75vh",
    position: "relative",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  newChatButton: {
    position: "absolute",
    right: theme.spacing(2),
    bottom: theme.spacing(2)  
  },
  searchField: {
    marginLeft: theme.spacing(1)
  },
  searchInput: {
    display: "flex",
    width: "100%"
  },
  divider: {
    height: 30,
    marginTop: 7,
    marginBottom: 3
  } 
}));
