import React, { useState, useRef } from 'react';
import "./index.css";
import {Link} from 'react-router-dom';
import { login } from "../../../redux-handle/actions/admin/auth";
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { check } from '../../../validator';
import LoadingAnimation from '../../../components/loading-animation';

// import images
import Email_icon from '../../../images/svg/email.svg';
import Password_icon from '../../../images/svg/password.svg';
import Error_icon from '../../../images/img/error.png';

export default function AdminLogInPage() {

    let history = useHistory();
    let dispatch = useDispatch();
    let email_input = useRef();
    let password_input = useRef();

    let [isLoading, setIsLoading] = useState(false);
    let [field, setField] = useState({email: "", password: ""});
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
                history.push("/admin/dashboard");
                return;
            } else {
                let {target, message} = result.error;

                let newAlert = {...alert};
                newAlert[target] = {
                    isOk: false,
                    isShow: true, 
                    message: message
                }
                setAlert(newAlert);
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


    return (
        <div>
            <div className="admin-login">
                <div className="title">Log in to your Admin account!</div>
                <Divided_line width="350px" margin="15px 0"/>

                <div className="indirect-login-methods">

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
                    <h4>Wanna create an admin account? <Link to="/admin/register">Register</Link></h4>
                </div>

            </div>
        </div>
    );
}

function AlertError({ message }) {
    return (
        <div className="alert-error">
            <img src={Error_icon} className="icon"/>
            <h4><i>{message}</i></h4>
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