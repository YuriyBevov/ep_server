
module.exports = function sortByGroups(groups, users) {
    Object.assign(users).forEach(user => {
        if(user.isArchieved !== true) {
            //все айди групп в которых состоит пользователь без повторов
            let allUserGroupPermits = []

            Object.assign(groups).forEach(group => {
                let conjuctionArray = []

                group.permitsID.forEach(permit => {
                    let isExist = user.permits.find(p => p === permit)
                    conjuctionArray.push(!!isExist)
                })

                const userCheck = conjuctionArray.includes(false)

                // наполняю группу пользователями, а данные пользователя группами
                if(!!userCheck === false) {
                    group.permitsID.forEach(permit => {                    
                        if(!allUserGroupPermits.includes(permit)) {
                            allUserGroupPermits.push(permit)
                        }                   
                    })

                    let name = user.name + ' ' + user.surname

                    let isEmpty = !group.permitsID.length ? true : false
                    
                    user.groups.push({
                        id: group._id,
                        name: group.name,
                        shortName: group.shortName,
                        isEmpty,
                        color: group.color,
                        textColor: group.textColor
                    })

                    group.usersID.push({
                        id: user._id,
                        name
                    })
                }
            })
            
            if(user.permits.length > allUserGroupPermits.length) {
                user.groups.push({
                    name: 'Custom',
                    shortName: 'Custom'
                })
            }
        }
    })

    return {
        users,
        groups
    }
}