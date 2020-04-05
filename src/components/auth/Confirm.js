import React, {useState, useEffect} from 'react';
import { Container, Button, Form} from 'semantic-ui-react'
import './styles.css'
import {useHistory} from 'react-router-dom';

import {api} from '../../constants/api'



export default function Confirm () {
    let history = useHistory();
    // let {auth ,authDispatch} = useContext(AuthContext);
    let [submitLoading, setSubmitLoading] = useState(false);

    let [user,setUser] = useState({
        email: "",
        otp: ""
    })

    useEffect(() => {
        if ( history.location.state && history.location.state.email) {
            setUser((u) => {return {...u, email:history.location.state.email}})
        }
        
    },[history])

    let resendConfirmation = function () {
        console.log(user.email);
        let url = `${api}/auth/resend-confirmation`;
        let params = {
            method: "POST",
            body: JSON.stringify({email: user.email}),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        fetch(url,params)
    } 

    let confirm = async function () {
        setSubmitLoading(true);
        let url = `${api}/auth/confirm`;
        let params = {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        let request = await fetch(url,params);

        let response = await request.json();
        if(response.status === 201) {
            history.push('/login' , {message: "Success registering! Now sign in"});
        } else {
            alert("Wrong confirmation code");
        }

        setSubmitLoading(false);

        console.log(response);
    }
   
   

    return(
        <Container className="knotes container-padding">
            <h1> Confirm Your  <span className="knotes">Email</span></h1>
            <hr/>
            <div>
                <Form>
                    <Form.Group widths='equal'>
                        <Form.Input
                            value={user.email}
                            type="email"
                            fluid
                            disabled={history.location.state && history.location.state.email? true : false}
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
                            value={user.otp}
                           
                            fluid
                            label="Confirmation code"
                            placeholder='Confirmation code'
                            onChange={(e) => {
                                setUser({
                                    ...user,
                                    otp: e.target.value
                                })
                            }}
                        />
                    
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Button className="knotes active" onClick={resendConfirmation}>{" "} Didn't get your code? Resend </Button>
                    </Form.Group>
                    <br/>
                    <Button 
                        onClick={confirm}
                        color="orange"
                        loading={submitLoading}
                    >
                        Confirm
                    </Button>
                </Form>
            </div>
        </Container>
    )
}