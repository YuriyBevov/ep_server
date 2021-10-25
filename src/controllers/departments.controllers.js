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
        const { title, memberList, headList } = req.body
        try {
            console.log('UPDATE')

            return res.status(200).json({
                message: 'Состав отдела успешно обновлен !'
            })
        }
        /*try {
            await UserModel.find({})
            .then(users => {
                // все текущие участники отдела
                let departmentMembers = users.filter(user => user.department === title)

                

                departmentMembers.forEach(depMember => {
                    depMember.department = ''
                    depMember.isDepartmentHead = false
                })

                console.log('departmentMembers', departmentMembers)
                console.log('memberList',memberList)

                /*memberList.forEach(member => {
                    let user = users.find(person => person._id.equals(member))

                    user.department = title

                    headList.forEach(head => {

                        if(user._id.equals(head)) {
                            user.isDepartmentHead = true
                        } else {
                            user.isDepartmentHead = false
                        }
                    })
                    console.log('USER', user)
                    UserModel.updateOne({_id: user._id}, user)
                    .then(() => {})
                })*/
            /*})

            return res.status(200).json({
                message: 'Состав отдела успешно обновлен !'
            })
        }*/

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