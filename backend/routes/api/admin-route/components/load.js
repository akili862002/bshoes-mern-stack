const Admin = require('../../../../models/Admin');

async function load(req, res) {

    try {
        let admin = await Admin.findById(req.admin.id).select('-password');
        if (!admin) {
            res.status(400).json(
                { error: 
                    { message: "Something wrong!. Cannot find that admin!"}
                }
            );
        }
        
        res.json(admin);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!')
    }
}

module.exports = load;
