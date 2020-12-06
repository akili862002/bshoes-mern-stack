const Product = require('../../../../models/Product');
const Public = require('../../../../models/Public');
const { getIndexOfItemInArrayHaveSameSubObj } = require('../../../../backup');

async function getProductsOfTrademark(req, res) {
    try {

        let trademark = req.params.trademark;

        trademark = trademark.toUpperCase().replace(/-/g, ' ');

        let trademarks = await Public.findOne({ name: "trademarks"});
        trademarks = trademarks._doc.data;

        let index = getIndexOfItemInArrayHaveSameSubObj({ trademark }, trademarks);
        let id_products = trademarks[index].id_products;

        let payload = await Product.find(
            {
                $in: {
                    id_product: id_products
                }
            }
        );

        res.json(payload);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error!');
    }
}

module.exports = getProductsOfTrademark;