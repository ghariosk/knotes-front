import React, {useContext} from 'react';
import {Label} from 'semantic-ui-react'
import {AuthContext} from '../../flux/auth/store';

export default function ImageLabel ({user}) {

    let {auth} = useContext(AuthContext);
    let {id} = auth;
    let {user_id , friends , user_name } = user;
    const imageLabelColors = {
        "You": 'green',
        "Friend": 'blue',
        "Suggested" : 'yellow'
    }
    let who = user_id === id ? "You" : (friends? "Friend" : "Suggested")
    return (
        <Label as='a' color={imageLabelColors[who]} image>
        {id === user_id? "You" : user_name}
        {id === user_id? 
            null 
            :
            <Label.Detail>
                {friends?
                    "Friend"
                :
                    "Suggested"
                }
            </Label.Detail>
        }
        </Label>
    )
}