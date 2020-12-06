const User = require('../../../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

async function register(req, res) {
    let error = {
        target: "",
        message: ""
    }

    try {
        let { email, password, name } = req.body;

        // check that email has existed?
        let user = await User.findOne({ email: email });
        if (user) { // if email has been used  --> return error
            error = {
                target: "email",
                message: "This Email was used!"
            }
            return res.status(400).json({ error });
        }

        // Hash password (encode)
        let salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);

        // Create user
        let newUser = new User({
            name,
            email,
            password
        });

        newUser.save();

        // Send token 
        let payload = {
            user: {
                id: newUser.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn: 360000},
            (err, token) => {
                if (err) throw err;
                res.json({ token }); // send the token!
            }
        );
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error!');
    }
}

module.exports = register;