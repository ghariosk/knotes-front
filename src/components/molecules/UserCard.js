import React  from 'react';
import {  Button, Image, Card} from 'semantic-ui-react'
import avatar from  '../../utilities/avatar';
import {useHistory} from 'react-router-dom'; 
import AddFriendButton from '../molecules/AddFriendButton';
import RemoveFriendButton from '../molecules/RemoveFriendButton';


var timeAgo = require('node-time-ago');


export default function UserCard ({user, onRemoveFriend})  {
    let history = useHistory()
    return(
        <Card>
            <Card.Content>
                <Image
                    size="tiny"
                    floated='right'
                    style={ !user.profile_picture_key && {backgroundColor: 'white'}}
                    src={avatar()}
                />
                <Card.Header as="a">{user.user_name}</Card.Header>
                <Card.Meta>{(user.friends && ("Friends since " + timeAgo(user.friends_since))) || "" }</Card.Meta>
                <Card.Description>

                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                {!user.friends && user.friendship_status === "NOT_FRIENDS" &&
                    <AddFriendButton user_id={user.user_id}/>
                }
                {user.friends === 1 &&   
                    <RemoveFriendButton user_id={user.user_id} friendship_id={user.friendship_id}/>
                
                }
                <Button 
                    onClick={() => history.push(`/people/${user.user_id}`)}
                    basic 
                    color="blue"
                >
                    Visit Profile
                </Button>
                
            </Card.Content>
        </Card>
    )

}