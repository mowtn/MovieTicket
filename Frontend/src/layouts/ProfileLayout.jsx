import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

function MenuLink(props) {
    return (
        <NavLink
            className={({ isActive }) =>
                `py-2 px-5 rounded-t-lg transition-colors ${isActive ? 'bg-white' : 'hover:text-blue-primary'}`
            }
            {...props}
        ></NavLink>
    )
}

function ProfileLayout() {
    return (
        <div className="container-custom">
            <div className="bg-gray-secondary shadow-inner p-5">
                <div className="flex">
                    <MenuLink to="/profile/ticket">Vé của tôi</MenuLink>
                    <MenuLink to="/profile" end>
                        Thông tin cá nhân
                    </MenuLink>
                    <MenuLink to="/profile/change-pass">Đổi mật khẩu</MenuLink>
                </div>
                <div className="bg-white p-5">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default ProfileLayout
