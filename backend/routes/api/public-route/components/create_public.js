const Public = require('../../../../models/Public');

async function createPublic(req, res) {
    try {
        let { name, data } = req.body;
            
        // if name wasn't exist, we create new one
        let public = await Public.findOne({ name });
        if (public) 
            return res.status(400).json(
                {
                    error: {
                        message: "This name public was used!"
                    }
                }
            )
            
        public = new Public({
            name,
            data
        });

        await public.save();

        res.send('Add new public successfully!');

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error!')
    }
}

module.exports = createPublic;