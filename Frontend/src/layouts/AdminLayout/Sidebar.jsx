import { AiOutlineDashboard, AiOutlineGroup, AiOutlinePlaySquare } from 'react-icons/ai'
import { TbTheater } from 'react-icons/tb'
import { FaUserEdit } from 'react-icons/fa'
import { BiCameraMovie } from 'react-icons/bi'
import { MdFastfood } from 'react-icons/md'
import { IoTicket } from 'react-icons/io5'
import { BsCardImage } from 'react-icons/bs'
import { HiChartBar } from 'react-icons/hi2'

import SidebarLink from './SidebarLink'
import SidebarDropdown from './SidebarDropdown'

function Sidebar({ className }) {
    return (
        <div
            className={`fixed z-30 left-0 h-full transition-transform duration-700 bg-white overflow-y-auto ${className}`}
        >
            <SidebarLink to="/admin" end icon={<AiOutlineDashboard />}>
                Dashboard
            </SidebarLink>
            <SidebarLink to="/admin/showtime" icon={<AiOutlinePlaySquare />}>
                Lịch chiếu
            </SidebarLink>
            <SidebarLink to="/admin/ticket" icon={<IoTicket />}>
                Vé
            </SidebarLink>
            <SidebarDropdown
                icon={<AiOutlineGroup />}
                text="Quản lý rạp"
                menu={
                    <>
                        <SidebarLink to="/admin/cinema" icon={<TbTheater />}>
                            Rạp
                        </SidebarLink>
                        <SidebarLink to="/admin/food" icon={<MdFastfood />}>
                            Đồ ăn
                        </SidebarLink>
                        <SidebarLink to="/admin/movie" icon={<BiCameraMovie />}>
                            Phim
                        </SidebarLink>
                    </>
                }
            />
            <SidebarLink to="/admin/banner" icon={<BsCardImage />}>
                Banner
            </SidebarLink>
            <SidebarLink to="/admin/user" icon={<FaUserEdit />}>
                Người dùng
            </SidebarLink>
            <SidebarLink to="/admin/report" icon={<HiChartBar />}>
                Báo cáo / thống kê
            </SidebarLink>
        </div>
    )
}

export default Sidebar
