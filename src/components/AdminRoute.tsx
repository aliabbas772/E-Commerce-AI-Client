import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'

export default function AdminRoute() {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (user?.role !== 'admin') {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}