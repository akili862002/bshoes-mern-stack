const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const Admin = require('../../../../models/Admin');

async function login(req, res) {
    let error = {
        target:"",
        message: ""
    }

    try {
        let {email, password} = req.body;
        // Check email
        let admin = await Admin.findOne({ email });
        if (!admin) {
            error = {
                target: "email",
                message: "Email is not exist!"
            }
            return res.status(400).json({ error });
        }

        // Check password
        let isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            error = {
                target: "password",
                message: "Password is not match!"
            }
            return res.status(400).json({ error });
        }

        // if email and password is correct           
        // send user Token
        let payload = {
            admin: {
                id: admin.id,
            }
        };
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 3600 },
            (error, token) => {
                if (error) throw error;
                res.json({ token });
            }
        )

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!')
    }
}

module.exports = login;