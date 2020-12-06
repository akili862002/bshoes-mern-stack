const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../../../models/User');

async function login(req, res) {
    let error = {
        target: "",
        message: ""
    }

    try {
        let { email, password } = req.body;

        // first step is check that email is exist 
        let user = await User.findOne({ email });
        if (!user) { // if we don't find any email like this
            error = {
                target: "email",
                message: "Email doesn't exist!"
            }
            return res.status(400).json({ error });
        }

        // Check Pasword 
        let isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) { // if wrong password
            error = {
                target: "password",
                message: "Wrong Password!"
            }
            return res.status(400).json({ error });
        }

        // If this user is correct
        // create token
        let payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 360000 },
            async (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );


    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!');
    }
}

module.exports = login;