import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import Image from '../../components/Image'
import Pagination from '../../components/Pagination'
import webAPI from '../../api/webAPI'
import dateUtil from '../../utils/dateUtil'

function Movie() {
    const [searchParams, setSearchParams] = useSearchParams()
    const query = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams])
    const [movies, setMovies] = useState({
        data: [],
        page: {},
    })

    useEffect(() => {
        async function loadMovies() {
            const res = await webAPI.movie.getAllWithPage({ ...query, size: 12 })
            setMovies(res.data)
        }
        loadMovies()
    }, [query])

    return (
        <div className="py-5">
            <div className="container-custom">
                <div className="mb-3">
                    <span className="mr-3">Lọc</span>
                    <select
                        className="text-ellipsis border rounded-md px-3 py-2 focus:outline outline-blue-primary"
                        value={query.movieType || 'current'}
                        onChange={(e) => {
                            delete query.page
                            setSearchParams({ ...query, movieType: e.target.value })
                        }}
                        autoFocus
                    >
                        <option value="current">Đang chiếu</option>
                        <option value="coming-soon">Sắp chiếu</option>
                        <option value="popular">Phổ biến</option>
                    </select>
                </div>
            </div>
            <hr />
            <div className="container-custom">
                <div className="mb-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {movies.data.map((movie) => (
                        <div key={movie.id} className="relative rounded-lg shadow-lg overflow-hidden">
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
                {movies.page.totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center">
                        <Pagination
                            className="flex gap-2"
                            buttonClassName="py-1 px-3 rounded enabled:hover:bg-gray-secondary aria-[current]:border-2 aria-[current]:border-blue-primary aria-[current]:text-blue-primary"
                            currentPage={movies.page.page}
                            totalPage={movies.page.totalPages}
                            onPageClick={(page) => setSearchParams({ ...query, page })}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Movie
