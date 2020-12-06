const Public = require('../../../../models/Public');

async function setup(req, res) {
    try {

        let setups = req.body;
        for (let setup of setups) {
            let { name, data } = setup;
            
            // if name wasn't exist, we create new one
            let public = await Public.findOne({ name });
            if (!public) {
                public = new Public({
                    name,
                    data
                })

                await public.save();

            }
        }

        res.send("Set up a new public!");
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!');
    }
}

module.exports = setup;