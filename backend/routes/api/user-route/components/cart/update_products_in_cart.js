const User = require('../../../../../models/User');

async function update_products_in_cart(req, res) {
    try {
        let products_in_cart = req.body;
        let update = { 'cart.products': products_in_cart }
        User.findByIdAndUpdate(
            req.user.id,
            { $set: update },
            { new: true },
            (err) => {
                if (err) {
                    console.error(err);
                    return res.status(400).json({ error: { message: "Update Fail!" } })
                }

                res.send('Update Success!');
            }
        )

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!')
    }
}

module.exports = update_products_in_cart;