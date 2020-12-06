import axios from 'axios';

export async function loadAdmin(dispatch) {
    // if have token an local store, we will get it and put it to the headers
    //    everytime we communicate with server
    if (localStorage.admin_token) {

        let token = localStorage.admin_token;
        axios.defaults.headers.common['admin-code-bshoes'] = token;

    } else {
        delete axios.defaults.headers.common['admin-code-bshoes'];
    }

    await axios.get('/api/admin/auth')
        .then((res) => {
            dispatch({
                type: "ADMIN_LOADED",
                payload: res.data
            });
        })
        .catch ( (err) => {
            console.error(err);
            // if that token is not valid or wrong, we will log out this account
            //    and delete token in localStore
            dispatch({
                type: "ADMIN_AUTH_ERROR"
            })
        }) 
}

// register admin
export async function register(field, dispatch) {
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

    await axios.post('/api/admin/register', body, config)
        .then( (res) => {
            result.isSuccess = true;

            dispatch({
                type: "ADMIN_REGISTER_SUCCESS",
                payload: res.data
            });

            loadAdmin(dispatch);
            
        })
        .catch( (err) => {
            let error = err.response.data.error;
            console.error(error);

            result.isSuccess = false;
            result.error = {
                target: error.target,
                message: error.message
            }
            
            dispatch({
                type: "ADMIN_REGISTER_FAIL"
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


    await axios.post('/api/admin/login', body, config)
        .then((res) => {
            result.isSuccess = true;

            dispatch({
                type: "ADMIN_LOGIN_SUCCESS",
                payload: res.data
            });

            loadAdmin(dispatch);
        })
        .catch((err) => {
            let error = err.response.data.error;

            result.isSuccess = false;
            result.error = {
                target: error.target,
                message: error.message
            }
            
            dispatch({
                type: "ADMIN_LOGIN_FAIL"
            })
        })

    return result;
}