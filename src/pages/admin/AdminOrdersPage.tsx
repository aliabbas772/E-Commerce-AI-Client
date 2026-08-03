import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { Package, X } from 'lucide-react'
import { GET_ALL_ORDERS, UPDATE_ORDER_STATUS, CANCEL_ORDER } from '../../features/admin/queries'

const DELIVERY_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

const paymentBadge: Record<string, string> = {
    initiated: 'bg-gray-100 text-gray-600',
    pending: 'bg-amber-100 text-amber-700',
    paid: 'bg-emerald-100 text-emerald-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-purple-100 text-purple-700',
    partially_refunded: 'bg-purple-100 text-purple-700',
}

const deliveryBadge: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
}

export default function AdminOrdersPage() {
    const { data, loading, refetch } = useQuery(GET_ALL_ORDERS, {
        variables: { page: 1, limit: 50 },
    })

    const [updateStatus] = useMutation(UPDATE_ORDER_STATUS, {
        onCompleted: () => refetch(),
    })

    const [cancelOrder] = useMutation(CANCEL_ORDER, {
        onCompleted: () => refetch(),
    })

    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

    const orders = data?.getAllOrders?.data ?? []

    const handleStatusChange = (orderId: string, deliveryStatus: string) => {
        updateStatus({ variables: { id: orderId, deliveryStatus } })
    }

    const handleCancel = (orderId: string) => {
        const reason = prompt('Reason for cancellation (optional):')
        if (reason !== null) {
            cancelOrder({ variables: { id: orderId, reason: reason || undefined } })
        }
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
                <p className="mt-0.5 text-sm text-gray-400">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
            </div>

            {loading ? (
                <p className="text-sm text-gray-500">Loading orders...</p>
            ) : orders.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-200 py-16">
                    <Package size={32} strokeWidth={1.2} className="text-gray-300" />
                    <p className="text-sm text-gray-500">No orders yet</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-100">
                    {orders.map((order: any, i: number) => (
                        <div
                            key={order._id}
                            className={`p-4 transition-colors ${i !== orders.length - 1 ? 'border-b border-gray-100' : ''}`}
                        >
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
                                    className="flex flex-1 items-center gap-4 text-left"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            #{order._id.slice(-8).toUpperCase()}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {order.user.name} · {order.user.email}
                                        </p>
                                    </div>
                                </button>

                                <div className="flex items-center gap-3">
                                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium uppercase ${paymentBadge[order.paymentStatus?.toLowerCase()] ?? 'bg-gray-100 text-gray-600'}`}>
                                        {order.paymentStatus}
                                    </span>

                                    <select
                                        value={order.deliveryStatus?.toLowerCase() ?? 'pending'}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        className={`rounded-full border-0 px-2.5 py-1 text-[11px] font-medium uppercase outline-none ${deliveryBadge[order.deliveryStatus?.toLowerCase()] ?? 'bg-gray-100 text-gray-600'}`}
                                    >
                                        {DELIVERY_STATUSES.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>

                                    <p className="w-20 text-right text-sm font-semibold text-gray-900">
                                        ₹{order.totalAmount.toLocaleString('en-IN')}
                                    </p>

                                    {order.deliveryStatus?.toLowerCase() !== 'cancelled' && (
                                        <button
                                            onClick={() => handleCancel(order._id)}
                                            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                                            title="Cancel order"
                                        >
                                            <X size={15} strokeWidth={1.5} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {expandedOrderId === order._id && (
                                <div className="mt-4 border-t border-gray-100 pt-4">
                                    <div className="flex flex-col gap-2">
                                        {order.items.map((item: any, idx: number) => (
                                            <div key={idx} className="flex justify-between text-xs text-gray-600">
                                                <span>{item.product.name} · Size {item.size} · Qty {item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-2 text-xs text-gray-400">
                                        Placed {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </p>
                                    {order.notes && (
                                        <p className="mt-1 text-xs text-gray-500">Notes: {order.notes}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}