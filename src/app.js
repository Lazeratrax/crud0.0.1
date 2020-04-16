const express = require('express');
// const router = require('./routers/export-routers');
const path = require('path');
//защищает фронтенд и сравнивает переменные. возвращае функцию, потому ниже ее как мидлвар вызываваем
const csrf = require('csurf');
//миддлвар. с помощью сессии позволяет делать транспортировку определенных ошибок
const flash = require('connect-flash')
const mongoose = require('mongoose');
//защита express установкой заголовков
const helmet = require('helmet')
//сжатие js(для деплоя)
const compression = require('compression')
//мидлвар. пакет, отвечающий за сессии
const session = require('express-session')
// пакет, для сохр в автомат-режиме сессий в БД монгоДБ. с большой буквы - потому что название класса.
const MongoStore = require('connect-mongodb-session')(session)
const orderRoutes = require('./routes/orders');
const exphbs = require('express-handlebars');
const homeRoutes = require("./routes/home");
const courseRoutes = require("./routes/courses");
const addRoutes = require("./routes/add");
const cardRoutes = require("./routes/card");
const profileRoutes = require('./routes/profile')
//если клиент на другом домене, сможем отвечать серверу все равно
// const cors = require('cors');
// //для более понятного логирования
// const morgan = require('morgan')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const authRoutes = require('./routes/auth');
//для загрузки файлов картинок
const fileMiddleware = require('./middleware/file')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const errorHandler = require('./middleware/error')
const keys = require('./keys')

//вынесли в ключи
// const MONGODB_URI = `mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false`;
const app = express()

//handlenars создается
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    //регистрация хэлпера!
    helpers: require('./utils/hbs-helpers'),
    handlebars: allowInsecurePrototypeAccess(Handlebars)
});
//экземпляр класса для автосохр сессий в БД
const store = new MongoStore({
    //передаем объект конфигурации
    collection: 'sessions',
    uri: keys.MONGODB_URI
})
//двигатель = engine
app.engine('hbs', hbs.engine);

app.set('view engine', 'hbs');
app.set('views', 'src/views');

app.use(express.static('src/public'));
// подключение статических файлов изображений -первый параметр закреплят путь
app.use('/src/img', express.static('src/img'));
//расширение кодировки
app.use(express.urlencoded({extended: true}))

app.use(session({
    //сессия шифруется на основе строки:
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    //сохранение сессии в БД
    store
}))
//загрузка файлов. single - передаем только 1 файл. avatar - название поля, куда складывается
app.use(fileMiddleware.single('avatar'))
//подключаем пакетные миддлвары. ВАЖНО! после сессии
//Логика создания и верификации токенов CSRF
app.use(csrf())
//с помощью сессии позволяет делать транспортировку определенных ошибок
app.use(flash())
//защита express заголовками
app.use(helmet())
//сжатие js для деплоя
app.use(compression())
//опрделяем свои мидлвары, ВАЖНО! после сессии

app.use(varMiddleware);
app.use(userMiddleware);

//подключение роутов
app.use('/', homeRoutes);
app.use('/courses', courseRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);
app.use('/orders', orderRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes)

//для любых несуществующих роутов - страница 404. подключать строго после всех роутов!
app.use(errorHandler)

const port = process.env.PORT || 3001

async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            //обязательно для корректной работы через вебшторм - ?
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        app.listen(port, () => {
            console.log('сервер грузится на localhost:' + port)
        })
    } catch (e) {
        console.log(e)
    }
}
//запуск
start()



