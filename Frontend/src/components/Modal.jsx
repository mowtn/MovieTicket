import { FaTimes } from 'react-icons/fa'

function Modal({ className, onHideClick, children, clickBackHide = true }) {
    return (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-30" onMouseDown={clickBackHide ? onHideClick : null}>
            <div
                className={`relative mx-auto mt-5 lg:mt-20 w-2/3 md:w-1/3 h-4/5 animate-[slideFromTop_.4s] ${
                    className || ''
                }`}
            >
                <div
                    className="overflow-y-auto max-h-full bg-white p-5 rounded"
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <button
                        type="button"
                        className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-white p-2 border rounded-full"
                        onClick={onHideClick}
                    >
                        <FaTimes />
                    </button>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal
