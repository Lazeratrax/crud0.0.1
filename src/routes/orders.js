const {Router} = require('express')
const Order = require('../models/order')
//новый роутер - результат работы функции Роутер:
const auth = require('../middleware/auth')
const router = Router()

router.get(`/`, auth, async (req, res) => {
    try {
        const orders = await Order.find({
            //сравниваем модель с текущим id
            'user.userId': req.user._id
        }).populate('user.userId')
        res.render(`orders`, {
            isOrder: true,
            title: `Заказы`,
            orders: orders.map(o => {
                return {
                    ...o._doc,
                    price: o.courses.reduce((total, c) => {
                        return total += c.count * c.course.price
                    }, 0)
                }
            })
        })

    } catch (e) {
        console.log(e)
    }

})
//делаем заказ - получаем редирект
router.post(`/`, auth, async (req, res) => {
    try {
        const user = await req.user
            //превращаем те id курсов в объекты
            .populate(`cart.items.courseId`)
            .execPopulate()
        //создаем объект курсов и приводим к "человеческому" формату
        const courses = user.cart.items.map(i => ({
            count: i.count,
            course: {...i.courseId._doc}
        }))

//создадим новый объект ордера, куда нужно передать 2 обязательных параметра!!
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            courses: courses
        })

        await order.save()
        await req.user.clearCart()

        res.redirect(`/orders`)

    } catch (e) {
        console.log(e)
    }
})


module.exports = router

