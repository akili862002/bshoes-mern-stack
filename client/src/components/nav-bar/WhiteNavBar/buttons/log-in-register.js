import React from 'react';
import User_icon from '../../../../images/img/user_icon.png';

import { Link } from 'react-router-dom';


export default function SignInOrRegister_button() {

    return (
        <div className="button dropdown">
            <div className="drop-btn">
                <img src={User_icon} className="icon" alt=""/>
                <h4>Sign in<br/>or Register</h4>
            </div>
            <div className="dropdown-list login-register">
                <Link to="/user/login" className="drop-item">Log in</Link>
                <Link to="/user/register" className="drop-item">Register</Link>
            </div>
        </div>
    );
}