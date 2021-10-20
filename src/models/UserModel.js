const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    login: { type: String },
    password: { type: String },
    ordinalNumber: { type: Number, required: true },

    name: { type: String, required: true },
    surname: { type: String, required: true },
    fullName: { type : String},

    created: { type: Date, required: true},
    //---Отдел пользователя
    department: { type: String, default: null },
    isDepartmentHead: { type: Boolean, default: false },
    //---

    //--- Задачи пользователя
    tasksMember: { type: Array },
    tasksPerformer: { type: Array },
    tasksMaster: { type: Array },
    //---
    roles: { type: Array, required: true },
    permits: { type: Array },

    email: { type: String },
    phone: { type: String, required: true},

    usersGroup: { type: Array }

}, {
  collection: 'users'
})

module.exports = model('UserModel', UserSchema)