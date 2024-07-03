import { useEffect, useMemo, useState } from 'react'

import Modal from '../../../components/Modal'
import dateUtil from '../../../utils/dateUtil'
import currencyUtil from '../../../utils/currencyUtil'
import Image from '../../../components/Image'
import webAPI from '../../../api/webAPI'
import RenderSeatTable from './RenderSeatTable'
import { handleError } from '../../../api/axiosConfig'

function BookTicketModal({ showtime, setShowModal }) {
    const [loading, setLoading] = useState(true)
    const [apiLoading, setApiLoading] = useState(false)
    const [seats, setSeats] = useState([])
    const [foods, setFoods] = useState([])

    const seatTypes = useMemo(
        () =>
            seats
                .map((seat) => seat.type)
                .filter((type, index, self) => self.findIndex((x) => x.id === type.id) === index),
        [seats]
    )

    const [ticket, setTicket] = useState({
        showtimeId: showtime.id,
        details: [],
    })
    const ticketDetails = useMemo(() => {
        const seat = ticket.details.filter((detail) => !!detail.seatId)
        const food = ticket.details.filter((detail) => !!detail.foodId)
        return { seat, food }
    }, [ticket])
    const totalPrice = useMemo(() => {
        const seat = ticketDetails.seat.reduce((total, detail) => total + detail.price * detail.quantity, 0)
        const food = ticketDetails.food.reduce((total, detail) => total + detail.price * detail.quantity, 0)
        return { seat, food, all: seat + food }
    }, [ticketDetails])

    useEffect(() => {
        async function loadSeats() {
            const res = await webAPI.seat.getAll(showtime.room.id, showtime.id)
            setSeats(res.data)
        }

        async function loadFoods() {
            const res = await webAPI.food.getAll()
            setFoods(res.data)
        }

        ;(async () => {
            await Promise.all([loadSeats(), loadFoods()])
            setLoading(false)
        })()
    }, [showtime])

    const handleSeatClick = (seat) => {
        const newDetail = {
            seatId: seat.id,
            quantity: 1,
            price: seat.type.price,
        }
        setTicket((prev) => {
            let newDetails
            if (prev.details.find((detail) => detail.seatId === seat.id))
                newDetails = prev.details.filter((detail) => detail.seatId !== seat.id)
            else newDetails = [...prev.details, newDetail]
            return { ...prev, details: newDetails }
        })
    }
    const handleInputFoodChange = (e, food) => {
        const quantity = e.target.valueAsNumber || 0
        const newDetail = {
            foodId: food.id,
            quantity,
            price: food.price,
        }
        setTicket((prev) => {
            let newDetails
            if (quantity === 0) newDetails = prev.details.filter((detail) => detail.foodId !== food.id)
            else if (prev.details.find((detail) => detail.foodId === food.id))
                newDetails = prev.details.map((detail) => (detail.foodId === food.id ? newDetail : detail))
            else newDetails = [...prev.details, newDetail]
            return { ...prev, details: newDetails }
        })
    }

    const handleButtonBookTicketClick = async (e) => {
        try {
            setApiLoading(true)
            const res = await webAPI.profile.bookTicket(ticket)
            setTimeout(() => {
                window.location.href = res.data
                setApiLoading(false)
            }, 1000)
        } catch (error) {
            handleError(error)
        }
    }

    return loading ? (
        <></>
    ) : (
        <Modal className="md:w-2/3" onHideClick={() => setShowModal(false)}>
            <main className="mb-3">
                <h1 className="text-lg font-semibold">
                    {showtime.room.cinema.name} | {showtime.room.name} |{' '}
                    {dateUtil.format(showtime.startTime, dateUtil.DATETIME_FORMAT)} -{' '}
                    {dateUtil.format(
                        dateUtil.add(showtime.startTime, showtime.movie.duration, dateUtil.dateType.MINUTES),
                        dateUtil.DATETIME_FORMAT
                    )}
                </h1>
                <h1 className="p-1 mb-3 text-center bg-gray-secondary">Ghế</h1>
                <img className="w-full mb-10" src={webAPI.getStatic('bg-screen.png')} alt="screen" />
                <div className="mb-5">
                    <RenderSeatTable
                        seats={seats}
                        selectedIds={ticketDetails.seat.map((detail) => detail.seatId)}
                        onSeatClick={handleSeatClick}
                    />
                </div>
                <div className="mb-3">
                    <div className="mx-auto lg:w-1/2 p-3 rounded shadow grid sm:grid-cols-2 gap-5">
                        <div className="flex gap-3 items-center">
                            <div className="p-3 border-4 rounded border-gray-secondary bg-gray-secondary"></div>
                            Đã có người
                        </div>
                        {seatTypes.map((type) => (
                            <div key={type.id} className="flex gap-3 items-center">
                                <div className="p-3 border-4 rounded" style={{ borderColor: type.color }}></div>
                                {type.name} ({currencyUtil.format(type.price)})
                            </div>
                        ))}
                    </div>
                </div>
                <h1 className="p-1 mb-3 text-center bg-gray-secondary">Đồ ăn</h1>
                <div className="mb-3 grid grid-cols-2 gap-5">
                    {foods.map((food) => (
                        <div key={food.id} className="flex">
                            <Image className="w-1/3 rounded" src={webAPI.getUpload(food.thumbnail)} />
                            <div className="w-2/3 pl-5">
                                <h1 className="text-lg font-semibold">
                                    {food.name} ({currencyUtil.format(food.price)})
                                </h1>
                                <p className="text-justify">{food.description}</p>
                                <label className="flex items-center gap-3">
                                    <span>Số lượng</span>
                                    <input
                                        className="flex-1 py-1 px-3 border rounded outline-blue-primary focus:outline"
                                        type="number"
                                        min={0}
                                        value={
                                            ticketDetails.food
                                                .find((detail) => detail.foodId === food.id)
                                                ?.quantity?.toString() || 0
                                        }
                                        onChange={(e) => handleInputFoodChange(e, food)}
                                    />
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <footer>
                <div className="bg-black-primary text-gray-third mb-3">
                    <div
                        className="h-2"
                        style={{ background: `url(${webAPI.getStatic('bg-ticket.png')}) repeat-x` }}
                    ></div>
                    <div className="p-5 grid lg:grid-cols-[8rem_70fr_30fr] gap-5">
                        <div className="max-lg:px-10">
                            <Image className="rounded" src={webAPI.getUpload(showtime.movie.thumbnail)} />
                        </div>
                        <div>
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td>Phim</td>
                                        <td>{showtime.movie.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Rạp</td>
                                        <td>{showtime.room.cinema.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Phòng</td>
                                        <td>{showtime.room.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Xuất chiếu</td>
                                        <td>{dateUtil.format(showtime.startTime, dateUtil.DATETIME_FORMAT)}</td>
                                    </tr>
                                    <tr>
                                        <td>Ghế</td>
                                        <td>
                                            {ticketDetails.seat
                                                .map((detail) => seats.find((seat) => seat.id === detail.seatId).name)
                                                .join(', ')}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Đồ ăn</td>
                                        <td>
                                            {ticketDetails.food
                                                .map(
                                                    (detail) =>
                                                        foods.find((food) => food.id === detail.foodId).name +
                                                        ' x' +
                                                        detail.quantity
                                                )
                                                .join(', ')}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <table className="w-full mb-3">
                                <tbody>
                                    <tr>
                                        <td>Ghế</td>
                                        <td>{currencyUtil.format(totalPrice.seat)}</td>
                                    </tr>
                                    <tr>
                                        <td>Đồ ăn</td>
                                        <td>{currencyUtil.format(totalPrice.food)}</td>
                                    </tr>
                                    <tr>
                                        <td>Tổng</td>
                                        <td>{currencyUtil.format(totalPrice.all)}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <button
                                className="w-full px-5 py-2 rounded-md bg-blue-primary text-white hover:bg-opacity-80 disabled:bg-gray-primary outline-none"
                                onClick={handleButtonBookTicketClick}
                                disabled={ticketDetails.seat.length === 0 || apiLoading}
                            >
                                Đặt vé
                            </button>
                        </div>
                    </div>
                    <div
                        className="h-2"
                        style={{
                            background: `url(${webAPI.getStatic('bg-ticket.png')}) repeat-x`,
                            transform: 'rotateX(180deg)',
                        }}
                    ></div>
                </div>
            </footer>
        </Modal>
    )
}

export default BookTicketModal
