const express = require('express');
// const router = require('./routers/export-routers');
const path = require('path');
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const mongoose = require('mongoose');
const orderRoutes = require('./routes/orders');
const exphbs = require('express-handlebars');
const homeRoutes = require("./routes/home");
const courseRoutes = require("./routes/courses");
const addRoutes = require("./routes/add");
const cardRoutes = require("./routes/card");
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const User = require('./models/user');
const fileMiddleware = require('./middleware/file')
// const keys = require('./keys')

const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
});

app.engine('hbs', hbs.engine);

app.set('view engine', 'hbs');
app.set('views', 'src/views');

//иницилизация юзера
app.use(async (req, res, next) => {
    try {
        const user = await User.findById(`5e8b0d920bd69f3cb44a95ad`)
        // const user = await User.findOne()
        console.log(user)
        req.user = user
        next()
    } catch (e) {
        console.log(e)
    }
})

app.use(express.static('src/public'));
// app.use(express.static(path.join(__dirname, 'src/public')));
app.use(express.urlencoded({extended: true}))


app.use(fileMiddleware.single('avatar'))
app.use('/', homeRoutes);
app.use('/courses', courseRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);
app.use('/orders', orderRoutes);

//
// app.get('/', (req, res) => {
//     // res.sendFile(path.join(__dirname, 'views', 'index.hbs'))
//     res.render('index')
// });
//
// app.get('/about', (req, res) => {
//     // res.sendFile(path.join(__dirname, 'views', 'about.hbs'))
//     res.render('about')
// });

const port = process.env.PORT || 3001

// app.use(express.json())
// app.use('/users', router.userRouter)
// app.use(express.static(__dirname + "/public"));

async function start() {
    try {
        // const url = `mongodb+srv://LazarevKirill:opeCv6qi2S5l7GaD@cluster0-jgb4m.mongodb.net/shop`;
        const url = `mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false`;
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        const candidate = await User.findOne()
        if (!candidate) {
            const user = new User({
                email: 'lazeratrax@gmail.com',
                name: 'Kirill',
                cart: {items: []}
            })
            await user.save()
        }

        app.listen(port, () => {
            console.log('сервер грузится на localhost:' + port)
        })
    } catch (e) {
        console.log(e)
    }
}

start()



