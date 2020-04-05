import React, {useContext} from 'react';
import {Feed} from 'semantic-ui-react';
import timeAgo from 'node-time-ago';
import {AuthContext} from '../../flux/auth/store.js';
import avatar from '../../utilities/avatar'
export default function AnsweredFriendRequest({request}) {
    let {auth} = useContext(AuthContext);
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
                    <Feed.User>{request.name}</Feed.User>'s request has been {request.status.toLowerCase()}
                    <Feed.Date>{timeAgo(request.created_at)}</Feed.Date>
                </Feed.Summary>
            </Feed.Content>
        </Feed.Event>
    )

}