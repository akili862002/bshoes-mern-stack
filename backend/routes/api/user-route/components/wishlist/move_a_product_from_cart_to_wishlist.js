const User = require('../../../../../models/User');

async function move_a_product_from_cart_to_wishlist(req, res) {
    try {
        let user = await User.findById( req.user.id )
                             .select('cart wishlist');
        if (!user) {
            return res.status(400).json({ error: "User is not exist!" });
        }

        let index = req.params.index;
        // get product which needed to transfer
        let product = user.cart.products[index];
        // delete this product in cart
        user.cart.products.splice(index, 1);
        // add it to wishlist
        user.wishlist.products.unshift(product);

        // Save to database
        await user.save();

        res.send('Moved!')

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error!');
    }
}

module.exports = move_a_product_from_cart_to_wishlist;