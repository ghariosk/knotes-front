import React, { useState, useContext, useEffect} from 'react';
import {
    BrowserRouter,
} from "react-router-dom";

import {
    CSSTransition
} from "react-transition-group";


import NavBar from '../components/protected/NavBar';
import Footer from '../components/protected/Footer';
import LoadingPage from '../components/molecules/LoadingPage'
import './styles.css'
import { AuthContext } from '../flux/auth/store';
import {routes} from './routesMap';


export default function Router () {
    let {auth,authDispatch} = useContext(AuthContext);
    let [loading, setLoading] = useState(true);
    
    useEffect(() => {
      let boot = async function () {
        try {      
            let session = localStorage.getItem('session');
            session = JSON.parse(session);
            await authDispatch({type: "LOGGED_IN", payload: session}) 

        } catch(e) {
          console.log(e);
        }
        setLoading(false);     
      } 
      boot();
    },[authDispatch])


    useEffect(() => {
      if(auth.auth) {
        localStorage.setItem('session', JSON.stringify(auth) );
      } 
    },[auth])

    

    if(loading) {
        return <LoadingPage/>
    }

    return (
        <BrowserRouter>
          <div className="carouselContainer">
            {auth.auth && <NavBar/>}
            {/* Maps the route wrapped by the route component defined in routesMap */}
            {routes.map(({ path, Component, RouteComponent }) => (
              <RouteComponent key={path} exact path={path}>
                {({ match }) => (
                  //  Css transition applies classes on mount and unmount
                  //  css classes lsare defined in the ./styles.css
                  // to produce a whole page carousel when the user switches
                  // path
                  <CSSTransition 
                    in={match != null}
                    timeout={1000}
                    classNames="page"
                    unmountOnExit
                  >
                    <div className="page">
                      <Component />
                    </div>
                  </CSSTransition>
                )}
              </RouteComponent>
            ))}
          
            {auth.auth && <Footer/> }
      
        </div>
      </BrowserRouter>
    )
}








