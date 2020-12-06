const admin = require('express').Router();
const admin_middleware = require('../../../middleware/admin');
// import Routes
const register = require('./components/register');
const login = require('./components/login');
const getAllUser = require('./components/get_all_user');
const load = require('./components/load');

/** ------------------------------------------
 * @Route {POST} /api/admin/register
 * @name Admin_Register 
 * @group Admin
 * @description register an admin account here. Just enable 
 * @Privacy publish
 * 
 * @param_body {String} name      Name of user
 * @param_body {String} email     Email of user
 * @param_body {String} password  Password of user
 * @param_body {String} key_admin key_admin is private key which just has if you are right admin
 * 
 * @ResponseSuccess {json} Object res.data = { token }
 * 
 * @ResponseError {json} 
        {
            error: {
                targer: String
                message: String
            }
        }
 */
admin.post('/register', register);

/** ------------------------------------------
 * @Route {POST} /api/admin/login
 * @name Admin_Login
 * @group Admin
 * @description log in to admin account and take token
 * @Privacy publish
 * 
 * @param_body {String} email     Email of user
 * @param_body {String} password  Password of user
 * 
 * @ResponseSuccess {json} Object res.data = { token }
 * 
 * @ResponseError {json} 
        {
            error: {
                targer: String
                message: String
            }
        }
 */
admin.post('/login', login);


/** ------------------------------------------
 * @Route {GET} /api/admin/load
 * @name Load_Admin
 * @group Admin
 * @description load admin data
 * @Privacy Private
 * 
 * @ResponseSuccess {json} data data of admin 
 * 
 * @ResponseError {json} 
        {
            error: {
                message: String
            }
        }
 */
admin.get('/load', admin_middleware, load);

/** ------------------------------------------
 * @Route {GET} /api/admin/get-all-user
 * @name Admin_Gets_All_User
 * @group Admin
 * @description admin gets all user
 * @Privacy Private
 * 
 * @ResponseSuccess {json} Object res.data = { token }
 */
admin.get('/get-all-user', admin_middleware, getAllUser);


module.exports = admin;