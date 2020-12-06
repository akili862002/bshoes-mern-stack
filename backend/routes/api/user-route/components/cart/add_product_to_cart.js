const { findSubObjInArray, isSubObjInArray } = require('../../../../../backup');
const User = require('../../../../../models/User');

async function add_product_to_cart(req, res) {
    try {
        let user = await User.findOne({ _id: req.user.id }).select('cart wishlist');

        let cart_products = user._doc.cart.products;
        let wishlist_products = user._doc.wishlist.products;

        let newProduct = req.body;

        // make sure this product hasn't be in cart before
        if ( !isSubObjInArray({ id_product: newProduct.id_product }, cart_products) ) {
            // First, add new product to cart
            user.cart.products.unshift(newProduct);

            // Now, make sure that have no product like this in wishlist
            let index = findSubObjInArray({ id_product: newProduct.id_product }, wishlist_products)[0];
            if (index != undefined) {
                // Remove it from wishlist products
                user.wishlist.products.splice(index, 1);
            }
        }

        await user.save();

        res.send('Updated!');

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!')
    }
} 

module.exports = add_product_to_cart;