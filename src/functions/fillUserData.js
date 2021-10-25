const { DepartmentModel } = require('../models/index.js');

module.exports = function fillUserData(user) {
    return {
        login: user.login,
        _id: user._id,
        ordinalNumber: user.ordinalNumber,
        roles: user.roles,
        name: user.name,
        surname: user.surname,
        fullName: user.name + ' ' + user.surname,
        department: {
            _id: user.department._id,
            title: user.department.title,
            isHead: user.department.isHead
        },

        tasks: {
            member: user.tasks.member,
            performer: user.tasks.performer,
            master: user.tasks.master
        },

        email: user.email,
        phone: user.phone,
        // будет пополняться с расширением приложения...
    }
}