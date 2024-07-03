import { useState, useEffect, useMemo } from 'react'
import { RiMoneyEuroCircleLine } from 'react-icons/ri'
import { IoTicket } from 'react-icons/io5'

import { handleError } from '../../api/axiosConfig'
import adminAPI from '../../api/adminAPI'
import dateUtil from '../../utils/dateUtil'
import currencyUtil from '../../utils/currencyUtil'

function Dashboard() {
    const [loading, setLoading] = useState(true)
    const [ticketFilter, setTicketFilter] = useState('week')
    const [tickets, setTickets] = useState([])

    const revenue = useMemo(() => tickets.reduce((total, ticket) => total + ticket.totalPrice, 0), [tickets])

    useEffect(() => {
        const today = new Date()
        const monday = dateUtil.getMonday(today)
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

        async function loadTickets() {
            const fromDate = ticketFilter === 'week' ? monday : firstDayOfMonth
            const res = await adminAPI.ticket.getAll({
                fromDate: dateUtil.format(fromDate, dateUtil.INPUT_DATE_FORMAT),
                toDate: dateUtil.format(today, dateUtil.INPUT_DATE_FORMAT),
            })
            setTickets(res.data)
        }

        ;(async () => {
            try {
                await loadTickets()
                setLoading(false)
            } catch (error) {
                handleError(error)
            }
        })()
    }, [ticketFilter])

    return loading ? (
        <></>
    ) : (
        <>
            <h1 className="mb-3 text-lg font-semibold">Thống kê</h1>
            <div className="bg-white rounded shadow p-5">
                <select
                    className="mb-3 px-3 py-2 rounded border outline-blue-primary focus:outline"
                    value={ticketFilter}
                    onChange={(e) => setTicketFilter(e.target.value)}
                >
                    <option value="week">Tuần này</option>
                    <option value="month">Tháng này</option>
                </select>
                <div className="grid grid-cols-3 text-center gap-5 lg:gap-10">
                    <div className="rounded-lg p-2 bg-green-primary text-white shadow drop-shadow">
                        <p className="inline-flex items-center gap-1 text-lg">
                            <RiMoneyEuroCircleLine /> <span>Doanh thu</span>
                        </p>
                        <h1 className="text-2xl font-semibold">{currencyUtil.format(revenue)}</h1>
                    </div>
                    <div className="rounded-lg p-2 bg-blue-primary text-white shadow drop-shadow">
                        <p className="inline-flex items-center gap-1 text-lg">
                            <IoTicket /> <span>Vé</span>
                        </p>
                        <h1 className="text-2xl font-semibold">{tickets.length}</h1>
                    </div>
                    <div className="rounded-lg p-2 bg-gray-primary text-white shadow drop-shadow">
                        <p className="inline-flex items-center gap-1 text-lg">
                            <RiMoneyEuroCircleLine /> <span>Doanh thu / vé</span>
                        </p>
                        <h1 className="text-2xl font-semibold">{currencyUtil.format(revenue / tickets.length || 0)}</h1>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard
