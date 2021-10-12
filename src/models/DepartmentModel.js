const { Schema, model } = require('mongoose');

const DepartmentSchema = new Schema({
    title: { type: String, required: true },
    heads: { type: Array },
    members: { type: Array },
    tasks: { type: Array, default: null }
}, {
  collection: 'departments'
})

module.exports = model('DepModel', DepartmentSchema)