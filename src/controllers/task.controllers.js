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
                                if(members !== null){
                                    members.forEach(member => {
                                        if(user._id.equals(member._id)) {
                                            user.tasks.member.push({_id:task._id})
                                        }
                                    })
                                }

                                if(performers !== null) {
                                    performers.forEach(performer => {
                                        if(user._id.equals(performer._id)) {
                                            user.tasks.performer.push({_id:task._id})
                                        }
                                    })
                                }

                                if(master !== null) {
                                    if(user._id.equals(master._id)) {
                                        user.tasks.master.push({_id: task._id})
                                    }
                                }

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
                            let isMember = user.tasks.member.find(member => member._id == task._id)
                            isMember ?
                            task.members.push({_id: user._id}) : null

                            let isPerformer = user.tasks.performer.find(performer => performer._id == task._id)
                            isPerformer ?
                            task.performers.push({_id: user._id}) : null

                            let isMaster = user.tasks.master.find(master => master._id == task._id)
                            isMaster ?
                            task.master = { _id: user._id} : null
                        })
                    })

                    tasks.forEach(task => {
                        if(task.master && task.status === 'isOpened') {
                            task.status = 'inWork'
                        }
                    })

                    return res.status(200).json(tasks)
                })
                .catch((err) => console.log(err))
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
            await UserModel.find({})
            .then((users) => {
                users.forEach(user => {
                    if(user.tasks.member.length) {
                        let isMember = user.tasks.member.find(task => task._id.equals(_id))
                        let index = user.tasks.member.indexOf(isMember)
                        if (index > -1) {
                            user.tasks.member.splice(index, 1);
                        }
                    }

                    if(user.tasks.performer.length) {
                        let isPerformer = user.tasks.performer.find(task => task._id.equals(_id))
                        let index = user.tasks.performer.indexOf(isPerformer)
                        if (index > -1) {
                            user.tasks.performer.splice(index, 1);
                        }
                    }

                    if(user.tasks.master.length) {
                        let isMaster = user.tasks.master.find(task => task._id.equals(_id))
                        let index = user.tasks.master.indexOf(isMaster)
                        if (index > -1) {
                            user.tasks.master.splice(index, 1);
                        }
                    }

                    UserModel.updateOne({_id: user._id}, user)
                    .then(() => {})
                })
            })
            .then(async () => {
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