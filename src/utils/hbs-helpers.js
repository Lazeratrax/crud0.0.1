//утилита переключатель да-нет, подключается в главном файле в хэндлебарсе
module.exports = {
    ifeq(a, b, options) {
        if (a == b) {
            return options.fn(this)
        }
        return options.inverse(this)
    }
}