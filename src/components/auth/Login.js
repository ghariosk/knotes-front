import React, {useContext, useState} from 'react';
import { Container, Button, Form, Header, Message} from 'semantic-ui-react'
import './styles.css'
import {useHistory, Link} from 'react-router-dom';
import {AuthContext} from '../../flux/auth/store' 
import {api} from '../../constants/api'


export default function Login () {
    let history = useHistory();
    let authDispatch = useContext(AuthContext).authDispatch;
    let [submitLoading, setSubmitLoading] = useState(false);
    let defaultUser = {
        email: "",
        password: "",
    }

    let [user,setUser] = useState(defaultUser);
    let [errorMessage , setErrorMessage] = useState(false); 

    let login = async function () {
        setErrorMessage(false); 
        setSubmitLoading(true)
        let url = api + '/auth/login'
        let params =  {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }
 
        try {
            let request = await fetch(url, params);
            

            let response = await request.json();

            if (response.status === 201) {
                setSubmitLoading(false) 
                await authDispatch({type: "LOGGED_IN", payload: response})
                history.push('/');
            } else {
                throw response;
            }
            

        } catch(e) {
            setSubmitLoading(false);
            setErrorMessage(true); 
            console.log(e)
        }  
        

    }

    return(
        <Container className="knotes container-padding">
        <Button className="back" onClick={() => history.goBack()}> {"<<"} Go Back</Button>
        {history.location.state && <Header> {history.location.state.message} </Header>}
        <h1> Sign <span className="knotes">In</span></h1>
        <hr/>

        <div>
            <Form>
                <Form.Group widths='equal'>
                    <Form.Input
                        value={user.email}
                        type="email"
                        fluid 
                        label='Email' 
                        placeholder='Email'
                        onChange={(e) => {
                            setUser({
                                ...user,
                                email: e.target.value
                            })
                        }}

                    />
                </Form.Group>
                <Form.Group widths='equal'>
                    <Form.Input 
                        value={user.password}
                        type="password"
                        fluid
                        label="Password"
                        placeholder='Password'
                        onChange={(e) => {
                            setUser({
                                ...user,
                                password: e.target.value
                            })
                        }}
                    />
                   
                </Form.Group>
                <Form.Group>
                    <Link style={{color:'red'}} to="/forgot"> I forgot my password</Link>
                    {errorMessage && <Message negative> This password and email combination is invalid </Message> }
                </Form.Group>
                <br/>
                <Button 
                    onClick={login}
                    color="orange"
                    loading={submitLoading}
                >
                    Submit
                </Button>
            </Form>
        </div>
    </Container>
    )
}