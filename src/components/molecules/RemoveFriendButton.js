import React, { useContext, useState} from 'react';
import {NotesContext} from '../../flux/notes/store';
import {AuthContext} from '../../flux/auth/store'

import {api} from '../../constants/api'

import {Button} from 'semantic-ui-react';

// The remove and add friend button change the state through the context 
// so they can easily be separated

export default function RemoveFriendButton(props) {
    let notesDispatch = useContext(NotesContext).notesDispatch;
    let {auth} = useContext(AuthContext);
    let [loading,setLoading]= useState(false);

    let removeFriend = async (user_id, friendship_id) => {
        notesDispatch({type: "REMOVE_FRIEND"})
        setLoading(true)
        try {
            let url = `${api}/users/friends/${user_id}/${friendship_id}`
            let params =  {
                headers: {
                    'Authorization': `Bearer ${auth.jwt}`
                },
                method: "DELETE"
            }
            let request = await fetch(url, params);
            let response = await request.json();
        
            if(response.status === 201) {
                setLoading(false);
                notesDispatch({type: "REMOVE_FRIEND_FULFILLED", payload: friendship_id})
                if (props.onSuccess) {
                    props.onSuccess(friendship_id)
                }
              
            }

        } catch(e) {
            setLoading(false);
            console.log(e);
        }
       
    }

    return (
        <Button
            onClick={() => removeFriend(props.user_id, props.friendship_id)}  
            basic 
            color='green'
            loading={loading}
        >
                Unfriend
        </Button>
    )
}