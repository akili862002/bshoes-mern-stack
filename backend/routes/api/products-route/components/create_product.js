const Product = require('../../../../models/Product');
const Public = require('../../../../models/Public');
const { 
    getIndexOfItemInArrayHaveSameSubObj, 
    isSubObjInArray
} = require('../../../../backup');

async function createProduct(req, res) {

    try {
        let productOption = req.body;
        
        let name = productOption.name;

        // make sure that this name product hasn't existed!
        let product = await Product.findOne({ name });
        if (product) {
            return res.status(400).json(
                { errors: { message: "This name product was used!" } }
            )
        }
        
        // create a new product in database
        product = new Product(productOption);
        // console.log(product);


        // Now we need to add this item to "name-products" Public storage
        let name_products_storage = await Public.findOne({ name: "name-products" });

        if ( !isSubObjInArray({ id_product: product.id_product }, name_products_storage._doc.data))
            name_products_storage.data.unshift({
                name: product.name,
                trademark: product.information.trademark,
                id_product: product.id_product
            });

        // -----------------
        // Next, add id_product to trademark list storage
        let trademarks_storage = await Public.findOne({ name: "trademarks" });

        let trademarks = trademarks_storage.data;
        let trademark = product.information.trademark.toUpperCase();

        let index = getIndexOfItemInArrayHaveSameSubObj({ trademark }, trademarks);

        if (index == -1) {
            // If this trademark is new one in list trademark,
            // Create a new one
            trademarks.push({
                trademark: trademark,
                id_products: [
                    product.id_product
                ]
            }); 

        } else {
            trademarks[index].id_products.push(product.id_product);
        }

        await Public.findOneAndUpdate(
            { name: "trademarks" },
            { $set: {
                    data: trademarks
                } 
            },
            { new: true }
        )

        // console.log(trademarks_storage.data[index]);

        // finally. Update it to database
        await product.save();
        await name_products_storage.save();
        updateProductInDataOfServer(product.id_product, product._doc);

        res.send('Upload Successfully!');

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!');
    }

}

module.exports = createProduct;

