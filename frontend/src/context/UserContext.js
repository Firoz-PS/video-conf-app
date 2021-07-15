import React, { createContext, useEffect, useReducer } from "react";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { io } from "socket.io-client";
import { API_URL } from "../config/config";

// exporting socket connection
export const socket = io(API_URL);

const initialState = {
  isAuthenticated: false,
  isInitialised: false,
  user: null,
  searchResult: [],
  viewUser: [],
};

// function to whether the token has expired or not
const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }

  const decodedToken = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp > currentTime;
};

// function to save the token to local storage
const setToken = (accessToken) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    axios.defaults.headers = { "x-access-token": `${accessToken}` };
  } else {
    localStorage.removeItem("accessToken");
    delete axios.defaults.headers;
  }
};

// reducers
const userReducer = (state, action) => {
  switch (action.type) {
    case "USER_INIT": {
      const { isAuthenticated, user } = action.payload;
      return {
        ...state,
        isAuthenticated,
        isInitialised: true,
        user,
      };
    }
    case "USER_SIGN_IN": {
      const { user } = action.payload;
      return {
        ...state,
        user,
        isAuthenticated: true,
      };
    }
    case "USER_SIGN_UP": {
      const { user } = action.payload;
      return {
        ...state,
        user,
        isAuthenticated: true,
      };
    }
    case "SEARCH_USER": {
      const { searchResult } = action.payload;
      return {
        ...state,
        searchResult,
      };
    }
    case "VIEW_USER": {
      state.viewUser = action.payload.user;
      return {
        ...state,
      };
    }

    case "USER_SIGN_OUT": {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    }
    case "UPDATE_BASIC_DETAILS": {
      const { user } = action.payload;
      return {
        ...state,
        user,
      };
    }
    case "UPDATE_PASSWORD": {
      return {
        ...state,
      };
    }
    case "DELETE_ACCOUNT": {
      return {
        ...state,
      };
    }
    default: {
      return { ...state };
    }
  }
};

const UserContext = createContext({
  ...initialState,
  userSignIn: () => {},
  userSignOut: () => {},
  userSignUp: () => {},
  searchUser: () => {},
  updateBasicDetails: () => {},
  ViewUserDetails: () => {},
  updatePassword: () => {},
  deleteAccount: () => {},
});

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    (async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");
        if (accessToken && isValidToken(accessToken)) {
          setToken(accessToken);
          const res = await axios.get(API_URL + "/api/user/profile");
          const { user } = res.data;
          dispatch({
            type: "USER_INIT",
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: "USER_INIT",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: "USER_INIT",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    })();
  }, []);

  // function to signIn the user
  const userSignIn = async (email, password) => {
    const res = await axios.post(API_URL + "/api/user/signin", {
      email,
      password,
    });
    const { accessToken, user } = res.data;
    setToken(accessToken);
    dispatch({
      type: "USER_SIGN_IN",
      payload: {
        user,
      },
    });
  };

  // function to signUp the user
  const userSignUp = async (firstName, lastName, email, password, history) => {
    const res = await axios.post(API_URL + "/api/user/signup", {
      firstName,
      lastName,
      email,
      password,
    });
    const { accessToken, user } = res.data;
    setToken(accessToken);
    dispatch({
      type: "USER_SIGN_UP",
      payload: {
        user,
      },
    });
    history.push("/app/call");
    return Promise.resolve();
  };

  // function to update basic user details
  const updateBasicDetails = async (values) => {
    const res = await axios.put(API_URL + "/api/user/update/BASIC", {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNo: values.phoneNo,
      organization: values.organization,
      dateOfBirth: values.dateOfBirth,
    });
    const { user } = res.data;
    dispatch({
      type: "UPDATE_BASIC_DETAILS",
      payload: {
        user,
      },
    });
    return Promise.resolve();
  };

  // function to update password
  const updatePassword = async (oldPassword, newPassword) => {
    const res = await axios.put(API_URL + "/api/user/update/PASSWORD", {
      oldPassword,
      newPassword,
    });
    dispatch({
      type: "UPDATE_PASSWORD",
    });
    return Promise.resolve();
  };

  // function to delte user account
  const deleteAccount = async (password) => {
    const res = await axios.put(API_URL + "/api/user/delete", {
      password,
    });
    dispatch({
      type: "DELETE_ACCOUNT",
    });
    return Promise.resolve();
  };

  // function to search for a user based on email ID
  const searchUser = async (searchValue, contactInfosId) => {
    const res = await axios.put(API_URL + "/api/user/search", {
      searchValue,
      contactInfosId,
    });
    const { searchResult } = res.data;
    dispatch({
      type: "SEARCH_USER",
      payload: {
        searchResult,
      },
    });
    return Promise.resolve();
  };

  // function to view user details
  const ViewUserDetails = async (userId) => {
    const res = await axios.get(API_URL + `/api/user/details/${userId}`);
    dispatch({
      type: "VIEW_USER",
      payload: res.data,
    });
    return Promise.resolve();
  };

  // function to signOut a user
  const userSignOut = async (history) => {
    const res = await axios.put(API_URL + "/api/user/signout");
    setToken(null);
    dispatch({
      type: "USER_SIGN_OUT",
    });
    history.push("/login");
  };

  return (
    <UserContext.Provider
      value={{
        ...state,
        userSignIn,
        userSignOut,
        userSignUp,
        searchUser,
        updateBasicDetails,
        ViewUserDetails,
        updatePassword,
        deleteAccount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export default UserContext;
