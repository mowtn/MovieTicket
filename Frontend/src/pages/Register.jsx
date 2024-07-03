import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { validateField, validateObject } from '../utils/validateUtil'
import webAPI from '../api/webAPI'
import { handleError } from '../api/axiosConfig'
import { toast } from 'react-toastify'

const validateRules = [
    {
        name: 'fullname',
        message: 'Họ tên không được để trống.',
        test: (value) => !value,
    },
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
    {
        name: 'email',
        message: 'Email không được để trống.',
        test: (value) => !value,
    },
    {
        name: 'email',
        message: 'Email không đúng định dạng.',
        test: (value) => !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value),
    },
    {
        name: 'phoneNumber',
        message: 'Số điện thoại không được để trống.',
        test: (value) => !value,
    },
    {
        name: 'phoneNumber',
        message: 'Số điện thoại không đúng định dạng.',
        test: (value) => !/^0\d{8,15}$/.test(value),
    },
]

function Register() {
    const navigate = useNavigate()
    const [data, setData] = useState({
        fullname: '',
        username: '',
        password: '',
        email: '',
        phoneNumber: '',
    })
    const [errors, setErrors] = useState({})

    const handleInputChange = (e) => {
        const { name, value } = e.target
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
        try {
            await webAPI.profile.register(data)
            toast.success('Đăng ký tài khoản thành công')
            navigate('/login', { replace: true })
        } catch (error) {
            handleError(error)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary text-sm text-slate-800">
            <div className="m-5 md:w-1/2 xl:w-1/3 bg-white p-5 rounded-2xl shadow drop-shadow">
                <form onSubmit={handleFormSubmit}>
                    <div className="px-10">
                        <div className="mb-5 text-2xl font-bold text-center">Đăng Ký</div>
                        <div className="mb-3">
                            <label htmlFor="fullname">Họ tên</label>
                            <input
                                className="border aria-[invalid]:outline-red-primary rounded-md px-3 py-2 w-full focus:outline outline-blue-primary"
                                type="text"
                                id="fullname"
                                name="fullname"
                                value={data.fullname}
                                onChange={handleInputChange}
                                aria-invalid={errors.fullname}
                                autoFocus
                            />
                            {errors.fullname && <div className="mt-1 text-red-primary">{errors.fullname}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="username">Tài khoản</label>
                            <input
                                className="border aria-[invalid]:outline-red-primary rounded-md px-3 py-2 w-full focus:outline outline-blue-primary"
                                type="text"
                                id="username"
                                name="username"
                                value={data.username}
                                onChange={handleInputChange}
                                aria-invalid={errors.username}
                            />
                            {errors.username && <div className="mt-1 text-red-primary">{errors.username}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password">Mật khẩu</label>
                            <input
                                className="border aria-[invalid]:outline-red-primary rounded-md px-3 py-2 w-full focus:outline outline-blue-primary"
                                type="password"
                                id="password"
                                name="password"
                                value={data.password}
                                onChange={handleInputChange}
                                aria-invalid={errors.password}
                            />
                            {errors.password && <div className="mt-1 text-red-primary">{errors.password}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email">Email</label>
                            <input
                                className="border aria-[invalid]:outline-red-primary rounded-md px-3 py-2 w-full focus:outline outline-blue-primary"
                                type="text"
                                id="email"
                                name="email"
                                value={data.email}
                                onChange={handleInputChange}
                                aria-invalid={errors.email}
                            />
                            {errors.email && <div className="mt-1 text-red-primary">{errors.email}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phoneNumber">Số điện thoại</label>
                            <input
                                className="border aria-[invalid]:outline-red-primary rounded-md px-3 py-2 w-full focus:outline outline-blue-primary"
                                type="text"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={data.phoneNumber}
                                onChange={handleInputChange}
                                aria-invalid={errors.phoneNumber}
                            />
                            {errors.phoneNumber && <div className="mt-1 text-red-primary">{errors.phoneNumber}</div>}
                        </div>
                        <button className="mb-3 w-full py-2 rounded-md bg-blue-primary text-white hover:opacity-80">
                            Đăng ký
                        </button>
                        <p className="text-center text-xs">
                            Đã có tài khoản?{' '}
                            <Link to="/login" className="text-blue-primary">
                                Đăng nhập
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register
