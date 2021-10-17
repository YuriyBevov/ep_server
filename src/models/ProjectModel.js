const { Schema, model } = require('mongoose');

const projectSchema = new Schema({

}, {
  collection: 'projects'
})

module.exports = model('projectModel', projectSchema)