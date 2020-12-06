const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Product = Schema({
    id_product: {
        type: String,
        required: true 
    },
    name: {
        type: String,
        required: true 
    },
    tags: [],
    cost: {
        realCost: {
            type: Number,
            currency: "USD",
            required: true 
        },
        discountPersent: {
            type: Number,
            default: 0
        },
        currentCost: {
            type: Number,
            currency: "USD"
        }
    },
    options: {
        color: {
            type: String,
            required: true
        },
        sizes: []
    },
    numberProductInStock: {
        type: Number,
        required: true
    },
    images: {
        // each image in array is URL of that image
        //  All image was stored in Firebase storage
        normalSize: [ // width is 800px
            {
                id_image: {
                    type: String,
                    required: true
                },
                url: {
                    type: String,
                    default: ""
                }
            }
        ], 
        smallSize: [ // width is 200px
            {
                id_image: {
                    type: String,
                    required: true
                },
                url: {
                    type: String,
                    default: ""
                }
            }
        ]   
    },
    information: {
        trademark: {
            type: String,
            required: true
        },
        describe: {
            type: String
        },
        condition: {
            type: String, 
            default: "New Product"
        },
        dataSheet: [
            {
                name: {
                    type: String,
                    required: true
                },
                property: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    rate: {
        star: {
            type: Number,
            default: -1 // -1 mean Nobody has rated this
        },
        NumberPeopleRate: {
            type: Number,
            default: 0        
        }
    },
    reviews: [
        {
            user: {
                name: {
                    type: String,
                    required: true
                },
                _id: {
                    type: String,
                    required: true
                },
                avatar: {
                    type: String // URL
                }
            },
            comment: {
                type: String
            },
            rate: {
                type: Number
            },
            date: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = Product = mongoose.model('products', Product);