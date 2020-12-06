const User = require('../../../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');


async function login_by_google(req, res) {
    try {
        let {google_id, profile} = req.body;

        if (!google_id)
            return res.status(400).json({ error: "Cannot recognize user!" })

        // Now, find that google_id
        let user = await User.findOne({ google_id }).select('-password');
        if (!user) {
            // if this user hasn't access this site before,
            // Register for this account.

            let { email, imageUrl, name} = profile;

            // --- REGISTER
            let field = {
                // because if we use real email, it will be bug with
                // account without log in by google
                email: email + '-google_oauth',
                // create a random password to make sure that no one can access it
                password: "96bkjbd980u31444eqw644654dmcoio00803",
                avatar: {
                    type_avatar: "URL",
                    url: imageUrl
                },
                name: name,
                google_id: google_id
            }

            user = new User(field);
            await user.save();

            delete user.password;
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
        res.status(500).send('Server Error!');
    }
} 

module.exports = login_by_google;