import { useEffect, useRef, useState } from 'react'

function Dropdown({ Menu, ...props }) {
    const [show, setShow] = useState(false)

    const dropdownRef = useRef()

    useEffect(() => {
        function hideIfClickOutside(e) {
            if (!dropdownRef.current.contains(e.target)) setShow(false)
        }
        document.addEventListener('mousedown', hideIfClickOutside)
        return () => {
            document.removeEventListener('mousedown', hideIfClickOutside)
        }
    }, [])

    return (
        <div ref={dropdownRef} className="relative">
            <button onClick={() => setShow((prev) => !prev)} {...props}></button>
            <Menu isShow={show} />
        </div>
    )
}

export default Dropdown
