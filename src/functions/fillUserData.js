const { DepartmentModel } = require('../models/index.js');

module.exports = function fillUserData(user) {
    return {
        login: user.login,
        _id: user._id,
        ordinalNumber: user.ordinalNumber,
        roles: user.roles,
        name: user.name,
        surname: user.surname,
        fullName: user.fullName,
        department: user.department,
        isDepartmentHead: user.isDepartmentHead,
        email: user.email,
        phone: user.phone,
        // будет пополняться с расширением приложения...
    }
}