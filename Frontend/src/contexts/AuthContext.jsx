import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import webAPI from '../api/webAPI'
import Loading from '../components/Loading'
import localStorageUtil from '../utils/localStorageUtil'

const AuthContext = createContext()

function AuthProvider(props) {
    const [currentUser, setCurrentUser] = useState(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        const isLogin = localStorageUtil.getItem('isLogin')
        if (isLoading) {
            if (isLogin === true) {
                webAPI.profile
                    .getCurrentUser()
                    .then((res) => setCurrentUser(res.data))
                    .catch((err) => {
                        setCurrentUser(null)
                        localStorage.removeItem('isLogin')
                    })
                    .finally(() => setLoading(false))
            } else setLoading(false)
        }
    }, [isLoading])

    const login = async (data, onLoginSuccess = () => {}) => {
        try {
            const res = await webAPI.profile.login(data)
            localStorageUtil.setItem('isLogin', true)
            setLoading(true)
            toast.success('Đăng nhập thành công')

            setTimeout(() => {
                onLoginSuccess(res)
            }, 0)
        } catch (error) {
            toast.error('Thông tin tài khoản hoặc mật khẩu không chính xác')
        }
    }

    const logout = async () => {
        try {
            const res = await webAPI.profile.logout()
            localStorage.removeItem('isLogin')
            setCurrentUser(null)
            return res
        } catch (error) {
            toast.error('Lỗi đăng xuất')
        }
    }

    const value = { currentUser, login, logout }

    return isLoading ? <Loading /> : <AuthContext.Provider value={value} {...props}></AuthContext.Provider>
}

function useAuth() {
    return useContext(AuthContext)
}

export { useAuth, AuthProvider }
