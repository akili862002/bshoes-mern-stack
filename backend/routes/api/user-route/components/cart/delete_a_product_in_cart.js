const User = require('../../../../../models/User');

async function delete_a_product_in_cart(req, res) {
    try {

        let id_product = req.params.id_product;
        console.log('[ORDER] Delete id_product: ', id_product);

        User.findByIdAndUpdate(
            req.user.id,
            { 
                $pull: { // remove a item
                    "cart.products":  { id_product } 
                }
            },
            (err, mongo_res) => {
                console.log(mongo_res.cart.products);
                if (err) {
                    console.error(err);
                    return res.status(400).json({
                        error: { message: "Delete Fail In MongoDb" }
                    })
                }

                res.send('[SUCCESS] Deleted id_product: ' + id_product);
            }
        );

    } catch (err) {
        console.error(error.message);
        res.status(500).send('Server Error!');
    }
}

module.exports = delete_a_product_in_cart;