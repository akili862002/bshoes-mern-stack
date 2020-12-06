let initialState = {
    token: localStorage.getItem('admin_token'),
    isAuthenticated: null,
    loading: true,
    admin: null
}

export default function admin_auth(state=initialState, action) {
    let {type, payload} = action;
    payload = {
        token: null,
        ...payload
    }
    // copy state
    let State = Object.assign({}, state); 

    switch (type) {
        case "ADMIN_REGISTER_SUCCESS":
            State = {
                isAuthenticated: true,
                loading: false,
                ...payload
            }
            localStorage.setItem('admin_token', payload.token);
            return State;
        
        case "ADMIN_REGISTER_FAIL": 
            localStorage.removeItem('admin_token');
            State = {
                token: null,
                isAuthenticated: false,
                loading: true,
                admin: null
            }
            return State;

        case "ADMIN_LOGIN_SUCCESS": 
            State = {
                isAuthenticated: true,
                loading: false,
                ...payload
            }
            localStorage.setItem('admin_token', payload.token);

            return State;

        case "ADMIN_LOGIN_FAIL": 
            localStorage.removeItem('admin_token');
            State = {
                token: null,
                isAuthenticated: false,
                loading: true,
                admin: null
            }
            return State;
        
        case "ADMIN_LOADED": 
            State = {
                ...state,
                isAuthenticated: true,
                loading: false,
                admin: payload,
                isDataReady: true
            }
            return State;

        case "ADMIN_AUTH_ERROR": 
            localStorage.removeItem('admin_token');
            State = {
                token: null,
                isAuthenticated: false,
                loading: true,
                admin: null,
                isDataReady: false
            }
            return State;


        default: 
            return state;
    }
}