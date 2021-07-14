import React from "react";
import {
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// components
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

// pages
import Call from "../../pages/Call/Call";
import Profile from "../../pages/Profile/Profile";
import Chat from "../../pages/Chat/Chat";
import Contacts from "../../pages/Contacts/Contacts";
import Settings from "../../pages/Settings/Settings";


// context
import { useLayoutState } from "../../context/LayoutContext";

function Layout(props) {
  var classes = useStyles();

  var layoutState = useLayoutState();

  return (
    <div className={classes.root}>
        <>
          <Header history={props.history} />
          <Sidebar />
          <div
            className={classnames(classes.content, {
              [classes.contentShift]: layoutState.isSidebarOpened,
            })}
          >
            <div className={classes.fakeToolbar} />
            <Switch>
              <Route exact path="/app/call" component={() => <Call isCallActive={false} />}/>
              <Route exact path="/app/call/:id" component={() => <Call isCallActive={true} />}/>
              <Route path="/app/profile" component={Profile}/>
              <Route path="/app/contacts" component={Contacts}/>
              <Route path="/app/chat" component={Chat}/>
              <Route path="/app/settings" component={Settings} />

            </Switch>
          </div>
        </>
    </div>
  );
}

export default withRouter(Layout);
