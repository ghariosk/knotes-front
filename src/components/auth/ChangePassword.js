import React, {useContext, useState} from 'react';
import { Container, Button, Form, Message} from 'semantic-ui-react'
import './styles.css'
import {useHistory} from 'react-router-dom';
import {AuthContext} from '../../flux/auth/store' 
import {api} from '../../constants/api'


export default function ChangePassword () {
    let history = useHistory();
    let {auth} = useContext(AuthContext);

    let [submitLoading, setSubmitLoading] = useState(false);
    let defaultUser = {
        password: "",
        new_password: "",
        confirm_new_password: ""

    }

    let [user,setUser] = useState(defaultUser);
    let [errorMessage , setErrorMessage] = useState(false);

    let changePassword = async () => {
        setErrorMessage(false); 
        setSubmitLoading(true)
        let url = `${api}/auth/change-pass`
        let params =  {
            method: "POST",
            body: JSON.stringify({
                ...user,
                email: auth.email
            }),

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.jwt}`
            },
        }
        try {
            let request = await fetch(url, params);      

            let response = await request.json();

            if (response.status === 201) {
                setSubmitLoading(false) 
                history.push('/')
    
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
        <h1> Change <span className="knotes"> your password </span></h1>
        <hr/>

        <div>
            <Form>
                <Form.Group widths='equal'>
                    <Form.Input

                        value={user.password}
                        type="password"
                        fluid 
                        label='Current Password' 
                        placeholder='Password'
                        onChange={(e) => {
                            setUser({
                                ...user,
                                password: e.target.value
                            })
                        }}

                    />
                </Form.Group>
                <Form.Group widths='equal'>
                    <Form.Input
                        value={user.new_password}
                        type="password"
                        fluid
                        label="Your new password"
                        placeholder="Your new password"
                        onChange={(e) => {
                            setUser({
                                ...user,
                                new_password: e.target.value
                            })
                        }}
                    />
                   
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Input
                        value={user.confirm_new_password}
                        type="password"
                        fluid
                        label="Your new password"
                        placeholder="Your new password"
                        onChange={(e) => {
                            setUser({
                                ...user,
                                confirm_new_password: e.target.value
                            })
                        }}
                    /> 
                </Form.Group>
               
                <Form.Group>
                    {errorMessage && <Message negative> The passwords don't match </Message> }
                </Form.Group>
                <br/>
         
                <Button 
                    onClick={changePassword}
                    color="orange"
                    loading={submitLoading}
                >
                    Change
                </Button>
    
              
              
            </Form>
        </div>
    </Container>
    )
}