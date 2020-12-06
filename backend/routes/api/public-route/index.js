const public = require('express').Router();
const admin_middleware = require('../../../middleware/admin');

// import routes
const createPublic = require('./components/create_public');
const getPublic = require('./components/get_public');
const setup = require('./components/setup');
const update = require('./components/update');

/** ------------------------------------------------------
 * @Route {POST} /api/public/create
 * @name Create_Public 
 * @description admin creates public
 * @Privacy Private
 * 
 * @param_body {String} name // name of public
 * @param_body {Array} data  // data of public you wanna set
 * 
 * @responseSuccess {String}
 * 
 * @responseError {json} error 
        {
            error: {
                message: String
            }
        }
 */
public.post('/create', admin_middleware, createPublic);

/** ------------------------------------------------------
 * @Route {GET} /api/public/get/:name
 * @name Get_Public
 * @description get public
 * @Privacy Private
 * 
 * @param_url {String} name // name of public
 * 
 * @responseSuccess {Array} res.data // data
 * 
 * @responseError {json} error 
        {
           error: {
               message: String
           }
        }
 */
public.get('/get/:name', getPublic);

/** ------------------------------------------------------
 * @Route {POST} /api/public/setup
 * @name Setup_Publics
 * @description admin sets up whole public
 * @Privacy Private
 * 
 * @param_body {Array} setups
        setups = [
            {
                name: String,
                data: []
            }
        ]
 * 
 * @responseSuccess {String}
 */
public.post('/setup', admin_middleware, setup);

/** ------------------------------------------------------
 * @Route {PUT} /api/public/update/:name
 * @name Update_Public
 * @description admin updates public
 * @Privacy Private
 * 
 * @param_url  {String} name // name of public
 * @param_body {Array}  data // data which we want to update
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
public.put('/update/:name', admin_middleware, update);

module.exports = public;