const User = require('../../../../../models/User');
const Product = require('../../../../../models/Product');

let selection = ([
    'name',
    'cost',
    'images',
    'options.color',
    'information.trademark',
    'id_product'
]).join(' ');

async function load_cart(req, res) {
    try {
        let user = await User.findById(req.user.id).select('cart.products');
        let id_products = user._doc.cart.products.map((product) => product.id_product);
        // let data = [];

        let products = await Product.find({ id_product: { $in: id_products } })
                                    .select(selection);

        res.json(products);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error!')
    }
}

module.exports = load_cart;