module.exports = function (req, res, next) {
    //отрисовка 404.hbs
res.status(404).render('404', {
    title: 'Страница не найдена'
})
}