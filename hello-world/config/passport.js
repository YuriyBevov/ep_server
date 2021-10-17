const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const mongoose = require('mongoose');
const { UserModel } = require('../models/index.js');
const { SECRET_JWT_KEY } = require('../config/keys');

let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_JWT_KEY;

module.exports = passport => {
  
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    UserModel.findOne({_id: jwt_payload.id}, (err, user) => {

          if (err) {
              return done(err, false);
          }
          if (user) {
              return done(null, user);
          } else {
              return done(null, false);
              // or you could create a new account
          }
      });

  }));
}