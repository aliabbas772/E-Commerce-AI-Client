import type { ReactNode } from 'react'
import { useNotificationSocket } from '../features/notifications/useNotificationSocket'

export default function NotificationSocketProvider({ children }: { children: ReactNode }) {
    useNotificationSocket()
    return <>{children}</>
}