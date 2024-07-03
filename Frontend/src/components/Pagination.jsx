import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa'

function Pagination({ className, buttonClassName, currentPage, totalPage, onPageClick }) {
    const pages = Array.from({ length: 5 }, (value, index) => currentPage - 2 + index)
    return (
        <div className={className}>
            <button className={buttonClassName} onClick={() => onPageClick(1)}>
                <FaAngleDoubleLeft />
            </button>
            {pages.map(
                (page, index) =>
                    page >= 1 &&
                    page <= totalPage && (
                        <button
                            key={index}
                            className={buttonClassName}
                            onClick={() => onPageClick(page)}
                            aria-current={page === currentPage || undefined}
                            disabled={page === currentPage}
                        >
                            {page}
                        </button>
                    )
            )}
            <button className={buttonClassName} onClick={() => onPageClick(totalPage)}>
                <FaAngleDoubleRight />
            </button>
        </div>
    )
}

export default Pagination
