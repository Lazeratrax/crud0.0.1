const keys = require('../keys')

module.exports = function (email, token) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'аккаунт создан',
        html: `
        <h1>Восстановление пароля</h1>
        
         <p>Если вы случайно оказалаись здесь, проигнорируйте это письмо </p>
         <p>Иначе, нажмите на ссылку:
         <a href=`${keys.BASE_URL}/auth/password/${token}`>Восстановить доступ</a>
         </p>
         <hr/>
         <a href="${keys.BASE_URL}">Магазин курсов</a>
`
    }
}
