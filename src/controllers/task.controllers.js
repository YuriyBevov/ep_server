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
                                master !== null ?
                                master._id == user._id ?
                                user.tasksMaster.push(task._id) : null
                                : null

                                members !== null ?
                                members.forEach(member => {
                                    user._id == member._id ?
                                    user.tasksMember.push(task._id) : null
                                }) : null

                                performers !== null ?
                                performers.forEach(performer => {
                                    user._id == performer._id ?
                                    user.tasksPerformer.push(task._id) : null
                                }) : null
                                
                                UserModel.updateOne({_id: user._id}, user)
                                .then(() => {})
                            })
                            
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
                        if(task.master && task.status === 'isOpened') {
                            task.status = 'inWork'
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

    async deleteOne(req, res) {
        const { _id } = req.body
        try {

            await TaskModel.deleteOne({_id})
            .then(() => {
                return res.status(200).json({
                    message: "Задача была успешно удалена...",
                })
            })
            .catch((err) => {
                return res.status(500).json({
                    message: "Не удалось удалить данные задачи. Попробуйте снова..."
                })
            })

            await UserModel.find({})
            .then((users) => {
                users.forEach(user => {
                    console.log(user.tasksMember, _id)
                    if(user.tasksMember.includes(_id)) {
                        let index = user.tasksMember.indexOf(_id)
                        if (index > -1) {
                            user.tasksMember.splice(index, 1);
                        }
                    }

                    if(user.tasksPerformer.includes(_id)) {
                        let index = user.tasksPerformer.indexOf(_id)
                        if (index > -1) {
                            user.tasksPerformer.splice(index, 1);
                        }
                    }

                    if(user.tasksMaster.includes(_id)) {
                        let index = user.tasksMaster.indexOf(_id)
                        if (index > -1) {
                            user.tasksMaster.splice(index, 1);
                        }
                    }

                    UserModel.updateOne({_id: user._id}, user)
                    .then(() => {})
                })            
            })  
            .catch(err => console.log(err))
        }

        catch {
            return res.status(400).json({
                message: 'Произошла ошибка в процессе загрузки задач... Попробуйте снова !'
            })
        }
    }
}

module.exports = new taskControllers() 