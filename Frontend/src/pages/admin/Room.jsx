import { useEffect, useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { toast } from 'react-toastify'

import Modal from '../../components/Modal'
import Dropdown from '../../components/Dropdown'
import adminAPI from '../../api/adminAPI'
import { validateField, validateObject } from '../../utils/validateUtil'
import { Link, useParams } from 'react-router-dom'
import { handleError } from '../../api/axiosConfig'

const validateRules = [
    {
        name: 'name',
        message: 'Tên không được để trống.',
        test: (value) => !value,
    },
]

function Room() {
    const { cinemaId } = useParams()

    const [isLoading, setLoading] = useState(true)
    const [showModalCreate, setShowModalCreate] = useState(false)
    const [showModalUpdate, setShowModalUpdate] = useState(false)
    const [showModalDelete, setShowModalDelete] = useState(false)

    const [cinema, setCinema] = useState({})
    const [rooms, setRooms] = useState([])

    const dataRequestInit = {
        id: '',
        name: '',
        cinemaId,
        active: true,
    }
    const [dataRequest, setDataRequest] = useState(dataRequestInit)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        async function loadCinema() {
            try {
                const res = await adminAPI.cinema.getOne(cinemaId)
                setCinema(res.data)
            } catch (error) {
                toast.error('Lỗi load danh sách')
                console.log(error)
            }
        }

        async function loadRooms() {
            try {
                const res = await adminAPI.room.getAll({ cinemaId })
                setRooms(res.data)
            } catch (error) {
                toast.error('Lỗi load danh sách')
                console.log(error)
            }
        }

        ;(async function () {
            await Promise.all([loadCinema(), loadRooms()])
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
            const res = await adminAPI.room.create(dataRequest)
            toast.success('Thêm mới thành công')
            setRooms((prev) => [res.data, ...prev])
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
            const res = await adminAPI.room.update(dataRequest.id, dataRequest)
            toast.success('Cập nhật thành công')
            setRooms((prev) => prev.map((room) => (room.id === res.data.id ? res.data : room)))
            setShowModalUpdate(false)
        } catch (error) {
            handleError(error)
        }
    }

    const handleDelete = async () => {
        try {
            await adminAPI.room.delete([dataRequest.id])
            toast.success('Xoá thành công')
            setRooms((prev) => prev.filter((room) => room.id !== dataRequest.id))
            setShowModalDelete(false)
        } catch (error) {
            toast.error('Lỗi xoá phòng')
        }
    }

    return isLoading ? (
        <></>
    ) : (
        <>
            <h1 className="mb-3 text-lg font-semibold">
                <Link to="/admin/cinema" className="text-blue-primary">
                    Rạp
                </Link>{' '}
                ({cinema.name}) | Phòng
            </h1>
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
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-5">
                    {rooms.map((room) => (
                        <div key={room.id} className="relative select-none">
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
                                                    setDataRequest({ ...room, cinemaId: room.cinema.id })
                                                    setErrors({})
                                                    setShowModalUpdate(true)
                                                }}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                className="block w-full text-left whitespace-nowrap px-3 py-1 hover:bg-gray-secondary"
                                                onClick={() => {
                                                    setDataRequest(room)
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
                                to={`/admin/cinema/room/${room.id}/seat`}
                                className={`h-full flex justify-center items-center text-center p-3 rounded text-white hover:bg-opacity-80 ${
                                    room.active ? 'bg-green-primary' : 'bg-red-secondary'
                                }`}
                            >
                                {room.name}
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

export default Room
