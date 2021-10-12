const { DepartmentModel, UserModel, TaskModel } = require('../models/index.js');
const checkUserDepartment = require('../functions/checkUserDepartment');

class departmentsControllers {
    async getAll(req, res) {
        try {
            
            await DepartmentModel.find({})
            .then(async (departments) => {
                await UserModel.find({})
                .then(users => {
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
                .catch(err => {
                    return res.status(400).json({
                        message: 'Не удалось получить список отделов... Попробуйте снова !'
                    })
                })
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


}

module.exports = new departmentsControllers() 