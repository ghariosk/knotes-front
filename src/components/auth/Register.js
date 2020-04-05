import React, {useState} from 'react';
import { Container, Button, Form} from 'semantic-ui-react'
import './styles.css'
import {useHistory} from 'react-router-dom'; 
import {api} from '../../constants/api';


export default function Register () {
    let history = useHistory();
    let defaultUser = {
        email: "",
        password: "",
        confirm_password: "",
        name: ""
    }
    let [user, setUser ] = useState(defaultUser)
    let defaultError = {
        password: false,
        email: false,
        name: false,
        confirm_password: false
    }

  
    let [errors, setErrors] = useState(defaultError)

    let passwordDontMatch = {
        content: 'The passwords do not match',
        pointing: 'above',
    }

    let emailInvalid = {
        content: 'That email is invalid',
        pointing: 'above',
    }

    let emailTaken = {
        content: 'That email is taken',
        pointing: 'above',
    }

    let required = {
        content: 'That field is required',
        pointing: 'above'
    }

    let validateForm = function (params) {
        if(!params.email) {
            setErrors({
                ...defaultError,
                email: required
            })

            return false
        }
        if(params.email.indexOf("@") === -1 ) {
            setErrors({
                ...defaultError,
                email: emailInvalid
            })

            return false

        }

        if(!params.name) {
            setErrors({
                ...defaultError,
                name: required
            })

            return false
        }

        if(!params.password) {
            setErrors({
                ...defaultError,
                password: required
            })

            return false
        }

        if(!params.confirm_password) {
            setErrors({
                ...defaultError,
                confirm_password: required
            })

            return false
        }
 

        if (params.password !== params.confirm_password) {
            setErrors({
                ...defaultError,
                confirm_password: passwordDontMatch
            })

            return false

        }

        return true;

    }
 
   let signUp = async function () {
        await setErrors(defaultError)
        let params = user;
        if (!validateForm(params)) return;
        try {
            let url = `${api}/auth/register`;

            let request = await fetch(url, {
                method: "POST",
                body:  JSON.stringify(params),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
    
            let response = await request.json();

            console.log(response);

            if(response.status === 201) {
                history.push('/confirm' , {email : params.email})
            } 

            if (response.status === 422) {
                setErrors({
                    ...defaultError,
                    email: emailTaken
                })
            }

        } catch(e) {

        }
       



   }

    function handleChange(evt) {
        const value = evt.target.value;
        setUser({
            ...user,
            [evt.target.name]: value
        });
    };

    return(
        <Container className="knotes container-padding">
            <Button onClick={() => history.goBack()}> {"<<"} Go Back</Button>
            <h1> Sign <span className="knotes">Up</span></h1>
            <hr/>
            <div>
                <Form>
                    <Form.Group widths='equal'>
                        <Form.Input
                            name="email"
                            value={user.email}
                            fluid 
                            label='Email' 
                            placeholder='Email'
                            onChange={handleChange}
                            error={errors.email}
                        />
                        <Form.Input
                            fluid 
                            name="name"
                            value={user.name}
                            label='Name' 
                            placeholder='Name'
                            onChange={handleChange}
                            error={errors.name}
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Input 
                            type="password"
                            name="password"
                            value={user.password} 
                            fluid 
                            label="Password" 
                            placeholder='Password'
                            onChange={handleChange}
                            error={errors.password}
                        />
                        <Form.Input
                            type="password"
                            name="confirm_password"
                            value={user.confirm_password}
                            fluid 
                            label='Confirm Password' 
                            placeholder='Confirm Password'
                            onChange={handleChange}
                            error={errors.confirm_password}
                        />
                    </Form.Group>
                    <br/>
                    <Button onClick={signUp} color="orange">Submit</Button>
                </Form>
            </div>
        </Container>
    )
}