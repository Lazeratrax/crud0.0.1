const multer = require('multer')

//создание нового пути к файлу. diskStorage - принимает объект, где можно задать опред функции пока будет загружаться
const storage = multer.diskStorage({
    //'место назначения' - cb = callback = куда складываем файл
    destination(req, file, cb) {
        //первый параметр - ошибка. если ее нет - null
        cb(null, 'src/img')
    },
    //
    filename(req, file, cb) {
        //создание уникального имени = нового файла по дате добавления приведенному к стандарту ISO и оригинальное имя
        // cb(null, new Date().toISOString() + '-' + file.originalname)
      // cb(null, file.originalname)
        cb(null, Date.now() + '-' + file.originalname)
    }
})

//разрешенные mimetypes
const allowedTypes = [`image/png`, `image/jpg`, `image/jpeg`]

//валидатор для файлов
const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        //mimetype не содержится в файле - получим ошибку
        cb(null, false)
    }
}

module.exports = multer({
    storage, fileFilter
})