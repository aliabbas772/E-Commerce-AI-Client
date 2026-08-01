import { NavLink, Outlet } from 'react-router-dom'
import { LayoutGrid, Package, Shield, ShoppingBag } from 'lucide-react'

export default function AdminLayout() {
    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
        }`

    return (
        <div className="mx-auto flex max-w-7xl gap-8 px-6 py-10 lg:px-8">
            <aside className="w-52 shrink-0">
                <h2 className="mb-6 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Admin
                </h2>
                <nav className="flex flex-col gap-1">
                    <NavLink to="/admin" end className={linkClass}>
                        <LayoutGrid size={16} strokeWidth={1.5} />
                        Overview
                    </NavLink>
                    <NavLink to="/admin/categories" className={linkClass}>
                        <ShoppingBag size={16} strokeWidth={1.5} />
                        Categories
                    </NavLink>
                    <NavLink to="/admin/products" className={linkClass}>
                        <Package size={16} strokeWidth={1.5} />
                        Products
                    </NavLink>
                    <NavLink to="/admin/admins" className={linkClass}>
                        <Shield size={16} strokeWidth={1.5} />
                        Admins
                    </NavLink>
                </nav>
            </aside>

            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    )
}