import React, { createContext, useEffect, useReducer } from 'react'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import { io } from 'socket.io-client';


const API_URL = "http://localhost:5000";
export const socket = io(API_URL);

const initialState = {
    isAuthenticated: false,
    isInitialised: false,
    user: null,
    searchResult: [],
    viewUser: []
}

const isValidToken = (accessToken) => {
    if (!accessToken) {
        return false
    }

    const decodedToken = jwtDecode(accessToken)
    const currentTime = Date.now() / 1000
    return decodedToken.exp > currentTime
}

const setToken = (accessToken) => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken)
        axios.defaults.headers = {"x-access-token" : `${accessToken}`}
    } else {
        localStorage.removeItem('accessToken')
        delete axios.defaults.headers
    }
}

const userReducer = (state, action) => {
    switch (action.type) {
        case 'USER_INIT': {
            const { isAuthenticated, user } = action.payload
            return {
                ...state,
                isAuthenticated,
                isInitialised: true,
                user,
            }
        }
        case 'USER_SIGN_IN': {
            const { user } = action.payload
            return {
                ...state,
                user,
                isAuthenticated: true,
            }
        }
        case 'USER_SIGN_UP': {
            const { user } = action.payload
            return {
                ...state,
                user,
                isAuthenticated: true,
            }
        }
        case 'SEARCH_USER': {
            const { searchResult } = action.payload
            return {
                ...state,
                searchResult
            }
        }
        case 'VIEW_USER': {
            state.viewUser = action.payload.user
            return {
                ...state,
            }
        }
        
        case 'USER_SIGN_OUT': {
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            }
        }       
        case 'UPDATE_BASIC_DETAILS': {
            const { user } = action.payload
            return {
                ...state,
                user,
            }
            
        }
        case 'UPDATE_PASSWORD': {
            return {
                ...state,
            }
        }
        case 'DELETE_ACCOUNT': {
            return {
                ...state,
            }
        }
        case 'UPDATE_AVATAR': {
            return {
                ...state,
            }
        }
        default: {
            return { ...state }
        }
    }
}

const UserContext = createContext({
    ...initialState,
    userSignIn: () => {},
    userSignOut: () => {},
    userSignUp: () => {},
    updateAvatar: () => {},
    searchUser: () => {},
    updateBasicDetails: () => {},
    ViewUserDetails: () => {},
    updatePassword: () => {},
    deleteAccount: () => {}
})

export const UserProvider = ({ children }) => {
const [state, dispatch] = useReducer(userReducer, initialState)

useEffect(() => {
    (async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken')
            if (accessToken && isValidToken(accessToken)) {
                setToken(accessToken)
                const res = await axios.get(API_URL + '/api/user/profile')
                const {user} = res.data
                dispatch({
                    type: 'USER_INIT',
                    payload: {
                        isAuthenticated: true,
                        user,
                    },
                })
            } else {
                dispatch({
                    type: 'USER_INIT',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                })
            }
        } catch (err) {
            console.error(err)
            dispatch({
                type: 'USER_INIT',
                payload: {
                    isAuthenticated: false,
                    user: null,
                },
            })
        }
    })()
}, [])

const userSignIn = async (email, password, history, setIsLoading) => {
    setIsLoading(true);
    const res = await axios.post(API_URL + '/api/user/signin', {
        email,
        password,
    })
    const { accessToken, user } = res.data
    setToken(accessToken)
    setIsLoading(false)
    dispatch({
        type: 'USER_SIGN_IN',
        payload: {
            user
        },
    })
}

const userSignUp = async (firstName, lastName, email, password, history, setIsLoading) => {
    const res = await axios.post(API_URL + '/api/user/signup', {
        firstName,
        lastName,
        email,
        password,
    })
    const { accessToken, user } = res.data
    setToken(accessToken)
    dispatch({
        type: 'USER_SIGN_UP',
        payload: {
            user,
        },
    })
    history.push('/app/call')
    return Promise.resolve();
}

const updateBasicDetails = async (values) => {
    const res = await axios.put(API_URL + '/api/user/update/BASIC', {
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNo: values.phoneNo,
        organization: values.organization,
        dateOfBirth: values.dateOfBirth
    })
    const { user } = res.data
    dispatch({
        type: 'UPDATE_BASIC_DETAILS',
        payload: {
            user,
        },
    })
    return Promise.resolve();
}

const updatePassword = async (oldPassword, newPassword) => {
    const res = await axios.put(API_URL + '/api/user/update/PASSWORD', {
        oldPassword,
        newPassword
    })
    dispatch({
        type: 'UPDATE_PASSWORD',
    })
    return Promise.resolve();
}

const deleteAccount = async (password) => {
    const res = await axios.put(API_URL + '/api/user/delete', {
        password
    })
    dispatch({
        type: 'DELETE_ACCOUNT',
    })
    return Promise.resolve();
}

const searchUser = async (searchValue, contactInfosId) => {
    const res = await axios.put(API_URL + '/api/user/search', {
        searchValue,
        contactInfosId
    })
    const { searchResult } = res.data
    dispatch({
        type: 'SEARCH_USER',
        payload: {
            searchResult
        },
    })
    return Promise.resolve();
}

const ViewUserDetails = async (userId) => {
    const res = await axios.get(API_URL + `/api/user/details/${userId}`)
        dispatch({
            type: 'VIEW_USER',
            payload: res.data
        })
    return Promise.resolve();
}

const userSignOut = async (history) => {
    const res = await axios.put(API_URL + '/api/user/signout')
    setToken(null)
    dispatch({ 
        type: 'USER_SIGN_OUT',
    })
    history.push('/login')
}

const updateAvatar = async (formData) => {
    const res = await axios.post(API_URL + '/api/user/update-avatar', formData)
    dispatch({ 
        type: 'UPDATE_AVATAR',
    })
}


return (
    <UserContext.Provider
        value={{
            ...state,
            userSignIn,
            userSignOut,
            userSignUp,
            updateAvatar,
            searchUser,
            updateBasicDetails,
            ViewUserDetails,
            updatePassword,
            deleteAccount
        }}
    >
        {children}
    </UserContext.Provider>
)
}
export default UserContext
// export {UserProvider, UserContext};
