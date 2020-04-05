import React, { useContext, useState } from 'react';
import {NotesContext} from '../../flux/notes/store';
import {AuthContext} from '../../flux/auth/store'

import {api} from '../../constants/api'

import {Button} from 'semantic-ui-react';

// The remove and add friend button change the state through 
// the context so they can easily be separated from the parent compoent

export default function AddFriendButton(props) {
    let  notesDispatch = useContext(NotesContext).notesDispatch;
    let [loading,setLoading]= useState(false);
    let {auth} = useContext(AuthContext);

    let sendFriendRequest = async (id) => {
        setLoading(true);
        notesDispatch({type: "SEND_FRIEND_REQUEST"})
        try {
            let url = `${api}/users/friends/${id}`
            let params =  {
                headers: {
                    'Authorization': `Bearer ${auth.jwt}`
                },
                method: "POST"
            }
            let request = await fetch(url, params);
            let response = await request.json();
        
            if(response.status === 201) {
                setLoading(false);
                notesDispatch({type: "SEND_FRIEND_REQUEST_FULFILLED", payload: id})
                if(props.onSuccess) {
                    props.onSuccess(response.friendship.id);
                }
              
            }
        } catch(e) {
            console.log(e);
        } 

       

    }

    return (
        <Button
            loading={loading}
            onClick={() => sendFriendRequest(props.user_id)}  
            basic 
            color='green'
        >
                Add Friend
        </Button>
    )
}