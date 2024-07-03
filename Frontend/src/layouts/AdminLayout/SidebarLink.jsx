import { NavLink } from 'react-router-dom'

function SidebarLink({ icon, children, ...props }) {
    return (
        <NavLink
            className={({ isActive }) =>
                `flex items-center p-3 mb-2 transition-colors border-l-4 ${
                    isActive
                        ? 'text-blue-primary border-blue-primary'
                        : 'border-transparent hover:bg-blue-secondary hover:text-blue-primary'
                }`
            }
            {...props}
        >
            <div className="mr-2 text-2xl">{icon}</div>
            {children}
        </NavLink>
    )
}

export default SidebarLink
