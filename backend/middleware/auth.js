const jwt = require('jsonwebtoken');
const config = require('config');

let auth_middleware = async (req, res, next) => {
    try {
        let key = "code-bshoes";
        let token = req.header(key);
    
        // check if it doesn't have any token
        if (!token) {
            return res.status(401).send("No token!");
        }
    
        // if we have token, 
        // then DECODE it
        let decode = jwt.verify(token, config.get('jwtSecret'))
        req.user = decode.user;
        next();
    } catch (error) {
        console.error(error.message);
        res.status(401).send('Token is not valid!')
    }
}

module.exports = auth_middleware;