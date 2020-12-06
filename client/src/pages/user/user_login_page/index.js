import React, { useState, useRef } from 'react';
import "./index.css";
import {Link} from 'react-router-dom';
import { login, login_by_google, login_by_facebook } from "../../../redux-handle/actions/user/auth";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { check } from '../../../validator';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import CircleLoading from '../../../components/circle-loading';
import LoadingAnimation from '../../../components/loading-animation';

// import images
import Google_icon from '../../../images/svg/social_media/google.png';
import Facebook_icon from '../../../images/svg/social_media/facebook.png';
import Email_icon from '../../../images/img/email_icon.png';
import Password_icon from '../../../images/img/password_icon.png';

export default function UserLogInPage() {
    let history = useHistory();
    let dispatch = useDispatch();
    let email_input = useRef();
    let password_input = useRef();
    let isAuthenticated = useSelector(state => state.user_auth.isAuthenticated);
    // if user logged in, we will bring him to homePage
    if (isAuthenticated)
        history.push('/');

    let [isLoading, setIsLoading] = useState(false);
    let [field, setField] = useState({email: "", password: ""});
    let [isSigningIn, setIsSigningIn] = useState(false);
    const [alert, setAlert] = useState({
        email: {
            isOk: false,
            isShow: false,
            message: ""
        }, 
        password: {
            isOk: false,
            isShow: false,
            message: ""
        }
    });
    

    function checkEmail() {
        let email = email_input.current.value;

        let check_option = {
            notEmpty: {
                check: true,
                message: "Please fill your Email!"
            },
            isEmail: {
                check: true,
                message: "Please include a valid Email!"
            }
        }

        let error = check(email, check_option);
        if (error.exist) {
            alert.email = {
                isOk: false,
                isShow: true,
                message: error.message
            }
            setAlert({...alert});
            return;
        }

        // if this email is ok, don't alert
        field.email = email;
        alert.email = {
            isShow: false,
            isOk: true
        }
        setAlert({...alert});
    }

    function checkPassword() {
        let password = password_input.current.value;

        let check_option = {
            notEmpty: {
                check: true,
                message: "Please fill your Password!"
            }
        }
        let error = check(password, check_option);

        if (error.exist) {
            alert.password = {
                isOk: false,
                isShow: true,
                message: error.message
            }
            setAlert({...alert});
            return;
        }

        // if this password is ok, don't alert
        field.password = password;
        alert.password = {
            isShow: false,
            isOk: true
        }

        setAlert({...alert});
    }

    async function logInHandle() {
        if ( alert.email.isOk && alert.password.isOk ) {
            setIsLoading(true);
            let result = await login(field, dispatch);
            
            if (result.isSuccess) {
                // redirect user to admin dashboard
                history.push("/");
                return;
            } else {
                let {target, message} = result.error;

                alert[target] = {
                    isOk: false,
                    isShow: true, 
                    message: message
                }
                setAlert({...alert});
            }
            setIsLoading(false);

        } else {
            checkEmail();
        }
    }

    function pressEnterButtonHandle(e) {
        if (e.key === 'Enter')  {
           checkPassword();
           logInHandle();
       }
    }
    
    async function responseGoogle(response) {
        if (response.error !== "popup_closed_by_user") {
            setIsSigningIn(true);
            let result = await login_by_google(response, dispatch);

            if (result.isSuccess) {
                // redirect user to admin dashboard
                history.push("/");
                return;
            } else {
                setIsSigningIn(false);
            }
        }
    }

    async function responseFacebook(response) {
        if (response.status !== "unknown") {
            setIsSigningIn(true);
            let result = await login_by_facebook(response, dispatch);
            if (result.isSuccess) {
                // redirect user to admin dashboard
                history.push("/");
                return;
            } else {
                setIsSigningIn(false);
            }
        }
    }

    

    return (
        <div className="user-login-page">
            { isSigningIn && (
                <div className="loading-log-in">
                    <CircleLoading />
                </div>
            ) }
            <div className="user-login">
                <div className="title">Log in to your account!</div>
                <Divided_line width="350px" margin="15px 0"/>

                <div className="indirect-login-methods">

                    <GoogleLogin
                        clientId="252306079114-ne0eu8garimp4mbbrkpo665io5g05p14.apps.googleusercontent.com"
                        buttonText="Login"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                        render={renderProps => (
                            <div className="btn login-by-google" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                                <img src={Google_icon} className="icon"/>
                                <h4>Continue with Google</h4>
                            </div>
                        )}
                    />

                    <FacebookLogin
                        appId="370847763933176"
                        callback={responseFacebook}
                        fields = "name,email,picture"
                        render={renderProps => (
                            <div className="btn login-by-facebook disable" onClick={renderProps.onClick}>
                                <img src={Facebook_icon} className="icon"/>
                                <h4>Continue with Facebook</h4>
                            </div>
                        )}
                    />

                </div>

                <div className="direct-login">
                    <div className="email box-input">
                        <img src={Email_icon} className="icon"/>
                        <input 
                            type="email" 
                            spellCheck="false" 
                            placeholder="Email"
                            onBlur = {checkEmail}
                            ref = {email_input}
                            onKeyPress={pressEnterButtonHandle}
                        />
                    </div>
                    {alert.email.isShow && <AlertError message={alert.email.message}/>}

                    <div className="password box-input">
                        <img src={Password_icon} className="icon"/>
                        <input 
                            type="password" 
                            placeholder="Password"
                            onBlur = {checkPassword}    
                            ref = {password_input}
                            onKeyPress={pressEnterButtonHandle}
                        />
                    </div>
                    {alert.password.isShow && <AlertError message={alert.password.message}/>}

                    <button className="login" onClick={() => { logInHandle() }}>
                        {
                            isLoading ? <LoadingAnimation /> : (<h3>Log in</h3>) 
                        }
                    </button>
                </div>

                <div className="recommend">
                    <h4>Don't have any account? <Link to="/user/register">Register</Link></h4>
                </div>

            </div>
        </div>
    );
}

function AlertError({ message }) {
    return (
        <div className="alert-error">
            <h4>{message}</h4>
        </div>
    );
}

function Divided_line({ width, margin }) {
    let style = {
        width: width,
        height: "1px",
        background: "rgb(204 204 204)",
        margin: margin
    }

    return <div className="line-divide" style={style}></div>;
}