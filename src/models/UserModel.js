const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    login: { type: String },
    password: { type: String },
    ordinalNumber: { type: Number, required: true },

    name: { type: String, required: true },
    surname: { type: String, required: true },
    fullName: { type : String},

    created: { type: Date, required: true},

    department: {
      type: Object,
      default: {
        _id: '',
        title: 'Без отдела',
        isHead: false
      }
    },

    tasks: {
      type: Object,
      default: {
        member: [],
        performer: [],
        master: []
      }
    },

    roles: { type: Array, required: true, default: 'quest'},
    permits: { type: Array },

    email: { type: String },
    phone: { type: String, required: true},

    usersGroup: { type: Array }

}, {
  collection: 'users'
})

module.exports = model('UserModel', UserSchema)