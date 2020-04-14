const {Router} = require('express');
const Course = require('../models/course');
// const Card = require('../models/card');
const auth = require('../middleware/auth')
const router = Router()

//функция-хэлпер для формирования массива курсов
function mapCartItems(cart) {
    //возвращаем объект, потому что обернули в скобки
    return cart.items.map(c => ({
        //_doc убирает всю ненужную метадату, оставляем тлько нужное из модели/ map создает нам плоский объект
        ...c.courseId._doc,
        //чтобы при популейте id было без подчеркивания
        id: c.courseId.id,
        count: c.count
    }))
}

//функция высчитывет цену
function computePrice(courses) {
    return courses.reduce((total, course) => {
        return total += course.price * course.count
    }, 0)
}

router.post('/add', auth, async (req, res) => {
    console.log(req.body.id)
    const course = await Course.findById(req.body.id)
    console.log(req.user)
    await req.user.addToCart(course)
    // await Card.add(course)
    res.redirect('/card')
})

router.delete('/remove/:id', auth, async (req, res) => {
    await req.user.removeFromCart(req.params.id)
    const user = await req.user.populate(`cart.items.courseId`).execPopulate()
    const courses = mapCartItems(user.cart)
    const cart = {
        courses, price: computePrice(courses)
    }
    res.status(200).json(cart)
    // const card = await Card.remove(req.params.id)
})

router.get('/', auth, async (req, res) => {
    //корзину получаем из модели пользователя
    const user = await req.user
        //оставляем только содержимое, чтобы вместо courseId попало содержимое
        .populate('cart.items.courseId')
        //чтобы все работало, вызываем метод
        .execPopulate()
    // console.log(user.cart.items)
    //формируем массив курсов
    const courses = mapCartItems(user.cart)

    // const card = await Card.fetch()
    res.render('card', {
        title: 'Корзина',
        isCard: true,
        courses: courses,
        price: computePrice(courses)
    })

})
module.exports = router
