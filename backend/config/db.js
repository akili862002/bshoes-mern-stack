const config = require('config');
const mongoose = require('mongoose');

let connectDB = async () => {
    try {
        console.log('[SERVER -> MONGODB] Connect to MongoDB ... ');

        await mongoose.connect(config.get('mongoURL'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        .then(res => {
            console.log('[SERVER -> MONGODB] Connected - (✔)');
        })
        .catch(err => {
            console.log('[SERVER -> MONGODB] FAIL - (❌)');
        })
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;