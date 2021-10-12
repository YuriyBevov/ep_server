const { UserModel, GroupModel } = require('../models/index.js');

class initControllers {

    async initApp(req, res) {
        try {
            console.log('init app')

            return res.status(200).json({
                message: 'Инициализация прошла успешно'
            })
        }

        catch {
            return res.status(400).json({
                message: 'Ошибка в процессе инициализации приложения'
            })
        }
    }
}

module.exports = new initControllers() 