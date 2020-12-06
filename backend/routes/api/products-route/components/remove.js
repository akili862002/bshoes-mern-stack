const Product = require('../../../../models/Product');

async function remove(req, res) {
    try {
        let id_product = req.params.id_product;

        await Product.remove({ id_product })

        res.send(`Removed product with id:\n-> "${id_product_delete}"`);

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
}

module.exports = remove;