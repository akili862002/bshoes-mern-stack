const User = require('../../../../../models/User');

async function edit_a_address(req, res) {
    try {
        let { index, newField } = req.body;
        let user = await User.findOne({ _id: req.user.id }).select('addressList');

        // add to user
        user.addressList[index] = newField;
        // Update it to database 
        await user.save();

        res.json('Uploaded Address!');

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error!');
    }
}

module.exports = edit_a_address;