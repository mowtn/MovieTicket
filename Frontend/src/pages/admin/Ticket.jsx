import { Fragment, useCallback, useEffect, useState } from 'react'
import { AiFillDelete } from 'react-icons/ai'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti'
import { TbFileExport } from 'react-icons/tb'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CSVLink } from 'react-csv'

import Modal from '../../components/Modal'
import Dropdown from '../../components/Dropdown'
import adminAPI from '../../api/adminAPI'
import arrayUtil from '../../utils/arrayUtil'
import dateUtil from '../../utils/dateUtil'
import currencyUtil from '../../utils/currencyUtil'
import Pagination from '../../components/Pagination'
import { ticketStatus } from '../../constants/ticketStatus'
import { handleError } from '../../api/axiosConfig'
import InputDelay from '../../components/InputDelay'

const dataRequestInit = {
    id: '',
    note: '',
    status: '',
    active: true,
}

function Ticket() {
    const [isLoading, setLoading] = useState(true)
    const [showModalInfo, setShowModalInfo] = useState(false)
    const [showModalUpdate, setShowModalUpdate] = useState(false)
    const [showModalDelete, setShowModalDelete] = useState(false)

    const [cinemas, setCinemas] = useState([])
    const [movies, setMovies] = useState([])
    const [tickets, setTickets] = useState({
        data: [],
        page: {},
    })
    const [query, setQuery] = useState({
        fromDate: dateUtil.format(dateUtil.add(Date.now(), -30, dateUtil.dateType.DAYS), dateUtil.INPUT_DATE_FORMAT),
        toDate: dateUtil.format(new Date(), dateUtil.INPUT_DATE_FORMAT),
        cinemaId: undefined,
        movieId: undefined,
    })

    const [selectedId, setSelectedId] = useState([])
    const [dataRequest, setDataRequest] = useState(dataRequestInit)

    useEffect(() => {
        async function loadCinemas() {
            try {
                const res = await adminAPI.cinema.getAll()
                setCinemas(res.data)
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

    const loadTickets = useCallback(async function (query) {
        try {
            const res = await adminAPI.ticket.getAllWithPage(query)
            setTickets(res.data)
        } catch (error) {
            toast.error('Lỗi load danh sách')
            console.log(error)
        }
    }, [])

    useEffect(() => {
        ;(async function () {
            await loadTickets(query)
            setLoading(false)
        })()
    }, [query, loadTickets])

    const handleFormInputChange = (e) => {
        const { name, value, type, checked } = e.target
        if (type === 'checkbox') setDataRequest((prev) => ({ ...prev, [name]: checked }))
        else {
            setDataRequest((prev) => ({ ...prev, [name]: value }))
        }
    }

    const handleFormUpdateSubmit = async (e) => {
        e.preventDefault()
        try {
            await adminAPI.ticket.update(dataRequest.id, dataRequest)
            await loadTickets(query)
            toast.success('Cập nhật thành công')
            setShowModalUpdate(false)
        } catch (error) {
            handleError(error)
        }
    }

    const handleDelete = async () => {
        try {
            await adminAPI.ticket.delete(selectedId)
            await loadTickets(query)
            toast.success('Xoá thành công')
            setSelectedId([])
            setShowModalDelete(false)
        } catch (error) {
            toast.error('Lỗi xoá đồ ăn')
        }
    }

    const renderTableHeader = (text, property) => {
        let Icon,
            newDirection = 'ASC'
        const { property: currentProperty, direction: currentDirection } = tickets.page
        if (property === currentProperty) {
            if (currentDirection === 'ASC') {
                Icon = TiArrowSortedUp
                newDirection = 'DESC'
            } else {
                Icon = TiArrowSortedDown
            }
        } else {
            Icon = Fragment
        }

        return (
            <th>
                <button
                    onClick={(e) =>
                        setQuery((prev) => ({ ...prev, page: 1, property: property, direction: newDirection }))
                    }
                >
                    <div className="flex items-center hover:opacity-80">
                        {text}
                        <div className="w-4">
                            <Icon />
                        </div>
                    </div>
                </button>
            </th>
        )
    }

    const renderTicketStatus = (status) => {
        switch (status) {
            case ticketStatus.PAYMENT_SUCCESS.value:
                return (
                    <span className="text-xs rounded text-white p-1 bg-green-primary">
                        {ticketStatus.PAYMENT_SUCCESS.text}
                    </span>
                )
            case ticketStatus.PAYMENT_FAILED.value:
                return (
                    <span className="text-xs rounded text-white p-1 bg-red-secondary">
                        {ticketStatus.PAYMENT_FAILED.text}
                    </span>
                )
            default:
                return (
                    <span className="text-xs rounded p-1 bg-gray-secondary whitespace-nowrap">
                        {ticketStatus.UNPAID.text}
                    </span>
                )
        }
    }

    const renderCsvLink = () => (
        <CSVLink
            data={tickets.data.map((ticket) => ({
                ...ticket,
                createdDate: dateUtil.format(ticket.createdDate, dateUtil.DATETIME_FORMAT),
                status: Object.values(ticketStatus).find((status) => ticket.status === status.value).text,
                details: ticket.details
                    .map(
                        (detail) =>
                            `${detail.seat?.name || detail.food?.name} x ${detail.quantity}: ${currencyUtil.format(
                                detail.quantity * detail.price
                            )}`
                    )
                    .join(', '),
                totalPrice: currencyUtil.format(ticket.totalPrice),
            }))}
            headers={[
                { key: 'user.fullname', label: 'Tên khách hàng' },
                { key: 'user.email', label: 'Email' },
                { key: 'user.phoneNumber', label: 'Số điện thoại' },
                { key: 'createdDate', label: 'Ngày đặt vé' },
                { key: 'showtime.room.cinema.name', label: 'Tên rạp' },
                { key: 'showtime.movie.name', label: 'Tên phim' },
                { key: 'status', label: 'Trạng thái' },
                { key: 'details', label: 'Chi tiết' },
                { key: 'totalPrice', label: 'Thành tiền' },
            ]}
            filename="ticket.csv"
            className="inline-flex gap-1 items-center py-1 px-3 rounded bg-green-primary text-white hover:opacity-80"
        >
            <TbFileExport />
            Xuất file
        </CSVLink>
    )

    return isLoading ? (
        <></>
    ) : (
        <>
            <div className="mb-3 bg-white rounded shadow p-5">
                <div className="mb-3 flex flex-wrap items-center gap-5">
                    <span>Từ ngày</span>
                    <input
                        className="max-md:w-full border rounded-md px-3 py-2 focus:outline outline-blue-primary"
                        type="date"
                        value={query.fromDate}
                        onChange={(e) => {
                            setQuery((prev) => {
                                let fromDate = e.target.value
                                let toDate = prev.toDate
                                if (fromDate > toDate) toDate = fromDate
                                return { ...prev, page: 1, fromDate, toDate }
                            })
                        }}
                    />
                    <span>Đến ngày</span>
                    <input
                        className="max-md:w-full border rounded-md px-3 py-2 focus:outline outline-blue-primary"
                        type="date"
                        value={query.toDate}
                        onChange={(e) => {
                            setQuery((prev) => {
                                let fromDate = prev.fromDate
                                let toDate = e.target.value
                                if (fromDate > toDate) fromDate = toDate
                                return { ...prev, page: 1, fromDate, toDate }
                            })
                        }}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-5">
                    <span>Rạp</span>
                    <select
                        className="max-md:w-full text-ellipsis border rounded-md px-3 py-2 focus:outline outline-blue-primary"
                        value={query.cinemaId}
                        onChange={(e) =>
                            setQuery((prev) => ({ ...prev, page: 1, cinemaId: e.target.value || undefined }))
                        }
                    >
                        <option value="">--- Chọn rạp ---</option>
                        {cinemas.map((cinema) => (
                            <option key={cinema.id} value={cinema.id}>
                                {cinema.name}
                            </option>
                        ))}
                    </select>
                    <span>Phim</span>
                    <select
                        className="max-md:w-full text-ellipsis border rounded-md px-3 py-2 focus:outline outline-blue-primary"
                        value={query.movieId}
                        onChange={(e) =>
                            setQuery((prev) => ({ ...prev, page: 1, movieId: e.target.value || undefined }))
                        }
                    >
                        <option value="">--- Chọn phim ---</option>
                        {movies.map((movie) => (
                            <option key={movie.id} value={movie.id}>
                                {movie.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <h1 className="mb-3 text-lg font-semibold">Danh Sách</h1>
            <div className="bg-white rounded shadow p-5">
                <div className="mb-3">
                    <button
                        className="inline-flex gap-1 items-center py-1 px-3 rounded bg-red-secondary text-white hover:opacity-80 disabled:opacity-50 mr-2"
                        disabled={selectedId.length === 0}
                        onClick={() => setShowModalDelete(true)}
                    >
                        <AiFillDelete />
                        Xóa ({selectedId.length})
                    </button>
                    {tickets.data.length > 0 && renderCsvLink()}
                </div>
                <div className="mb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <select
                                className="mr-2 border rounded outline-none"
                                value={tickets.page.size}
                                onChange={(e) => setQuery((prev) => ({ ...prev, page: 1, size: e.target.value }))}
                            >
                                <option value="2">2</option>
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                {tickets.page.totalItems > 20 && (
                                    <option value={tickets.page.totalItems}>Tất cả</option>
                                )}
                            </select>
                            <span>dòng / trang</span>
                        </div>
                        <InputDelay
                            className="flex px-3 py-1 items-center border rounded-full focus-within:border-blue-primary"
                            onAfterDelay={(value) => setQuery((prev) => ({ ...prev, page: 1, q: value }))}
                        />
                    </div>
                </div>
                <table className="table-custom">
                    <thead>
                        <tr>
                            <th className="w-1">
                                <input
                                    type="checkbox"
                                    checked={selectedId.length === tickets.length}
                                    onChange={() => {
                                        if (selectedId.length === tickets.length) setSelectedId([])
                                        else if (selectedId.length < tickets.length)
                                            setSelectedId(tickets.map((item) => item.id))
                                    }}
                                />
                            </th>
                            {renderTableHeader('#', 'id')}
                            {renderTableHeader('Khách', 'user.fullname')}
                            {renderTableHeader('Ngày đặt', 'createdDate')}
                            {renderTableHeader('Rạp', 'showtime.room.cinema.name')}
                            {renderTableHeader('Phim', 'showtime.movie.name')}
                            {renderTableHeader('Thành tiền', 'totalPrice')}
                            {renderTableHeader('Trạng thái', 'status')}
                            {renderTableHeader('Kích hoạt', 'active')}
                            <th className="w-1"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.data.map((ticket) => (
                            <tr key={ticket.id}>
                                <td>
                                    <input
                                        className="p-2"
                                        type="checkbox"
                                        checked={selectedId.includes(ticket.id)}
                                        onChange={() =>
                                            setSelectedId((prev) => arrayUtil.addOrRemoveValue(prev, ticket.id))
                                        }
                                    />
                                </td>
                                <td>{ticket.id}</td>
                                <td>{ticket.user.fullname}</td>
                                <td>{dateUtil.format(ticket.createdDate, dateUtil.DATETIME_FORMAT)}</td>
                                <td>{ticket.showtime.room.cinema.name}</td>
                                <td>{ticket.showtime.movie.name}</td>
                                <td>{currencyUtil.format(ticket.totalPrice)}</td>
                                <td>{renderTicketStatus(ticket.status)}</td>
                                <td>
                                    {ticket.active ? (
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
                                                        setDataRequest(ticket)
                                                        setShowModalInfo(true)
                                                    }}
                                                >
                                                    Xem
                                                </button>
                                                <button
                                                    className="block w-full text-left whitespace-nowrap px-3 py-1 hover:bg-gray-secondary"
                                                    onClick={() => {
                                                        setDataRequest(ticket)
                                                        setShowModalUpdate(true)
                                                    }}
                                                >
                                                    Sửa
                                                </button>
                                                <Link
                                                    to="/print-ticket"
                                                    state={ticket}
                                                    className="block w-full text-left whitespace-nowrap px-3 py-1 hover:bg-gray-secondary"
                                                >
                                                    In vé
                                                </Link>
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
                <div className="flex justify-between mt-2">
                    <p>
                        Hiển thị <span className="text-blue-primary">{tickets.data.length}</span> / tổng số{' '}
                        <span className="text-blue-primary">{tickets.page.totalItems || 0}</span>
                    </p>
                    {tickets.page.totalPages > 1 && (
                        <Pagination
                            className="flex gap-1"
                            buttonClassName="py-1 px-3 rounded enabled:hover:bg-gray-secondary aria-[current]:bg-blue-primary aria-[current]:text-white"
                            currentPage={tickets.page.page}
                            totalPage={tickets.page.totalPages}
                            onPageClick={(page) => setQuery((prev) => ({ ...prev, page }))}
                        />
                    )}
                </div>
            </div>
            {showModalInfo && (
                <Modal onHideClick={(e) => setShowModalInfo(false)}>
                    <header className="flex items-center justify-between mb-3">
                        <h1 className="font-bold text-xl">Thông tin vé #{dataRequest.id}</h1>
                    </header>
                    <main>
                        <p className="mb-3">Tên khách hàng: {dataRequest.user.fullname}</p>
                        <p className="mb-3">Số điện thoại: {dataRequest.user.phoneNumber}</p>
                        <p className="mb-3">Email: {dataRequest.user.email}</p>
                        <hr />
                        <p className="mb-3">
                            Ngày đặt vé: {dateUtil.format(dataRequest.createdDate, dateUtil.DATETIME_FORMAT)}
                        </p>
                        <p className="mb-3">Phim: {dataRequest.showtime.movie.name}</p>
                        <p className="mb-3">Rạp: {dataRequest.showtime.room.cinema.name}</p>
                        <p className="mb-3">Phòng: {dataRequest.showtime.room.name}</p>
                        <p className="mb-3">
                            Thời gian chiếu: {dateUtil.format(dataRequest.showtime.startTime, dateUtil.DATETIME_FORMAT)}{' '}
                            -{' '}
                            {dateUtil.format(
                                dateUtil.add(
                                    dataRequest.showtime.startTime,
                                    dataRequest.showtime.movie.duration,
                                    dateUtil.dateType.MINUTES
                                ),
                                dateUtil.DATETIME_FORMAT
                            )}
                        </p>
                        <h1 className="mb-3 text-center font-semibold bg-gray-secondary rounded shadow">Chi tiết</h1>
                        <table className="mb-3 w-full text-left">
                            <thead>
                                <tr>
                                    <th>Loại</th>
                                    <th>Tên</th>
                                    <th>Số lượng</th>
                                    <th>Tổng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataRequest.details.map((detail) => (
                                    <tr key={detail.id}>
                                        <td>{detail.seat ? 'Ghế' : 'Khác'}</td>
                                        <td>{detail.seat?.name || detail.food?.name}</td>
                                        <td>{detail.quantity}</td>
                                        <td>{currencyUtil.format(detail.price * detail.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="mb-3 text-left font-semibold">
                            Thành tiền: {currencyUtil.format(dataRequest.totalPrice)}
                        </p>
                    </main>
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
                                    Ghi chú
                                    <textarea
                                        className="border aria-[invalid]:outline-red-primary rounded-md px-3 py-2 w-full focus:outline outline-blue-primary"
                                        rows="3"
                                        name="note"
                                        value={dataRequest.note}
                                        onChange={handleFormInputChange}
                                        autoFocus
                                    />
                                </label>
                            </div>
                            <div className="mb-3">
                                <label>
                                    <span>Trạng thái</span>
                                    <select
                                        className="w-full text-ellipsis border rounded-md px-3 py-2 focus:outline outline-blue-primary"
                                        name="status"
                                        value={dataRequest.status}
                                        onChange={handleFormInputChange}
                                    >
                                        {Object.values(ticketStatus).map((status) => (
                                            <option key={status.value} value={status.value}>
                                                {status.text}
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

export default Ticket
