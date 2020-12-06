const User = require('../../../../../models/User');
const Product = require('../../../../../models/Product');


let selection = [
    'name',
    'cost',
    'images',
    'information.trademark',
    'id_product',
    'options.color',
    'rate'
].join(' ');

async function load_wishlist(req, res) {
    try {
        let user = await User.findById(req.user.id).select('wishlist.products');
        let id_products = user._doc.wishlist.products.map((product) => product.id_product);

        let products = await Product.find({ id_product: { $in: id_products } })
                                    .select(selection);

        res.json(products);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error!')
    }
}

module.exports = load_wishlist;