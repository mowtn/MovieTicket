import { TiThMenu } from 'react-icons/ti'
import { FaUserAlt } from 'react-icons/fa'
import { RiArrowDropDownLine } from 'react-icons/ri'
import { Link, useNavigate } from 'react-router-dom'

import Logo from '../../components/Logo'
import { useAuth } from '../../contexts/AuthContext'
import Dropdown from '../../components/Dropdown'

function Header({ className, handleShowSidebar }) {
    const navigate = useNavigate()
    const { currentUser, logout } = useAuth()

    const handleLogout = async () => {
        await logout()
        navigate('/login', { replace: true })
    }

    return (
        <header className={`sticky z-30 top-0 inset-x-0 bg-white flex ${className}`}>
            <Link to="/admin" className="w-60 flex items-center justify-center">
                <Logo />
            </Link>
            <div className="flex-1 flex justify-between items-center px-3">
                <button className="text-lg p-2 rounded-full hover:bg-gray-secondary" onClick={handleShowSidebar}>
                    <TiThMenu />
                </button>

                <Dropdown
                    className="flex items-center p-2 text-lg"
                    Menu={({ isShow }) => (
                        <div
                            className="absolute top-full right-[10px] min-w-[10rem] bg-white rounded shadow py-2 transition-transform origin-top aria-hidden:scale-y-0"
                            aria-hidden={!isShow}
                        >
                            <h1 className="whitespace-nowrap px-3 py-1">Xin chào, {currentUser.fullname || 'user'}</h1>
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
                    <FaUserAlt />
                    <RiArrowDropDownLine />
                </Dropdown>
            </div>
        </header>
    )
}

export default Header
