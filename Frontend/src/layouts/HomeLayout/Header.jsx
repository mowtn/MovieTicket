import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { SlUser } from 'react-icons/sl'
import { BiLogInCircle } from 'react-icons/bi'
import { TfiSearch } from 'react-icons/tfi'

import Logo from '../../components/Logo'
import { useAuth } from '../../contexts/AuthContext'
import Dropdown from '../../components/Dropdown'
import HeaderLink from './HeaderLink'
import { useState } from 'react'

function Header() {
    const navigate = useNavigate()
    const { currentUser, logout } = useAuth()

    const [q, setQ] = useState('')

    const handleLogout = async () => {
        await logout()
        navigate('/login', { replace: true })
    }

    return (
        <header className="sticky top-0 z-30 shadow-md bg-white">
            <div className="container-custom h-14 flex items-center justify-between">
                <Link to="/">
                    <Logo />
                </Link>
                <div className="flex items-center max-md:hidden">
                    <HeaderLink to="/">Trang chủ</HeaderLink>
                    <HeaderLink to="/movie">Phim</HeaderLink>
                    <HeaderLink to="/cinema">Rạp</HeaderLink>
                </div>
                <div className="flex items-center gap-3">
                    <Dropdown
                        className="p-3 rounded-full bg-gray-secondary text-lg"
                        Menu={({ isShow }) => (
                            <div
                                className="absolute top-[calc(100%+10px)] right-0 min-w-[10rem] bg-white rounded shadow-blur p-3 transition-transform origin-top aria-hidden:scale-y-0"
                                aria-hidden={!isShow}
                            >
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault()
                                        navigate(`/movie?q=${q}`)
                                    }}
                                >
                                    <label className="flex px-3 py-2 items-center border focus-within:border-blue-primary">
                                        <input
                                            type="text"
                                            className="outline-none"
                                            value={q}
                                            onChange={(e) => setQ(e.target.value)}
                                            autoFocus
                                        />
                                        <TfiSearch key="search" />
                                    </label>
                                </form>
                            </div>
                        )}
                    >
                        <TfiSearch />
                    </Dropdown>
                    {currentUser ? (
                        <Dropdown
                            className="p-3 rounded-full bg-gray-secondary text-lg"
                            Menu={({ isShow }) => (
                                <div
                                    className="absolute top-[calc(100%+10px)] right-0 min-w-[10rem] bg-white rounded shadow-blur py-2 transition-transform origin-top aria-hidden:scale-y-0"
                                    aria-hidden={!isShow}
                                >
                                    <h1 className="whitespace-nowrap px-3 py-1">
                                        Xin chào, {currentUser.fullname || 'user'}
                                    </h1>
                                    <hr />
                                    <Link
                                        to="/profile/ticket"
                                        className="block w-full text-left whitespace-nowrap px-3 py-1 hover:bg-gray-secondary"
                                    >
                                        Thông tin cá nhân
                                    </Link>
                                    <button
                                        className="block w-full text-left whitespace-nowrap px-3 py-1 hover:bg-gray-secondary"
                                        onClick={handleLogout}
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        >
                            <SlUser />
                        </Dropdown>
                    ) : (
                        <Link
                            to="/login"
                            state={{ navigateBack: true }}
                            className="p-3 rounded-full bg-gray-secondary text-lg"
                        >
                            <BiLogInCircle />
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
