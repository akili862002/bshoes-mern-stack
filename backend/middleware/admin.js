const jwt = require('jsonwebtoken');
const config = require('config');


let admin_middleware = async (req, res, next) => {
    try {     
        let key = "admin-code-bshoes";
        let token = req.header(key);

        if (!token) {
            return res.status(401).send('No Token!. Please provide token.');
        }

        // decode that token
        let decode = jwt.verify(token, config.get('jwtSecret'));
        req.admin = decode.admin;
        next();
    } catch (error) {
        console.error(error.message);
        res.status(401).send('Token admin is not valid!');
    }
}

module.exports = admin_middleware;