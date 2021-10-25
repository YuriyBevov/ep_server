const { Schema, model } = require('mongoose');

const TaskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: 'isOpened' },
    members: { type: Array, default: null },
    performers: { type: Array, default: null },
    master: { type: Object, default: null },
    projectMember: { type: String },
    priority: { type: Number },
    expDate: { type: Date },
    created: { type: Date, required: true},
    createdBy: { type: Object, required: true },
    subtasks: { type: Array },
    department: { type: String }
}, {
  collection: 'tasks'
})

module.exports = model('TaskModel', TaskSchema)