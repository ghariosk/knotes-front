import React, {useContext, useState} from 'react';
import { Container, Button, Form, Header, Message} from 'semantic-ui-react'
import './styles.css'
import {useHistory} from 'react-router-dom';
import {AuthContext} from '../../flux/auth/store' 
import {api} from '../../constants/api'


export default function ForgotPassword () {
    let history = useHistory();
    let authDispatch = useContext(AuthContext).authDispatch;
    let [submitLoading, setSubmitLoading] = useState(false);
    let defaultUser = {
        email: "",
        otp: "",
    }

    let [user,setUser] = useState(defaultUser);
    let [errorMessage , setErrorMessage] = useState(false);
    let [accountFound, setAccountFound] = useState(false);

    let sendOtp = async () => {
        setErrorMessage(false); 
        setSubmitLoading(true)
        let url = `${api}/auth/forgot`
        let params =  {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            },
        }
        try {
            let request = await fetch(url, params);
            

            let response = await request.json();

            if (response.status === 201) {
                setSubmitLoading(false) 
    
                setAccountFound(true)
            } else {
                throw response;
            }
            

        } catch(e) {
            setSubmitLoading(false);
            setErrorMessage(true); 
            console.log(e)
        }      

    }

    let loginWithTempPassword = async () => {
        setErrorMessage(false); 
        setSubmitLoading(true)
        let url = api + '/auth/login/otp'
        let params =  {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        }
 
        try {
            let request = await fetch(url, params);
            

            let response = await request.json();

            if (response.status === 201) {
                setSubmitLoading(false) 
                localStorage.setItem('session', JSON.stringify(response) );
                await authDispatch({type: "LOGGED_IN", payload: response})
                history.push('/force-change-password');
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
        <h1> Forgotten <span className="knotes">Password</span></h1>
        <hr/>

        <div>
            <Form>
                <Form.Group widths='equal'>
                    <Form.Input
                        disabled={accountFound}
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
                        disabled={!accountFound}
                        value={user.password}
                        type="password"
                        fluid
                        label="One Time Password"
                        placeholder='One Time Password'
                        onChange={(e) => {
                            setUser({
                                ...user,
                                otp: e.target.value
                            })
                        }}
                    />
                   
                </Form.Group>
                {!accountFound && 
                <Button 
                    onClick={sendOtp}
                    color="orange"
                    loading={submitLoading}
                >
                    Submit
                </Button>
                }
                <Form.Group>
                    {accountFound && !errorMessage && <Message> We have sent you an email with a temporary password</Message>}
                    {errorMessage && <Message negative> This email does not exist in our records </Message> }
                </Form.Group>
                <br/>
                {accountFound && 
                <Button 
                    onClick={loginWithTempPassword}
                    color="orange"
                    loading={submitLoading}
                >
                    Login
                </Button>
                }
              
            </Form>
        </div>
    </Container>
    )
}