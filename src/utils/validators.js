const {body} = require('express-validator')
const User = require('../models/user')

exports.registerValidators = [
    //withMessage - 1 вариант (всего 2)
    body('email').isEmail().withMessage('Введите корректный email')
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({email: value})// можно req.body.email
                if (user) {
                    return Promise.reject('Такой email уже занят')
                }
            } catch (e) {
                console.log(e)
            }
        })
        //сантиайзер. проверяет майл на адекватность - один язык и т.д.
        .normalizeEmail(),
    //2 вариант добавления сообщеия об ошибке - в боди через запятую!!
    body('password', 'Пароль должен быть минимум 4 символа')
        .isLength({min: 4, max: 26})
        .isAlphanumeric()
        //сантитайзер удаляет лишние пробелы
        .trim(),
    //проверка повторо введенного пароля
    body('confirm')
        .custom((value, {req}) => {
            //если пароль не совпадает
            if (value !== req.body.password) {
                throw new Error('Пароли должны совпадать')
            }
            return true
        })
        //сантитайзер удаляет лишние пробелы
        .trim(),
    body('name')
        .isLength({min: 5})
        .withMessage('Никнейм должен быть не меньше 5 символов')
        //сантитайзер удаляет лишние пробелы
        .trim()
]

exports.courseValidators = [
    body('title').isLength({min: 3}).withMessage("Минимальная длина названия 3 символа").trim(),
    body('price').isNumeric().withMessage('Введите корректную цену'),
    body('img', 'Введите крректный URL').isURL()
]