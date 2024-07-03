import { useMemo } from 'react'

function getKey(row, col) {
    return `${row}, ${col}`
}

function RenderSeatTable({ seats, selectedIds = [], onSeatClick = () => {} }) {
    const minRow = Math.min(...seats.map((seat) => seat.rowOrder))
    const maxRow = Math.max(...seats.map((seat) => seat.rowOrder))
    const minCol = Math.min(...seats.map((seat) => seat.columnOrder))
    const maxCol = Math.max(...seats.map((seat) => seat.columnOrder))

    const rows = Array.from({ length: maxRow - minRow + 1 }, (value, index) => minRow + index)
    const cols = Array.from({ length: maxCol - minCol + 1 }, (value, index) => minCol + index)

    const seatObj = useMemo(() => {
        return seats.reduce((prev, seat) => {
            const key = getKey(seat.rowOrder, seat.columnOrder)
            if (!prev.hasOwnProperty(key)) prev[key] = seat
            return prev
        }, {})
    }, [seats])

    return (
        <div className="overflow-x-auto">
            <table className="mx-auto border-separate border-spacing-1">
                <tbody>
                    {rows.map((row) => (
                        <tr key={row}>
                            {cols.map((col) => {
                                const seat = seatObj[getKey(row, col)]
                                return (
                                    <td key={col}>
                                        {seat ? (
                                            <button
                                                className="py-1 px-3 border-4 rounded aria-selected:bg-blue-secondary disabled:border-gray-secondary disabled:bg-gray-secondary"
                                                style={{ borderColor: !seat.occupied && seat.type.color }}
                                                onClick={(e) => onSeatClick(seat)}
                                                aria-selected={selectedIds.includes(seat.id)}
                                                disabled={seat.occupied}
                                            >
                                                {seat.name}
                                            </button>
                                        ) : (
                                            <div className="w-10 h-10"></div>
                                        )}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default RenderSeatTable
