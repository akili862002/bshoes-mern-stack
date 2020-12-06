const image = require('express').Router();
const upload_model = require('./components/upload_model');
const upload = require('./components/upload');
const admin_middleware = require('../../../middleware/admin');

/**
 * @Route {POST} /api/image/upload
 * @name Upload_Image
 * @description admin will upload image to Firebase here
 * @Privacy Private
 * 
 * @param_format { 'image': <file> }
 * @param_format { 'id_image': id_image}
 * 
 * @ResponseSuccess {String}
 */
image.post(
    '/upload', 
    [admin_middleware, upload_model.single('image')],
    upload
)

module.exports = image;