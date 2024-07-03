import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import webAPI from '../../api/webAPI'
import Carousel from '../../components/Carousel'
import dateUtil from '../../utils/dateUtil'
import Image from '../../components/Image'

function Home() {
    const [loading, setLoading] = useState(true)
    const [banners, setBanners] = useState([])
    const [movies, setMovies] = useState([])

    useEffect(() => {
        async function loadBanners() {
            const res = await webAPI.banner.getAll()
            setBanners(res.data)
        }
        async function loadMovies() {
            const res = await webAPI.movie.getAllWithPage()
            setMovies(res.data.data)
        }

        ;(async () => {
            await Promise.all([loadBanners(), loadMovies()])
            setLoading(false)
        })()
    }, [])

    return loading ? (
        <></>
    ) : (
        <>
            <div className="container-custom my-5">
                <div className="h-[35rem] rounded-xl shadow drop-shadow overflow-hidden">
                    <Carousel data={banners} intervalDuration={5000} />
                </div>
            </div>
            <div className="bg-gray-secondary py-5 my-5">
                <h1 className="text-2xl font-semibold text-center underline underline-offset-8">Phim đang chiếu</h1>
            </div>
            <div className="container-custom my-5">
                <div className="flex gap-8 overflow-x-auto snap-x pb-3 mb-3">
                    {movies.map((movie) => (
                        <div
                            key={movie.id}
                            className="relative snap-start min-w-[calc(50%-1.5rem)] md:min-w-[calc((100%/3)-1.5rem)] lg:min-w-[calc(25%-1.5rem)] rounded-lg border overflow-hidden"
                        >
                            {movie.showtimeCount === 0 && (
                                <div className="absolute top-3 right-3 px-3 rounded-full bg-gray-primary text-white text-sm shadow drop-shadow pointer-events-none">
                                    Chưa có lịch chiếu
                                </div>
                            )}
                            <Link to={`/movie/${movie.slug}`}>
                                <Image src={webAPI.getUpload(movie.thumbnail)} className="w-full h-72 object-cover" />
                            </Link>
                            <div className="p-5">
                                <Link
                                    to={`/movie/${movie.slug}`}
                                    className="block mb-1 text-lg font-semibold whitespace-nowrap overflow-hidden text-ellipsis hover:text-blue-primary transition-colors"
                                    title={movie.name}
                                >
                                    {movie.name}
                                </Link>
                                <p>Thể loại: {movie.genre || '?'}</p>
                                <p>
                                    {dateUtil.format(movie.premiere, dateUtil.DATE_FORMAT)} - {movie.duration} phút
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center">
                    <Link
                        to="/movie"
                        className="inline-block py-2 px-10 border transition-colors border-blue-primary hover:bg-blue-secondary rounded-full"
                    >
                        Xem thêm
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Home
