const { UserModel } = require('../models/index.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_JWT_KEY } = require('../config/keys');

// функция сортирующая поля пользователя и отдающая на клиент только нужные данные
const fillUserData = require('../functions/fillUserData');


// функция создания jwt-токена
const generateAccessToken = (payload) => {
  return jwt.sign(payload, SECRET_JWT_KEY, {
      // время действия токена
      expiresIn: '12h'
  })
}

class authControllers {
  
  async auth(req, res) {
    try { 
      // если пользователь прошел проверку своего токена в passport.js, создаю новый токен и отправляю ответ клиенту

      const token = generateAccessToken ({
        id: req.user._id
      })

      return res.status(200).json({
        token: `Bearer ${token}`,
        message: 'Аутентификация прошла успешно !',
        user: fillUserData(req.user)
      });
    }

    catch(err) {
      return res.status(401).json({
        message: 'Произошла ошибка аутентификации, попробуйте войти снова'
      })
    }
  }
}

module.exports = new authControllers() 