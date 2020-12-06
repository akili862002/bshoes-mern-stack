const Public = require('../../../../models/Public');
const Product = require('../../../../models/Product');

let getPublicNameFromParams = {
    "flash-sales" : "flash-sales-products",
    "most-popular": "most-popular-products",
    "random-products": "random-products"
}

async function getSlickSlide(req, res) {
    try {
        let title = req.params.title;

        let public_name = getPublicNameFromParams[title];
        let public = await Public.findOne({ name: public_name });
        let id_products = public._doc.data;

        let payload = await Product.find(
            { 
                $in: { 
                    id_product: id_products 
                }
            }
        ).limit(8);
        
        res.json(payload);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error!')
    }
}

module.exports = getSlickSlide;