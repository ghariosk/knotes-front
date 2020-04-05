import React, {useContext, useState} from  'react';
import {Label, Icon,Confirm} from 'semantic-ui-react';
import {NotesContext} from '../../flux/notes/store'
import {api} from '../../constants/api';
import {AuthContext} from '../../flux/auth/store';

export default function DeleteNoteButton({id}) {
    let notesDispatch = useContext(NotesContext).notesDispatch;
    let {auth} = useContext(AuthContext);
    let [confirmOpen, setConfirmOpen] = useState(false);
    let deleteNote = async (id) => {
        notesDispatch({type: "DELETE_NOTE"})
        try {
            let url = `${api}/notes/${id}`
            let params =  {
                headers: {
                    'Authorization': `Bearer ${auth.jwt}`
                },
                method: "DELETE"
            }
            let request = await fetch(url, params);
            let response = await request.json();
            if(response.status === 201) {
                notesDispatch({type: "DELETE_NOTE_FULFILLED", payload: id})
            }
        } catch(e) {
            console.log(e);
        } 
    }
   
    return (
        <>
            <Label onClick={()=> setConfirmOpen(true)} circular as="button" color="red">
                <Icon color="black" style={{margin: 0, color: 'white'}}  name="delete"/> 
            </Label>
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={() => deleteNote(id)}
            />
        </>
    )
}