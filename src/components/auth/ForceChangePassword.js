import React, {useContext, useState} from 'react';
import { Container, Button, Form,Message} from 'semantic-ui-react'
import './styles.css'
import {useHistory} from 'react-router-dom';
import {AuthContext} from '../../flux/auth/store' 
import {api} from '../../constants/api'


export default function ForceChangePassword () {
    let history = useHistory();
    let {auth} = useContext(AuthContext);

    let [submitLoading, setSubmitLoading] = useState(false);
    let defaultUser = {
        password: "",
        confirm_password: "",

    }

    let [user,setUser] = useState(defaultUser);
    let [errorMessage , setErrorMessage] = useState(false);

    let changePassword = async () => {
        setErrorMessage(false); 
        setSubmitLoading(true)
        let url = `${api}/auth/otp/change-pass`
        let params =  {
            method: "POST",
            body: JSON.stringify({
                ...user
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
        <h1> You must <span className="knotes">change </span> your password</h1>
        <hr/>
        <div>
            <Form>
                <Form.Group widths='equal'>
                    <Form.Input

                        value={user.password}
                        type="password"
                        fluid 
                        label='Password' 
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
                        value={user.confirm_password}
                        type="password"
                        fluid
                        label="Confirm your password"
                        placeholder="Confirm Your Password"
                        onChange={(e) => {
                            setUser({
                                ...user,
                                confirm_password: e.target.value
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