import React, {useContext} from 'react';
import {Feed, Button} from 'semantic-ui-react';
import timeAgo from 'node-time-ago';
import {AuthContext} from '../../flux/auth/store.js';
import {FriendsContext} from '../../flux/friends/store.js'
import avatar from '../../utilities/avatar'
import {useHistory} from 'react-router-dom';
import {api} from '../../constants/api';

export default function FriendRequest ({request}) {
    let friendsDispatch = useContext(FriendsContext).friendsDispatch;
    let {auth} = useContext(AuthContext);
    let acceptFriendRequest = async (friend_id, id) => {
        await updateFriendRequest(friend_id, id, "PUT", "ACCEPTED");

    }

    let denyFriendRequest =  async (friend_id, id) => {
       await updateFriendRequest(friend_id, id, "DELETE", "DENIED")

    }

    let updateFriendRequest = async (friend_id, id, method, status) => {
        try {
            friendsDispatch({type: "UPDATE_FRIEND_REQUEST"});
            let url = `${api}/users/friends/${friend_id}/requests/${id}`
            let params =  {
                headers: {
                    'Authorization': `Bearer ${auth.jwt}`
                },
                method: method
            }
            let request = await fetch(url, params);
            if(request.ok) {
                friendsDispatch({type: "UPDATE_FRIEND_REQUEST_FULFILLED", payload:{id: id, status: status}})
            }             

        } catch(e) {
            console.log(e);
        }
     
    }

    let history = useHistory();

   
    return(
        <Feed.Event key={request.id}>
            <Feed.Label>
                <img alt="Profile" 
                    style={{ objectFit: 'cover', width:40, height:40}} 
                    src={avatar(auth.id, request.id, auth.profile_picture_key, request.profile_picture_key)} 
                />
            </Feed.Label>
            <Feed.Content>
                <Feed.Summary>
                    <Feed.User onClick={() => history.push(`/users/${request.id}`)}>{request.name} </Feed.User> sent you a friend request
                    <Feed.Date>{timeAgo(request.created_at)}</Feed.Date>
                </Feed.Summary>
                <Button
                    onClick={()=> acceptFriendRequest(request.user_id, request.id)}
                > 
                    Accept
                </Button> 
                <Button
                    onClick={()=> denyFriendRequest(request.user_id, request.id)}
                > 
                    Deny
                </Button>
            </Feed.Content>
        </Feed.Event>
    )

}
