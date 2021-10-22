const { DepartmentModel, UserModel, TaskModel } = require('../models/index.js');

class departmentsControllers {
    async getAll(req, res) {
        try {
            
            await DepartmentModel.find({})
            .then(async (departments) => {
                await UserModel.find({})
                .then(users => {
                    // наполняю отдел пользователями
                    departments.forEach(dep => {
                        users.find(user => {
                            user.department === dep.title ?
                            dep.members.push({_id: user._id, fullName : user.fullName}) : null

                            user.isDepartmentHead === true && user.department === dep.title ?
                            dep.heads.push({_id: user._id, fullName : user.fullName}) : null
                        })
                    })
                    
                    return departments
                })
                .then(async (departments) => {
                    // наполняю отдел задачами
                    await TaskModel.find({})
                    .then(tasks => {
                        tasks.forEach(task => {
                            departments.find(dep => {
                                dep.title === task.department ?
                                dep.tasks.push({_id: task._id, title: task.title }) : null
                            })
                        })
                    })
                    .catch(err => console.log('DEP.CONTR.ERR.TASKS'))

                    return departments
                })
                .then((departments) => {
                    return res.status(200).json({
                        departments
                    })
                })
                .catch(err => console.log(err))
            })
            .catch(err => {
                return res.status(400).json({
                    message: 'Не удалось получить список отделов... Попробуйте снова !'
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
        const { title, memberList, headList } = req.body
        try {
            await UserModel.find({})
            .then(users => {
                memberList.forEach(member => {
                    let user = users.find(person => person._id.equals(member))

                    // изменять только тех пользователей , которые имеют изменения ????? ошибка при исключении пользователя из отдела !!!
                    user.department = title

                    headList.forEach(head => {

                        if(user._id.equals(head)) {
                            user.isDepartmentHead = true
                        } else {
                            user.isDepartmentHead = false
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
            const { _id, title, tasks} = req.body

            await UserModel.find({})
            .then(users => {
                const filteredUsers = users.filter(user => user.department === title)

                filteredUsers.forEach(user => {
                    if(user.isDepartmentHead) {
                        user.isDepartmentHead = false
                    }
                    user.department = 'Без отдела'

                    tasks.length ?
                    tasks.forEach(task => {

                        if(user.tasksMember.includes(task._id)) {
                            let index = user.tasksMember.indexOf(task._id)
                            if (index > -1) {
                                user.tasksMember.splice(index, 1);
                            }
                        }

                        if(user.tasksPerformer.includes(task._id)) {
                            let index = user.tasksPerformer.indexOf(task._id)
                            if (index > -1) {
                                user.tasksPerformer.splice(index, 1);
                            }
                        }
    
                        if(user.tasksMaster.includes(task._id)) {
                            let index = user.tasksMaster.indexOf(task._id)
                            if (index > -1) {
                                user.tasksMaster.splice(index, 1);
                            }
                        }

                        TaskModel.deleteOne({_id: task._id })
                        .then(() => {})
                    }) : null

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