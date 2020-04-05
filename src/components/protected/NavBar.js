import React, {useState , useContext, useEffect}from 'react';
import {Dropdown, Menu, Button, Icon, Label, Popup, Feed, Responsive } from 'semantic-ui-react'
import {AuthContext} from '../../flux/auth/store';
import {FriendsContext} from '../../flux/friends/store';
import {NotesContext} from '../../flux/notes/store';
import {useHistory} from 'react-router-dom';

import {api} from '../../constants/api';

import AnsweredFriendRequest from '../molecules/AnsweredFriendRequest';
import FriendRequest from './FriendRequest';


export default function NavBar() {
    let {auth, authDispatch} = useContext(AuthContext) 
    let {friends, friendsDispatch} = useContext(FriendsContext);
    let notesDispatch = useContext(NotesContext).notesDispatch
    let [activeItem,setActiveItem] = useState('editorials');
    let history = useHistory();
    let logOut = async function () {
        fetch(`${api}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${auth.jwt}`
            }
        })
        authDispatch({type: "RESET"});
        notesDispatch({type: "RESET"});
        friendsDispatch({type: "RESTET"});

    }

    useEffect(()=>{
       setActiveItem(history.location.pathname)
    },[history.location.pathname])

    let FriendRequestHeader = () => (
        <Menu.Item>      
            <Icon name='users' />
                Friends
            <Label color='red' floating>
                {friends.friendRequests.count}
            </Label>
              
        </Menu.Item>
    )

    let handleItemClick = (e, { name }) =>  {
        if (activeItem !== name)  {
            setActiveItem(name)
            history.push(name)
        }    
    }

    useEffect(() => {
        let getFriendRequests = async () => {
            try {
                friendsDispatch({type: "GET_FRIEND_REQUESTS"});

                let url = `${api}/users/friends/requests`
                let params =  {
                    headers: {
                        'Authorization': `Bearer ${auth.jwt}`
                    },
                    credentials: 'include'
                }
                let request = await fetch(url, params);
                let response = await request.json();
            
                friendsDispatch({type: "GET_FRIEND_REQUESTS_FULFILLED", payload: response.body})
              
            } catch(e) {

            }
           
        }

        if(auth.jwt) {
            getFriendRequests()
        }

    },[auth.jwt,friendsDispatch])

   
    return (
        <div className="padding-nav">
            <Menu inverted color="blue">
                <Menu.Item
                    active={activeItem === "/"}
                    name="/"
                    onClick={handleItemClick}
                >
                    K-Notes
                </Menu.Item>
                <Menu.Item
                    name={`/people/${auth.id}`}
                    active={activeItem === `/people/${auth.id}`}
                    onClick={handleItemClick}
                >
                    You
                </Menu.Item>
                <Responsive 
                    minWidth={767}
                    as={Menu.Item}
                    name='/people'
                    active={activeItem === '/people'}
                    onClick={handleItemClick}
                >
                    People
                </Responsive>
                <Menu.Menu position='right'>
                    <Dropdown item icon='wrench' simple>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                name="/change-pass"
                                active={activeItem=== '/change-pass'}
                                onClick={handleItemClick}
                            >
                                Change Password
                            </Dropdown.Item>
                            <Responsive 
                                color="red"
                                name='logout'
                                maxWidth={992}
                                as={Dropdown.Item}
                            >
                            <Button size="mini" onClick={logOut} color="red">Logout</Button>    
                            </Responsive>
                        </Dropdown.Menu>
                    </Dropdown>
                
                    <Popup position='bottom right' trigger={FriendRequestHeader()} flowing hoverable>
                        <Feed>
                            {friends.friendRequests.requests.map((el) => {
                                return (
                                    el.status === "REQUESTED"?
                                        <FriendRequest 
                                            key={el.id} 
                                            request={el}
                                        />
                                    :
                                        <AnsweredFriendRequest key={el.id} request={el}/>
                                )   
                            })}

                        </Feed>
                    </Popup>
                    <Responsive 
                        color="red"
                        name='logout'
                        minWidth={992}
                        as={Menu.Item}
                    >
                        <Button onClick={logOut} color="red">Logout</Button>    
                    </Responsive>
                </Menu.Menu>
            </Menu>
        </div>
    )
}




