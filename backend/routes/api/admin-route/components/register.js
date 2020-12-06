const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const Admin = require('../../../../models/Admin');
 
async function register(req, res) {
    let error = {
        target: "",
        message: ""
    }

    try {
        let { name, email, password, key_admin } = req.body;
        // First, check key-admin to make sure that this guy has a right!
        if (key_admin !== config.get('admin-private-key')) {
            error = {
                target: "key_admin",
                message: "Key-Admin is wrong!"
            }
            return res.status(400).json({ error });
        }

        
        // Then, check that has this email existed already?
        let admin = await Admin.findOne({ email });
        if (admin) { // if email was register --> err
            error = {
                target: "email",
                message: "This Email was used!"
            }
            return res.status(400).json({ error });
        }

        // Else, we need to encode the password
        let salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);

        // Create a new admin
        admin = new Admin({
            name,
            email,
            password,
        });

        await admin.save();

        let payload = {
            admin: {
                id: admin.id,
            }
        };
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 360000 },
            (error, token) => {
                if (error) throw error;

                // if register success we will send to client admin data and client
                res.json({ token });
            }
        );

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!')
    }
}

module.exports = register;
