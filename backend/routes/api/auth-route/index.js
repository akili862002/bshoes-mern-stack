const auth_router = require('express').Router();
// import routes
const register = require('./components/register');
const login = require('./components/login');
const login_by_google = require('./components/login_by_google');
const login_by_facebook = require('./components/login_by_facebook');

/** ------------------------------------------
 * @Route {POST} /api/user/register
 * @name User_Register 
 * @Group User
 * @description user registers a new account
 * @Privacy Publish
 * 
 * @param_body {String} name      //Name of user
 * @param_body {String} email     //Email of user
 * @param_body {String} password  //Password of user
 * 
 * @ResponseSuccess {Object} Object res.data = { token }
 */
auth_router.post('/register', register);


/** ------------------------------------------
 * @Route {POST} /api/user/login
 * @name User_Login
 * @Group User
 * @description login to user and take token
 * @Privacy Publish
 * 
 * @param_body {String} email    // Email user
 * @param_body {String} password // Password of user
 * 
 * @ResponseSuccess {String} token // token was generated from id
 */
auth_router.post('/login', login);


/** ------------------------------------------
 * @Route {POST} /api/user/login-by-google
 * @name User_Login_By_Google
 * @Group User
 * @description user logs in by google. If user hasn't had account before, \
 *              they will be registered. 
 * @Privacy Publish
 * 
 * @param_body {String} google_id // google_id which was given when user login by google
 * @param_body {String} profile   // profile was sent us profile of that user logged by google
 * 
 * @example body = {
 *      google_id: "3213151208843"
 *      profile: { name, avatar, ...} <-- provided by GoogleOAuth
 * }
 * 
 * @ResponseSuccess {String} token token was generated from id
 */
auth_router.post('/login-by-google', login_by_google);


/** ------------------------------------------
 * @Route {POST} /api/user/login-by-facebook
 * @name User_Login_By_Facebook
 * @Group User
 * @Privacy Publish
 * @description user logs in by facebook. If user hasn't had account before, \
 *              they will be registered. 
 * 
 * @param_body {String} facebook_id // facebook_id was given when user login by facebook
 * @param_body {String} profile     // Profile was sent us profile of that user logged by Facebook
 * 
 * @example 
 * body = {
 *      facebook_id: "431243512432424"
 *      profile: { name, avatar, ...} <-- provided by FacebookOAuth
 * }
 * 
 * @ResponseSuccess {String} token // token was generated from id
 */
auth_router.post('/login-by-facebook', login_by_facebook);


module.exports = auth_router;