const {Router} = require('express')
const auth = require('../middleware/auth')
const User = require('../models/user')
const router = Router()

router.get('/', auth, async (req, res) => {
    res.render('profile', {
        title: 'Профиль',
        isProfile: true,
        user: req.user.toObject()
    })
})

//auth - защита от просмотра неавторизованными пользователями+ они не будут получать пост запросы
router.post('/', auth, async (req, res) => {
    try {
        //получаем объект пользователя/ req.user._id - id текущего пользователя из БД
        const user = await User.findById(req.user._id)
        console.log(user)
        const toChange = {
            //берется из profile.hbs
            name: req.body.name
        }
        // console.log(toChange)
        console.log(req.file)

        if (req.file) {
            toChange.avatarUrl = req.file.path
        }


        //чтобы добавить новыe поля/ assign = 'назначить'/ добавить user поля toChange
        Object.assign(user, toChange)
        await user.save()
        res.redirect('/profile')
    } catch (e) {
        console.log(e)
    }
})


module.exports = router