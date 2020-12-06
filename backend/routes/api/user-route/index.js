const user = require('express').Router();
const auth_middleware = require('../../../middleware/auth');

// import routes
// -- user
const load_user = require('./components/user/load_user');
const update_user = require('./components/user/update_user');
// -- cart
const load_cart = require('./components/cart/load_cart');
const add_product_to_cart = require('./components/cart/add_product_to_cart');
const move_a_product_from_wishlist_to_cart = require('./components/cart/move_a_product_from_wishlist_to_cart');
const update_products_in_cart = require('./components/cart/update_products_in_cart');
const delete_a_product_in_cart = require('./components/cart/delete_a_product_in_cart');
// -- wishlist
const load_wishlist = require('./components/wishlist/load_wishlist');
const add_a_product_to_wishlist = require('./components/wishlist/add_a_product_to_wishlist');
const move_a_product_from_cart_to_wishlist = require('./components/wishlist/move_a_product_from_cart_to_wishlist');
// -- address list
const add_a_address_to_address_list = require('./components/address/add_a_address_to_address_list');
const edit_a_address = require('./components/address/edit_a_address');
const delete_a_address = require('./components/address/delete_a_address');

// USER Routes ----------
/** ----------------------------------------------
 * @Route {GET} /api/user
 * @name Load-User 
 * @Group User
 * @description Load user infos
 * @Privacy Private
 * 
 * @HeaderRequire {json} token
 * @HeaderRequireExample 
 * headers {
 *      <key>: <token>
 * }
 * 
 * @responseSuccess {json} 
    res.data = {
        email, name, avatar, cart, wishlist,
        addressList, date
    } 
    --> See detail in models/User
 */
user.get('/', auth_middleware, load_user);

/** ----------------------------------------------
 * @Route {POST} /api/user/update
 * @name Update-User 
 * @Group User
 * @description Update user
 * @Privacy Private
 * 
 * @HeaderRequire {json} token
 * @HeaderRequireExample 
 * headers {
 *      <key>: <token>
 * }
 * 
 * @responseSuccess {String}
 * @responseError structure:
    {
        error: {
            message: String
        }
    }
 */
user.post('/update', auth_middleware, update_user);



// CART Routes ----------
/** ----------------------------------------------
 * @Route {GET} /api/user/cart/load
 * @name Load-Cart 
 * @Group User -> Cart
 * @description Load Cart data of user
 * @Privacy Private
 * 
 * @HeaderRequire {json} token
 * @HeaderRequireExample 
 * headers {
 *      <key>: <token>
 * }
 * 
 * @responseSuccess {json} 
    res.data = [
        {
            name,
            cost,
            images,
            options.color,
            information.trademark,
            id_product
        },
        ...
    ]
 * --> See detail in models/User
 */
user.get('/cart/load', auth_middleware, load_cart);

/** ----------------------------------------------
 * @Route {PUT} /api/user/cart/:id_product
 * @name Add-Product-To-Cart
 * @Group User -> Cart
 * @description User add a product to cart
 * @Privacy Private
 * 
 * @HeaderRequire {json} token
 * @HeaderRequireExample 
        headers {
            <key>: <token>
        }
 *  
 * @param {String} id_product   id_product of product
 * @param {String} name         name of that product
 * @param {String} size         size of that product
 * @param {String} color        color of that product
 * --> See more at models/User.Schema.cart.products
 * 
 * @responseSuccess {String}
 */
user.put('/cart/:id_product', auth_middleware, add_product_to_cart);

/** ----------------------------------------------
 * @Route {PUT} /api/user/cart/update
 * @name Update-Products-In-Cart
 * @Group User -> Cart
 * @description Delete a product in cart by id_product
 * @Privacy Private
 * 
 * @HeaderRequire {json} token
 * @HeaderRequireExample 
        headers {
            <key>: <token>
        }
 *  
 * @param_body {Array} products "a new products array which F-E changed"
        body = [...]
        --> See more in models/User.cart.products
 * @responseSuccess {String} res.body
 */
user.put('/cart/update', auth_middleware, update_products_in_cart);


/** ----------------------------------------------
 * @Route {PUT} /api/user/cart/move-a-product-from-wishlist-to-cart/:index
 * @name Move-A-Product-From-Wishlist-To-Cart
 * @Group User -> Cart
 * @description move a product (item) from wishlist.products to cart.products
 * @Privacy Private
 * 
 * @HeaderRequire {json} token
 * @HeaderRequireExample 
        headers {
            <key>: <token>
        }
 *  
 * @param_url {Number} index 
        "current index in user.wishlist.products, which we want to move to cart"
 *
 * 
 * @responseSuccess {String} res.data
 */
user.put(
    '/cart/move-a-product-from-wishlist-to-cart/:index', 
    auth_middleware, 
    move_a_product_from_wishlist_to_cart
);

/** ----------------------------------------------
 * @Route {DELETE} /api/user/cart/:id_product
 * @name Delete-A-Product-In-Cart
 * @Group User -> Cart
 * @description Delete a product in cart by id_product
 * @Privacy Private
 * 
 * @HeaderRequire {json} token
 * @HeaderRequireExample 
        headers {
            <key>: <token>
        }
 *  
 * @param_url {String} id_product // id_product of product which we want to remove
 * 
 * @responseSuccess {String}
 */
user.delete('/cart/:id_product', auth_middleware, delete_a_product_in_cart);


// ------------------------------------------------------------------------------------------------------------------------

// WISHLIST Routes ----------
/** ----------------------------------------------
 * @Route {GET} /api/user/wishlist/load
 * @name Load-Wishlist 
 * @Group User -> Wishlist
 * @description Load Wishlist data of user
 * @Privacy Private
 * 
 * @HeaderRequire {json} token
 * @HeaderRequireExample 
 * headers {
 *      <key>: <token>
 * }
 * 
 * @responseSuccess {json} 
 * --> See detail in models/User.wishlist
 */
user.get('/wishlist/load', auth_middleware, load_wishlist);

/** ----------------------------------------------
 * @Route {PUT} /api/user/wishlist/add
 * @name Add-Product-To-Wishlist
 * @Group User -> Cart
 * @description User adds a product to cart
 * @Privacy Private
 * 
 * @HeaderRequire {json} token
 * @HeaderRequireExample 
        headers {
            <key>: <token>
        }
 *  
 * @param_body {String} id_product   id_product of product
 * @param_body {String} name         name of that product
 * @param_body {String} size         size of that product
 * --> See more at models/User.Schema.wishlist.products
 * 
 * @responseSuccess {String} res.data "It will send to Front-end that process was success"
 */
user.put(
    '/wishlist/add',
    auth_middleware,
    add_a_product_to_wishlist
);


/** ----------------------------------------------
 * @Route {PUT} /api/user/wishlist/move-a-product-from-cart-to-wishlist/:index
 * @name Move-A-Product-From-Cart-To-Wishlist
 * @Group User -> Wishlist
 * @description move a product from cart.products to wishlist.products
 * @Privacy Private
 * 
 * @HeaderRequire {json} token
 * @HeaderRequireExample 
        headers {
            <key>: <token>
        }
 *  
 * @param_url {Number} index 
        "current index in user.cart.products, which we want to move to cart"
        
 * @responseSuccess {String} res.data
 */
user.put(
    '/cart/move-a-product-from-cart-to-wishlist/:index', 
    auth_middleware, 
    move_a_product_from_cart_to_wishlist
);



// ADDRESS-LIST Routes ----------
/** ----------------------------------------------
 * @Route {GET} /api/user/address/add
 * @name Add-A-New-Adress 
 * @Group User -> Adress
 * @description User addes a new address
 * @Privacy Private
 * 
 * @HeaderRequire {json} token
 * @HeaderRequireExample 
 * headers {
 *      <key>: <token>
 * }
 * 
 * @param_body {String} name     "name of user"
 * @param_body {String} location "location of user"
 * @param_body {String} phone    "phone number of user"
 * --> See detail in models/User.addressList
 * 
 * @responseSuccess {String} res.data "server responses Success"
 */
user.put(
    '/address/add',
    auth_middleware,
    add_a_address_to_address_list
);

/** ----------------------------------------------
 * @Route {PUT} /api/user/address/edit
 * @name Edit-A-Address 
 * @Group User -> Adress
 * @description User edits a address in list address
 * @Privacy Private
 * 
 * @HeaderRequire {json} token
 * @HeaderRequireExample 
 * headers {
 *      <key>: <token>
 * }
 * 
 * @param_body {Number} index     "index of address in addressList which we want to modify"
 * @param_body {json}   newField  "newField is what we will change old address to"
    newField = {
        name,
        location,
        phone
    }
    --> See detail in models/User.addressList
 * 
 * @responseSuccess {String} res.data "server responses Success"
 */
user.put(
    '/address/edit',
    auth_middleware,
    edit_a_address
);


/** ----------------------------------------------
 * @Route {DELETE} /api/user/address/:id_location_delete
 * @name Delete-A-Address 
 * @Group User -> Adress
 * @description User removes a address in list address
 * @Privacy Private
 * 
 * @HeaderRequire {json} token
 * @HeaderRequireExample 
 * headers {
 *      <key>: <token>
 * }
 * 
 * @param_url {Number} id_location_delete "id_location_delete is _id of address item in addressList"
 * 
 * @responseSuccess {String} res.data "server responses Success"
 * 
 * @responseError {json}
 * @example 
    {
        error: { 
            target: "id_location_delete",
            message: "Cannot find that id in list locations!"
        }
    }
 */
user.delete(
    '/address/:id_location_delete',
    auth_middleware,
    delete_a_address
);

// -------------------------------/////
module.exports = user;