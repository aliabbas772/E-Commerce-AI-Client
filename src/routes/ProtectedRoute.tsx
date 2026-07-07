import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'

export default function ProtectedRoute() {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
    const location = useLocation()

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }
    return <Outlet />
}