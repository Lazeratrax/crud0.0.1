//модель нужна. потому что без нее не хватает данных, чтобы работать с заказами
const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    courses: [
        {
            course: {
                type: Object,
                required: true
            },
            //значение курсов.которое купили
            count: {
                type: Number,
                required: true
            }
        }
    ],
    //пользоваетль, который сделал заказ
    user: {
        name: String,
        //референция на модель пользователей
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            //чтобы можно было делать популейт, делаем реф
            ref: `User`,
            required: true
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
})

let Order = mongoose.model('Order', orderSchema);
module.exports = Order;

