const express = require('express');
const authRoute = express.Router();
const controllers = require('../controllers/auth.controllers');
const passport = require('passport');

authRoute.get('/auth', passport.authenticate('jwt', {
    session: false
}), controllers.auth);

module.exports = authRoute;