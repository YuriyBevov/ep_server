// определяю отдел пользователя

const { UserModel, GroupModel, DepartmentModel } = require('../models/index.js');

module.exports = function setUserDepartment(deps, users) {
    deps.forEach(dep => {
        if(dep.members) {

            dep.members.forEach(member => {
                let depMember = users.find(user => toString(member._id) === toString(user._id))

                depMember ?
                depMember.department = dep.title : null
            })

            dep.members.forEach(member => {
                let depHead = users.find(user => toString(member._id) === toString(user._id))

                depHead ?
                depHead.isDepartmentHead = true : null
            })
        }
    })
}