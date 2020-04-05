import React, { createContext, useReducer } from 'react';

import { createPortal } from 'react-dom';

import CreateNote from '../../components/protected/CreateNote';

// This app uses the built in useContext and useReducers react hook that 
// lets you manage flux in functional components
//  here actions, context, reducer and provider are defined
//  The provider wraps around the components in which we want
//  the app state to be accessible
// The reducer updates the state based on actions which are dispatched
// inside components
//  Actions are objects with type and payload attribute
//  All functions present here are put in the same file for ease of management but
// should be put in different files if action number increase



export const NotesContext = createContext();

const initialState = {
    notes: [],
    loading: true,
    modal: false,
    edit: false,
    note: {}
};


export const GET_NOTES_FULFILLED = "GET_NOTES_FULFILLED";
export const GET_NOTES = "GET_NOTES";
export const ADD_NOTE = "ADD_NOTE";
export const ADD_NOTE_FULFILLED = "ADD_NOTE_FULFILLED"
export const RESET = "RESET";
export const OPEN_MODAL = "OPEN_MODAL";
export const CLOSE_MODAL = "CLOSE_MODAL";
export const DELETE_NOTE = "DELETE_NOTE";
export const DELETE_NOTE_FULFILLED = "DELETE_NOTE_FULFILLED";
export const EDIT_NOTE = "EDIT_NOTE";
export const UPDATE_NOTE = "UPDATE_NOTE";
export const UPDATE_NOTE_FULFILLED = "UPDATE_NOTE_FULFILLED";
export const SEND_FRIEND_REQUEST = "SEND_FRIEND_REQUEST";
export const SEND_FRIEND_REQUEST_FULFILLED = "SEND_FRIEND_REQUEST_FULFILLED";
export const REMOVE_FRIEND = "REMOVE_FRIEND";
export const REMOVE_FRIEND_FULFILLED = "REMOVE_FRIEND_FULFILLED";


export const notesReducer = (state, action) => {

  switch (action.type) {
    case OPEN_MODAL:
        return {...state, modal:true}
    case CLOSE_MODAL:
        return {...state, modal:false, edit:false, note: {}}
    case GET_NOTES:
        return {...state, loading: true}
    case GET_NOTES_FULFILLED:
        return {...state, notes: action.payload, loading: false}
    case ADD_NOTE:
        return {...state, loading:true}
    case ADD_NOTE_FULFILLED:

        return {...state, notes: [action.payload, ...state.notes], loading: false, modal:false}
    case DELETE_NOTE:
        return  {...state, loading: true};
    case DELETE_NOTE_FULFILLED:
        let notes = state.notes.filter((el) => {return el.id !== action.payload});

        return {...state, notes: notes, loading: false}
    case EDIT_NOTE:
        return {...state, edit:true, modal:true, note: action.payload}
    case UPDATE_NOTE:
        return {...state, loading:true};
    case UPDATE_NOTE_FULFILLED:
        // search for the note updated and update it
        let updatedNotes = state.notes
        for (var i in updatedNotes) {
            if (updatedNotes[i].id === action.payload.id) {
                updatedNotes[i] = action.payload;
            }
        }

        return {...state, notes: updatedNotes, edit: false, modal: false, loading: false, note:{}}
    case SEND_FRIEND_REQUEST_FULFILLED:
        // search for the note containing the friendship that was requested and update its status to requested
        let oldNotes = state.notes;
      
        for (var j in oldNotes) {
                if (oldNotes[j].user_id === action.payload) {
                oldNotes[j].friendship_status = "REQUESTED";
            }
        }
        return {...state, notes: oldNotes}
    case REMOVE_FRIEND:
        return {...state, loading: true};
    case REMOVE_FRIEND_FULFILLED:
        // search for the friendship that was deleted and update it
        let removedFriendNotes = state.notes;
        for (var u in removedFriendNotes) {
                if (removedFriendNotes[u].friendship_id === action.payload) {
                removedFriendNotes[u].friendship_status = "";
                removedFriendNotes[u].friends = 0;
                removedFriendNotes[u].friendship_status = "NOT_FRIENDS"
            }
        }
     
        return {...state, notes: removedFriendNotes}
    case RESET:
        return initialState;

    default:
      return state;
  }
};

export const NotesProvider = props => {
  const [notes, notesDispatch] = useReducer(notesReducer, initialState);
  const notesData = {notes, notesDispatch};

  return (
    <NotesContext.Provider value={notesData}>
      {props.children}
      {/* add the create note modal */}
      {createPortal(<CreateNote edit={notes.edit} note={notes.note} />, document.body)}
    </NotesContext.Provider>
  );
};

