import { useEffect, useMemo, useState } from 'react'

import webAPI from '../../api/webAPI'
import Image from '../../components/Image'
import dateUtil from '../../utils/dateUtil'
import BookTicketModal from './BookTicketModal'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'
import { handleError } from '../../api/axiosConfig'
import { Link } from 'react-router-dom'

function Cinemas() {
    const { currentUser } = useAuth()
    const [loading, setLoading] = useState(true)

    const [cinemas, setCinemas] = useState([])
    const [selectedCinema, setSelectedCinema] = useState({})
    const [moviesWithShowtime, setMoviesWithShowtime] = useState([])

    const datePickers = useMemo(
        () => Array.from({ length: 30 }, (value, index) => dateUtil.add(Date.now(), index, dateUtil.dateType.DAYS)),
        []
    )
    const [selectedDate, setSelectedDate] = useState(datePickers[0])
    const [selectedShowtime, setSelectedShowtime] = useState({})
    const [showModalBookTicket, setShowModalBookTicket] = useState(false)

    useEffect(() => {
        async function loadCinemas() {
            try {
                const res = await webAPI.cinema.getAll()
                setCinemas(res.data)
                setSelectedCinema(res.data[0])
                setLoading(false)
            } catch (error) {
                handleError(error)
            }
        }
        loadCinemas()
    }, [])

    useEffect(() => {
        if (selectedCinema?.id) {
            async function loadMoviesWithShowtime() {
                const res = await webAPI.cinema.getShowtime(
                    selectedCinema.id,
                    dateUtil.format(selectedDate, dateUtil.INPUT_DATE_FORMAT)
                )
                const showtimes = res.data.filter((showtime) => new Date(showtime.startTime) > new Date())

                const movies = showtimes.reduce((prev, showtime, index, self) => {
                    const movie = showtime.movie
                    if (prev.find((item) => item.id === movie.id)) return prev
                    return [...prev, { ...movie, showtimes: self.filter((item) => item.movie.id === movie.id) }]
                }, [])
                setMoviesWithShowtime(movies)
            }
            loadMoviesWithShowtime()
        }
    }, [selectedCinema, selectedDate])

    return loading ? (
        <></>
    ) : (
        <div className="container-custom py-5">
            <div className="mb-3 grid grid-cols-2 md:grid-cols-5 gap-5">
                {cinemas.length > 0 ? (
                    cinemas.map((cinema) => (
                        <button
                            key={cinema.id}
                            className="p-3 rounded border text-center transition-colors hover:border-blue-primary aria-selected:text-blue-primary aria-selected:border-blue-primary"
                            aria-selected={cinema.id === selectedCinema.id}
                            onClick={(e) => setSelectedCinema(cinema)}
                        >
                            {cinema.name}
                        </button>
                    ))
                ) : (
                    <p className="mb-3">Chưa có rạp</p>
                )}
            </div>
            <hr />
            {selectedCinema && (
                <>
                    <div className="mb-3">
                        <h1 className="text-lg font-semibold">{selectedCinema.name}</h1>
                        <p>Địa chỉ: {selectedCinema.address}</p>
                    </div>
                    <hr />
                </>
            )}
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
            {moviesWithShowtime.length > 0 ? (
                moviesWithShowtime.map((movie) => (
                    <div key={movie.id} className="mb-3">
                        <div>
                            <Link
                                to={`/movie/${movie.slug}`}
                                className="text-lg font-semibold transition-colors hover:text-blue-primary"
                            >
                                {movie.name}
                            </Link>
                        </div>
                        <div className="flex items-start gap-3">
                            <Image className="object-cover rounded-lg w-1/6" src={webAPI.getUpload(movie.thumbnail)} />
                            <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-2">
                                {movie.showtimes.map((showtime) => (
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
                    </div>
                ))
            ) : (
                <p className="mb-3">Chưa có lịch chiếu</p>
            )}
            {showModalBookTicket && (
                <BookTicketModal showtime={selectedShowtime} setShowModal={setShowModalBookTicket} />
            )}
        </div>
    )
}

export default Cinemas
