import { useEffect, useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { toast } from 'react-toastify'

import Modal from '../../components/Modal'
import Dropdown from '../../components/Dropdown'
import adminAPI from '../../api/adminAPI'
import dateUtil from '../../utils/dateUtil'
import { FaTimes } from 'react-icons/fa'
import { handleError } from '../../api/axiosConfig'

function Showtime() {
    const [isLoading, setLoading] = useState(true)
    const [showModalCreate, setShowModalCreate] = useState(false)
    const [showModalUpdate, setShowModalUpdate] = useState(false)
    const [showModalDelete, setShowModalDelete] = useState(false)

    const [showtimes, setShowtimes] = useState([])
    const [cinemas, setCinemas] = useState([])
    const [rooms, setRooms] = useState([])
    const [movies, setMovies] = useState([])
    const [filter, setFilter] = useState({
        cinemaId: '',
        startTime: dateUtil.format(new Date(), dateUtil.INPUT_DATE_FORMAT),
    })

    const dataRequestInit = {
        id: '',
        startTime: dateUtil.format(filter.startTime, 'yyyy-MM-ddT00:00'),
        movieId: movies[0]?.id,
        roomId: rooms[0]?.id,
        active: true,
    }
    const [dataRequest, setDataRequest] = useState(dataRequestInit)
    const [dataFormCreate, setDataFormCreate] = useState([dataRequestInit])

    useEffect(() => {
        async function loadCinemas() {
            try {
                const res = await adminAPI.cinema.getAll()
                setCinemas(res.data)
                setFilter((prev) => ({ ...prev, cinemaId: res.data[0]?.id }))
            } catch (error) {
                toast.error('Lỗi load danh sách rạp')
                console.log(error)
            }
        }

        async function loadMovies() {
            try {
                const res = await adminAPI.movie.getAll()
                setMovies(res.data)
            } catch (error) {
                toast.error('Lỗi load danh sách phim')
                console.log(error)
            }
        }

        ;(async function () {
            await Promise.all([loadCinemas(), loadMovies()])
        })()
    }, [])

    useEffect(() => {
        async function loadRooms() {
            try {
                const res = await adminAPI.room.getAll({ cinemaId: filter.cinemaId })
                setRooms(res.data)
            } catch (error) {
                toast.error('Lỗi load phòng')
                console.log(error)
            }
        }
        async function loadShowtimes() {
            try {
                const res = await adminAPI.showtime.getAll(filter)
                setShowtimes(res.data)
            } catch (error) {
                toast.error('Lỗi load lịch chiếu')
                console.log(error)
            }
        }

        ;(async function () {
            await Promise.all([loadRooms(), loadShowtimes()])
            setLoading(false)
        })()
    }, [filter])

    const handleFormCreateChange = (e, index) => {
        const { name, value, type, checked } = e.target
        let val = value
        if (type === 'checkbox') val = checked
        setDataFormCreate((prev) => prev.map((data, i) => (i === index ? { ...data, [name]: val } : data)))
    }

    const handleFormCreateSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await adminAPI.showtime.createMany(dataFormCreate)
            toast.success('Thêm mới thành công')
            setShowtimes((prev) => [
                ...res.data.filter(
                    (showtime) => dateUtil.format(showtime.startTime, dateUtil.INPUT_DATE_FORMAT) === filter.startTime
                ),
                ...prev,
            ])
            setShowModalCreate(false)
        } catch (error) {
            handleError(error)
        }
    }

    const handleFormUpdateChange = (e) => {
        const { name, value, type, checked } = e.target
        if (type === 'checkbox') setDataRequest((prev) => ({ ...prev, [name]: checked }))
        else setDataRequest((prev) => ({ ...prev, [name]: value }))
    }

    const handleFormUpdateSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await adminAPI.showtime.update(dataRequest.id, dataRequest)
            toast.success('Cập nhật thành công')
            setShowtimes((prev) => prev.map((showtime) => (showtime.id === res.data.id ? res.data : showtime)))
            setShowModalUpdate(false)
        } catch (error) {
            handleError(error)
        }
    }

    const handleDelete = async () => {
        try {
            await adminAPI.showtime.delete([dataRequest.id])
            toast.success('Xoá thành công')
            setShowtimes((prev) => prev.filter((showtime) => showtime.id !== dataRequest.id))
            setShowModalDelete(false)
        } catch (error) {
            toast.error('Lỗi xoá rạp')
        }
    }

    return isLoading ? (
        <></>
    ) : (
        <>
            <div className="mb-3 bg-white rounded shadow p-5">
                <div className="mb-3 flex items-center gap-5">
                    <span>Rạp</span>
                    <select
                        className="max-w-[50%] text-ellipsis border rounded-md px-3 py-2 focus:outline outline-blue-primary"
                        value={filter.cinemaId}
                        onChange={(e) => setFilter((prev) => ({ ...prev, cinemaId: e.target.value }))}
                    >
                        {cinemas.map((cinema) => (
                            <option key={cinema.id} value={cinema.id}>
                                {cinema.name}
                            </option>
                        ))}
                    </select>
                    <span>Ngày</span>
                    <input
                        type="date"
                        className="border rounded-md px-3 py-2 focus:outline outline-blue-primary"
                        value={filter.startTime}
                        onChange={(e) => setFilter((prev) => ({ ...prev, startTime: e.target.value }))}
                    />
                </div>
                <button
                    className="inline-flex gap-1 items-center py-1 px-3 rounded bg-green-primary text-white hover:opacity-80 disabled:opacity-50"
                    disabled={rooms.length === 0}
                    onClick={() => {
                        setDataFormCreate([dataRequestInit])
                        setShowModalCreate(true)
                    }}
                >
                    <IoMdAdd />
                    Thêm
                </button>
            </div>
            {rooms.length === 0 ? (
                <h1 className="mb-3 text-lg font-semibold">Chưa có phòng</h1>
            ) : (
                rooms.map((room) => {
                    const showtimesInRoom = showtimes.filter((showtime) => showtime.room.id === room.id)
                    return (
                        <div key={room.id} className="mb-3">
                            <h1 className="mb-3 text-lg font-semibold">{room.name}</h1>
                            {showtimesInRoom.length === 0 ? (
                                <div className="bg-white rounded shadow p-5">Chưa có lịch chiếu</div>
                            ) : (
                                <div className="bg-white rounded shadow p-5 grid grid-cols-3 md:grid-cols-5 gap-5">
                                    {showtimesInRoom.map((showtime) => (
                                        <div
                                            key={showtime.id}
                                            title={showtime.movie.name}
                                            className={`relative select-none p-3 rounded text-center text-white ${
                                                showtime.active ? 'bg-green-primary' : 'bg-red-secondary'
                                            }`}
                                        >
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
                                                                    setDataRequest({
                                                                        ...showtime,
                                                                        roomId: showtime.room.id,
                                                                        movieId: showtime.movie.id,
                                                                    })
                                                                    setShowModalUpdate(true)
                                                                }}
                                                            >
                                                                Sửa
                                                            </button>
                                                            <button
                                                                className="block w-full text-left whitespace-nowrap px-3 py-1 hover:bg-gray-secondary"
                                                                onClick={() => {
                                                                    setDataRequest(showtime)
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
                                            <h1 className="text-xl font-semibold">
                                                {dateUtil.format(showtime.startTime, dateUtil.TIME_FORMAT)}
                                            </h1>
                                            <p className="whitespace-nowrap overflow-hidden text-ellipsis">
                                                {showtime.movie.name}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })
            )}
            {showModalCreate && (
                <Modal className="md:w-2/3" onHideClick={(e) => setShowModalCreate(false)}>
                    <form onSubmit={handleFormCreateSubmit}>
                        <header className="flex items-center justify-between mb-3">
                            <h1 className="font-bold text-xl">Thêm</h1>
                        </header>
                        <main>
                            {dataFormCreate.map((item, index) => (
                                <div key={index} className="flex items-center mb-3">
                                    <div className="flex-1 grid md:grid-cols-2 gap-3 bg-gray-third rounded p-3 shadow-inner">
                                        <label>
                                            <span>Phòng</span>
                                            <select
                                                className="w-full text-ellipsis border rounded-md px-3 py-2 focus:outline outline-blue-primary"
                                                name="roomId"
                                                value={item.roomId}
                                                onChange={(e) => handleFormCreateChange(e, index)}
                                                autoFocus={index === 0}
                                            >
                                                {rooms.map((room) => (
                                                    <option key={room.id} value={room.id}>
                                                        {room.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        <label>
                                            <span>Phim</span>
                                            <select
                                                className="w-full text-ellipsis border rounded-md px-3 py-2 focus:outline outline-blue-primary"
                                                name="movieId"
                                                value={item.movieId}
                                                onChange={(e) => handleFormCreateChange(e, index)}
                                            >
                                                {movies.map((movie) => (
                                                    <option key={movie.id} value={movie.id}>
                                                        {movie.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        <label>
                                            <span>Thời gian bắt đầu</span>
                                            <div>
                                                <input
                                                    className="w-full border rounded-md px-3 py-2 focus:outline outline-blue-primary"
                                                    type="datetime-local"
                                                    name="startTime"
                                                    value={item.startTime}
                                                    onChange={(e) => handleFormCreateChange(e, index)}
                                                />
                                            </div>
                                        </label>
                                        <div className="select-none">
                                            <span>Kích hoạt</span>
                                            <div>
                                                <label>
                                                    <input
                                                        className="mr-2"
                                                        type="checkbox"
                                                        name="active"
                                                        checked={item.active}
                                                        onChange={(e) => handleFormCreateChange(e, index)}
                                                    />
                                                    Đã kích hoạt
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => setDataFormCreate((prev) => prev.filter((v, i) => i !== index))}
                                        className="p-2 bg-gray-third shadow-inner"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                            <div className="mb-3 text-center">
                                <button
                                    type="button"
                                    onClick={(e) => setDataFormCreate((prev) => [...prev, dataRequestInit])}
                                    className="p-2 rounded bg-green-primary text-white hover:bg-opacity-80"
                                >
                                    <IoMdAdd />
                                </button>
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
                                    Phòng
                                    <select
                                        className="border rounded-md px-3 py-2 w-full focus:outline outline-blue-primary"
                                        name="roomId"
                                        value={dataRequest.roomId}
                                        onChange={handleFormUpdateChange}
                                        autoFocus
                                    >
                                        {rooms.map((room) => (
                                            <option key={room.id} value={room.id}>
                                                {room.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div className="mb-3">
                                <label>
                                    Phim
                                    <select
                                        className="border rounded-md px-3 py-2 w-full focus:outline outline-blue-primary"
                                        name="movieId"
                                        value={dataRequest.movieId}
                                        onChange={handleFormUpdateChange}
                                    >
                                        {movies.map((movie) => (
                                            <option key={movie.id} value={movie.id}>
                                                {movie.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div className="mb-3">
                                <label>
                                    Thời gian bắt đầu
                                    <input
                                        className="border rounded-md px-3 py-2 w-full focus:outline outline-blue-primary"
                                        type="datetime-local"
                                        name="startTime"
                                        value={dataRequest.startTime}
                                        onChange={handleFormUpdateChange}
                                    />
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
                                            onChange={handleFormUpdateChange}
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
                            Bạn có chắc muốn xóa lịch chiếu tại phòng{' '}
                            <span className="text-blue-primary">{dataRequest.room.name}</span> vào{' '}
                            <span className="text-blue-primary">
                                {dateUtil.format(dataRequest.startTime, dateUtil.DATETIME_FORMAT)}
                            </span>{' '}
                            ?
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

export default Showtime
