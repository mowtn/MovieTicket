import { useEffect, useRef, useState } from 'react'
import { TfiSearch } from 'react-icons/tfi'

function InputDelay({ className, onAfterDelay = () => {}, delay = 800 }) {
    const [value, setValue] = useState('')

    const firstRender = useRef(true)

    useEffect(() => {
        if (firstRender.current) firstRender.current = false
        else {
            const timeoutId = setTimeout(() => {
                onAfterDelay(value)
            }, delay)
            return () => {
                clearTimeout(timeoutId)
            }
        }
    }, [value])

    return (
        <label className={className}>
            <input type="text" className="outline-none" value={value} onChange={(e) => setValue(e.target.value)} />
            <TfiSearch />
        </label>
    )
}

export default InputDelay
