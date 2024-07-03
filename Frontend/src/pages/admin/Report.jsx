import { useEffect, useMemo, useState } from 'react'
import { IoTicket } from 'react-icons/io5'
import { RiMoneyEuroCircleLine } from 'react-icons/ri'
import { toast } from 'react-toastify'
// import {
//     Chart as ChartJS,
//     LinearScale,
//     CategoryScale,
//     BarElement,
//     LineElement,
//     PointElement,
//     Legend,
//     Tooltip,
//     Title,
//     Filler,
//     LineController,
//     BarController,
// } from 'chart.js'
// import { Chart } from 'react-chartjs-2'

import adminAPI from '../../api/adminAPI'
import dateUtil from '../../utils/dateUtil'
import currencyUtil from '../../utils/currencyUtil'
import { handleError } from '../../api/axiosConfig'

// ChartJS.register(
//     LinearScale,
//     CategoryScale,
//     BarElement,
//     LineElement,
//     PointElement,
//     Legend,
//     Tooltip,
//     Title,
//     Filler,
//     LineController,
//     BarController
// )

function Report() {
    const [isLoading, setLoading] = useState(true)

    const [cinemas, setCinemas] = useState([])
    const [movies, setMovies] = useState([])
    const [tickets, setTickets] = useState([])
    const [showtimes, setShowtimes] = useState([])
    const [groupType, setGroupType] = useState(dateUtil.dateType.DAYS)

    const [query, setQuery] = useState({
        fromDate: dateUtil.format(dateUtil.add(Date.now(), -7, dateUtil.dateType.DAYS), dateUtil.INPUT_DATE_FORMAT),
        toDate: dateUtil.format(new Date(), dateUtil.INPUT_DATE_FORMAT),
        cinemaId: undefined,
        movieId: undefined,
    })

    const dateRange = useMemo(
        () => dateUtil.getDateRange(new Date(query.fromDate), new Date(query.toDate), groupType),
        [query, groupType]
    )

    const ticketData = useMemo(() => {
        const ticketGroup = tickets.reduce((prev, ticket) => {
            const createdDate = dateUtil.format(ticket.createdDate, dateUtil.getFormatByDateType(groupType))
            if (!prev[createdDate]) prev[createdDate] = []
            prev[createdDate].push(ticket)
            return prev
        }, {})

        const revenue = tickets.reduce((prev, ticket) => prev + ticket.totalPrice, 0)
        const count = tickets.length
        return { ticketGroup, revenue, count }
    }, [tickets, groupType])

    const showtimeData = useMemo(() => {
        // group by startTime
        const showtimeGroup = showtimes.reduce((prev, showtime) => {
            const startTime = dateUtil.format(showtime.startTime, dateUtil.getFormatByDateType(groupType))
            if (!prev[startTime]) prev[startTime] = []
            prev[startTime].push(showtime)
            return prev
        }, {})
        return { showtimeGroup }
    }, [showtimes, groupType])

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
            setLoading(false)
        })()
    }, [])

    useEffect(() => {
        async function loadTickets() {
            const res = await adminAPI.ticket.getAll(query)
            setTickets(res.data)
        }

        async function loadShowtimes() {
            const res = await adminAPI.showtime.getAllWithFilter(query)
            setShowtimes(res.data)
        }

        ;(async () => {
            try {
                await Promise.all([loadTickets(), loadShowtimes()])
            } catch (error) {
                handleError(error)
            }
        })()
    }, [query])

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
                                return { ...prev, fromDate, toDate }
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
                                return { ...prev, fromDate, toDate }
                            })
                        }}
                    />
                </div>
                <div className="mb-5 flex flex-wrap items-center gap-5">
                    <span>Rạp</span>
                    <select
                        className="max-md:w-full text-ellipsis border rounded-md px-3 py-2 focus:outline outline-blue-primary"
                        value={query.cinemaId}
                        onChange={(e) => setQuery((prev) => ({ ...prev, cinemaId: e.target.value || undefined }))}
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
                        onChange={(e) => setQuery((prev) => ({ ...prev, movieId: e.target.value || undefined }))}
                    >
                        <option value="">--- Chọn phim ---</option>
                        {movies.map((movie) => (
                            <option key={movie.id} value={movie.id}>
                                {movie.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-3 text-center gap-5 lg:gap-10">
                    <div className="rounded-lg p-2 bg-green-primary text-white shadow drop-shadow">
                        <p className="inline-flex items-center gap-1 text-lg">
                            <RiMoneyEuroCircleLine /> <span>Doanh thu</span>
                        </p>
                        <h1 className="text-2xl font-semibold">{currencyUtil.format(ticketData.revenue || 0)}</h1>
                    </div>
                    <div className="rounded-lg p-2 bg-blue-primary text-white shadow drop-shadow">
                        <p className="inline-flex items-center gap-1 text-lg">
                            <IoTicket /> <span>Vé</span>
                        </p>
                        <h1 className="text-2xl font-semibold">{ticketData.count}</h1>
                    </div>
                    <div className="rounded-lg p-2 bg-gray-primary text-white shadow drop-shadow">
                        <p className="inline-flex items-center gap-1 text-lg">
                            <RiMoneyEuroCircleLine /> <span>Doanh thu / vé</span>
                        </p>
                        <h1 className="text-2xl font-semibold">
                            {currencyUtil.format(ticketData.revenue / ticketData.count || 0)}
                        </h1>
                    </div>
                </div>
            </div>
            <div className="mb-3 bg-white rounded shadow p-5">
                <span>Thống kê theo</span>
                <select className="outline-none" value={groupType} onChange={(e) => setGroupType(e.target.value)}>
                    <option value={dateUtil.dateType.DAYS}>ngày</option>
                    <option value={dateUtil.dateType.MONTHS}>tháng</option>
                    <option value={dateUtil.dateType.YEARS}>năm</option>
                </select>
            </div>
            <div className="grid grid-cols-2 gap-5">
                {/* <div className="bg-white rounded shadow p-5">
                    <Chart
                        type="line"
                        data={{
                            labels: dateRange.map((date) =>
                                dateUtil.format(date, dateUtil.getFormatByDateType(groupType))
                            ),
                            datasets: [
                                {
                                    label: 'VND',
                                    fill: true,
                                    data: dateRange.map((date) => {
                                        const ticketsInDate =
                                            ticketData.ticketGroup[
                                                dateUtil.format(date, dateUtil.getFormatByDateType(groupType))
                                            ]
                                        if (!ticketsInDate) return 0
                                        return ticketsInDate.reduce((prev, ticket) => prev + ticket.totalPrice, 0)
                                    }),
                                    borderColor: 'rgb(53, 162, 235)',
                                    backgroundColor: 'rgba(53, 162, 235, 0.3)',
                                },
                            ],
                        }}
                        options={{
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Biểu đồ doanh thu',
                                },
                            },
                        }}
                    />
                </div> */}
                {/* <div className="bg-white rounded shadow p-5">
                    <Chart
                        data={{
                            labels: dateRange.map((date) =>
                                dateUtil.format(date, dateUtil.getFormatByDateType(groupType))
                            ),
                            datasets: [
                                {
                                    type: 'bar',
                                    label: 'Đã đặt',
                                    data: dateRange.map((date) => {
                                        const showtimesInDate =
                                            showtimeData.showtimeGroup[
                                                dateUtil.format(date, dateUtil.getFormatByDateType(groupType))
                                            ]
                                        if (!showtimesInDate) return 0
                                        return showtimesInDate.reduce(
                                            (prev, showtime) => prev + showtime.occupiedSeatCount,
                                            0
                                        )
                                    }),
                                    backgroundColor: '#1AD598',
                                },
                                {
                                    type: 'bar',
                                    label: 'Còn trống',
                                    data: dateRange.map((date) => {
                                        const showtimesInDate =
                                            showtimeData.showtimeGroup[
                                                dateUtil.format(date, dateUtil.getFormatByDateType(groupType))
                                            ]
                                        if (!showtimesInDate) return 0
                                        return showtimesInDate.reduce(
                                            (prev, showtime) =>
                                                prev + (showtime.totalSeatCount - showtime.occupiedSeatCount),
                                            0
                                        )
                                    }),
                                    backgroundColor: '#ccc',
                                },
                            ],
                        }}
                        options={{
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Tình trạng chỗ ngồi',
                                },
                            },
                        }}
                    />
                </div> */}
            </div>
        </>
    )
}

export default Report
