// const {Schema, model} = require('mongoose')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true
                }
            }
        ]
    }
})

userSchema.methods.addToCart = function (course) {
    const items = [...this.cart.items]
    const idx = items.findIndex(c => {
        return c.courseId.toString() === course._id.toString()
    })

    if (idx >= 0) {
        items[idx].count = items[idx].count + 1
    } else {
        items.push({
            courseId: course._id,
            count: 1
        })
    }

    //const newCart = {items: clonedItems}
    //this.cart = newCart

    this.cart = {items}
    return this.save()
}

userSchema.methods.removeFromCart = function (id) {
    //т.к. далее переопределяем - пишем let
    let items = [...this.cart.items]
    //потенциальный индекс курса в массиве items который мы должны найти. сравнимаем id который пришел, с которым есть
    const idx = items.findIndex(c => c.courseId.toString() === id.toString())

    if (items[idx].count === 1) {
        items = items.filter(c => c.courseId.toString() !== id.toString())
    } else {
        items[idx].count--
    }

    this.cart = {items}
    return this.save()
}

userSchema.methods.clearCart = function () {
    this.cart = {items: []}
    return this.save()
}


let User = mongoose.model('User', userSchema);
module.exports = User;

// model.exports = model('User', userSchema)
