import React, { createContext, useReducer } from 'react';



// This app uses the built in useContext and useReducers react hook that 
// lets you manage flux in functional components
//  here actions, context, reducer and provider are defined
//  The provider wraps around the components in which we want
//  the app state to be accessible
// The reducer updates the state based on actions which are dispatched
// inside components
//  Actions are objects with type and payload attribute


export const FriendsContext = createContext();

const initialState = {
    friends: [],
    friendRequests: {
        requests: [],
        count: 0
    },
    loading: true,
};


// Actions types for the friends reducer
// Actions and actions fulfilled are both preset here but only the fulfilled action performs a state update
// further improvements could make the actions also perform a state update to show loading
export const GET_FRIENDS_FULFILLED = "GET_FRIENDS_FULFILLED";
export const GET_FRIENDS = "GET_FRIENDS";
export const ADD_FRIEND = "ADD_FRIEND";
export const ADD_FRIEND_FULFILLED = "ADD_FRIEND_FULFILLED"
export const RESET = "RESET";
export const GET_FRIEND_REQUESTS = "GET_FRIEND_REQUESTS";
export const GET_FRIEND_REQUESTS_FULFILLED = "GET_FRIEND_REQUESTS_FULFILLED";
export const UPDATE_FRIEND_REQUEST = 'UPDATE_FRIEND_REQUEST';
export const UPDATE_FRIEND_REQUEST_FULFILLED = "UPDATE_FRIEND_REQUEST_FULFILLED";



export const friendsReducer = (state, action) => {

  switch (action.type) {
    case GET_FRIENDS:
        return {...state, loading: true}
    case GET_FRIENDS_FULFILLED:
        return {...state, friends: action.payload, loading: false}
    case GET_FRIEND_REQUESTS:
        return {...state, loading:true}
    case GET_FRIEND_REQUESTS_FULFILLED:
        // Gets all requested friendships
        return {...state, friendRequests: {count: action.payload.count, requests: action.payload.requests}, loading: false}; 
    case UPDATE_FRIEND_REQUEST:
        return {...state, loading: true};
    case UPDATE_FRIEND_REQUEST_FULFILLED:
      // Change the status upon success
      let friendRequests = state.friendRequests.requests;
      let count = state.friendRequests.count -1;
      // Search for the friend request and update its status
      for (var i in friendRequests) {
        if (friendRequests[i].id === action.payload.id) {
           friendRequests[i].status = action.payload.status;
           break; //Stop this loop, we found it!
        }
      }
      return {
        ...state,
        friendRequests: {
          requests: 
          [...friendRequests],
          count: count
        },
        loading: false
      }
    case RESET:
        return initialState;
    default:
      return state;
  }
};



 

export const FriendsProvider = props => {
  const [friends, friendsDispatch] = useReducer(friendsReducer, initialState);
  const friendsData = {friends, friendsDispatch};

  return (
    <FriendsContext.Provider value={friendsData}>
      {props.children}
    </FriendsContext.Provider>
  );
};

// export const useToastContext = () => {
//   return useContext(ToastContext);
// };