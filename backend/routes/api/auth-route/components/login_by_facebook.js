const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../../../models/User');

async function login_by_facebook(req, res) {
    try {
        let { facebook_id, profile } = req.body;
        console.log({ facebook_id, profile })

        if (!facebook_id) {
            return res.status(400).json({ error: "Cannot recognize user!" });
        }
            
        // Now, find that facebook_id
        let user = await User.findOne({ facebook_id }).select('-password');
        if (!user) {
            // if this user hasn't access this site before,
            // Register for this account.

            let { imageURL, name } = profile;

            // --- REGISTER
            let field = {
                // because if we use real email, it will be bug with
                // account without log in by facebook
                email: "facebook-oauth-login-api",
                // create a random password to make sure that no one can access it
                password: "nnu0n4kl912u903um;d;mq0-",
                avatar: {
                    type_avatar: "URL",
                    url: imageURL
                },
                name: name,
                facebook_id: facebook_id
            }

            user = new User(field);
            await user.save();

            delete user.password;
        } else {
            // If user register before
            // do nothing
        }

        // create our token
        payload = {
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
        console.error(error);
        res.status(500).send('Server Error!')
    }
}

module.exports = login_by_facebook;