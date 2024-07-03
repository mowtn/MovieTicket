import { IoTicket } from 'react-icons/io5'

function Logo({ className }) {
    return (
        <div className={`inline-flex items-center text-2xl font-bold select-none ${className || ''}`}>
            <span className="text-blue-primary">
                <IoTicket />
            </span>
            Cinemaz
        </div>
    )
}

export default Logo
