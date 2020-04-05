import React, {useContext} from  'react';
import {Label} from 'semantic-ui-react';
import {NotesContext} from '../../flux/notes/store'

export default function EditNoteButton({note}) {
    let notesDispatch = useContext(NotesContext).notesDispatch;
    let editNote = (note) => {
        notesDispatch({type: "EDIT_NOTE", payload: note})
    }
    return (
        <Label color="orange" as="button" onClick={() => editNote(note)}>Edit</Label>
    )
}