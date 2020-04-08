const multer = require('multer')

//создание нового пути к файлу. принимает объект, где можно задать опред функции пока будет загружаться
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'src/img')
    },
    filename(req, file, cb) {
        //создание уникального имени
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }

})
//разрешенные mimetypes
const allowedTypes = [`image/png`, `image/jpg`, `image/jpeg`]
//валидатор для файлов
const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

module.exports = multer({
    storage, fileFilter
})