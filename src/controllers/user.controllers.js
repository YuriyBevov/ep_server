const { UserModel, GroupModel, DepartmentModel } = require('../models/index.js');



// кодировка пароля
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_JWT_KEY } = require('../config/keys');

const fillUserData = require('../functions/fillUserData');
const setUserDepartment = require('../functions/setUserDepartment');

// функция создания jwt-токена
const generateAccessToken = (payload) => {
  return jwt.sign(payload, SECRET_JWT_KEY, {
      // время действия токена
      expiresIn: '12h'
  })
}

class userControllers {
    async registration(req, res) {
        try {          
            const { login, password, confirmPassword } = req.body;

            await UserModel.findOne({login})
            .then((candidate) => {
                if(candidate) {
                    return res.status(400).json({
                        message: 'Пользователь с таким логином уже существует'
                    })
                }

                if(password !== confirmPassword) {
                    return res.status(400).json({
                        message: 'Пароли не совпадают... Проверьте правильность введенных данных...'
                    })
      
                } else {
                    const hashPassword = bcrypt.hashSync(password, 7)
                    const data = req.body
                    data.password = hashPassword

                    new UserModel(data).save()
            
                    return res.status(200).json({
                        message: 'Пользователь был успешно зарегистрирован !'
                    })
                }
            })
        }

        catch {
            return res.status(400).json({
                message: 'Произошла ошибка в процессе регистрации... Попробуйте снова !'
            })
        }
    }

    async login(req, res) {
        try {
            const { login, password } = req.body;
            // делаю запрос в бд по введеному логину
            await UserModel.findOne({
              login
            }).then((user) => {
              // если пользователь с таким логином существует
      
              if(user !== null) {
                if(user.roles.length) {
                  // проверяю верен ли пароль
                  const validPassword = bcrypt.compareSync( password/*пароль введенный клиентом*/ , user.password/*пароль сохраненный в бд*/ )
      
                  if(!validPassword) {
                    return res.status(400).json({
                      message: "Введен неверный пароль. Попробуйте снова"
                    })
                  } /*else if (!!resp.isArchieved) {
                    return res.status(400).json({
                      message: "У вас нет прав доступа к приложению, так как вы находитесь в архиве... Свяжитесь с админом..."
                    })
                  }*/ 
                  
                  else {
                    // создаю токен для клиента
                    const token = generateAccessToken ({
                      id: user._id
                    })

                    let userData = fillUserData(user)
      
                    // отправляю токен и ответ сервера на клиент
                    return res.status(200).json({
                      token: `Bearer ${token}`,
                      user: userData,
                      message: "Вы успешно вошли в систему"
                    })
                  }
                } else {
                  // если пользователь без роли
                  return res.status(400).json({
                    message: 'У вас нет прав доступа к приложению.. Обратитесь к админу'
                  })
                }
              } else {
                // если пользователя с таким логином не существует
                return res.status(400).json({
                  message: 'Пользователь с таким логином не зарегистрирован'
                })
              }
            })
          } 
          
          catch(err) {
            res.status(400).json({
              message: 'Произошла ошибка в процессе авторизации. Попробуйте снова'
            })
          }
    }

    async getAll(req, res) {
        try {
            await UserModel.find({})
            .then(async (users) => {

                /*await DepartmentModel.find({})
                .then( departments => {
                    setUserDepartment(departments, users)
                })*/

                let data = []
    
                users.forEach(user => {
                  data.push(fillUserData(user))
                })
  
                return res.status(200).json(data)
            })
            .catch(err => {
                return res.status(400).json({
                    message: 'Не удалось получить список пользователей... Попробуйте перезагрузить страницу !'
                })
            })
        }

        catch {
            return res.status(400).json({
                message: 'Произошла непредвиденная ошибка... Попробуйте перезагрузить страницу !'
            })
        }
    }
}

module.exports = new userControllers() 