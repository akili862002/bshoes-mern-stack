import axios from 'axios';
import {loadUser} from './load_data';

export async function register( field, dispatch ) {
    let result = {
        isSuccess: null,
        error: {
            target: "",
            message: ""
        }
    }

    let config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let body = JSON.stringify(field);

    await axios.post('/api/user/register', body, config)
        .then( (res) => {
            result.isSuccess = true;
            dispatch({
                type: "USER_REGISTER_SUCCESS",
                payload: res.data
            });

            loadUser(dispatch);
        })
        .catch( (err) => {
            let error = err.response.data.error;

            result.isSuccess = false;
            result.error = error;
            
            dispatch({
                type: "USER_REGISTER_FAIL"
            })
        });

    return result;
}


export async function login(form, dispatch) {
    let result = {
        isSuccess: null,
        error: {
            target: "",
            message: ""
        }
    }

    let {email, password} = form;
    let config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let body = JSON.stringify({email, password});


    await axios.post('/api/user/login', body, config)
        .then((res) => {
            result.isSuccess = true;

            dispatch({
                type: "USER_LOGIN_SUCCESS",
                payload: res.data
            });

            loadUser(dispatch);
        })
        .catch((err) => {
            let error = err.response.data.error;

            result.isSuccess = false;
            result.error = error;
            
            dispatch({
                type: "USER_LOGIN_FAIL"
            })
        })

    return result;
}

export async function login_by_google(response, dispatch) {
    let result = {
        isSuccess: true
    }

    let google_id = response.googleId;
    let profile = response.profileObj;

    let config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let body = JSON.stringify({ google_id, profile });

    await axios.post('/api/user/login_by_google', body, config)
        .then( (res) => {
            dispatch({
                type: "USER_LOGIN_SUCCESS",
                payload: res.data
            })

            loadUser(dispatch);
        })
        .catch ((err) => {
            result.isSuccess = false;
        })
    
    return result;
}

export async function login_by_facebook(response, dispatch) {
    let result = {
        isSuccess: true
    }

    let { name, picture } = response;
    let facebook_id = response.userID;
    let profile = {
        name: name,
        imageURL: picture.data.url
    }

    let config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let body = JSON.stringify({ facebook_id, profile });

    await axios.post('/api/user/login_by_facebook', body, config)
        .then( (res) => {
            dispatch({
                type: "USER_LOGIN_SUCCESS",
                payload: res.data
            })

            loadUser(dispatch);
        })
        .catch ((err) => {
            console.error(err);
            result.isSuccess = false;
        })
    
    return result;
}


