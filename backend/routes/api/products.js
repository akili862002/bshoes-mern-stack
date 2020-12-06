const express = require('express');
const router = express.Router();
const fs = require('fs');
const Product = require('../../models/Product');
const Public = require('../../models/Public');
const admin_middleware = require('../../middleware/admin');
const auth_middleware = require('../../middleware/auth');
const { 
    getIndexOfItemInArrayHaveSameSubObj, 
    isSubObjInArray, 
    getSuggestionsWithInputText, 
    splitArray,
    getProductsByTopic
} = require('../../backup');
const { FilterAndSortData } = require('../../data-handler');


// @Router: POST /api/products/search-detail/:search_text
// @Desc   : Get products of current page
// @Req 
/*
    params: search_text
    body  : {
        filterAndSortTargets, 
        currentPage
    }
 */
// Public
router.post(
    '/search-detail/:search_text',
    async (req, res) => {
        try {
            fs.readFile(
                __dirname + "/../../data/list_product.json",
                'utf8',
                async (err, data) => {
                    if (err) {
                        return console.error(err);
                    }

                    let products = JSON.parse(data);

                    let search_text = req.params.search_text;
                    let { filterAndSortTargets, currentPage } = req.body;

                    if (search_text.length == 0)
                        return res.status(400).json(
                            {
                                error: {
                                    message: "Your search text is empty, please provide text!"
                                }
                            }
                        );

                    let suggestions = await getSuggestionsWithInputText(search_text, products);
                    let totalProductFound = suggestions.length;
                    suggestions = await FilterAndSortData(filterAndSortTargets, suggestions);
                    
                    // now we need to split list suggestion to many page
                    // Number maximum product we use in each page will be 20 product
                    let suggestionPages = await splitArray(20, suggestions);

                    let dataOfCurrentPage = [];
                    if (suggestionPages.length > 0)
                        dataOfCurrentPage = suggestionPages[currentPage];

                    res.json({
                        dataOfCurrentPage,
                        currentPage,
                        totalProductFound,
                        totalPage: suggestionPages.length
                    });
                }
            );
        } catch (error) {
            console.error(err);
            res.status(500).send('Server Error!');
        }
    }
);


// @Router: POST /api/products/search-by-topic/:search_text
// @Desc   : Get products by topic of current page
// @Req 
/*
    params: search_text
    body  : {
        filterAndSortTargets, 
        currentPage
    }
 */
// Public
router.post(
    '/search-by-topic/:topic',
    async (req, res) => {
        try {
            fs.readFile(
                __dirname + "/../../data/list_product.json",
                'utf8',
                async (err, data) => {
                    if (err) {
                        return console.error(err);
                    }

                    let products = JSON.parse(data);

                    let topic = req.params.topic;
                    let { filterAndSortTargets, currentPage } = req.body;

                    if (topic.length == 0)
                        return res.status(400).json(
                            {
                                error: {
                                    message: "Your search text is empty, please provide text!"
                                }
                            }
                        );

                    let suggestions = await getProductsByTopic(topic, products);
                    let totalProductFound = suggestions.length;
                    suggestions = await FilterAndSortData(filterAndSortTargets, suggestions);
                    
                    // now we need to split list suggestion to many page
                    // Number maximum product we use in each page will be 20 product
                    let suggestionPages = await splitArray(20, suggestions);

                    let dataOfCurrentPage = [];
                    if (suggestionPages.length > 0)
                        dataOfCurrentPage = suggestionPages[currentPage];

                    res.json({
                        dataOfCurrentPage,
                        currentPage,
                        totalProductFound,
                        totalPage: suggestionPages.length
                    });
                }
            );
        } catch (error) {
            console.error(err);
            res.status(500).send('Server Error!');
        }
    }
);


// @Router: POST /api/products/event/:event
// @Desc   : Get products by topic of current page
// @Req 
/*
    params: search_text
    body  : {
        filterAndSortTargets, 
        currentPage
    }
 */
// Public

let getPublicNameFromParams = {
    "flash-sales" : "flash-sales-products",
    "most-popular": "most-popular-products",
    "you-may-like": "random-products"
}
router.get(
    '/event/:event',
    async (req, res) => {
        try {
            let event_name = req.params.event;
            fs.readFile(
                __dirname + "/../../data/list_product.json",
                'utf8',
                async (err, data) => {
                    if (err) {
                        return console.error(err);
                    }

                    let products = JSON.parse(data);
                    let public = await Public.findOne({ name: getPublicNameFromParams[event_name] }); 
                    let id_products = public._doc.data;

                    let payload = [];
                    for (let id_product of id_products) {
                        let product = products[id_product];
                        payload.push(product);
                    }
                    
                    res.json(payload);
                    
                }
            );
        } catch (error) {
            console.error(err);
            res.status(500).send('Server Error!');
        }
    }
);

module.exports = router;