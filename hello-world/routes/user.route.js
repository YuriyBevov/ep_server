const express = require('express');
const userRoute = express.Router();
const controllers = require('../controllers/user.controllers');

userRoute.post('/add_user', controllers.registration);
userRoute.post('/login', controllers.login);
userRoute.get('/get_users', controllers.getAll);

module.exports = userRoute;