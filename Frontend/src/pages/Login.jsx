import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import Image from '../components/Image'
import { useAuth } from '../contexts/AuthContext'
import { validateField, validateObject } from '../utils/validateUtil'
import webAPI from '../api/webAPI'

const validateRules = [
    {
        name: 'username',
        message: 'Tài khoản không được để trống.',
        test: (value) => !value,
    },
    {
        name: 'password',
        message: 'Mật khẩu không được để trống.',
        test: (value) => !value,
    },
]

function Login() {
    const location = useLocation()
    const navigate = useNavigate()
    const { login } = useAuth()
    const [data, setData] = useState({
        username: '',
        password: '',
        remember: false,
    })
    const [errors, setErrors] = useState({})

    const handleInputChange = (e) => {
        const name = e.target.name
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        const errs = validateField(name, value, validateRules, errors)
        setErrors(errs)
        setData((prev) => ({ ...prev, [name]: value }))
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        const errs = validateObject(data, validateRules)
        if (Object.keys(errs).length > 0) {
            setErrors(errs)
            return
        }

        await login(data, (res) => {
            if (location.state?.navigateBack) return navigate(-1, { replace: true })
            if (res.data.isAdmin) return navigate('/admin', { replace: true })
            return navigate('/', { replace: true })
        })
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary text-sm text-slate-800">
            <form onSubmit={handleFormSubmit}>
                <div className="flex items-center bg-white p-5 rounded-2xl shadow drop-shadow">
                    <div>
                        <Image className="rounded-2xl" src={webAPI.getStatic('login-thumbnail.jpg')} />
                    </div>
                    <div className="px-10 min-w-[23rem]">
                        <div className="text-2xl font-bold text-center mb-10">Đăng Nhập</div>
                        <div className="mb-3">
                            <input
                                className="border aria-[invalid]:outline-red-primary rounded-md px-3 py-2 w-full focus:outline outline-blue-primary"
                                type="text"
                                placeholder="Tài khoản"
                                id="username"
                                name="username"
                                value={data.username}
                                onChange={handleInputChange}
                                aria-invalid={errors.username}
                                autoFocus
                            />
                            {errors.username && <div className="mt-1 text-red-primary">{errors.username}</div>}
                        </div>
                        <div className="mb-3">
                            <input
                                className="border aria-[invalid]:outline-red-primary rounded-md px-3 py-2 w-full focus:outline outline-blue-primary"
                                type="password"
                                placeholder="Mật khẩu"
                                id="password"
                                name="password"
                                value={data.password}
                                onChange={handleInputChange}
                                aria-invalid={errors.password}
                            />
                            {errors.password && <div className="mt-1 text-red-primary">{errors.password}</div>}
                        </div>
                        <div className="mb-8 select-none">
                            <input
                                className="mr-2"
                                type="checkbox"
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="remember">Nhớ mật khẩu</label>
                        </div>
                        <button className="mb-3 w-full py-2 rounded-md bg-blue-primary text-white hover:opacity-80">
                            Đăng nhập
                        </button>
                        <p className="text-center text-xs">
                            Chưa có tài khoản?{' '}
                            <Link to="/register" className="text-blue-primary">
                                Đăng ký
                            </Link>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Login
