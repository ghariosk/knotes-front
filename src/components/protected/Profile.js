import React, { useEffect, useContext, useRef, useState } from 'react';
import {useParams} from 'react-router-dom';

import {Card, Container, Feed, Grid, Header, Segment, Label , Divider, Image, Icon, Responsive} from 'semantic-ui-react';
import {AuthContext} from '../../flux/auth/store'

import {useHistory} from 'react-router-dom';
import {api} from '../../constants/api'; 
import getAvatar from '../../utilities/avatar'

import LoadingPage from '../molecules/LoadingPage';
import {importanceMapping, colors} from '../../utilities/notesMapping'

import timeAgo from 'node-time-ago'
import { NotesContext } from '../../flux/notes/store';

import AddFriendButton from '../molecules/AddFriendButton';
import RemoveFriendButton from '../molecules/RemoveFriendButton';
import EditNoteButton from '../molecules/EditNoteButton';
import DeleteNoteButton from '../molecules/DeleteNoteButton';


export default function Profile() {
    let {id} = useParams();
    let {auth, authDispatch} = useContext(AuthContext);
    let [avatar, setAvatar] = useState()
    let [loading , setLoading] = useState(true);
    let [activity, setActivity] = useState([]);
    let [profile, setProfile] = useState([]);
    let [userNotes, setUserNotes] = useState([]);
    let history = useHistory();
    let {notes,notesDispatch} = useContext(NotesContext);

    const inputRef = useRef();
  
    useEffect(() => {
        let newAvatar = getAvatar(auth.id, id, auth.profile_picture_key, profile.profile_picture_key)
        setAvatar(newAvatar);

    },[auth,id, profile])

    let fileInputClick = () => {
        if (auth.id === id) {
            inputRef.current.click()
        }   
    }

    useEffect(() => {
        setUserNotes(notes.notes);
    },[notes])

    let handleFileChange = async (e) => {
      
        let file = e.target.files[0];
        const data = new FormData() 
        data.append('file', file);

        let url = `${api}/users/avatar`


        let params =  {
            headers: {
                'Authorization': `Bearer ${auth.jwt}`
            },
            method : "PUT",
            body: data,
        }

        let request = await fetch(url, params);
        let response = await request.json();

        if(response.status === 201) {
         
            authDispatch({type: "UPDATE_PROFILE_PICTURE" , payload: response.key})

        }
    }

    useEffect(() => {
        let getProfile = async () => {
            try {
                let url = `${api}/users/${id}`;
                let params = {
                    headers: {
                        'Authorization': `Bearer ${auth.jwt}`
                    }
    
                }
                let request = await fetch(url,params);
                let response = await request.json();
               
                if (request.status === 200) {
            
                    setActivity(response.activity)
                    setProfile(response.profile)
                    await notesDispatch({type: "GET_NOTES_FULFILLED", payload: response.notes})
                    setLoading(false)
                    
                } else {
                    console.log(response)
                }
            } catch(e) {
                console.log(e)
            }
        }

        if(id) {
            getProfile()
        }
       
    },[id,auth.jwt, notesDispatch])


    let addNote = () => {
        notesDispatch({type: "OPEN_MODAL"});
    }

    if(loading) return <LoadingPage/>

    return (
        <Container>
            <br/>
            <Grid columns={2} divided>
                <Grid.Row>
                    <Grid.Column mobile={16} computer={4}>
                            <Card
                                key={0}
                                onClick={fileInputClick}
                            >
                                <Image src={avatar} wrapped ui={false} />
                                <Card.Content>
                                    <Card.Header>{auth.id === profile.id? "You" : profile.name}</Card.Header>
                                    {profile.friendship_id  && profile.status === "ACCEPTED" &&   <Card.Description> Friends </Card.Description>}
                                </Card.Content>
                              
                                {!profile.friendship_id && profile.id !== auth.id  &&
                                    <Card.Content extra> 
                                        <AddFriendButton 
                                            user_id={profile.id}
                                            onSuccess={(id)=> {
                                                setProfile({
                                                    ...profile,
                                                    friendship_id: id,
                                                    status: "REQUESTED"
                                                })
                                            }}
                                        />
                                    </Card.Content>
                                }
                                {profile.friendship_id  && profile.status === "ACCEPTED" &&  
                                    <Card.Content extra> 
                                        <RemoveFriendButton 
                                            user_id={profile.id} 
                                            friendship_id={profile.friendship_id}
                                            onSuccess={(id)=> {
                                                setProfile({
                                                    ...profile,
                                                    friendship_id: "",
                                                    status: ""
                                                })
                                            }}
                                        />
                                    </Card.Content>
                                
                                }
                                {profile.friendship_id  && profile.status === "REQUESTED" &&  
                                    <Card.Content extra> 
                                        Friendship Requested
                                    </Card.Content> 
                                }
                            </Card>   
                            {/* Hidden file input for profile picture upload */}
                            {id === auth.id && <input key={1} style={{display: 'none'}} onChange={handleFileChange} accept="image/*"  type="file" ref={inputRef} /> }
                    </Grid.Column>
                
                    
                    <Grid.Column mobile={16} computer={8}>
                        <Responsive maxWidth={767} as="br"/>
                        <Header size='small'>Activity</Header>
                        <Feed>
                            {activity.length?
                                activity.map((el,index) => {
                                    if (el.type === "friendship") {
                                        return (
                                            <Feed.Event key={index}>
                                            <Feed.Content>
                                                    <Feed.Summary><Feed.User> {auth.id === profile.id? "You" : profile.name}</Feed.User> became friend with <Feed.User onClick={()=> history.push(`/people/${el.id}`)}>
                                                        {auth.id === el.id ? "You" : el.content}
                                                    </Feed.User>
                                                    <Feed.Date>{timeAgo(el.date)}</Feed.Date>
                                                </Feed.Summary>
                                            </Feed.Content>
                                            </Feed.Event>
                                        )

                                    } else  {
                                        return(
                                            <Feed.Event key={index}>
                                            <Feed.Content>
                                                <Feed.Summary>
                                                <Feed.User>{auth.id === profile.id? "You" : profile.name}</Feed.User> wrote a note titled {el.content}
                                                <Feed.Date>{timeAgo(el.date)}</Feed.Date>
                                                </Feed.Summary>
                                            </Feed.Content>
                                            </Feed.Event>
                                        )
                                    }   
                                })
                            :
                            <p> No activity</p>
                            }
                        </Feed>
                    </Grid.Column>
                </Grid.Row>
            </Grid>    
            <Divider horizontal>
                Notes &nbsp;
                {id === auth.id &&
                    
                    <Label onClick={addNote} circular as="button" color="green" basic>
                        <Icon style={{margin: 0}}  name="add"/> 
                    </Label>

                }
            </Divider>
            {userNotes.length?
                userNotes.map((el) => {
                    return (
                        <div key={el.id}>
                            <div key={el.id}>
                                <Header color={colors[el.type]} as='h2' attached='top'>
                                    {/* This had to be inline or else there would be no space between the components */}
                                    {el.title} <Label> {el.type} </Label> <Label> {el.privacy} </Label> <Label> {importanceMapping[el.importance].label}</Label>
                                    {profile.id === auth.id &&  
                                        <>
                                            <DeleteNoteButton id={el.id}/>
                                            <EditNoteButton note={el}/>
                                        </>
                                    }
                                    <br/>
                                    <small>{timeAgo(el.created_at)} </small>
                                </Header>
                                <Segment attached>
                                    {el.content}
                                </Segment>
                            </div>
                            <br/>
                        </div>

                    )
                })
                : 
                    <p> No notes to display</p>
            }    
        </Container>
       
    )
}