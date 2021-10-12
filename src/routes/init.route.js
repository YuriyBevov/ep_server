const express = require('express');
const initRoute = express.Router();
const controllers = require('../controllers/init.controllers');

initRoute.get('/init_app', controllers.initApp);

module.exports = initRoute;