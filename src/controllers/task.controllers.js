const { TaskModel, UserModel } = require('../models/index.js');

class taskControllers {
    async addTask(req, res) {
        try {          
            const { title, master, members, performers } = req.body

            const taskData = {
                title,
                description: req.body.description,
                projectMember: req.body.projectMember,
                priority: req.body.priority,
                expDate: req.body.expDate,
                created: req.body.created,
                createdBy: req.body.createdBy,
                department: req.body.department
            }

            await TaskModel.findOne({title})
            .then((task) => {
                if(task) {
                    return res.status(400).json({
                        message: 'Задача с таким именем уже существует !'
                    })
                } else if(members && !master) {
                    return res.status(400).json({
                        message: 'Если вы выбрали участников задачи, то должно быть назначено ответственное лицо !'
                    })
                }               
                else {
                    new TaskModel(taskData).save().
                    then(task => {
                        UserModel.find({})
                        .then((users) => {
                            users.forEach(user => {
                                members.forEach(member => {
                                    if(user._id == member._id) {
                                        user.tasksMember.push(task._id)
                                    }
                                })

                                performers.forEach(performer => {
                                    if(user._id == performer._id) {
                                        user.tasksPerformer.push(task._id)
                                    }
                                })

                                if(master._id == user._id) {
                                    user.tasksMaster.push(task._id)
                                }

                                UserModel.updateOne({_id: user._id}, user)
                                .then(() => {
                                    return res.status(200).json({
                                        message: 'Задача была успешно создана !'
                                    })
                                })
                                .catch(() => {
                                    return res.status(400).json({
                                        message: 'Произошла непредвиденная ошибка... Попробуйте снова !'
                                    })
                                })
                            })
                        })
                        .catch(() => {
                            return res.status(400).json({
                                message: 'Произошла непредвиденная ошибка... Попробуйте снова !'
                            })
                        })
                    })
                    .catch(() => {
                        return res.status(400).json({
                            message: 'Произошла непредвиденная ошибка... Попробуйте снова !'
                        })
                    })
                }
            })
            .catch(() => {
                return res.status(400).json({
                    message: 'Произошла непредвиденная ошибка... Попробуйте снова !'
                })
            })
        }

        catch {
            return res.status(400).json({
                message: 'Произошла ошибка в процессе создания задачи... Попробуйте снова !'
            })
        }
    }

    async getAll(req, res) {
        try {
            await TaskModel.find({})
            .then((tasks) => {
                UserModel.find({})
                .then(users => {
                    users.forEach(user => {
                        tasks.forEach(task => {
                            let isMember    = user.tasksMember.includes(task._id)
                            let isMaster    = user.tasksMaster.includes(task._id)
                            let isPerformer = user.tasksPerformer.includes(task._id)

                            isMember ?
                            task.members.push({_id: user._id, fullName: user.fullName}) : null 
                            isMaster ?
                            task.master = {_id: user._id, fullName: user.fullName} : null
                            isPerformer ?
                            task.performers.push({_id: user._id, fullName: user.fullName}) : null 
                        })
                    })

                    tasks.forEach(task => {
                        if(task.master && task.status === undefined) {
                            task.status = 'inWork'
                        }

                        if(task.master === undefined && task.status === undefined) {
                            console.log('empty')
                            task.status = 'isOpened'
                        }
                    })
                    return res.status(200).json(tasks)
                })
                .catch(() => {
                    return res.status(400).json({
                        message: 'Произошла непредвиденная ошибка... Попробуйте снова !'
                    })
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
                message: 'Произошла ошибка в процессе загрузки задач... Попробуйте снова !'
            })
        }
    }
}

module.exports = new taskControllers() 