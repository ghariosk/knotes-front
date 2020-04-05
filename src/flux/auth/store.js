import React, { createContext, useReducer } from 'react';


// This app uses the built in useContext and useReducers react hook that 
// lets you manage flux in functional components
//  here actions, context, reducer and provider are defined
//  The provider wraps around the components in which we want
//  the app state to be accessible
// The reducer updates the state based on actions which are dispatched
// inside components
//  Actions are objects with type and payload attribute

export const AuthContext = createContext();

const initialState = {
    authState: "public",
    auth: false,
    jwt: "",
    jwt_exp: ""
};

export const ADD = "";
export const LOGIN = 'LOGIN';
export const REGISTER = 'REGISTER';
export const LOGGED_IN = 'LOGGED_IN'
export const CONFIRM_SIGN_UP = 'CONFIRM_SIGN_UP'
export const SIGN_OUT = 'SIGN_OUT';
export const RESET = "RESET";
export const UPDATE_PROFILE_PICTURE = "UPDATE_PROFILE_PICTURE";

export const authReducer = (state, action) => {

  switch (action.type) {
    case LOGIN:
        return {...state, authState: "login"}
    case REGISTER:
        return {...state, authState: "register"}
    case LOGGED_IN:
        return {
            ...state,
            ...action.payload,
            authState: 'loggedin'
        }
    case UPDATE_PROFILE_PICTURE:

        return {...state, profile_picture_key: action.payload}
    case RESET: // Resets the auth context to initial state on logout
        localStorage.setItem('session', JSON.stringify(initialState) );
        return initialState;
    default:
      return state;
  }
};

export const AuthProvider = props => {
  const [auth, authDispatch] = useReducer(authReducer, initialState);
  const authData = { auth, authDispatch};

  return (
    <AuthContext.Provider value={authData}>
      {props.children}
    </AuthContext.Provider>
  );
};

