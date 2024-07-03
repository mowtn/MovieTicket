import { useEffect } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import Image from '../components/Image'
import webAPI from '../api/webAPI'
import currencyUtil from '../utils/currencyUtil'
import dateUtil from '../utils/dateUtil'

function PrintTicket() {
    const location = useLocation()
    const navigate = useNavigate()
    const ticket = location.state

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            window.print()
            navigate(-1)
        }, 500)
        return () => {
            clearTimeout(timeoutId)
        }
    }, [])

    if (!ticket) return <Navigate to={-1} />

    const ticketDetails = {
        seat: ticket.details.filter((detail) => !!detail.seat),
        food: ticket.details.filter((detail) => !!detail.food),
    }
    const totalPrice = {
        seat: ticketDetails.seat.reduce((total, detail) => total + detail.price * detail.quantity, 0),
        food: ticketDetails.food.reduce((total, detail) => total + detail.price * detail.quantity, 0),
    }

    return (
        <div className="bg-black-primary text-gray-third mt-20">
            <div className="h-2" style={{ background: `url(${webAPI.getStatic('bg-ticket.png')}) repeat-x` }}></div>
            <div className="p-5 grid grid-cols-[8rem_60fr_40fr] gap-5">
                <div>
                    <Image className="rounded" src={webAPI.getUpload(ticket.showtime.movie.thumbnail)} />
                </div>
                <div>
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <td>Phim</td>
                                <td>{ticket.showtime.movie.name}</td>
                            </tr>
                            <tr>
                                <td>Rạp</td>
                                <td>{ticket.showtime.room.cinema.name}</td>
                            </tr>
                            <tr>
                                <td>Phòng</td>
                                <td>{ticket.showtime.room.name}</td>
                            </tr>
                            <tr>
                                <td>Xuất chiếu</td>
                                <td>{dateUtil.format(ticket.showtime.startTime, dateUtil.DATETIME_FORMAT)}</td>
                            </tr>
                            <tr>
                                <td>Ghế</td>
                                <td>{ticketDetails.seat.map((detail) => detail.seat.name).join(', ')}</td>
                            </tr>
                            <tr>
                                <td>Đồ ăn</td>
                                <td>
                                    {ticketDetails.food
                                        .map((detail) => detail.food.name + ' x' + detail.quantity)
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
                                <td>{currencyUtil.format(totalPrice.seat + totalPrice.food)}</td>
                            </tr>
                        </tbody>
                    </table>
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
    )
}

export default PrintTicket
