import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import Sidebar from './Sidebar'
import Header from './Header'

function AdminLayout() {
    const [showSidebar, setShowSidebar] = useState(true)

    return (
        <>
            <Header className="h-14" handleShowSidebar={() => setShowSidebar((prev) => !prev)} />
            <div>
                <Sidebar className={`w-60 ${!showSidebar && '-translate-x-full'}`} />
                <main
                    className={`min-h-[calc(100vh-3.5rem)] transition-[margin] duration-700 p-5 shadow-inner bg-gray-third ${
                        showSidebar && 'md:ml-60'
                    }`}
                >
                    <Outlet />
                </main>
            </div>
        </>
    )
}

export default AdminLayout
