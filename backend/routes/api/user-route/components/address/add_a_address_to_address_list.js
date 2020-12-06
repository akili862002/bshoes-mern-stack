const User = require('../../../../../models/User');

async function add_a_address_to_address_list(req, res) {
    try {
        let field = req.body;
        let user = await User.findOne({ _id: req.user.id })
                             .select('addressList');

        // add to user
        user.addressList.unshift( field );
        // Update it to database 
        await user.save();

        res.json('Uploaded new Address!');

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error!');
    }
}

module.exports = add_a_address_to_address_list;