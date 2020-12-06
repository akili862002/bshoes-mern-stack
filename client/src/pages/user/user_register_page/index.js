import React, { useState, useRef } from 'react';
import "./index.css";
import {Link} from 'react-router-dom';
import { register } from "../../../redux-handle/actions/user/auth";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { check } from '../../../validator';
import LoadingAnimation from '../../../components/loading-animation';

// import images
import Email_icon from '../../../images/svg/email.svg';
import Password_icon from '../../../images/svg/password.svg';
import User_icon from '../../../images/svg/user.svg';

export default function UserRegisterPage() {
    let history = useHistory();
    let dispatch = useDispatch();
    let isAuthenticated = useSelector(state => state.user_auth.isAuthenticated);
    // if user logged in, we will bring him to homePage
    if (isAuthenticated)
        history.push('/');

    let email_input = useRef();
    let password_input = useRef();
    let name_input = useRef();
    let password_confirm_input = useRef();

    let [isLoading, setIsLoading] = useState(false);
    let [field, setField] = useState({email: "", password: "", name: "", key_admin: ""});
    const [alert, setAlert] = useState({
        name: {
            isOk: false,
            isShow: false,
            message: ""
        }, 
        email: {
            isOk: false,
            isShow: false,
            message: ""
        }, 
        password: {
            isOk: false,
            isShow: false,
            message: ""
        },
        confirm_password: {
            isOk: false,
            isShow: false,
            message: ""
        }
    });
    
    
    function isMatchPassword() {
        let password_first = password_input.current.value;
        let password_second = password_confirm_input.current.value;

        if (password_first === password_second) {
            return true;
        }
        return false;
    }

    function checkName() {
        let name = name_input.current.value;

        if (isEmpty(name)) {
            alert.name = {
                isOk: false,
                isShow: true,
                message: "Please fill your Name"
            }
            setAlert({...alert});
        } else {
            field.name = name;
            alert.name = {
                isOk: true,
                isShow: false,
            }
            setAlert({...alert});
        }
    }

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
            },
            length: {
                check: true,
                min: 6,
                message: "Please Include password with at least 6 characters!"
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
        checkPasswordConfirm();

        setAlert({...alert});
    }

    function checkPasswordConfirm() {

        if ( isMatchPassword() ) {
            alert.confirm_password = {
                isOk: true,
                isShow: false
            }
            setAlert({...alert});
        } else {
            alert.confirm_password = {
                isOk: false, 
                isShow: true,
                message: "Confirm password is not match!"
            }
            setAlert({...alert})
        }
        
    }

    async function register_submit() {
        if ( isNoAlert(alert) && isMatchPassword() ) {
            setIsLoading(true);

            let result = await register(field, dispatch);
            
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
            checkName();
        }
    }

    return (
        <div>
            <div className="user-register">
                <div className="title">Register an user account!</div>

                <Divided_line width="350px" margin="15px 0"/>

                <div className="register-box">
                    <div className="name box-input">
                        <img src={User_icon} className="icon"/>
                        <input 
                            type="text" 
                            spellCheck="false" 
                            placeholder="Name"
                            onBlur = {checkName}
                            ref = {name_input}
                            onKeyPress={e => { if (e.key === 'Enter') register_submit() }}
                        />
                    </div>
                    {alert.name.isShow && <AlertError message={alert.name.message}/>}

                    <div className="email box-input">
                        <img src={Email_icon} className="icon"/>
                        <input 
                            type="email" 
                            spellCheck="false" 
                            placeholder="Email"
                            onBlur = {checkEmail}
                            ref = {email_input}
                            onKeyPress={e => { if (e.key === 'Enter') register_submit() }}
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
                            onKeyPress={e => { if (e.key === 'Enter') register_submit() }}
                        />
                    </div>
                    {alert.password.isShow && <AlertError message={alert.password.message}/>}

                    <div className="confirm-password box-input">
                        <img src={Password_icon} className="icon"/>
                        <input 
                            type="password" 
                            placeholder="Confirm password"
                            onBlur = {checkPasswordConfirm}    
                            ref = {password_confirm_input}
                            onKeyPress={e => { if (e.key === 'Enter') register_submit() }}
                        />
                    </div>
                    {alert.confirm_password.isShow && <AlertError message={alert.confirm_password.message}/>}

                    <button className="login" onClick={() => { register_submit() }}>
                        {
                            isLoading ? <LoadingAnimation /> : (<h3>Register</h3>) 
                        }
                    </button>
                </div>

                <div className="recommend">
                    <h4>You have an account? <Link to="/user/login">Log in</Link></h4>
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

function isEmpty(text) {
    if (text.length == 0 || text == undefined)
        return true;
    return false;
}

function isNoAlert(alert) {
    for (let key of Object.keys(alert)) {
        if (alert[key].isOk === false)
            return false;
    };
    return true;
}