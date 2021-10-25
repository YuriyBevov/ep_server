const { DepartmentModel, UserModel, TaskModel } = require('../models/index.js');

class departmentsControllers {
    async getAll(req, res) {
        try {
            await DepartmentModel.find({})
            .then(async(departments) => {
                await UserModel.find({})
                .then(users => {
                    let data = {departments, users}
                    return data
                })
                .then(async (data) => {
                    await TaskModel.find({})
                    .then(tasks => {
                        data.departments.forEach(department => {
                            data.users.find(user => {
                                if(user.department._id == department._id) {
                                    department.members.push({ _id: user._id, fullName: user.fullName })
    
                                    if(user.department.isHead) {
                                        department.heads.push({ _id: user._id, fullName: user.fullName })
                                    }
                                }
                            })

                            tasks.find(task => {
                                task.department === department.title ?
                                department.tasks.push({
                                    _id: task._id,
                                    title: task.title
                                }) : null
                            })
                        })
                    })
                })

                return res.status(200).json({
                    departments
                })
            })
        }

        catch {
            return res.status(400).json({
                message: 'Произошла непредвиденная ошибка... Попробуйте снова !'
            })
        }
    }
    
    async addOne(req,res) {
        try {
            const { title, heads, members } = req.body

            await DepartmentModel.findOne({title})
            .then(async (department) => {
                if(department) {
                    return res.status(400).json({
                        message: 'Отдел с таким именем уже существует !'
                    })
                }

                new DepartmentModel(req.body).save();
        
                return res.status(200).json({
                    message: 'Отдел был успешно создан !'
                })
            })
            .catch(err => {
                return res.status(400).json({
                    message: 'Произошла непредвиденная ошибка... Попробуйте снова !'
                })
            })
        }

        catch {
            return res.status(400).json({
                message: 'Произошла ошибка в процессе создания отдела... Попробуйте снова !'
            })
        }
    }

    async updateOne(req, res) {
        const { _id, title, memberList } = req.body
        try {
            await UserModel.find({})
            .then(users => {
                let departmentMembers = users.filter(user => user.department._id === _id)

                departmentMembers.forEach(member => {
                    member.department = {
                        _id: null,
                        title: 'Без отдела',
                        isHead: false
                    }
                })

                users.forEach(user => {
                    memberList.forEach(member => {
    
                        if(member._id == user._id) {
                            user.department._id = _id,
                            user.department.title = title

                            if(member.isHead) {
                                user.department.isHead = true
                            }
                        }
                    })

                    UserModel.updateOne({_id: user._id}, user)
                    .then(() => {})
                })
            })
            .catch(err => console.log(err))

            return res.status(200).json({
                message: 'Состав отдела успешно обновлен !'
            })
        }
        catch {
            return res.status(400).json({
                message: 'Произошла ошибка в процессе создания отдела... Попробуйте снова !'
            })
        }
    }

    async deleteOne(req, res) {
        try {
            //ОТДЕЛ!!!
            const { _id, title, tasks} = req.body
            console.log('DEPARTMENT TO DELETE:', req.body)
            await UserModel.find({})
            .then(users => {
                const filteredUsers = users.filter(user => user.department._id === _id)

                filteredUsers.forEach(user => {
                    user.department = { _id: null, title: 'Без отдела', isHead: false }

                    // 3
                    if(tasks.length) {
                        tasks.forEach(task => {
                            // сделать одну функцию !!

                            if(user.tasks.member.length) {
                                let taskID = user.tasks.member.find(userTask => userTask._id.equals(task._id))
                                let index = user.tasks.member.indexOf(taskID)
                                if (index > -1) {
                                    user.tasks.member.splice(index, 1);
                                }
                            }

                            if(user.tasks.performer.length) {
                                let taskID = user.tasks.performer.find(userTask => userTask._id.equals(task._id))
                                let index = user.tasks.performer.indexOf(taskID)
                                if (index > -1) {
                                    user.tasks.performer.splice(index, 1);
                                }
                            }

                            if(user.tasks.master.length) {
                                let taskID = user.tasks.master.find(userTask => userTask._id.equals(task._id))
                                let index = user.tasks.master.indexOf(taskID)
                                if (index > -1) {
                                    user.tasks.master.splice(index, 1);
                                }
                            }

                            TaskModel.deleteOne({_id: task._id })
                            .then(() => {})
                        })
                    }

                    UserModel.updateOne({_id: user._id}, user)
                    .then(() => console.log('user updated'))
                })

                DepartmentModel.deleteOne({_id})
                .then(() => {})
                .catch(err => console.log(err))
            })
            .catch(err => console.log(err))

            return res.status(200).json({
                message: 'Отдел был успешно удален !'
            })
        }

        catch {
            return res.status(400).json({
                message: 'Произошла непредвиденная ошибка... Попробуйте снова !'
            })
        }
    }
}

module.exports = new departmentsControllers() 