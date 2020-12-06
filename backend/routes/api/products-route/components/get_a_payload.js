const Product = require('../../../../models/Product');

async function getAPayload(req, res) {
    try {
        
        let { id_products, selections } = req.body;

        // convert selections from array to string
        selections = selections.join(' ');

        let payload = await Product.find(
            {
                $in: { 
                    id_product: id_products 
                } 
            }
        ).select(selections);

        res.json(payload);

    } catch(err) {
        console.error(err);
        res.status(500).send('Server Error!');
    }
}

module.exports = getAPayload;