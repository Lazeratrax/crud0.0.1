module.exports = function (req, res, next) {
    //чтобы добавить какие-то данные, которые будут отдаваться назад в шаблон
    res.locals.isAuth = req.session.isAuthenticated
    //создаем переменную для добавления к формам. в скрытых инпутах
    res.locals.csrf = req.csrfToken()
    //чтобы продолжить цепочку выплнения мидлваров -
    next()
}
