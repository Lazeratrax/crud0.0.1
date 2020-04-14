const keys = require('../keys')

module.exports = function (email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'аккаунт создан',
        html: `
        <h1>Добро пожаловать в наш магазин</h1>
         <p>вы успешно создали аккаунт с email - ${email}!</p>
         <hr/>
         <a href="${keys.BASE_URL}">Магмзин курсов</a>
`
    }
}
