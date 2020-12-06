const Public = require('../../../../models/Public');

async function update(req, res) {
    try {
        let name = req.params.name;

        let newProperty = {
            data: req.body.data
        };

        let public = await Public.findOneAndUpdate(
            { name },
            { $set: newProperty },
            { new: true }
        );

        if (!public) {
            return res.status(400).json(
                {
                    error: { 
                        message: "name Public not found" 
                    }
                }
            );
        }

        res.json(public);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error!')
    }
}

module.exports = update;