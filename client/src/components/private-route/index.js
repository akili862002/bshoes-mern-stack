import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PrivateRoute({ component: Component, ...rest }) {
    let { isAuthenticated, loading } = useSelector(state => state.user_auth);
    return (
        <Route {...rest} render = {
            (props) => 
                (!isAuthenticated && !loading) ? (
                    <Redirect to='/user/login' />
                ) : (
                    <Component {...props}/>
                )
        }/>
    );
}