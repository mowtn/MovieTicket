import { useEffect, useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { toast } from 'react-toastify'
import { Link, useParams } from 'react-router-dom'

import SeatType from './SeatType'
import Modal from '../../../components/Modal'
import adminAPI from '../../../api/adminAPI'
import { validateField, validateObject } from '../../../utils/validateUtil'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import RenderSeatTable from './RenderSeatTable'
import { handleError } from '../../../api/axiosConfig'

const validateRules = [
    {
        name: 'name',
        message: 'Tên không được để trống.',
        test: (value) => !value,
    },
]

function Seat() {
    const { roomId } = useParams()

    const [isLoading, setLoading] = useState(true)
    const [showModalCreate, setShowModalCreate] = useState(false)
    const [showModalUpdate, setShowModalUpdate] = useState(false)
    const [showModalDelete, setShowModalDelete] = useState(false)

    const [room, setRoom] = useState({})
    const [seats, setSeats] = useState([])
    const [seatTypes, setSeatTypes] = useState([])
    const [selectedSeat, setSelectedSeat] = useState()

    const dataRequestInit = {
        id: '',
        name: '',
        rowOrder: 1,
        columnOrder: 1,
        roomId,
        typeId: seatTypes[0]?.id,
        active: true,
    }
    const [dataRequest, setDataRequest] = useState(dataRequestInit)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        async function loadRoom() {
            try {
                const res = await adminAPI.room.getOne(roomId)
                setRoom(res.data)
            } catch (error) {
                toast.error('Lỗi load danh sách')
                console.log(error)
            }
        }

        async function loadSeats() {
            try {
                const res = await adminAPI.seat.getAll({ roomId })
                setSeats(res.data)
            } catch (error) {
                toast.error('Lỗi load danh sách')
                console.log(error)
            }
        }

        ;(async function () {
            await Promise.all([loadRoom(), loadSeats()])
            setLoading(false)
        })()
    }, [])

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
            const res = await adminAPI.seat.create(dataRequest)
            toast.success('Thêm mới thành công')
            setSeats((prev) => [res.data, ...prev])
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
            const res = await adminAPI.seat.update(dataRequest.id, dataRequest)
            toast.success('Cập nhật thành công')
            setSeats((prev) => prev.map((seat) => (seat.id === res.data.id ? res.data : seat)))
            setShowModalUpdate(false)
        } catch (error) {
            handleError(error)
        }
    }

    const handleDelete = async () => {
        try {
            await adminAPI.seat.delete([dataRequest.id])
            toast.success('Xoá thành công')
            setSeats((prev) => prev.filter((seat) => seat.id !== dataRequest.id))
            setShowModalDelete(false)
        } catch (error) {
            toast.error('Lỗi xoá ghế')
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
                ({room.cinema.name}) |{' '}
                <Link to={`/admin/cinema/${room.cinema.id}/room`} className="text-blue-primary">
                    Phòng
                </Link>{' '}
                ({room.name}) | Ghế
            </h1>
            <div className="mb-3 bg-white rounded shadow p-5">
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
                        className="inline-flex gap-1 items-center py-1 px-3 rounded bg-yellow-primary text-white hover:opacity-80 disabled:opacity-50 mr-2"
                        disabled={!selectedSeat}
                        onClick={() => {
                            setDataRequest({
                                ...selectedSeat,
                                roomId: selectedSeat.room.id,
                                typeId: selectedSeat.type.id,
                            })
                            setErrors({})
                            setShowModalUpdate(true)
                        }}
                    >
                        <AiFillEdit />
                        Sửa
                    </button>
                    <button
                        className="inline-flex gap-1 items-center py-1 px-3 rounded bg-red-secondary text-white hover:opacity-80 disabled:opacity-50"
                        disabled={!selectedSeat}
                        onClick={() => {
                            setDataRequest(selectedSeat)
                            setShowModalDelete(true)
                        }}
                    >
                        <AiFillDelete />
                        Xóa
                    </button>
                </div>
                <RenderSeatTable
                    seats={seats}
                    selectedSeat={selectedSeat}
                    onSeatClick={(seat) => setSelectedSeat(selectedSeat?.id === seat.id ? undefined : seat)}
                />
            </div>
            <SeatType onSeatTypeChange={(seatTypes) => setSeatTypes(seatTypes)} />
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
                                    Hàng
                                    <input
                                        className="border aria-[invalid]:outline-red-primary rounded-md px-3 py-2 w-full focus:outline outline-blue-primary"
                                        type="number"
                                        min={0}
                                        name="rowOrder"
                                        value={dataRequest.rowOrder.toString()}
                                        onChange={handleFormInputChange}
                                        aria-invalid={errors.rowOrder}
                                    />
                                </label>
                                {errors.rowOrder && <div className="mt-1 text-red-primary">{errors.rowOrder}</div>}
                            </div>
                            <div className="mb-3">
                                <label>
                                    Cột
                                    <input
                                        className="border aria-[invalid]:outline-red-primary rounded-md px-3 py-2 w-full focus:outline outline-blue-primary"
                                        type="number"
                                        min={0}
                                        name="columnOrder"
                                        value={dataRequest.columnOrder.toString()}
                                        onChange={handleFormInputChange}
                                        aria-invalid={errors.columnOrder}
                                    />
                                </label>
                                {errors.columnOrder && (
                                    <div className="mt-1 text-red-primary">{errors.columnOrder}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label>
                                    Loại ghế
                                    <select
                                        className="border rounded-md px-3 py-2 w-full focus:outline outline-blue-primary"
                                        name="typeId"
                                        value={dataRequest.typeId}
                                        onChange={handleFormInputChange}
                                    >
                                        {seatTypes.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
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
                                    Hàng
                                    <input
                                        className="border aria-[invalid]:outline-red-primary rounded-md px-3 py-2 w-full focus:outline outline-blue-primary"
                                        type="number"
                                        min={0}
                                        name="rowOrder"
                                        value={dataRequest.rowOrder.toString()}
                                        onChange={handleFormInputChange}
                                        aria-invalid={errors.rowOrder}
                                    />
                                </label>
                                {errors.rowOrder && <div className="mt-1 text-red-primary">{errors.rowOrder}</div>}
                            </div>
                            <div className="mb-3">
                                <label>
                                    Cột
                                    <input
                                        className="border aria-[invalid]:outline-red-primary rounded-md px-3 py-2 w-full focus:outline outline-blue-primary"
                                        type="number"
                                        min={0}
                                        name="columnOrder"
                                        value={dataRequest.columnOrder.toString()}
                                        onChange={handleFormInputChange}
                                        aria-invalid={errors.columnOrder}
                                    />
                                </label>
                                {errors.columnOrder && (
                                    <div className="mt-1 text-red-primary">{errors.columnOrder}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label>
                                    Loại ghế
                                    <select
                                        className="border rounded-md px-3 py-2 w-full focus:outline outline-blue-primary"
                                        name="typeId"
                                        value={dataRequest.typeId}
                                        onChange={handleFormInputChange}
                                    >
                                        {seatTypes.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
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

export default Seat
