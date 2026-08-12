import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client/react'
import { useSelector } from 'react-redux'
import { Bell, Check, Trash2 } from 'lucide-react'
import type { RootState } from '../store/store'
import {
    GET_MY_NOTIFICATIONS,
    GET_UNREAD_COUNT,
    MARK_AS_READ,
    MARK_ALL_AS_READ,
    DELETE_NOTIFICATION,
} from '../features/notifications/queries'

const POLL_INTERVAL = 120000 // 120s

export default function NotificationBell() {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth)
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    const { data: countData } = useQuery<any>(GET_UNREAD_COUNT, {
        skip: !isAuthenticated,
        pollInterval: POLL_INTERVAL,
    })

    const { data: listData, refetch } = useQuery<any>(GET_MY_NOTIFICATIONS, {
        variables: { page: 1, limit: 15 },
        skip: !isAuthenticated || !isOpen,
    })

    const [markAsRead] = useMutation(MARK_AS_READ, {
        refetchQueries: [{ query: GET_UNREAD_COUNT }],
    })
    const [markAllAsRead] = useMutation(MARK_ALL_AS_READ, {
        refetchQueries: [{ query: GET_UNREAD_COUNT }, { query: GET_MY_NOTIFICATIONS, variables: { page: 1, limit: 15 } }],
    })
    const [deleteNotification] = useMutation(DELETE_NOTIFICATION, {
        refetchQueries: [{ query: GET_UNREAD_COUNT }, { query: GET_MY_NOTIFICATIONS, variables: { page: 1, limit: 15 } }],
    })

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    if (!isAuthenticated) return null

    const unreadCount = countData?.getUnreadCount?.count ?? 0
    const notifications = listData?.getMyNotifications ?? []

    const handleNotificationClick = (notification: any) => {
        if (!notification.isRead) {
            markAsRead({ variables: { id: notification._id } })
        }
        setIsOpen(false)
        if (notification.link) {
            navigate('/account' + notification.link)
        }
    }

    return (
        <div ref={containerRef} className="relative">
            <button
                onClick={() => {
                    setIsOpen((prev) => !prev)
                    if (!isOpen) refetch()
                }}
                aria-label="Notifications"
                className="relative text-gray-500 transition-colors hover:text-gray-900"
            >
                <Bell size={19} strokeWidth={1.5} />
                {unreadCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-gray-100 bg-white shadow-lg">
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                        <span className="text-sm font-semibold text-gray-900">Notifications</span>
                        {unreadCount > 0 && (
                            <button
                                onClick={() => markAllAsRead()}
                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900"
                            >
                                <Check size={13} strokeWidth={1.5} />
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="px-4 py-8 text-center text-sm text-gray-400">
                                No notifications yet
                            </p>
                        ) : (
                            notifications.map((n: any) => (
                                <div
                                    key={n._id}
                                    className={`flex items-start gap-2 border-b border-gray-50 px-4 py-3 last:border-0 hover:bg-gray-50 ${!n.isRead ? 'bg-blue-50/40' : ''
                                        }`}
                                >
                                    <button
                                        onClick={() => handleNotificationClick(n)}
                                        className="flex-1 text-left"
                                    >
                                        <div className="flex items-center gap-2">
                                            {!n.isRead && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />}
                                            <p className="text-sm font-medium text-gray-900">{n.title}</p>
                                        </div>
                                        <p className="mt-0.5 text-xs text-gray-500">{n.message}</p>
                                        <p className="mt-1 text-[11px] text-gray-400">
                                            {new Date(n.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                    </button>
                                    <button
                                        onClick={() => deleteNotification({ variables: { id: n._id } })}
                                        className="text-gray-300 hover:text-red-500"
                                    >
                                        <Trash2 size={13} strokeWidth={1.5} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}