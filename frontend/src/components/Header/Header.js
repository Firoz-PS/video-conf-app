import React, { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Fab,
  Link,
  Typography,
  Badge
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  MailOutline as MailIcon,
  Person as AccountIcon,
  Search as SearchIcon,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  Settings as SettingsIcon
} from "@material-ui/icons";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import UserAvatar from "../UserAvatar/UserAvatar";

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";
// import { useUserDispatch, signOut } from "../../context/UserContext";
import UserContext from "../../context/AuthContext";

// const messages = [
//   {
//     id: 0,
//     variant: "warning",
//     name: "Jane Hew",
//     message: "Hey! How is it going?",
//     time: "9:32",
//   },
//   {
//     id: 1,
//     variant: "success",
//     name: "Lloyd Brown",
//     message: "Check out my new Dashboard",
//     time: "9:18",
//   },
//   {
//     id: 2,
//     variant: "primary",
//     name: "Mark Winstein",
//     message: "I want rearrange the appointment",
//     time: "9:15",
//   },
//   {
//     id: 3,
//     variant: "secondary",
//     name: "Liana Dutti",
//     message: "Good news from sale department",
//     time: "9:09",
//   },
// ];

export default function Header(props) {
  var classes = useStyles();

  // global
  var layoutState = useLayoutState();
  var layoutDispatch = useLayoutDispatch();
  // var userDispatch = useUserDispatch();
  const { userSignOut, user } = useContext(UserContext);

  // local
  var [mailMenu, setMailMenu] = useState(null);
  var [isMailsUnread, setIsMailsUnread] = useState(true);
  var [profileMenu, setProfileMenu] = useState(null);
  var [isSearchOpen, setSearchOpen] = useState(false);

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          color="inherit"
          onClick={() => toggleSidebar(layoutDispatch)}
          className={classNames(
            classes.headerMenuButtonSandwich,
            classes.headerMenuButtonCollapse,
          )}
        >
          {layoutState.isSidebarOpened ? (
            <ArrowBackIcon
              classes={{
                root: classNames(
                  classes.headerIcon,
                  classes.headerIconCollapse,
                ),
              }}
            />
          ) : (
            <MenuIcon
              classes={{
                root: classNames(
                  classes.headerIcon,
                  classes.headerIconCollapse,
                ),
              }}
            />
          )}
        </IconButton>
        <Typography variant="h6" weight="medium" className={classes.logotype}>
          Teams Clone
        </Typography>
        <div className={classes.grow} />
        <IconButton
          aria-haspopup="true"
          color="inherit"
          className={classes.headerMenuButton}
          aria-controls="profile-menu"
          onClick={(e) => setProfileMenu(e.currentTarget)}
        >
          <AccountIcon classes={{ root: classes.headerIcon }} />
        </IconButton>
        <Menu
          id="profile-menu"
          open={Boolean(profileMenu)}
          anchorEl={profileMenu}
          onClose={() => setProfileMenu(null)}
          className={classes.headerMenu}
          classes={{ paper: classes.profileMenu }}
          disableAutoFocusItem
        >
          <div className={classes.profileMenuUser}>
            <Typography variant="h4" weight="medium">
              {`${user.firstName} ${user.lastName}`}
            </Typography>
          </div>
          <MenuItem
            to="/app/profile"
            className={classNames(
              classes.profileMenuItem,
              classes.headerMenuItem,
            )}
          >
            <AccountIcon className={classes.profileMenuIcon} /> Profile
          </MenuItem>
          <MenuItem
          to="/app/settings"
          className={classNames(
            classes.profileMenuItem,
            classes.headerMenuItem,
          )}
        >
          <SettingsIcon className={classes.profileMenuIcon} /> Settings
        </MenuItem>
          <div className={classes.profileMenuUser}>
            <Typography
              className={classes.profileMenuLink}
              color="primary"
              onClick={() => userSignOut(props.history)}
            >
              Sign Out
            </Typography>
          </div>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
