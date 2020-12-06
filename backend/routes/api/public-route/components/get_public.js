const Public = require('../../../../models/Public');

async function getPublic(req, res) {
    try {
        let name = req.params.name;
        
        let public = await Public.findOne({ name });

        if (!public) {
            return res.status(400).json(
                {
                    error: { message: "Public not found!" }
                }
            );
        }

        res.json(public.data);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error!')
    }
}

module.exports = getPublic;
