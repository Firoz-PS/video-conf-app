import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline } from "@material-ui/core";
import { LayoutProvider } from "./context/LayoutContext";
import { UserProvider } from "./context/AuthContext";
import Themes from "./themes";
import App from "./App";
import { Store } from "./redux/Store";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";

ReactDOM.render(
  <SnackbarProvider maxSnack={3}>
    <UserProvider>
      <LayoutProvider>
        <ThemeProvider theme={Themes.default}>
          <Provider store={Store}>
            <CssBaseline />
            <App />
          </Provider>
        </ThemeProvider>
      </LayoutProvider>
    </UserProvider>
  </SnackbarProvider>,
  document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
