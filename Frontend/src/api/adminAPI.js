import { privateAPI } from './axiosConfig'

const user = {
    url: '/admin/user',
    getAll(params) {
        return privateAPI.get(`${this.url}/page`, { params })
    },
    create(data) {
        return privateAPI.post(this.url, data)
    },
    update(id, data) {
        return privateAPI.put(`${this.url}/${id}`, data)
    },
    delete(data) {
        return privateAPI.delete(this.url, { data })
    },
    changePassword(id, newPassword) {
        return privateAPI.put(`${this.url}/${id}/changepassword`, newPassword)
    },
}

const role = {
    getAll() {
        return privateAPI.get('/admin/role')
    },
}

const movie = {
    url: '/admin/movie',
    getAll() {
        return privateAPI.get(this.url)
    },
    getAllWithPage(params) {
        return privateAPI.get(`${this.url}/page`, { params })
    },
    create(data) {
        return privateAPI.post(this.url, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
    update(id, data) {
        return privateAPI.put(`${this.url}/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
    delete(data) {
        return privateAPI.delete(this.url, { data })
    },
}

const food = {
    url: '/admin/food',
    getAll() {
        return privateAPI.get(this.url)
    },
    getAllWithPage(params) {
        return privateAPI.get(`${this.url}/page`, { params })
    },
    create(data) {
        return privateAPI.post(this.url, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
    update(id, data) {
        return privateAPI.put(`${this.url}/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
    delete(data) {
        return privateAPI.delete(this.url, { data })
    },
}

const cinema = {
    url: '/admin/cinema',
    getAll(params) {
        return privateAPI.get(this.url, { params })
    },
    getOne(id) {
        return privateAPI.get(`${this.url}/${id}`)
    },
    create(data) {
        return privateAPI.post(this.url, data)
    },
    update(id, data) {
        return privateAPI.put(`${this.url}/${id}`, data)
    },
    delete(data) {
        return privateAPI.delete(this.url, { data })
    },
}

const room = {
    url: '/admin/room',
    getAll(params) {
        return privateAPI.get(this.url, { params })
    },
    getOne(id) {
        return privateAPI.get(`${this.url}/${id}`)
    },
    create(data) {
        return privateAPI.post(this.url, data)
    },
    update(id, data) {
        return privateAPI.put(`${this.url}/${id}`, data)
    },
    delete(data) {
        return privateAPI.delete(this.url, { data })
    },
}

const seat = {
    url: '/admin/seat',
    getAll(params) {
        return privateAPI.get(this.url, { params })
    },
    create(data) {
        return privateAPI.post(this.url, data)
    },
    update(id, data) {
        return privateAPI.put(`${this.url}/${id}`, data)
    },
    delete(data) {
        return privateAPI.delete(this.url, { data })
    },
}

const seatType = {
    url: '/admin/seattype',
    getAll(params) {
        return privateAPI.get(this.url, { params })
    },
    create(data) {
        return privateAPI.post(this.url, data)
    },
    update(id, data) {
        return privateAPI.put(`${this.url}/${id}`, data)
    },
    delete(data) {
        return privateAPI.delete(this.url, { data })
    },
}

const showtime = {
    url: '/admin/showtime',
    getAll(params) {
        return privateAPI.get(this.url, { params })
    },
    getAllWithFilter(params) {
        return privateAPI.get(`${this.url}/filter`, { params })
    },
    createMany(data) {
        return privateAPI.post(this.url, data)
    },
    update(id, data) {
        return privateAPI.put(`${this.url}/${id}`, data)
    },
    delete(data) {
        return privateAPI.delete(this.url, { data })
    },
}

const ticket = {
    url: '/admin/ticket',
    getAll(params) {
        return privateAPI.get(this.url, { params })
    },
    getAllWithPage(params) {
        return privateAPI.get(`${this.url}/page`, { params })
    },
    getReport(params) {
        return privateAPI.get(`${this.url}/report`, { params })
    },
    create(data) {
        return privateAPI.post(this.url, data)
    },
    update(id, data) {
        return privateAPI.put(`${this.url}/${id}`, data)
    },
    delete(data) {
        return privateAPI.delete(this.url, { data })
    },
}

const banner = {
    url: '/admin/banner',
    getAll() {
        return privateAPI.get(this.url)
    },
    create(data) {
        return privateAPI.post(this.url, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
    update(id, data) {
        return privateAPI.put(`${this.url}/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
    delete(data) {
        return privateAPI.delete(this.url, { data })
    },
}

const adminAPI = { user, role, movie, food, cinema, room, seat, seatType, showtime, ticket, banner }

export default adminAPI
