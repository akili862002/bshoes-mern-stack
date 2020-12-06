import axios from 'axios';

export async function loadUser(dispatch) {
    // if have token an local store, we will get it and put it to the headers
    //    everytime we communicate with server
    if (localStorage.user_token) {

        let token = localStorage.user_token;
        axios.defaults.headers.common['code-bshoes'] = token;

    } else {
        delete axios.defaults.headers.common['code-bshoes'];
        return;
    }

    await axios.get('/api/auth')
        .then((res) => {
            dispatch({
                type: "USER_LOADED",
                payload: res.data
            })
        })
        .catch ( (err) => {

            // if that token is not valid or wrong, we will log out this account
            //    and delete token in localStore
            dispatch({
                type: "AUTH_ERROR"
            })
        }) 
}


// Loading Cart ---------------------------------------------------------

export async function load_cart_user(dispatch) {
    await axios.get('/api/auth/cart/get-cart-data')
        .then((res) => {
            dispatch({
                type: "USER_UPDATE_DATA_IN_CART",
                payload: {
                    cart_data: res.data
                }
            })
            // console.log('[CART] Load data done (✔)');
        })
        .catch((err) => {
            console.error(err);
        })
}

// Loading WishList ---------------------------------------------------------

export async function load_wishlist_user(dispatch) {
    await axios.get('/api/auth/wishlist/get-wishlist-data')
        .then((res) => {
            dispatch({
                type: "USER_UPDATE_DATA_IN_WISHLIST",
                payload: {
                    wishlist_data: res.data
                }
            })
            // console.log('[WISHLIST] |-> Loaded data done (✔)')
        })
        .catch((err) => {
            console.error(err);
        })
}
