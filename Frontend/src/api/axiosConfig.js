import axios from 'axios'
import { toast } from 'react-toastify'

function getAxios() {
    return axios.create({
        baseURL: process.env.REACT_APP_API_URL,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

const publicAPI = getAxios()

const privateAPI = getAxios()
privateAPI.interceptors.response.use(null, (err) => {
    const status = err.response.status
    if (status === 401 || status === 403) {
        if (err.response.status === 401) toast.error('Bạn chưa đăng nhập')
        else if (err.response.status === 403) toast.error('Bạn không có đủ quyền để thực hiện hành động này')
        return Promise.reject('nevermind')
    }
    return Promise.reject(err)
})

function handleError(error) {
    if (error === 'nevermind') return
    toast.error(error.response.data.message)
    console.log(error)
}

export { publicAPI, privateAPI, handleError }
