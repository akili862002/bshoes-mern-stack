const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const connectDB = require('./config/db');

// Connect to mongoDB server --
connectDB();

// Init Middleware
app.use( express.json({ extended: false }) );
app.use( bodyParser.urlencoded({ extended: false }) );
app.use( bodyParser.json() );

app.use('/api/auth', require('./routes/api/auth-route'));
app.use('/api/user', require('./routes/api/user-route'));

app.use('/api/image', require('./routes/api/image-route'));
app.use('/api/admin', require('./routes/api/admin-route'));

app.use('/api/products', require('./routes/api/products-route'));
app.use('/api/client', require('./routes/api/client-route'));
app.use('/api/public', require('./routes/api/public-route'));

//server static accets in production
// Just uncomment below when we want to push to Real Server

/*

app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/*', function(_, res) {
    res.sendFile(path.resolve('./frontend/index.html'), function(err) {
        if (err) {
            res.status(500).json(err);
        }
    })
})

*/

let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[SERVER] Server starts on port ${PORT}`);
});