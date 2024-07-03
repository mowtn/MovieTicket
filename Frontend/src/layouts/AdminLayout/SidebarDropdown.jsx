import { useEffect, useRef, useState } from 'react'
import { MdOutlineChevronRight } from 'react-icons/md'

function SidebarDropdown({ icon, text, menu }) {
    const [isShow, setShow] = useState(false)
    const menuRef = useRef()
    const menuHeight = useRef()

    useEffect(() => {
        menuHeight.current = menuRef.current.clientHeight
        menuRef.current.style.height = 0
    }, [])

    useEffect(() => {
        if (isShow) {
            menuRef.current.style.height = menuHeight.current + 'px'
            menuRef.current.classList.remove('overflow-hidden', 'opacity-0')
        } else {
            menuRef.current.style.height = 0
            menuRef.current.classList.add('overflow-hidden', 'opacity-0')
        }
    }, [isShow])

    return (
        <>
            <button
                type="button"
                className="w-full flex items-center justify-between hover:bg-blue-secondary hover:text-blue-primary border-l-4 border-transparent p-3 my-2 transition-colors"
                onClick={() => setShow((prev) => !prev)}
            >
                <div className="flex items-center">
                    <span className="mr-2 text-2xl">{icon}</span>
                    {text}
                </div>
                <div className={`text-2xl transition-transform ${isShow && 'rotate-90'}`}>
                    <MdOutlineChevronRight />
                </div>
            </button>
            <div ref={menuRef} className="transition-[height,opacity]">
                {menu}
            </div>
        </>
    )
}

export default SidebarDropdown
