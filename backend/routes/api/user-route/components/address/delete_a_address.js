const { findSubObjInArray } = require('../../../../../backup');
const User = require('../../../../../models/User');

async function delete_a_address(req, res) {
    try {    
        let user = await User.findOne({ _id: req.user.id }).select('locations');
        let locations = user.locations;
        let id_location_delete = req.params.id_location_delete;
        
        // find that id: 
        let indexs = findSubObjInArray({ _id: id_location_delete }, locations);
        if (indexs.length === 0) { // if have no id like that in list
            return res.status(400).json({
                error: { 
                    target: "id_location_delete",
                    message: "Cannot find that id in list locations!"
                }
            })
        }

        // if we finded, deleted it 
        let index = indexs[0];
        locations.splice(index, 1);

        // update database
        user.locations = locations;
        await user.save();

        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!');
    }
}

module.exports = delete_a_address;