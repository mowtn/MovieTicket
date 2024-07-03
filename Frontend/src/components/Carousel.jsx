import { useEffect, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
// import { GoPrimitiveDot } from 'react-icons/go'

import Image from './Image'
import webAPI from '../api/webAPI'

function Carousel({ data, intervalDuration = 3000 }) {
    const [activeIndex, setActiveIndex] = useState(0)
    const [isInterval, setIsInterval] = useState(true)

    useEffect(() => {
        if (isInterval) {
            const intervalId = setInterval(() => {
                setActiveIndex((prev) => prev + 1)
            }, intervalDuration)
            return () => {
                clearInterval(intervalId)
            }
        }
    }, [isInterval, intervalDuration])

    useEffect(() => {
        if (activeIndex < 0) setActiveIndex(data.length - 1)
        else if (activeIndex > data.length - 1) setActiveIndex(0)
    }, [activeIndex, data])
console.log(data);
    return (

        <div
            className="relative h-full text-white"
            onMouseEnter={(e) => setIsInterval(false)}
            onMouseLeave={(e) => setIsInterval(true)}
        >
            {data.map((item, index) => (
                <a
                    key={item.id}
                    href={item.link}
                    className="absolute inset-0 transition-opacity aria-disabled:opacity-0 aria-disabled:pointer-events-none"
                    aria-disabled={activeIndex !== index}
                >
                    <Image
                        className="w-full h-full object-cover brightness-90"
                        src={webAPI.getUpload(item.thumbnail)}
                    />
                    
                </a>
            ))}
            <button className="absolute left-0 top-1/2 -translate-y-1/2 text-7xl opacity-80 hover:opacity-100">
                <FiChevronLeft onClick={(e) => setActiveIndex((prev) => prev - 1)} />
            </button>
            <button className="absolute right-0 top-1/2 -translate-y-1/2 text-7xl opacity-80 hover:opacity-100">
                <FiChevronRight onClick={(e) => setActiveIndex((prev) => prev + 1)} />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 text-2xl">
                {data.map((item, index) => (
                    <button
                        key={index}
                        className="transition-opacity opacity-80 aria-[current='true']:opacity-100"
                        aria-current={activeIndex === index}
                        onClick={(e) => setActiveIndex(index)}
                    >
                        {/* <GoPrimitiveDot /> */}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Carousel
