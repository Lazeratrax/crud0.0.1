// const mongoose = require('mongoose');
const {Router} = require('express');
const Course = require('../models/course');
//объект ошибок валидации
const {validationResult} = require('express-validator')
const auth = require('../middleware/auth')
const {courseValidators} = require('../utils/validators')
const router = Router();
// const User = require('user-model');

//хэлпер проверка на
function isOwner(course, req) {
    //защита от редактирования недоступных курсов - сравниваем авторизоанного с объектом из сессии!!
    return course.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('userId', 'email name')
            .select('price title img')

        res.render('courses', {
            title: "курсы",
            isCourses: true,
            //пользователь если есть - предаем, если нет - null
            userId: req.user ? req.user._id.toString() : null,
            courses
        })
    } catch (e) {
        console.log(e)
    }
})

router.get('/:id/edit', auth, async (req, res) => {

    if (!req.query.allow) {
        return res.redirect('/')
    }

    try {
        //создаем объект авторизованный пользователь
        const course = await Course.findById(req.params.id)
        //защита от редактирования недоступных курсов - сравниваем авторизоанного с объектом из сессии!!
        if (!isOwner(course, req)) {
            return res.redirect('/courses')
        }
        res.render('course-edit', {
            title: `Редактировать ${course.title}`,
            course
        })
    } catch (e) {
        console.log(e)
    }
})

//courseValidators - утилита валидации
router.post('/edit', auth, courseValidators, async (req, res) => {

    const errors = validationResult(err)
    //
    const {id} = req.body
    if(!errors.isEmpty()){
        return res.status(422).redirect(`/courses/${id}/edit?allow=true`)
    }

    try {
        const {id} = req.body
        delete req.body.id
        const course = await Course.findById(id)
        if (!isOwner(course, req)) {
            return res.redirect('/courses')
        }
        //обращаемся к самому курсу / assign - "назначить"
        Object.assign(course, req.body)
        await course.save()
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
})

router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({
            _id: req.body.id,
            //если id курсов не совпадет, все равно зачищаем что есть
            userId: req.user._id
        })
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
})

router.get('/:id', async (req, res) => {
    console.log('ID', req.params.id)
    const course = await Course.findById(req.params.id)
    res.render('course', {
        layout: 'empty',
        title: `Курс ${course.title}`,
        course
    })
})

module.exports = router


//версия без mongo
// const {Router} = require('express');
// const Course = require('../models/course')
// const router = Router()
//
// router.get('/', async (req, res) => {
//     const courses = await Course.getAll()
//     res.render('courses', {
//         title: "курсы",
//         isCourses: true,
//         courses
//
//     })
// })
//
// router.get('/:id/edit', async (req, res) => {
//     if (!req.query.allow) {
//         return res.redirect('/')
//     }
//
//     const course = await Course.getById(req.params.id)
//
//     res.render('course-edit', {
//         title: `Редактировать ${course.title}`,
//         course
//     })
// })
//
// router.post('/edit', async (req, res) => {
//     await Course.update(req.body)
//     res.redirect('/courses')
// })
//
// router.get('/:id', async (req, res) => {
//     const course = await Course.getById(req.params.id)
//     res.render('course', {
//         layout: 'empty',
//         title: `Курс ${course.title}`,
//         course
//     })
// })
//
//
// module.exports = router

