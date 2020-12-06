const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let publicSchema = Schema({
    name: {
        type: String,
        required: true 
    },
    data: []
});

module.exports = Public = mongoose.model('publics', publicSchema)