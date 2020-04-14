const {Router} = require('express');
const {validationResult} = require('express-validator')
const Course = require('../models/course')
const auth = require('../middleware/auth')
const {courseValidators} = require('../utils/validators')
const router = Router()

router.get('/', auth, (req, res) => {
    res.render('add', {
        title: "добавить курс",
        isAdd: true
    })
})

//миддлвар - утилита валидации
router.post('/', auth, courseValidators, async (req, res) => {
    const errors = validationResult(req)
    //если есть ошибки
    if (!errors.isEmpty()) {
        //422 - ошибка валидации
        return res.status(422).render('add', {
            title: 'Добавить курс',
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
                title: req.body.title,
                price: req.body.price,
                img: req.body.img
            }
        })
    }

    const course = new Course({
        //передаем объект конфигурации
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        //можно так -
        // userId: req.user._id
        userId: req.user
    })
    try {

        await course.save()
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router;


//версия без монгуза

// const {Router} = require('express');
// const Course = require('../models/course')
// const router = Router()
//
// router.get('/', (req, res) => {
//     res.render('add', {
//         title: "добавить курс",
//         isAdd: true
//     })
// })
//
// router.post('/', (req, res) => {
//     const course = new Course(req.body.title, req.body.price, req.body.img)
//     course.save()
//
//     res.redirect('/courses')
// })
//
// module.exports = router;
