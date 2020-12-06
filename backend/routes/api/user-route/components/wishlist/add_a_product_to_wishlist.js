const User = require('../../../../../models/User');
const { findSubObjInArray, isSubObjInArray } = require('../../../../../backup');

async function add_a_product_to_wishlist(req, res) {
    try {
        let user = await User.findOne({ _id: req.user.id })
                             .select('wishlist cart');

        let wishlist_products = user._doc.wishlist.products;
        let cart_products = user._doc.cart.products;
        let newProduct = req.body;

        // make sure this product hasn't be in wishlist before
        if ( !isSubObjInArray({ id_product: newProduct.id_product }, wishlist_products) ) {
            // Add new product to wishlist
            user.wishlist.products.unshift(newProduct);
            
            let index = findSubObjInArray({ id_product: newProduct.id_product }, cart_products)[0];
            if ( index != undefined ) {
                user.cart.products.splice(index, 1);
            }
        }
        
        await user.save();

        res.send('Updated!');

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!')
    }
}

module.exports = add_a_product_to_wishlist;