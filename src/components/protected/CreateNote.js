import React, { useEffect, useContext, useState } from 'react';
import {Divider, Label, Form,  Button, Header, Message } from 'semantic-ui-react'
import './Feed.css';
import {NotesContext} from '../../flux/notes/store';
import {AuthContext} from '../../flux/auth/store';
import avatar from '../../utilities/avatar'


import {api} from '../../constants/api';

import Modal from '../molecules/Modal';

import {options, importanceOptions, privacyOptions } from '../../utilities/notesMapping'




export default function CreateNote (props) {
    let {auth} = useContext(AuthContext);
    let {notes,notesDispatch}= useContext(NotesContext);
      
    let defaultNewNote = {
        title: "",
        content: "",
        importance: "",
        type: "",
        privacy: ""
    }

    let [newNote, setNewNote] = useState(defaultNewNote);
    let [errors, setErrors] = useState(); 

    useEffect(() => {
        let defaultNewNote = {
            title: "",
            content: "",
            importance: "",
            type: "",
            privacy: ""
        }
        if(props.edit) {
    
            setNewNote((newNote) => {
                return {
                    ...newNote,
                    ...props.note

                }        
            })
        } else  {
            setNewNote(defaultNewNote)
        }
       
    },[props.note, props.edit])

    let handleNoteChange = (e, {name, value }) => {
        setNewNote({
            ...newNote,
            [name || e.target.name]: e.target.value || value
        });
    }

    let addNote = async () => {
        setErrors();
        try {
            notesDispatch({type: "ADD_NOTE"})
            let url = `${api}/notes`
            let params =  {
                headers: {
                    'Authorization': `Bearer ${auth.jwt}`,
                    'Content-Type': "application/json"
                },
                method : "POST",
                body: JSON.stringify(newNote)
            }
            let request = await fetch(url, params);
            let response = await request.json();
            if (response.status === 201) {
                notesDispatch({type: "ADD_NOTE_FULFILLED", payload: response.body})
                setNewNote(defaultNewNote)
            } else {
                throw response;
            }
            
        } catch (e) {
            let errors = e.errors.errors.map((el) => {return el.param  })
            setErrors(errors)
        }    
        
    }
    let updateNote = async () => {
    
        notesDispatch({type: "UPDATE_NOTE"})
        let url = `${api}/notes/${newNote.id}`
        let params =  {
            headers: {
                'Authorization': `Bearer ${auth.jwt}`,
                'Content-Type': "application/json"
            },
            method : "PUT",
            body: JSON.stringify(newNote)
        }
        let request = await fetch(url, params);
        let response = await request.json();

        if(response.status === 201) {
            notesDispatch({type: "UPDATE_NOTE_FULFILLED", payload: newNote})
            setNewNote(defaultNewNote)
        } else {
            let errors = response.errors.errors.map((el) => {return el.param  })
            setErrors(errors)

        }

        

    }
    let closeModal = () => {
        notesDispatch({type: "CLOSE_MODAL"})
    }
    return (
        <Modal
            show={notes.modal}
            screenKey={0}
            onClose={props.onModalClose}
            basic
        >
            <div key={0} className="my-modal items">
                <Header as="h3"> Create Note</Header>
                <Divider/>
            <div className="item">
                    <div className="image">
                        <img alt="Profile" src={avatar()}/>
                        <Label className="image" as='a' color='blue'>
                            {auth.name}
                            <Label.Detail>You</Label.Detail>
                        </Label>
                    </div>
                    <Form>
                        <Form.Group widths="equal">
                            <Form.Input 
                                name ="title"
                                fluid placeholder='Title'
                                value={newNote.title}
                                onChange={handleNoteChange}
                            />
                            <Form.Select
                                fluid
                                name="importance"
                                options={importanceOptions}
                                placeholder='Importance'
                                value={newNote.importance}
                                onChange={handleNoteChange}
                            />
                        </Form.Group>
                        <Form.Group widths="equal">
                            <Form.Select
                                fluid
                                name="type"
                                options={options}
                                placeholder='Type'
                                value={newNote.type}
                                onChange={handleNoteChange}
                            />
                            <Form.Select
                                fluid
                                name="privacy"
                                options={privacyOptions}
                                placeholder='Privacy'
                                value={newNote.privacy}
                                onChange={handleNoteChange}
                            />
                        </Form.Group>
                        <Form.TextArea 
                            placeholder='What would you like to remember?' 
                            name="content"
                            value={newNote.content}
                            onChange={handleNoteChange}
                        />
                        {errors &&   <Message negative header="The following fields are required" list={errors} /> }
                       
                        <div className="space-between">
                            {props.edit? 
                                <Form.Button onClick={updateNote}> Update That Note</Form.Button>
                                :
                                <Form.Button onClick={addNote}>Keep That Note</Form.Button>
                            }  
                            <Button onClick={closeModal}> Close</Button>
                        </div>
                    </Form>
    
                </div>   
            </div>
      
      </Modal>

    )
}