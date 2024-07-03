import { useEffect, useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { toast } from 'react-toastify'

import Modal from '../../components/Modal'
import Dropdown from '../../components/Dropdown'
import adminAPI from '../../api/adminAPI'
import { validateField, validateObject } from '../../utils/validateUtil'
import { Link } from 'react-router-dom'
import { handleError } from '../../api/axiosConfig'

const dataRequestInit = {
    id: '',
    name: '',
    address: '',
    active: true,
}
const validateRules = [
    {
        name: 'name',
        message: 'Tên không được để trống.',
        test: (value) => !value,
    },
    {
        name: 'address',
        message: 'Địa chỉ không được để trống.',
        test: (value) => !value,
    },
]

function Cinema() {
    const [isLoading, setLoading] = useState(true)
    const [showModalCreate, setShowModalCreate] = useState(false)
    const [showModalUpdate, setShowModalUpdate] = useState(false)
    const [showModalDelete, setShowModalDelete] = useState(false)

    const [cinemas, setCinemas] = useState([])

    const [dataRequest, setDataRequest] = useState(dataRequestInit)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        async function loadCinemas() {
            try {
                const res = await adminAPI.cinema.getAll()
                setCinemas(res.data)
            } catch (error) {
                toast.error('Lỗi load danh sách')
                console.log(error)
            }
        }

        ;(async function () {
            await loadCinemas()
            setLoading(false)
        })()
    }, [])

    const handleFormInputChange = (e) => {
        const { name, value, type, checked } = e.target
        if (type === 'checkbox') setDataRequest((prev) => ({ ...prev, [name]: checked }))
        else {
            const errs = validateField(name, value, validateRules, errors)
            setErrors(errs)
            setDataRequest((prev) => ({ ...prev, [name]: value }))
        }
    }

    const handleFormCreateSubmit = async (e) => {
        e.preventDefault()
        const errs = validateObject(dataRequest, validateRules)
        if (Object.keys(errs).length > 0) {
            setErrors(errs)
            return
        }
        try {
            const res = await adminAPI.cinema.create(dataRequest)
            toast.success('Thêm mới thành công')
            setCinemas((prev) => [res.data, ...prev])
            setShowModalCreate(false)
        } catch (error) {
            handleError(error)
        }
    }

    const handleFormUpdateSubmit = async (e) => {
        e.preventDefault()
        const errs = validateObject(dataRequest, validateRules)
        if (Object.keys(errs).length > 0) {
            setErrors(errs)
            return
        }
        try {
            const res = await adminAPI.cinema.update(dataRequest.id, dataRequest)
            toast.success('Cập nhật thành công')
            setCinemas((prev) => prev.map((cinema) => (cinema.id === res.data.id ? res.data : cinema)))
            setShowModalUpdate(false)
        } catch (error) {
            handleError(error)
        }
    }

    const handleDelete = async () => {
        try {
            await adminAPI.cinema.delete([dataRequest.id])
            toast.success('Xoá thành công')
            setCinemas((prev) => prev.filter((cinema) => cinema.id !== dataRequest.id))
            setShowModalDelete(false)
        } catch (error) {
            toast.error('Lỗi xoá rạp')
        }
    }

    return isLoading ? (
        <></>
    ) : (
        <>
            <h1 className="mb-3 text-lg font-semibold">Danh Sách</h1>
            <div className="bg-white rounded shadow p-5">
                <div className="mb-5">
                    <button
                        className="inline-flex gap-1 items-center py-1 px-3 rounded bg-green-primary text-white hover:opacity-80 disabled:opacity-50"
                        onClick={() => {
                            setDataRequest(dataRequestInit)
                            setErrors({})
                            setShowModalCreate(true)
                        }}
                    >
                        <IoMdAdd />
                        Thêm
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
                    {cinemas.map((cinema) => (
                        <div key={cinema.id} className="relative select-none">
                            <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-black-primary">
                                <Dropdown
                                    className="p-2 rounded-full bg-gray-secondary"
                                    Menu={({ isShow }) => (
                                        <div
                                            className="absolute bottom-full right-1/2 translate-x-1/2 bg-white rounded shadow py-2"
                                            hidden={!isShow}
                                        >
                                            <button
                                                className="block w-full text-left whitespace-nowrap px-3 py-1 hover:bg-gray-secondary"
                                                onClick={() => {
                                                    setDataRequest(cinema)
                                                    setErrors({})
                                                    setShowModalUpdate(true)
                                                }}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                className="block w-full text-left whitespace-nowrap px-3 py-1 hover:bg-gray-secondary"
                                                onClick={() => {
                                                    setDataRequest(cinema)
                                                    setShowModalDelete(true)
                                                }}
                                            >
                                                Xoá
                                            </button>
                                        </div>
                                    )}
                                >
                                    <BsThreeDotsVertical />
                                </Dropdown>
                            </div>
                            <Link
                                to={`/admin/cinema/${cinema.id}/room`}
                                className={`h-full flex justify-center items-center text-center p-3 rounded text-white hover:bg-opacity-80 ${
                                    cinema.active ? 'bg-green-primary' : 'bg-red-secondary'
                                }`}
                            >
                                {cinema.name}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            {showModalCreate && (
                <Modal onHideClick={(e) => setShowModalCreate(false)}>
                    <form onSubmit={handleFormCreateSubmit}>
                        <header className="flex items-center justify-between mb-3">
                            <h1 className="font-bold text-xl">Thêm</h1>
                        </header>
                        <main>
                            <div className="mb-3">
                                <label>
                                    Tên
                                    <input
                                        className="border aria-[invalid]:outline-red-primary rounded-md px-3 py-2 w-full focus:outline outline-blue-primary"
                                        type="text"
                                        name="name"
                                        value={dataRequest.name}
                                        onChange={handleFormInputChange}
                                        aria-invalid={errors.name}
                                        autoFocus
                                    />
                                </label>
                                {errors.name && <div className="mt-1 text-red-primary">{errors.name}</div>}
                            </div>
                            <div className="mb-3">
                                <label>
                                    Địa chỉ
                                    <input
                                        className="border aria-[invalid]:outline-red-primary rounded-md px-3 py-2 w-full focus:outline outline-blue-primary"
                                        type="text"
                                        name="address"
                                        value={dataRequest.address}
                                        onChange={handleFormInputChange}
                                        aria-invalid={errors.address}
                                    />
                                </label>
                                {errors.address && <div className="mt-1 text-red-primary">{errors.address}</div>}
                            </div>
                            <div className="mb-3 select-none">
                                <span>Kích hoạt</span>
                                <div>
                                    <label>
                                        <input
                                            className="mr-2"
                                            type="checkbox"
                                            name="active"
                                            checked={dataRequest.active}
                                            onChange={handleFormInputChange}
                                        />
                                        Đã kích hoạt
                                    </label>
                                </div>
                            </div>
                        </main>
                        <footer className="text-right">
                            <button className="py-2 px-5 rounded-md bg-blue-primary text-white hover:opacity-80">
                                Thêm mới
                            </button>
                        </footer>
                    </form>
                </Modal>
            )}
            {showModalUpdate && (
                <Modal onHideClick={(e) => setShowModalUpdate(false)}>
                    <form onSubmit={handleFormUpdateSubmit}>
                        <header className="flex items-center justify-between mb-3">
                            <h1 className="font-bold text-xl">Cập nhật thông tin</h1>
                        </header>
                        <main>
                            <div className="mb-3">
                                <label>
                                    Tên
                                    <input
                                        className="border aria-[invalid]:outline-red-primary rounded-md px-3 py-2 w-full focus:outline outline-blue-primary"
                                        type="text"
                                        name="name"
                                        value={dataRequest.name}
                                        onChange={handleFormInputChange}
                                        aria-invalid={errors.name}
                                        autoFocus
                                    />
                                </label>
                                {errors.name && <div className="mt-1 text-red-primary">{errors.name}</div>}
                            </div>
                            <div className="mb-3">
                                <label>
                                    Địa chỉ
                                    <input
                                        className="border aria-[invalid]:outline-red-primary rounded-md px-3 py-2 w-full focus:outline outline-blue-primary"
                                        type="text"
                                        name="address"
                                        value={dataRequest.address}
                                        onChange={handleFormInputChange}
                                        aria-invalid={errors.address}
                                    />
                                </label>
                                {errors.address && <div className="mt-1 text-red-primary">{errors.address}</div>}
                            </div>
                            <div className="mb-3 select-none">
                                <span>Kích hoạt</span>
                                <div>
                                    <label>
                                        <input
                                            className="mr-2"
                                            type="checkbox"
                                            name="active"
                                            checked={dataRequest.active}
                                            onChange={handleFormInputChange}
                                        />
                                        Đã kích hoạt
                                    </label>
                                </div>
                            </div>
                        </main>
                        <footer className="text-right">
                            <button className="py-2 px-5 rounded-md bg-blue-primary text-white hover:opacity-80">
                                Cập nhật
                            </button>
                        </footer>
                    </form>
                </Modal>
            )}
            {showModalDelete && (
                <Modal onHideClick={(e) => setShowModalDelete(false)}>
                    <header className="flex items-center justify-between mb-3">
                        <h1 className="font-bold text-xl">Xóa</h1>
                    </header>
                    <main>
                        <p className="mb-3">
                            Bạn có chắc muốn xóa <span className="text-blue-primary">{dataRequest.name}</span> ?
                        </p>
                    </main>
                    <footer className="text-right">
                        <button
                            className="py-2 px-5 rounded-md bg-blue-primary text-white hover:opacity-80"
                            onClick={handleDelete}
                        >
                            Xác nhận
                        </button>
                    </footer>
                </Modal>
            )}
        </>
    )
}

export default Cinema
