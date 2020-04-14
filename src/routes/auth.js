const {Router} = require('express');
const User = require('../models/user')
const bcrypyt = require('bcryptjs')
const crypto = require('crypto');
//валидация. check - проверка всех! параметров - и из query,и из body,и из params
const {validationResult} = require('express-validator')
// const nodemailer = require('nodemailer')
// const sendgrid = require('nodemailer-sendgrid-transport')
// const regEmail = require('../emails/registration')
// const keys = require('../keys')
// const regEmail = require('../emails/registration')
// const resetEmail = require('../emails/reset')
//утилита валидации на сервере. доб как мидлвар
const {registerValidators} = require('../utils/validators')
const router = Router()

//отрисовка страницы авторизации
router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        //здесь передаем ошибку на клиента!!
        //flash хранит все данные в сессии, поэтому они удалятся потом
        registerError: req.flash("registerError"),
        loginError: req.flash("loginError")
    })
})

router.get('/logout', async (req, res) => {
//нужно почистить сессию/ колбэк вызывается, когда все данные сессии уничтожены. очищает данные из базы данных
    req.session.destroy(() => {
        res.redirect('login#login')
    })
    // второй вариант записи выше:
    // req.session.isAuthenticated = false
    // res.redirect('auth/login#login')
})

router.post('/login', async (req, res) => {
    try {
        //данные со страницы логина
        const {email, password} = req.body
        //проверяем пользователя по мылу
        const candiate = await User.findOne({email})

        if (candiate) {
            //проверка пароля
            const areSame = await bcrypyt.compare(password, candiate.password)
            if (areSame) {
                // const user = await User.findById(`5e8f11aa3a5d55180837ef7e`)
                req.session.user = candiate
                req.session.isAuthenticated = true
                //операции могут выполняться до того, как произойдет редирект. поэтому используется save
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/')
                })
            } else {
                //неправильный пароль
                //сообщение об ошибке на сервере/передаем ключ сообщения и сообщение
                req.flash('loginError', 'неправильный пароль')
                res.redirect('login#login')
            }
        } else {
            //такого пользоватея не существует
            //сообщение об ошибке на сервере/передаем ключ сообщения и сообщение
            req.flash('loginError', 'такого пользоватея не существует')
            res.redirect('/auth/login#register')
        }

    } catch (e) {
        console.log(e)
    }
})

//body('email').isEmail() - мидлвар валидации на сервере
router.post('/register', registerValidators, async (req, res) => {
    try {
        const {email, password, name} = req.body
        // const candidate = await User.findOne({email})

        //подключаем ошибки, если они есть
        const errors = validationResult(req)
        //если ошибок нет ( errors пустой)
        if (!errors.isEmpty()) {
            //если есть что-то в ошибках. пользуем флэш/ errors.array()[0].msg) - достаем собщение из валидатора
            req.flash('registerError', errors.array()[0].msg)
            //ошибку словиили. 422 - ствтус ошибки валидации
            return res.status(422).redirect('login#register')
        }

        // if (candidate) {
        //     //сообщение об ошибке на сервере/передаем ключ сообщения и сообщение
        //     req.flash('registerError', 'Пользователь с таким email уже занят')
        //     res.redirect('/auth/login#login')
        // } else {
        //создаем пароль путем шифрования! асинхронный метод hash. в нем - объект пасворд и солд(может быть строкой) оптимально 10-12 значений
        const hashPassword = await bcrypyt.hash(password, 10)

        const user = new User({
            //ключи и значения совпадают, поэтому можно только в 1 слово писать
            email, name, password: hashPassword, cart: {items: []}
        })
        await user.save()
        // после сохранения - редирект на логин
        res.redirect('login#login')
    } catch (e) {
        console.log(e)
    }
})

//вход на страницу восстановление пароля
router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: "Забыли пароль?",
        error: req.flash('error')
    })
})

//сообщение воссстановлеия
router.post('/reset', (req, res) => {
    try {
        //генерируем рандомный ключ
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Что-то пошло не так, повторите попытку позже!')
                return res.redirect('reset')
            }
            //буфер обязательно нужно приводить!hex - фомат
            const token = buffer.toString('hex')
            //пользователь
            const candidate = await User.findOne({email: req.body.email})

            if (candidate) {
                candidate.resetToken = token
                //задаем 1 час временному токену
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000
                await candidate.save()
                await transporter.sendMail()
            } else {
                req.flash('error', 'Такого email нет!')
                res.redirect('/reset')
            }
        })

    } catch (e) {
        console.log(e)
    }
})

module.exports = router