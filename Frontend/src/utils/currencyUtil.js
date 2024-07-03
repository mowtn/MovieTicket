function format(number) {
    return number.toLocaleString('vi-vn', { style: 'currency', currency: 'VND' })
}

const currencyUtil = { format }
export default currencyUtil
