const path = require('path');
const multer = require('multer');


let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        let saveWithNameFile = file.fieldname + '-' + Date.now() + ext; // f.e: 'image-1503213.jpg 
        // store file name in req
        req.nameImageFile = saveWithNameFile;
        // save file in to uploads folder
        cb(null, saveWithNameFile)
    }
});

module.exports = upload = multer({ storage });