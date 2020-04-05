import React, {useContext} from 'react'
import {AuthContext} from '../flux/auth/store'
import {Route, useHistory, Redirect} from 'react-router-dom';

// A private route checks if  user is authenticated and if yes redirects to the home page
export default function AuthRoute({ children, ...rest }) {
    let {auth} = useContext(AuthContext)
    let history = useHistory()
    return (
        <Route
            key={rest.path}
            exact
            path={rest.path}
        >
            {auth.auth? (
                <Redirect
                    to={{
                        pathname: "/",
                        state: { from: history.location }
                    }}
                />
            ) : (
                children
            )
            }
        </Route>
    );
}
