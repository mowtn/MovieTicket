import { Link } from 'react-router-dom'
import { BsFacebook } from 'react-icons/bs'
import { AiFillYoutube, AiFillInstagram } from 'react-icons/ai'

import Logo from '../../components/Logo'

function Footer() {
    return (
        <footer className="bg-black-primary text-gray-third">
            <div className="container-custom py-10 flex gap-5 flex-col md:flex-row">
                <div className="md:w-6/12">
                    <div className="mb-3">
                        <Link to="/">
                            <Logo className="text-white" />
                        </Link>
                    </div>
                    <p className="mb-1">Hệ thống rạp chiếu phim đẳng cấp Cinemaz Việt Nam.</p>
                    <p>@ {new Date().getFullYear()} Cinemaz. All rights reserved.</p>
                </div>
                <div className="md:w-3/12">
                    <h1 className="text-white mb-3 font-bold">Công ty TNHH Cinemaz Việt Nam</h1>
                    <p className="mb-3">Địa chỉ: 235 Hoàng Quốc Việt, Bắc Từ Liêm, Hà Nội.</p>
                    <div className="flex text-2xl gap-2">
                        <a href="#!">
                            <BsFacebook />
                        </a>
                        <a href="#!">
                            <AiFillYoutube />
                        </a>
                        <a href="#!">
                            <AiFillInstagram />
                        </a>
                    </div>
                </div>
                <div className="md:w-3/12">
                    <h1 className="text-white mb-3 font-bold">Chăm sóc khách hàng</h1>
                    <p className="mb-1">Hotline: 1900 6017</p>
                    <p className="mb-1 text-justify">Giờ làm việc: 8:00 - 22:00 (Tất cả các ngày bao gồm cả Lễ Tết)</p>
                    <p className="mb-1">Email hỗ trợ: hoidap@cinemaz.vn</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
