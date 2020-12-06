const Product = require('../../../../models/Product');
const User = require('../../../../models/User');

async function addReview(req, res) {
    try {
        let id_product = req.params.id_product;
        let field = req.body;
        field.user._id = req.user.id;

        let product = await Product.findOne({ id_product }).select('reviews rate');
        let user = await User.findById( req.user.id );
        if (!user) {
            return res.status(400).json(
                { error: { message: "User not found!" } }
            );
        }

        product.reviews.unshift(field);
        // calculate star 
        let { star, NumberPeopleRate } = product.rate;
        let sumRateStar = NumberPeopleRate * star;
        let newStar = (sumRateStar + field.rate) / (NumberPeopleRate + 1);

        // Update
        product.rate.star = newStar;
        product.rate.NumberPeopleRate += 1;
        
        await product.save();

        res.send('Updated!');

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
}

module.exports = addReview;