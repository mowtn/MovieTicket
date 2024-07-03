import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import webAPI from '../../api/webAPI'
import Image from '../../components/Image'
import dateUtil from '../../utils/dateUtil'
import BookTicketModal from './BookTicketModal'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'
import { handleError } from '../../api/axiosConfig'
import FacebookComment from '../../vendors/facebook/FacebookComment'

function CheckLocalhost() {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
}

function MovieDetail() {
    const { currentUser } = useAuth()
    const { slug } = useParams()

    const [loading, setLoading] = useState(true)
    const [movie, setMovie] = useState({})
    const [cinemasWithShowtime, setCinemasWithShowtime] = useState([])

    const datePickers = useMemo(
        () => Array.from({ length: 30 }, (value, index) => dateUtil.add(Date.now(), index, dateUtil.dateType.DAYS)),
        []
    )
    const [selectedDate, setSelectedDate] = useState(datePickers[0])
    const [showModalBookTicket, setShowModalBookTicket] = useState(false)
    const [selectedShowtime, setSelectedShowtime] = useState({})

    useEffect(() => {
        async function loadMovie() {
            try {
                const res = await webAPI.movie.getOne(slug)
                setMovie(res.data)
                setLoading(false)
            } catch (error) {
                handleError(error)
            }
        }
        loadMovie()
    }, [slug])

    useEffect(() => {
        if (movie.id) {
            async function loadCinemasWithShowtime() {
                const res = await webAPI.movie.getShowtime(
                    movie.id,
                    dateUtil.format(selectedDate, dateUtil.INPUT_DATE_FORMAT)
                )
                const showtimes = res.data.filter((showtime) => new Date(showtime.startTime) > new Date())

                const cinemas = showtimes.reduce((prev, showtime, index, self) => {
                    const cinema = showtime.room.cinema
                    if (prev.find((item) => item.id === cinema.id)) return prev
                    return [...prev, { ...cinema, showtimes: self.filter((item) => item.room.cinema.id === cinema.id) }]
                }, [])
                setCinemasWithShowtime(cinemas)
            }
            loadCinemasWithShowtime()
        }
    }, [movie.id, selectedDate])

    return loading ? (
        <></>
    ) : (
        <>
            <div className="container-custom py-5">
                <div className="flex flex-wrap mb-5">
                    <div className="w-full md:w-1/4 text-justify">
                        <Image
                            className="object-cover rounded-lg mb-3 mx-auto max-md:w-3/5"
                            src={webAPI.getUpload(movie.thumbnail)}
                        />
                        <h1 className="font-semibold text-lg">{movie.name}</h1>
                        <p className="mb-3 indent-5">{movie.description}</p>
                        <table className="w-full">
                            <tbody>
                                {movie.director && (
                                    <tr>
                                        <td className="whitespace-nowrap text-gray-primary align-top">Đạo diễn</td>
                                        <td>{movie.director}</td>
                                    </tr>
                                )}
                                {movie.actor && (
                                    <tr>
                                        <td className="whitespace-nowrap text-gray-primary align-top">Diễn viên</td>
                                        <td>{movie.actor}</td>
                                    </tr>
                                )}
                                {movie.genre && (
                                    <tr>
                                        <td className="whitespace-nowrap text-gray-primary align-top">Thể loại</td>
                                        <td>{movie.genre}</td>
                                    </tr>
                                )}
                                {movie.premiere && (
                                    <tr>
                                        <td className="whitespace-nowrap text-gray-primary align-top">Khởi chiếu</td>
                                        <td>{dateUtil.format(movie.premiere, dateUtil.DATE_FORMAT)}</td>
                                    </tr>
                                )}
                                <tr>
                                    <td className="whitespace-nowrap text-gray-primary align-top">Thời lượng</td>
                                    <td>{movie.duration} phút</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="w-full md:w-3/4 md:pl-5">
                        <h1 className="text-lg font-bold">Chọn lịch chiếu</h1>
                        <hr />
                        <div className="flex overflow-x-auto gap-2 pb-2 mb-3 snap-x">
                            {datePickers.map((date, index) => (
                                <button
                                    key={index}
                                    className="snap-start rounded border p-2 aria-selected:border-blue-primary"
                                    onClick={(e) => setSelectedDate(date)}
                                    role="tab"
                                    aria-selected={selectedDate === date}
                                >
                                    <h1 className="font-bold text-3xl">{dateUtil.pad(date.getDate())}</h1>
                                    <p className="text-sm">{dateUtil.format(date, 'MM/yyyy')}</p>
                                </button>
                            ))}
                        </div>
                        {cinemasWithShowtime.length > 0 ? (
                            cinemasWithShowtime.map((cinema) => (
                                <div key={cinema.id} className="mb-3">
                                    <h1 className="text-lg font-semibold">{cinema.name}</h1>
                                    <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-2">
                                        {cinema.showtimes.map((showtime) => (
                                            <button
                                                key={showtime.id}
                                                className="p-2 rounded bg-green-primary text-white transition-colors hover:bg-opacity-80"
                                                onClick={(e) => {
                                                    if (currentUser) {
                                                        setSelectedShowtime(showtime)
                                                        setShowModalBookTicket(true)
                                                    } else toast.error('Bạn chưa đăng nhập')
                                                }}
                                            >
                                                {dateUtil.format(showtime.startTime, dateUtil.TIME_FORMAT)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Chưa có lịch chiếu</p>
                        )}
                    </div>
                    {showModalBookTicket && (
                        <BookTicketModal showtime={selectedShowtime} setShowModal={setShowModalBookTicket} />
                    )}
                </div>
                <FacebookComment
                    url={CheckLocalhost() ? `https://animehay.fan/movie/${movie.slug}` : window.location.href}
                />
            </div>
        </>
    )
}

export default MovieDetail
