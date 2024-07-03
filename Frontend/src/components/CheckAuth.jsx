import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'

function CheckAuth({ roles = [], children }) {
    const { currentUser } = useAuth()

    if (
        !currentUser ||
        (roles.length > 0 && !roles.every((role) => currentUser.roles?.map((r) => r.name).includes(role)))
    ) {
        toast.error('Bạn không có đủ quyền. Vui lòng đăng nhập')
        return <Navigate to={'/login'} />
    }

    return children
}

export const RoleName = Object.freeze({
    SHOW_ADMIN: 'SHOW_ADMIN',
    MANAGE_USER: 'MANAGE_USER',
    MANAGE_CINEMA: 'MANAGE_CINEMA',
    MANAGE_FOOD: 'MANAGE_FOOD',
    MANAGE_MOVIE: 'MANAGE_MOVIE',
    MANAGE_SHOWTIME: 'MANAGE_SHOWTIME',
    MANAGE_TICKET: 'MANAGE_TICKET',
})

export default CheckAuth
