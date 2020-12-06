const Product = require('../../../../models/Product');

async function update(req, res) {
    try {
        let id_product = req.params.id_product;

        let newProperty = req.body;
    
        let product = await Product.findOneAndUpdate(
            { id_product },
            { $set: newProperty },
            { new: true }
        );

        if (!product) {
            return res.status(400)
                .json(
                    { 
                        error: { 
                            message: "That product with this Id is not exist!" 
                        }
                    }
                );
        }

        res.json(product);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error!')
    }
}

module.exports = update;