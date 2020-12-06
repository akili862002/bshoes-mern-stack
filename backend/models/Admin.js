let mongoose = require('mongoose');
const { model } = require('./User');
let Schema = mongoose.Schema;

let AdminSchema = Schema({
    name: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true
    },
    password: {
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
    }
});

module.exports = Amin = mongoose.model('admins', AdminSchema);