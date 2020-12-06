const User = require('../../../../../models/User');

async function update_user(req, res) {
    try {
        let update_option = req.body;

        let user = await User.findByIdAndUpdate(
            req.params.id_user,
            { $set: update_option },
            { new: true }
        );

        if (!user) {
            res.status(400).json({ error: { message: "id_user is not exist!" }});
        }

        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!');
    }
}

module.exports = update_user;