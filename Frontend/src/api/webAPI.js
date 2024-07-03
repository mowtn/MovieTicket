import { privateAPI, publicAPI } from './axiosConfig'

const profile = {
    url: '/profile',
    register(data) {
        return publicAPI.post('/register', data)
    },
    login(data) {
        return publicAPI.post('/login', data)
    },
    updateInfo(data) {
        return privateAPI.put(this.url, data)
    },
    changePass(newPass) {
        return privateAPI.put(`${this.url}/change-pass`, newPass)
    },
    logout() {
        return privateAPI.post(`${this.url}/logout`)
    },
    getCurrentUser() {
        return publicAPI.get(this.url)
    },
    getCurrentUserTicket() {
        return privateAPI.get(`${this.url}/ticket`)
    },
    bookTicket(data) {
        return privateAPI.post(`${this.url}/payment`, data)
    },
    vnpayReturn(params) {
        return privateAPI.get(`${this.url}/vnpay_return`, { params })
    },
}

const movie = {
    url: '/movie',
    getAllWithPage(params) {
        return publicAPI.get(this.url, { params })
    },
    getOne(slug) {
        return publicAPI.get(`${this.url}/${slug}`)
    },
    getShowtime(id, startTime) {
        return publicAPI.get(`${this.url}/${id}/showtime`, { params: { startTime } })
    },
}

const cinema = {
    url: '/cinema',
    getAll() {
        return publicAPI.get(this.url)
    },
    getShowtime(id, startTime) {
        return publicAPI.get(`${this.url}/${id}/showtime`, { params: { startTime } })
    },
}

const seat = {
    url: '/seat',
    getAll(roomId, showtimeId) {
        return publicAPI.get(this.url, { params: { roomId, showtimeId } })
    },
}

const food = {
    url: '/food',
    getAll() {
        return publicAPI.get(this.url)
    },
}

const banner = {
    getAll() {
        return publicAPI.get('/banner')
    },
}

function getStatic(url) {
    return process.env.REACT_APP_STATIC_URL + '/' + url
}

function getUpload(url) {
    return process.env.REACT_APP_API_URL + '/upload/' + url
}

const webAPI = { getUpload, getStatic, profile, movie, cinema, seat, food, banner }

export default webAPI
