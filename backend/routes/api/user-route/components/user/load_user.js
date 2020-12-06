const User = require('../../../../../models/User');

async function load_user (req, res) {
    try {
        let user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(400).json(
                {
                    error: {
                        message: "Something wrong!. Cannot find that user!"
                    }
                }
            );
        }

        res.json(user);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!')
    }
}

module.exports = load_user;
