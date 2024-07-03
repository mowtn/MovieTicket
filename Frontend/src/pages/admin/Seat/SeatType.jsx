import { useEffect, useState } from 'react'
import { AiFillDelete } from 'react-icons/ai'
import { IoMdAdd } from 'react-icons/io'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { toast } from 'react-toastify'

import Modal from '../../../components/Modal'
import Dropdown from '../../../components/Dropdown'
import adminAPI from '../../../api/adminAPI'
import arrayUtil from '../../../utils/arrayUtil'
import currencyUtil from '../../../utils/currencyUtil'
import { validateField, validateObject } from '../../../utils/validateUtil'
import { handleError } from '../../../api/axiosConfig'

const dataRequestInit = {
    id: '',
    name: '',
    color: '#000000',
    price: 0,
    active: true,
}
const validateRules = [
    {
        name: 'name',
        message: 'Tên đồ ăn không được để trống.',
        test: (value) => !value,
    },
]

function SeatType({ onSeatTypeChange }) {
    const [isLoading, setLoading] = useState(true)
    const [showModalCreate, setShowModalCreate] = useState(false)
    const [showModalUpdate, setShowModalUpdate] = useState(false)
    const [showModalDelete, setShowModalDelete] = useState(false)

    const [seatTypes, setSeatTypes] = useState([])

    const [selectedId, setSelectedId] = useState([])
    const [dataRequest, setDataRequest] = useState(dataRequestInit)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        async function loadSeatTypes() {
            try {
                const res = await adminAPI.seatType.getAll()
                setSeatTypes(res.data)
            } catch (error) {
                toast.error('Lỗi load danh sách')
                console.log(error)
            }
        }

        ;(async function () {
            await loadSeatTypes()
            setLoading(false)
        })()
    }, [])

    useEffect(() => {
        onSeatTypeChange(seatTypes)
    }, [seatTypes])

    const handleFormInputChange = (e) => {
        const { name, value, type, checked, valueAsNumber } = e.target
        if (type === 'number') setDataRequest((prev) => ({ ...prev, [name]: valueAsNumber || 0 }))
        else if (type === 'checkbox') setDataRequest((prev) => ({ ...prev, [name]: checked }))
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
            const res = await adminAPI.seatType.create(dataRequest)
            toast.success('Thêm mới thành công')
            setSeatTypes((prev) => [res.data, ...prev])
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
            const res = await adminAPI.seatType.update(dataRequest.id, dataRequest)
            toast.success('Cập nhật thành công')
            setSeatTypes((prev) => prev.map((seatType) => (seatType.id === res.data.id ? res.data : seatType)))
            setShowModalUpdate(false)
        } catch (error) {
            handleError(error)
        }
    }

    const handleDelete = async () => {
        try {
            await adminAPI.seatType.delete(selectedId)
            toast.success('Xoá thành công')
            setSeatTypes((prev) => prev.filter((seatType) => !selectedId.includes(seatType.id)))
            setSelectedId([])
            setShowModalDelete(false)
        } catch (error) {
            toast.error('Lỗi xoá đồ ăn')
        }
    }

    return isLoading ? (
        <></>
    ) : (
        <>
            <h1 className="mb-3 text-lg font-semibold">Loại ghế</h1>
            <div className="bg-white rounded shadow p-5">
                <div className="mb-3">
                    <button
                        className="inline-flex gap-1 items-center py-1 px-3 rounded bg-green-primary text-white hover:opacity-80 disabled:opacity-50 mr-2"
                        onClick={() => {
                            setDataRequest(dataRequestInit)
                            setErrors({})
                            setShowModalCreate(true)
                        }}
                    >
                        <IoMdAdd />
                        Thêm
                    </button>
                    <button
                        className="inline-flex gap-1 items-center py-1 px-3 rounded bg-red-secondary text-white hover:opacity-80 disabled:opacity-50"
                        disabled={selectedId.length === 0}
                        onClick={() => setShowModalDelete(true)}
                    >
                        <AiFillDelete />
                        Xóa ({selectedId.length})
                    </button>
                </div>
                <table className="table-custom">
                    <thead>
                        <tr>
                            <th className="w-1">
                                <input
                                    type="checkbox"
                                    checked={selectedId.length === seatTypes.length}
                                    onChange={() => {
                                        if (selectedId.length === seatTypes.length) setSelectedId([])
                                        else if (selectedId.length < seatTypes.length)
                                            setSelectedId(seatTypes.map((item) => item.id))
                                    }}
                                />
                            </th>
                            <th>#</th>
                            <th>Tên</th>
                            <th>Màu</th>
                            <th>Giá</th>
                            <th>Kích hoạt</th>
                            <th className="w-1"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {seatTypes.map((seatType) => (
                            <tr key={seatType.id}>
                                <td>
                                    <input
                                        className="p-2"
                                        type="checkbox"
                                        checked={selectedId.includes(seatType.id)}
                                        onChange={() =>
                                            setSelectedId((prev) => arrayUtil.addOrRemoveValue(prev, seatType.id))
                                        }
                                    />
                                </td>
                                <td>{seatType.id}</td>
                                <td>{seatType.name}</td>
                                <td>
                                    <div
                                        className="inline-block rounded border-4 p-3"
                                        style={{ borderColor: seatType.color }}
                                    ></div>
                                </td>
                                <td>{currencyUtil.format(seatType.price)}</td>
                                <td>
                                    {seatType.active ? (
                                        <span className="text-xs rounded text-white p-1 bg-green-primary whitespace-nowrap">
                                            Đã kích hoạt
                                        </span>
                                    ) : (
                                        <span className="text-xs rounded text-white p-1 bg-red-secondary whitespace-nowrap">
                                            Chưa kích hoạt
                                        </span>
                                    )}
                                </td>
                                <td>
                                    <Dropdown
                                        className="p-2 rounded-full hover:bg-gray-secondary"
                                        Menu={({ isShow }) => (
                                            <div
                                                className="absolute bottom-full right-0 bg-white rounded shadow py-2"
                                                hidden={!isShow}
                                            >
                                                <button
                                                    className="block w-full text-left whitespace-nowrap px-3 py-1 hover:bg-gray-secondary"
                                                    onClick={() => {
                                                        setDataRequest(seatType)
                                                        setErrors({})
                                                        setShowModalUpdate(true)
                                                    }}
                                                >
                                                    Sửa
                                                </button>
                                            </div>
                                        )}
                                    >
                                        <BsThreeDotsVertical />
                                    </Dropdown>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
                                    <span className="mr-2">Màu</span>
                                    <input
                                        className="rounded-md focus:outline outline-blue-primary"
                                        type="color"
                                        name="color"
                                        value={dataRequest.color}
                                        onChange={handleFormInputChange}
                                    />
                                </label>
                            </div>
                            <div className="mb-3">
                                <label>
                                    Giá
                                    <input
                                        className="border aria-[invalid]:outline-red-primary rounded-md px-3 py-2 w-full focus:outline outline-blue-primary"
                                        type="number"
                                        name="price"
                                        min={0}
                                        value={dataRequest.price.toString()}
                                        onChange={handleFormInputChange}
                                        aria-invalid={errors.price}
                                    />
                                </label>
                                {errors.price && <div className="mt-1 text-red-primary">{errors.price}</div>}
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
                                    <span className="mr-2">Màu</span>
                                    <input
                                        className="rounded-md focus:outline outline-blue-primary"
                                        type="color"
                                        name="color"
                                        value={dataRequest.color}
                                        onChange={handleFormInputChange}
                                    />
                                </label>
                            </div>
                            <div className="mb-3">
                                <label>
                                    Giá
                                    <input
                                        className="border aria-[invalid]:outline-red-primary rounded-md px-3 py-2 w-full focus:outline outline-blue-primary"
                                        type="number"
                                        name="price"
                                        min={0}
                                        value={dataRequest.price.toString()}
                                        onChange={handleFormInputChange}
                                        aria-invalid={errors.price}
                                    />
                                </label>
                                {errors.price && <div className="mt-1 text-red-primary">{errors.price}</div>}
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
                            Bạn có chắc muốn xóa{' '}
                            <span className="text-blue-primary">{selectedId.map((id) => `#${id}`).join(', ')}</span> ?
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

export default SeatType
