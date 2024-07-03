import { useState } from 'react'
import { toast } from 'react-toastify'

import { validateField, validateObject } from '../../utils/validateUtil'
import webAPI from '../../api/webAPI'
import { handleError } from '../../api/axiosConfig'

const validateRules = [
    {
        name: 'oldPass',
        message: 'Không được để trống.',
        test: (value) => !value,
    },
    {
        name: 'newPass',
        message: 'Không được để trống.',
        test: (value) => !value,
    },
    {
        name: 'retypePass',
        message: 'Không được để trống.',
        test: (value) => !value,
    },
]

function Profile() {
    const [data, setData] = useState({
        oldPass: '',
        newPass: '',
        retypePass: '',
    })
    const [errors, setErrors] = useState({})

    const handleInputChange = (e) => {
        const { name, value } = e.target
        const errs = validateField(name, value, validateRules, errors)
        if (name === 'retypePass' && !errs[name] && value !== data.newPass) errs[name] = 'Mật khẩu nhập lại không đúng'
        setErrors(errs)
        setData((prev) => ({ ...prev, [name]: value }))
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        const errs = validateObject(data, validateRules)
        if (data.retypePass !== data.newPass) errs.retypePass = 'Mật khẩu nhập lại không đúng'
        if (Object.keys(errs).length > 0) {
            setErrors(errs)
            return
        }
        try {
            await webAPI.profile.changePass(data)
            toast.success('Đổi mật khẩu thành công')
        } catch (error) {
            handleError(error)
        }
    }

    return (
        <div className="mx-auto md:w-2/3">
            <form onSubmit={handleFormSubmit}>
                <div className="mb-3 flex flex-wrap items-center">
                    <label className="md:w-2/12" htmlFor="oldPass">
                        Mật khẩu cũ
                    </label>
                    <input
                        className="w-full md:w-10/12 border aria-[invalid]:outline-red-primary rounded-md px-3 py-2 focus:outline outline-blue-primary"
                        type="text"
                        id="oldPass"
                        name="oldPass"
                        value={data.oldPass}
                        onChange={handleInputChange}
                        aria-invalid={errors.oldPass}
                    />
                    <div className="md:w-2/12"></div>
                    {errors.oldPass && <div className="mt-1 text-red-primary">{errors.oldPass}</div>}
                </div>
                <div className="mb-3 flex flex-wrap items-center">
                    <label className="md:w-2/12" htmlFor="newPass">
                        Mật khẩu mới
                    </label>
                    <input
                        className="w-full md:w-10/12 border aria-[invalid]:outline-red-primary rounded-md px-3 py-2 focus:outline outline-blue-primary"
                        type="text"
                        id="newPass"
                        name="newPass"
                        value={data.newPass}
                        onChange={handleInputChange}
                        aria-invalid={errors.newPass}
                    />
                    <div className="md:w-2/12"></div>
                    {errors.newPass && <div className="mt-1 text-red-primary">{errors.newPass}</div>}
                </div>
                <div className="mb-3 flex flex-wrap items-center">
                    <label className="md:w-2/12" htmlFor="retypePass">
                        Nhập lại mật khẩu
                    </label>
                    <input
                        className="w-full md:w-10/12 border aria-[invalid]:outline-red-primary rounded-md px-3 py-2 focus:outline outline-blue-primary"
                        type="text"
                        id="retypePass"
                        name="retypePass"
                        value={data.retypePass}
                        onChange={handleInputChange}
                        aria-invalid={errors.retypePass}
                    />
                    <div className="md:w-2/12"></div>
                    {errors.retypePass && <div className="mt-1 text-red-primary">{errors.retypePass}</div>}
                </div>
                <div className="text-right">
                    <button className="py-2 px-5 rounded-md bg-blue-primary text-white hover:opacity-80">
                        Đổi mật khẩu
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Profile
