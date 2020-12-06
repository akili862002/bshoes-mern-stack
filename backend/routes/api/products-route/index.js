const products = require('express').Router();
const admin_middleware = require('../../../middleware/admin');
const auth_middleware = require('../../../middleware/auth');

// Import routes
const getProduct = require('./components/get_product');
const getAPayload = require('./components/get_a_payload');
const getProductsOfTrademark = require('./components/get_products_of_trademark');
const createProduct = require('./components/create_product');
const addReview = require('./components/add_review');
const remove = require('./components/remove');
const update = require('./components/update_product');

/** ------------------------------------------------------
 * @Route {GET} /api/products/get-product/:id_product
 * @name Get_Data_Of_A_Product
 * @description get data of a product
 * @Privacy Publish
 * 
 * @param_url {String} id_product // id_product of product which we need to get
 * 
 * @responseSuccess {json} res.data // data of product
 * 
 * @responseError {json} error 
        {
           error: {
               message: String
           }
        }
 */
products.get('/get-product/:id_product', getProduct);


/** ------------------------------------------------------
 * @Route {GET} /api/products/get-a-payload
 * @name Get_A_Payload_Of_Product
 * @description get a list data of products
 * @Privacy Publish
 * 
 * @param_body {Array} id_products // a list of id_products, which we want to get
 * @param_body {Array} selections  // a list of select item we want to get of each product
 * 
 * @responseSuccess {json} res.data // data of list product
 */
products.get('/get-a-payload', getAPayload);


/** ------------------------------------------------------
 * @Route {GET} /api/products/get-products-of-trademark/:trademark
 * @name Get_A_List_Products_Of_Trademark
 * @description this api will return to you a list products has trademark which you order
 * @Privacy Publish
 * 
 * @param_url {String} trademark // trademark you want to get
 * 
 * @responseSuccess {json} res.data // data of product
 */
products.get('/get-products-of-trademark/:trademark', getProductsOfTrademark);


/** ------------------------------------------------------
 * @Route {POST} /api/products/
 * @name Create_A_Product
 * @description admin creates a product
 * @Privacy Private (admin)
 * 
 * @param_body {json} productOption // options of a product
 * @example productOption
    {
        id_product: String,
        name: String,
        tags: [],
        cost: { realCost, discountPersent, currentCost },
        options: { color, sizes },
        numberProductInStock: Number
        images: { normalSize, smallSize },
        information: {...},
        rate: { star, NumberPeopleRate },
        reviews: [],
        date: Date
    }
    --> See detail in modules/Product
 * 
 * @responseSuccess {json} res.data // data of product
 * 
 * @responseError {json}
        {
           error: {
               message: String
           }
        }
 */
products.post('/create', admin_middleware ,createProduct);


/** ------------------------------------------------------
 * @Route {PUT} /api/products/add-review
 * @name Add_A_Review
 * @description user writes a review about product
 * @Privacy Private (user)
 * 
 * @param_url  {String} id_product 
 * @param_body {json} field // a file of review item
        field: {
            user: { name, _id, avatar },
            comment: String,
            rate: Number
        }
        --> See detail in models/Product.reviews
 * 
 * @responseSuccess {json} res.data // data of product
 * 
 * @responseError {json}
        {
           error: {
               message: String
           }
        }
 */
products.put('/add-review', auth_middleware, addReview);


/** ------------------------------------------------------
 * @Route {DELETE} /api/products/remove/:id_product
 * @name Delete_A_Product
 * @description admin removes a product with id_product
 * @Privacy Private
 * 
 * @param_url {String} id_product
 * 
 * @responseSuccess {json} res.data // data of product
 */
products.delete('/remove/:id_product', admin_middleware, remove);

/** ------------------------------------------------------
 * @Route {PUT} /api/products/update/:id_product
 * @name Update_A_Product
 * @description admin changes something in a product
 * @Privacy Private
 * 
 * @param_url  {String} id_product
 * @param_body {json} newProperty // update content is here
 * 
 * @responseSuccess {json} res.data // data of product
 *
 * @responseError {json}
        {
           error: {
               message: String
           }
        }
 */
products.put('/update/:id_product', admin_middleware, update);

module.exports = products;