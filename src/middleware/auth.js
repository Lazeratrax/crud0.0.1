module.exports = function (req, res, next) {
    if (!req.session.isAuthenticated) {
        //если попали в if - необходимо его завершить, поэтому пишем return
        return res.redirect('/auth/login')
    }
    next()
}