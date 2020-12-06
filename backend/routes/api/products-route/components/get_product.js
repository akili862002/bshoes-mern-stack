const Product = require('../../../../models/Product');

async function getProduct(req, res) {
    try {
        let id_product = req.params.id_product;
        
        let product = await Product.findOne({ id_product });
        if (!product) {
            return res.status(400).json(
                { error: {
                    message: "Not Found Product!"
                }}
            );
        }

        res.json(product);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!');
    }
}

module.exports = getProduct;