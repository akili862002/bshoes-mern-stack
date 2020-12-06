const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = Schema({
    email: {
        type: String,
        required: true 
    },
    password: {
        type: String,
        required: true
    },
    google_id: {
        type: String
    },
    facebook_id: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type_avatar: {
            type: String, // BASE64 | URL | NONE
            default: "NONE"
        },
        url: {
            type: String
        },
        img: {
            type: Buffer,
            contentType: String
        }
    },
    addressList: [
        {
            name: {
                type: String,
                required: true 
            }, 
            location: {
                type: String,
                required: true 
            }, 
            phone: {
                type: String,
                required: true 
            }
        }
    ],
    cart: {
        products: [
            {
                id_product: {
                    type: String,
                    required: true
                },
                number: {
                    type: Number,
                    required: true
                },
                size: {
                    type: String,
                    required: true
                },
                color: {
                    type: String
                }
            }
        ],
        data: []
    },
    wishlist: {
        products: [
            {
                id_product: {
                    type: String,
                    required: true
                },
                number: {
                    type: Number,
                    required: true
                },
                size: {
                    type: String
                }
            }
        ],
        data: []
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = User = mongoose.model('user', UserSchema);