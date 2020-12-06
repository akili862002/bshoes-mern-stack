const fs = require("fs");
const path = require('path');
const sharp = require('sharp');
const uploadFileToFireBase = require('../../../../firebase');
const Product = require('../../../../models/Product');

function delete_file(path) {
    fs.unlink(path, (err) => {
        if (err) 
            console.error(err);
    })
}

function areAllValueTrue(obj) {
    for (let key in obj)
        if (obj[key] == false)
            return false;
    return true;
}

async function upload(req, res) {
    
    let fileName = req.nameImageFile;
    let initalImageFile = path.join(__dirname + '/../../../../uploads/' + fileName);

    req_body = JSON.parse( JSON.stringify(req.body) );
    let id_image = req_body.id_image;
    let id_product = req_body.id_product;

    let product = await Product.findOne({ id_product });
    if (!product)
        return res.status(400).json(
            { error: { message: "Product with this id_product is not found!" } }
        )

    let url_of_images = product._doc.images;

    var checkFinish = {
        normalSizeImage: false,
        smallSizeImage: false
    }

    try {
        // Resize it before put to database
        let normalSizeImagePath = path.join(__dirname + '/../../../../uploads/normal-' + fileName);

        sharp(initalImageFile)
        .resize(800, null)
        .toFile(
            normalSizeImagePath,
            (err) => { // because resize function is promise, so we need to wait result
                if (err) console.error(err)
                else {
                    uploadFileToFireBase(normalSizeImagePath, 'normal-size-' + id_image)
                        .then( async (downloadURL) => {
                            console.log(`  [FIREBASE] Upload image successfully ✔`);
                            console.log(`     |-- id_image (normal-size): ${id_image} `);
                            // console.log('        |--> URL: ' + downloadURL);

                            let index = url_of_images.normalSize
                                            .findIndex(item => item.id_image == id_image);

                            if (index !== -1) {

                                await Product.findOneAndUpdate(
                                    { id_product, "images.normalSize.id_image": id_image },
                                    { $set: { "images.normalSize.$.url": downloadURL}},
                                    { new: true },
                                );

                                product._doc.images.normalSize[index].url = downloadURL;
                                updateProductInDataOfServer(id_product, product._doc);

                            } else {
                                console.error("[ERROR] ID_PRODUCT IN NORMAL-SIZE IMAGES LIST NOT FOUND");
                                console.error("  [X] In <id_image>: ", id_image);
                                console.error("  [X] In list normal image: \n", url_of_images.normalSize);
                            }

                            delete_file(normalSizeImagePath);

                            checkFinish.normalSizeImage = true;
                            if (areAllValueTrue(checkFinish)) {
                                delete_file(initalImageFile);
                                res.send('[SERVER] Upload successfully\n  |-- id: ' + id_image);
                            }
                        })

                }
            }
        );

        // ---------------------------
        // resize: 
        let smallSizeImagePath = path.join(__dirname + '/../../../../uploads/' + "resize-" + fileName);
        // resize that image
        sharp(initalImageFile)
            .resize(300, null)
            .toFile(
                smallSizeImagePath, 
                (err) => { // because resize function is promise, so we need to wait result
                    if (err) 
                        console.error(err)
                    else {
                        uploadFileToFireBase(smallSizeImagePath, 'small-size-' + id_image)
                            .then( async (downloadURL) => {
                                console.log(`  [FIREBASE] Upload image successfully ✔`);
                                console.log(`     |-- id_image (small-size): ${id_image} `);
                                // console.log('        |--> URL: ' + downloadURL);
                                let index = url_of_images.smallSize
                                                .findIndex(item => item.id_image == id_image);
                                if (index !== -1){
                                    url_of_images.smallSize[index].url = downloadURL;

                                    await Product.findOneAndUpdate(
                                        { id_product, "images.smallSize.id_image": id_image },
                                        { $set: { "images.smallSize.$.url": downloadURL}},
                                        { new: true },
                                    )

                                    product._doc.images.smallSize[index].url = downloadURL;
                                    updateProductInDataOfServer(id_product, product._doc);

                                } else {    
                                    console.error("[ERROR] ID_PRODUCT IN NORMAL-SIZE IMAGES LIST NOT FOUND");
                                    console.error("  [X] In <id_image>: ", id_image);
                                    console.error("  [X] In list normal image: \n", url_of_images.normalSize);
                                }

                                delete_file(smallSizeImagePath);

                                checkFinish.smallSizeImage = true;
                                if (areAllValueTrue(checkFinish)) {
                                    delete_file(initalImageFile);
                                    res.send('[SERVER] Upload successfully\n  |-- id: ' + id_image);
                                }
                            });
                    }
                }
            );

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error!');
    }
}


// -------------------------------

module.exports = upload;