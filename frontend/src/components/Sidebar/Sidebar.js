import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

// material UI
import { Drawer, IconButton, List } from "@material-ui/core";
import {
  VideoCall as CallIcon,
  ArrowBack as ArrowBackIcon,
  Message as ChatIcon,
  Settings as SettingsIcon,
  Person as ProfileIcon,
  Contacts as ContactsIcon,
} from "@material-ui/icons";
import { useTheme } from "@material-ui/styles";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import SidebarLink from "./SidebarLink";

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";

const structure = [
  {
    id: 0,
    label: "Call",
    link: "/app/call",
    icon: <CallIcon />,
  },
  {
    id: 1,
    label: "Chat",
    link: "/app/chat",
    icon: <ChatIcon />,
  },
  {
    id: 2,
    label: "Profile",
    link: "/app/profile",
    icon: <ProfileIcon />,
  },
  {
    id: 3,
    label: "contacts",
    link: "/app/contacts",
    icon: <ContactsIcon />,
  },
  {
    id: 4,
    label: "Settings",
    link: "/app/settings",
    icon: <SettingsIcon />,
  },
  { 
    id: 5,
    type: "divider" 
  }
];

function Sidebar({ location }) {
  var classes = useStyles();
  var theme = useTheme();

  // global state
  var { isSidebarOpened } = useLayoutState();
  var layoutDispatch = useLayoutDispatch();

  // local state
  var [isPermanent, setPermanent] = useState(true);

  useEffect(function() {
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener("resize", handleWindowWidthChange);
    };
  });

  return (
    <Drawer
      variant={isPermanent ? "permanent" : "temporary"}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened,
        }),
      }}
      open={isSidebarOpened}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowBackIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          />
        </IconButton>
      </div>
      <List className={classes.sidebarList}>
        {structure.map(link => (
          <SidebarLink
            key={link.id}
            location={location}
            isSidebarOpened={isSidebarOpened}
            {...link}
          />
        ))}
      </List>
    </Drawer>
  );

  // ##################################################################
  function handleWindowWidthChange() {
    var windowWidth = window.innerWidth;
    var breakpointWidth = theme.breakpoints.values.md;
    var isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default withRouter(Sidebar);
