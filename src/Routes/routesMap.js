
import Welcome from '../components/public/Welcome';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import Confirm from '../components/auth/Confirm';
import ForgotPassword from '../components/auth/ForgotPassword';


import Feed from '../components/protected/Feed';
import People from '../components/protected/People';
import Profile from '../components/protected/Profile'

import PrivateRoute from './PrivateRoute';
import AuthRoute from './AuthRoute';

import {Route} from 'react-router-dom';

import ForceChangePassword from '../components/auth/ForceChangePassword';
import ChangePassword from '../components/auth/ChangePassword';

//  Define the routes name, path, component and wrapping component of each routes
export const routes = [
    { path: '/welcome', name: 'Welcome', Component: Welcome, RouteComponent: Route},
    { path: '/login', name: 'login', Component:Login, RouteComponent: AuthRoute },
    { path: '/register', name: 'register', Component: Register, RouteComponent: AuthRoute},
    { path: '/confirm' , name:'confirm' , Component: Confirm, RouteComponent: AuthRoute},
    { path: '/change-pass', name: 'change-pass', Component: ChangePassword, RouteComponent: PrivateRoute},
    { path: '/', name: 'feed', Component: Feed , RouteComponent: PrivateRoute},
    { path: '/forgot' , name: 'forgot' , Component: ForgotPassword, RouteComponent: AuthRoute},
    { path: '/force-change-password', name: 'force-change-password', Component: ForceChangePassword, RouteComponent: PrivateRoute},
    { path: '/people', name: 'people' , Component: People, RouteComponent: PrivateRoute},
    { path: '/people/:id', name: 'profile' , Component: Profile, RouteComponent: PrivateRoute}
]