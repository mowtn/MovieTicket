import { useState } from 'react'
import { toast } from 'react-toastify'

import { validateField, validateObject } from '../../utils/validateUtil'
import webAPI from '../../api/webAPI'
import { handleError } from '../../api/axiosConfig'
import { useAuth } from '../../contexts/AuthContext'

const validateRules = [
    {
        name: 'fullname',
        message: 'Họ tên không được để trống.',
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

function Profile() {
    const { currentUser } = useAuth()
    const [data, setData] = useState(currentUser)
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
            await webAPI.profile.updateInfo(data)
            toast.success('Cập nhật thông tin thành công')
        } catch (error) {
            handleError(error)
        }
    }

    return (
        <div className="mx-auto md:w-2/3">
            <form onSubmit={handleFormSubmit} className="mb-3">
                <div className="mb-3 flex flex-wrap items-center">
                    <label className="md:w-2/12" htmlFor="fullname">
                        Họ tên
                    </label>
                    <input
                        className="w-full md:w-10/12 border aria-[invalid]:outline-red-primary rounded-md px-3 py-2 focus:outline outline-blue-primary"
                        type="text"
                        id="fullname"
                        name="fullname"
                        value={data.fullname}
                        onChange={handleInputChange}
                        aria-invalid={errors.fullname}
                        autoFocus
                    />
                    <div className="md:w-2/12"></div>
                    {errors.fullname && <div className="mt-1 text-red-primary">{errors.fullname}</div>}
                </div>
                <div className="mb-3 flex flex-wrap items-center">
                    <label className="md:w-2/12" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="w-full md:w-10/12 border aria-[invalid]:outline-red-primary rounded-md px-3 py-2 focus:outline outline-blue-primary"
                        type="text"
                        id="email"
                        name="email"
                        value={data.email}
                        onChange={handleInputChange}
                        aria-invalid={errors.email}
                    />
                    <div className="md:w-2/12"></div>
                    {errors.email && <div className="mt-1 text-red-primary">{errors.email}</div>}
                </div>
                <div className="mb-3 flex flex-wrap items-center">
                    <label className="md:w-2/12" htmlFor="phoneNumber">
                        Số điện thoại
                    </label>
                    <input
                        className="w-full md:w-10/12 border aria-[invalid]:outline-red-primary rounded-md px-3 py-2 focus:outline outline-blue-primary"
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={data.phoneNumber}
                        onChange={handleInputChange}
                        aria-invalid={errors.phoneNumber}
                    />
                    <div className="md:w-2/12"></div>
                    {errors.phoneNumber && <div className="mt-1 text-red-primary">{errors.phoneNumber}</div>}
                </div>
                <div className="text-right">
                    <button className="py-2 px-5 rounded-md bg-blue-primary text-white hover:opacity-80">
                        Xác nhận
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Profile
