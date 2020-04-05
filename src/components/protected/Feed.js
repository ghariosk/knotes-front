import React, { useEffect, useContext, useState } from 'react';
import { Item, Container,Divider, Label, Menu ,Dropdown, Button, Header, Image,Icon, Popup , Responsive } from 'semantic-ui-react'
import './Feed.css';
import {NotesContext} from '../../flux/notes/store';
import {AuthContext} from '../../flux/auth/store';


import avatar from '../../utilities/avatar';

import {api} from '../../constants/api';

import UserCard from '../molecules/UserCard';
import ImageLabel from '../molecules/ImageLabel';

import timeAgo from 'node-time-ago';
import LoadingPage from '../molecules/LoadingPage';

import EditNoteButton from '../molecules/EditNoteButton';
import DeleteNoteButton from '../molecules/DeleteNoteButton';
import {options, importanceOptions, importanceMapping, colors} from '../../utilities/notesMapping';





export default function Feed() {
    let {notes, notesDispatch} = useContext(NotesContext);
    let {auth} = useContext(AuthContext);

    let [ loading, setLoading] = useState(true)
    let [activeItem, setActiveItem] = useState("all");
    let [filteredNotes, setFilteredNotes] = useState([]);
    let [typeFilter, setTypeFilter] = useState("");
    let [importanceFilter, setImportanceFilter] = useState("");
    let [searchTerm , setSearchTerm] = useState("");
    let [dateFilter,setDateFilter] = useState(false);
 
    useEffect(() => {
        let getNotes = async () => {
            try {
                let url = `${api}/notes`
                let params =  {
                    headers: {
                        'Authorization': `Bearer ${auth.jwt}`
                    },
                    credentials: 'include'
                }
                let request = await fetch(url, params);
                let response = await request.json();
                if (response.status === 200) {
                    setFilteredNotes(response.body)
                    notesDispatch({type: "GET_NOTES_FULFILLED", payload: response.body})
                    setLoading(false);
                } 
            } catch(e) {
                console.log(e);
            }
            
        }
        if (auth.jwt) {
            getNotes()
        } 
    },[auth.jwt,notesDispatch])




    useEffect(() => {
        let filterNotes = async () => {
            let filter = notes.notes
                .filter((el) => {
                    return typeFilter? (el.type === typeFilter)  : true
                })
                .filter((el) => {
                    return importanceFilter? (el.importance === importanceFilter) : true
                })
                .filter((el) => {
                    return (
                        activeItem === "all"? 
                            true : 
                            (activeItem === "friends"? 
                                auth.id !== el.user_id : 
                                    ( activeItem === "me"? auth.id === el.user_id : true)
                            ) 
                    )
    
                })
                .filter((el) => {
                    let string = `${el.title.toUpperCase()} ${el.content.toUpperCase()}`
                    return string.indexOf(searchTerm.toUpperCase()) !== -1
                })
                .sort((a,b) => {
              
                    return dateFilter? new Date (a.created_at) - new Date(b.created_at) : new Date (b.created_at) - new Date(a.created_at) 
                })

            setFilteredNotes(filter)
        }

        filterNotes()
    },[typeFilter, importanceFilter, activeItem, searchTerm, auth.id, notes,dateFilter])

    let handleFilterClick = (e, {name}) => {
        setActiveItem(name)
    }

    let openNoteModal = () => {
        notesDispatch({type: "OPEN_MODAL"})
    }


    if(loading) return <LoadingPage/>

    return (
        <Container>
            <br/>
            <Responsive
                as={"div"}
                className="space-between"
            >
                <Header as='h2'>
                    <Image style={{width: 100, height: 100}} circular src={avatar(auth.id, auth.id, auth.profile_picture_key, auth.profile_picture_key)} /> 
                    Hi {auth.name}!
                </Header>
                <Button onClick={openNoteModal}>Create a note </Button>
            </Responsive>
            <div>
                <Responsive as={Menu} minWidth={767} pointing secondary>
                    <Menu.Item
                        header
                        name='sort by'
                    />
                    <Menu.Item
                        name='all'
                        active={activeItem === 'all'}
                        onClick={handleFilterClick}
                    />
                    <Menu.Item
                        name='friends'
                        active={activeItem === 'friends'}
                        onClick={handleFilterClick}
                    />
                    <Menu.Item
                        name='me'
                        active={activeItem === 'me'}
                        onClick={handleFilterClick}
                    />
                    <Dropdown
                        placeholder='Type'
                        clearable
                        item
                        value={typeFilter}
                        onChange={(e,{value}) => {e.type === "click" && setTypeFilter(value)}}
                        options={options}
                    />
                    <Dropdown
                        placeholder='Importance'
                        clearable
                        item
                        value={importanceFilter}
                        options={importanceOptions}
                        onChange={(e,{value}) => {e.type === "click" && setImportanceFilter(value)}}
                    />
                     <Menu.Item
                            name='date'
                            active={activeItem === 'video camera'}
                            onClick={() => setDateFilter(!dateFilter)}
                    >      
                        Date &nbsp;
                        <Icon name={`arrow ${dateFilter? "down" : "up"}`} />
                       
                        
                    </Menu.Item>
                    <Menu.Menu position='right'>
                        <div className='ui right aligned category search item'>
                            <div className='ui transparent icon input'>
                                <input
                                    value={searchTerm}
                                    className='prompt'
                                    type='text'
                                    placeholder='Search Notes'
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <i className='search link icon' />
                            </div>

                        </div>
                    </Menu.Menu>
                </Responsive>
            </div>
            <div className="items">
                {filteredNotes.map(e => {
                    const ProfileImage = () => (
                        <div className="image">
                                <img style={ !e.profile_picture_key && {backgroundColor: 'grey'}} alt="Profile" src={avatar(auth.id,e.user_id, auth.profile_picture_key, e.user_profile)}/>
                                <ImageLabel user={e}/>
                        </div>
                    )
                return( 
                        <div key={e.id}  className={`item ${colors[e.type]}`}>
                            {e.user_id === auth.id?
                                ProfileImage()
                            :
                                <Popup
                                    flowing 
                                    hoverable
                                    trigger={ProfileImage()}
                                    content={
                                        <UserCard
                                            user={e}/>
                                    }
                                    position='left center'
                                />
                            }
                            <Item.Content>
                                <div className="space-between">
                                    <div>
                                         <h3 style={{margin: 0}}> {e.title} </h3>
                                        <small> {timeAgo(e.created_at)} {e.create} </small>
                                    </div>
                                    <div>
                                        {e.user_id === auth.id && 
                                            <>  
                                             
                                                <EditNoteButton note={e}/>
                                                <DeleteNoteButton id={e.id}/>
                                            </>
                                        }
                                        <Label color={importanceMapping[e.importance].color} className="category"> {importanceMapping[e.importance].label} </Label>
                                        {e.privacy === "private" &&   <Icon name="lock"/>}
                                    </div>
                                </div>
                                <Divider fitted/>
                                <Item.Description className="it-ct-clr">{e.content}</Item.Description>
                            </Item.Content>
                        </div>
                    )
                })}
            </div>
        </Container>
    )
}









