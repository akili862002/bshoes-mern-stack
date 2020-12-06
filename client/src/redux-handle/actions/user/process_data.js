import axios from 'axios';
import { load_cart_user, load_wishlist_user } from './load_data';

export async function add_a_product_to_cart(product, dispatch) {
    dispatch({
        type: "ADD_PRODUCT_TO_CART",
        payload: product
    });

    let config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let body = JSON.stringify(product);

    await axios.put('/api/auth/cart', body, config)
        .then((res) => {
            // console.log('[CART] |-> Updated cart in database!')
        })
        .catch((err) => {
            console.error(err);
        })
    await load_cart_user(dispatch);
}


export async function add_a_product_to_wishlist(product, dispatch) {
    dispatch({
        type: "ADD_PRODUCT_TO_WISHLIST",
        payload: product
    });

    let config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let body = JSON.stringify(product);

    await axios.put('/api/auth/wishlist', body, config)
        .then((res) => {
            // console.log('[WISHLIST] |-> Updated cart in database!')
        })
        .catch((err) => {
            console.error(err);
        })
    await load_wishlist_user(dispatch);
}


export async function remove_product_out_of_cart(index, dispatch) {
    dispatch({
        type: "REMOVE_PRODUCT_OUT_OF_CART",
        payload: { index }
    });

    // UPDATE CART IN DATABASE
    await axios.delete('/api/auth/cart/' + index)
        .then((res) => {
            // console.log('[SERVER] Deleted product in cart!')
        })
        .catch((err) => {
            console.error(err.response.data.error);
        })

}


export async function move_product_from_cart_to_wishlist(index, dispatch) {
    dispatch({
        type: "MOVE_PRODUCT_FROM_CART_TO_WISHLIST",
        payload: { index }
    })

    await axios.put('/api/auth/cart/move-to-wishlist/' + index)
        .then((res) => {
            // console.log('[SERVER] Moved product to wishlist')
        })
        .catch((err) => {
            console.error(err.response.data.error);
        })
}

export async function move_product_from_wishlist_to_cart(index, dispatch) {
    dispatch({
        type: "MOVE_PRODUCT_FROM_WISHLIST_TO_CART",
        payload: { index }
    })

    await axios.put('/api/auth/wishlist/move-to-cart/' + index)
        .then((res) => {
            // console.log('[SERVER] Moved product to cart!')
        })
        .catch((err) => {
            console.error(err);
        })
}

export async function user_adds_a_new_address(field, dispatch) {
    dispatch({
        type: "ADD_A_NEW_ADDRESS",
        payload: {
            field
        }
    });

    let config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let body = JSON.stringify(field);

    await axios.put('/api/auth/addressList/add', body, config)
        .then(res => {
            // console.log(res.data)
        })
        .catch((err) => {
            console.error(err);
        })
}

export async function user_edits_address(index, newField, dispatch) {
    dispatch({
        type: "EDIT-AN-ADDRESS-IN-ADDRESS-LIST",
        payload: {
            index,
            newField
        }
    });

    let config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let body = JSON.stringify({
        index,
        newField
    });

    await axios.put('/api/auth/addressList/edit', body, config)
        .then(res => {
            // console.log(res.data)
        })
        .catch((err) => {
            console.error(err);
        })
}


export async function update_products_in_cart_of_user(products, dispatch) {
    
    dispatch({
        type: "UPDATE_PRODUCTS_IN_CART_OF_USER",
        payload: { products }
    })
    
    let config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let body = JSON.stringify(products);
    await axios.put('/api/auth/cart/update-products-in-cart', body, config)
        .then((res) => {
            // console.log('updated user.cart.products success!')
        })
        .catch((err) => {
            console.error(err.response.data.error);
        })
}

export async function user_reviews_a_product(field, id_product) {

    let config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let body = JSON.stringify(field);
    await axios.put('/api/products/product/add-review/' + id_product, body, config)
        .then((res) => {
            // console.log('[SERVER] Updated successfull!')
        })
        .catch((err) => {
            console.error(err);
        })
}
