
import React, { useEffect, useState, useContext } from 'react';
import { Container, Grid, Item, Header } from 'semantic-ui-react'
import {api} from '../../constants/api';
import {AuthContext} from '../../flux/auth/store';
import LoadingPage from '../molecules/LoadingPage';
import avatar from '../../utilities/avatar'
import {useHistory} from 'react-router-dom';

export default function People() {
    let {auth} = useContext(AuthContext);
    let history = useHistory();

    let [users, setUsers] = useState([]);
    let [loading,setLoading] = useState(true)

    useEffect(() => {
        // Gets the list of users that are confirmed expect the logged in user
        let getUsers = async () => {
            try {
                let url = `${api}/users`;
                let params = {
                    headers: {
                        'Authorization': `Bearer ${auth.jwt}`
                    }
                }
                let request = await fetch(url, params);
                let response = await request.json();

                if (response.status === 200) {
            
                    setUsers(response.users);

                } else {
                    throw response;
                }
            } catch (e) {
                console.log(e)
                
            }
            setLoading(false)
        }
        getUsers()
        // auth.jwt is a dependency to the hook so it is included 
    },[auth.jwt])

    if(loading) return <LoadingPage/>

    return (
        <Container>
            <br/>
            <Header>People</Header>
            <hr/>
            <Grid columns={3}>
            {/* Displays a card of users with the friendships status  */}
                {users.map((el) => {
                    return (
                        <Grid.Column key={el.id}>
                            <Item>
                                <Item.Image style={{objectFit: "cover"}} size='tiny' src={avatar(auth.id, el.id, auth.profile_picture_key, el.profile_picture_key)} />
                                <Item.Content>
                                    <Item.Header onClick={() => history.push(`/people/${el.id}`)} as='a'>{el.name}</Item.Header>
                                    
                                    <Item.Meta>
                                        {el.friendship_id && el.status === "ACCEPTED" && "Friends"}
                                    </Item.Meta>
                                </Item.Content>
                            </Item>
                        </Grid.Column>
                    )
                })}
            </Grid>
        </Container>

    )
    
}