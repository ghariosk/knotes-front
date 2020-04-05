import React, {useContext} from 'react';
import { Container, Button} from 'semantic-ui-react'
import './styles.css'
import {useHistory} from 'react-router-dom';
import {AuthContext} from '../../flux/auth/store' 


export default function Welcome () {
    let history = useHistory();
    let authDispatch = useContext(AuthContext).authDispatch;
    let goToLogin = function () {
        authDispatch({type: "LOGIN"})
        history.push('/login');
    }


    let goToRegister = function () {
        history.push('/register');
    }

    return(
        <Container className="knotes center-in-columns">
            <h1> Welcome to <span className="knotes">K-Notes</span></h1>
            <h3> Let's get you <span className="knotes">inside</span> shall we?</h3>
            <div>
                <Button color='green' onClick={goToLogin}> Log In </Button>
                <Button color='orange' onClick={goToRegister}> Register</Button>
            </div>
        </Container>
    )
}