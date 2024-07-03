function format(date, format) {
    date = convertToDate(date)
    return format
        .replace('yyyy', date.getFullYear())
        .replace('MM', pad(date.getMonth() + 1))
        .replace('dd', pad(date.getDate()))
        .replace('hh', pad(date.getHours()))
        .replace('mm', pad(date.getMinutes()))
        .replace('ss', pad(date.getSeconds()))
}

function pad(value) {
    const str = String(value)
    return str.length === 1 ? '0' + str : str
}

function convertToDate(date) {
    const d = new Date(date)
    if (isNaN(d)) return new Date()
    return d
}

function add(date, duration, type) {
    date = convertToDate(date)
    switch (type) {
        case dateType.YEARS:
            return new Date(date.setFullYear(date.getFullYear() + duration))
        case dateType.MONTHS:
            return new Date(date.setMonth(date.getMonth() + duration))
        case dateType.DAYS:
            return new Date(date.setDate(date.getDate() + duration))
        case dateType.HOURS:
            return new Date(date.setHours(date.getHours() + duration))
        case dateType.MINUTES:
            return new Date(date.setMinutes(date.getMinutes() + duration))
        case dateType.SECONDS:
            return new Date(date.setSeconds(date.getSeconds() + duration))
        default:
            return new Date(date.getTime() + duration)
    }
}

function getDateRange(startDate, endDate, type = dateType.DAYS) {
    const dateArray = []
    let currentDate = startDate
    while (currentDate <= endDate) {
        dateArray.push(new Date(currentDate))
        currentDate = add(currentDate, 1, type)
    }
    return dateArray
}

function getMonday(d) {
    d = convertToDate(d)
    const day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
}

function getFormatByDateType(type = dateType.DAYS) {
    switch (type) {
        case dateType.YEARS:
            return 'yyyy'
        case dateType.MONTHS:
            return 'MM/yyyy'
        case dateType.DAYS:
            return 'dd/MM'
        case dateType.HOURS:
            return 'hh dd/MM/yyyy'
        case dateType.MINUTES:
            return 'hh:mm dd/MM/yyyy'
        default:
            return 'hh:mm:ss dd/MM/yyyy'
    }
}

const dateType = Object.freeze({
    YEARS: 'YEARS',
    MONTHS: 'MONTHS',
    DAYS: 'DAYS',
    HOURS: 'HOURS',
    MINUTES: 'MINUTES',
    SECONDS: 'SECONDS',
})

const DATE_FORMAT = 'dd/MM/yyyy'
const TIME_FORMAT = 'hh:mm'
const DATETIME_FORMAT = 'hh:mm dd/MM/yyyy'

const INPUT_MONTH_FORMAT = 'yyyy-MM'
const INPUT_DATE_FORMAT = 'yyyy-MM-dd'
const INPUT_DATETIME_FORMAT = 'yyyy-MM-ddThh:mm'

const dateUtil = {
    format,
    add,
    pad,
    getMonday,
    getDateRange,
    getFormatByDateType,
    dateType,
    DATE_FORMAT,
    TIME_FORMAT,
    DATETIME_FORMAT,
    INPUT_MONTH_FORMAT,
    INPUT_DATE_FORMAT,
    INPUT_DATETIME_FORMAT,
}
export default dateUtil
