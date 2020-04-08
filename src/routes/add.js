const {Router} = require('express');
const Course = require('../models/course')
const router = Router()

router.get('/', (req, res) => {
    res.render('add', {
        title: "добавить курс",
        isAdd: true
    })
})

router.post('/', async (req, res) => {
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
    res.redirect('/courses')
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
