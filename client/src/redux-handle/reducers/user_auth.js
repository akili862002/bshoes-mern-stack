import { findSubObjInArray, isSubObjInArray, removeVietnameseTones } from '../../backup';

let inital_state = {
    token: localStorage.getItem('user_token'),
    isAuthenticated: false,
    loading: true,
    user: null,
    isDataReady: false
}

export default function user_auth(state = inital_state, action ) {
    let {type, payload} = action;
    payload = {
        token: null,
        ...payload
    }
    // copy state
    let State = Object.assign({}, state); 

    switch (type) {
        case "USER_REGISTER_SUCCESS": 
            State = {
                isAuthenticated: true,
                loading: false,
                ...payload
            }
            localStorage.setItem('user_token', payload.token);
            return State;
        
        case "USER_REGISTER_FAIL": 
            localStorage.removeItem('user_token');
            State = {
                token: null,
                isAuthenticated: false,
                loading: true,
                user: null,
                isDataReady: false
            }
            return State;

        case "USER_LOGIN_SUCCESS": 
            State = {
                isAuthenticated: true,
                loading: false,
                ...payload
            }
            localStorage.setItem('user_token', payload.token);

            return State;
        
        case "USER_LOGIN_FAIL": 
            localStorage.removeItem('user_token');
            State = {
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                isDataReady: false
            }
            return State;
        
        case "USER_LOADED":
            payload.name = removeVietnameseTones(payload.name);
            State = {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload,
                isDataReady: true
            }
            return State;
        
        case "AUTH_ERROR": 
            localStorage.removeItem('user_token');
            State = {
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                isDataReady: false
            }
            return State;
        
        case "USER_LOG_OUT": 
            localStorage.removeItem('user_token');
            State = {
                token: null,
                isAuthenticated: false,
                loading: true,
                user: null,
                isDataReady: false
            }
            return State;

        case "ADD_PRODUCT_TO_CART": 
            // product in cart - Structure
            /* 
                id_product: {
                    type: String,
                    required: true
                },
                number: {
                    type: Number,
                    required: true
                },
                size: {
                    type:  
                },
                color: {
                    type: String 
                }
            */
            let { id_product } = payload;
            let cart_products = State.user.cart.products;
            let wishlist_products = State.user.wishlist.products;

            // make sure this product hasn't be in cart before
            if ( !isSubObjInArray({ id_product }, cart_products) ) {
                //First, Add this product to cart
                State.user.cart.products.unshift(payload);

                // Next, we need to make sure that don't have this product in wishlist
                let index = findSubObjInArray({ id_product }, wishlist_products)[0];
                if ( index != undefined ) {
                    // if this product was existed in wishlist,
                    // we need to remove it
                    State.user.wishlist.products.splice(index, 1);
                    State.user.wishlist.data.splice(index, 1);
                }
            }
            return State;

        case "USER_UPDATE_DATA_IN_CART":
            State.user.cart.data = payload.cart_data;
            return State;


        case "ADD_PRODUCT_TO_WISHLIST": 
            // product in wishlist - Structure - payload
            /* 
                id_product: {
                    type: String,
                    required: true
                },
                number: {
                    type: Number,
                    required: true
                },
                size: {
                    type: String 
                },
                color: {
                    type: String 
                }
            */
            id_product = payload.id_product;
            wishlist_products = State.user.wishlist.products;
            cart_products = State.user.cart.products;

            // make sure this product hasn't been in wishlist before
            if ( !isSubObjInArray({ id_product }, wishlist_products) ) {
                // Add to wishlist
                State.user.wishlist.products.unshift(payload);

                // if this product has stayed in cart
                let index = findSubObjInArray({ id_product }, cart_products)[0];
                if ( index != undefined ) {
                    // Remove this product from products in cart
                    State.user.cart.products.splice(index, 1);
                    State.user.cart.data.splice(index, 1);
                }
            }

            return State;

        case "USER_UPDATE_DATA_IN_WISHLIST":
            State.user.wishlist.data = payload.wishlist_data;
            return State;
        
        case "UPDATE_PRODUCTS_IN_CART_OF_USER":
            State.user.cart.products = payload.products;
            return State;

        case "REMOVE_PRODUCT_OUT_OF_CART":
            let index = payload.index;
            // Remove from array
            State.user.cart.products.splice(index, 1);
            State.user.cart.data.splice(index, 1);
            return State;
        
        case "MOVE_PRODUCT_FROM_CART_TO_WISHLIST":
            index = payload.index;
            product = State.user.cart.products[index];

            // remove product in cart
            State.user.cart.products.splice(index, 1);
            State.user.cart.data.splice(index, 1);

            // Add product to cart
            State.user.wishlist.products.unshift(product);
            return State;

        case "MOVE_PRODUCT_FROM_WISHLIST_TO_CART":
            index = payload.index;
            let product = State.user.wishlist.products[index];

            // remove product in cart
            State.user.wishlist.products.splice(index, 1);
            State.user.wishlist.data.splice(index, 1);

            // Add product to cart
            State.user.cart.products.unshift(product);
            return State;
        
        case "ADD_A_NEW_ADDRESS":
            let { field } = payload;
            State.user.addressList.unshift(field);
            return State;
        
        case "EDIT-AN-ADDRESS-IN-ADDRESS-LIST":
            index = payload.index;
            let newField = payload.newField;
            State.user.addressList[index] = newField;
            return State;
        
        default:
            // console.log("[REDUCER] DISPATCH TYPE NOT FOUND (404)");
            // console.log(`  |-- dispatch.type: "${type}"`);
            return state;
    }
}