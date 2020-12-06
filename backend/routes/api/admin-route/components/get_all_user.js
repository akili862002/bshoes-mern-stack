const User = require('../../../../models/User');

async function getAllUser(req, res) {
    try {
        let users = await User.find().select('name email google_id');
        res.json(users)
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error!');
    }
}

module.exports = getAllUser;
