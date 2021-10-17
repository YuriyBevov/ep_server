if(req.body.members) {
    console.log('members exist')

    DepartmentModel.find({})
    .then(departments => {
        return departments
    })
    .then(departments => {
        let payload = UserModel.find({})
        .then(users => {
            return {users, departments}
        })
        .catch(() => {
            return res.status(400).json({
                message: 'Произошла непредвиденная ошибка usersModel... Попробуйте снова !'
            })
        })

        return payload
    })
    .then(payload => {
        console.log('payload----------', payload)
        const users = payload.users
        const departments = payload.departments
        
        req.body.heads.forEach(head => {
            //текущий пол-ль
            let user = users.find(user => toString(user._id) === toString(head._id))
            // отдел в котором этот пользователь состоит
            let department = departments.find(dep => dep.title === user.department)
            let isHead = null
            let isMember = null

            department ?
            isHead = department.heads.find(head => head._id === user._id) : null

            department ?
            isMember = department.members.find(head => head._id === user._id) : null

            console.log('department:-------',  department)

            if(isHead && department.heads.length === 1) {
                console.log('user is only one head')
                return res.status(400).json({
                    message: `Вы не можете перевести ${user.fullName} в другой отдел, так как в отделе ${user.department} он является единственным руководителем !`
                })
            }
             
            else {
                console.log('>1')
                // await UserModel.updateOne({_id}, {$push: { [collectionName] : data } })

                if(isMember){
                    let collectionName = 'members'

                    DepartmentModel.updateOne( { _id: department._id }, { $push: { [collectionName] : data } })
                    .then((resp) => {
                        new DepartmentModel(req.body).save()

                        return res.status(200).json({
                            message: 'Отдел был успешно создан !'
                        })
                    })
                    .catch((err) => {
                        return res.status(400).json({
                            message: 'Произошла непредвиденная ошибка memb... Попробуйте снова !'
                        })
                    })
                }

                new DepartmentModel(req.body).save()
                return res.status(200).json({
                    message: 'Отдел был успешно создан !'
                })
            }
        })

        req.body.members.forEach(member => { 
            // нахожу участников отдела по id, чтобы переименовать отдел пользователя
            let user = users.find(user => toString(user._id) === toString(member._id))

            //console.log('user',  user)
        })
    })
    .catch(() => {
        return res.status(400).json({
            message: 'Произошла непредвиденная ошибка com... Попробуйте снова !'
        })
    })
}

else {
    return res.status(200).json({
        message: 'Отдел был успешно создан !'
    })
}