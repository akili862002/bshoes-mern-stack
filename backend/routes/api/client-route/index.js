const client = require('express').Router();
const getSlickSlide = require('./components/slick-slide');

/**
 * @Route {GET} /api/client/get-slick-slide/:title
 * @name Get_Slick_Slide_Data
 * @description front-end will get data from public which admin set before, 
 *              then send to user data of all product
 * @Privacy Publish
 * 
 * @param_url {String} title // title of slick-slide
 * 
 * @ResponseSuccess {json} res.data // data of all product
 */
client.get('/get-slick-slide/:title', getSlickSlide);

module.exports = client;