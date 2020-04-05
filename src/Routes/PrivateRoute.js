import React, {useContext} from 'react'
import {AuthContext} from '../flux/auth/store'
import {Route, useHistory, Redirect} from 'react-router-dom';

// A private route checks if  user is authenticated and if not redirects to the welcome page
export default function PrivateRoute({ children, ...rest }) {
    let {auth} = useContext(AuthContext)
    let history = useHistory()
    return (
      <Route
        key={rest.path}
        exact
        path={rest.path}
      >
        {auth.auth? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/welcome",
                state: { from: history.location }
              }}
            />
          )
        }
        </Route>
    );
}