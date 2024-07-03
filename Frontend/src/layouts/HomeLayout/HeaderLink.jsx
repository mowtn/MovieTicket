import { NavLink } from 'react-router-dom'

function HeaderLink(props) {
    return (
        <NavLink
            className={({ isActive }) =>
                `px-3 py-1 transition-colors ${isActive ? 'text-blue-primary' : 'hover:text-blue-primary'}`
            }
            {...props}
        ></NavLink>
    )
}

export default HeaderLink
