// const mongoose = require('mongoose');
const {Router} = require('express');
const Course = require('../models/course');
const router = Router();
// const User = require('user-model');

router.get('/', async (req, res) => {
    const courses = await Course.find()
        .populate('userId', 'email name')

    res.render('courses', {
        title: "курсы",
        isCourses: true,
        courses
    })
})

router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    const course = await Course.findById(req.params.id)

    res.render('course-edit', {
        title: `Редактировать ${course.title}`,
        course
    })
})

router.post('/edit', async (req, res) => {
    const {id} = req.body
    delete req.body.id
    await Course.findByIdAndUpdate(id, req.body)
    res.redirect('/courses')
})

router.post('/remove', async (req, res) => {
    try {
        await Course.deleteOne({_id: req.body.id})
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

