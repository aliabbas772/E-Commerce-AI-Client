import { useQuery } from '@apollo/client/react'
import { useParams, Link } from 'react-router-dom'
import { GET_ORDER_BY_ID } from '@/features/orders/queries'

const statusColors: Record<string, string> = {
    initiated: 'bg-gray-100 text-gray-600',
    pending: 'bg-amber-100 text-amber-700',
    paid: 'bg-emerald-100 text-emerald-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    shipped: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-purple-100 text-purple-700',
    partially_refunded: 'bg-purple-100 text-purple-700',
}

const OrderDetailPage = () => {
    const { id } = useParams()
    const { data, loading, error } = useQuery(GET_ORDER_BY_ID, {
        variables: { id },
        skip: !id,
    })

    if (loading) {
        return <p className="px-6 py-12 text-center text-sm text-gray-500">Loading order...</p>
    }

    if (error) {
        return <p className="px-6 py-12 text-center text-sm text-red-600">Failed to load order: {error.message}</p>
    }

    const order = data?.getOrderById

    if (!order) {
        return <p className="px-6 py-12 text-center text-sm text-gray-500">Order not found.</p>
    }

    const badgeClass = statusColors[order.deliveryStatus?.toLowerCase()] ?? 'bg-gray-100 text-gray-600'

    return (
        <div className="mx-auto max-w-3xl px-6 py-12">
            <Link to="/account/orders" className="mb-8 inline-block text-xs font-medium uppercase tracking-wide text-gray-500 hover:text-gray-900">
                ← Back to Orders
            </Link>

            <div className="mb-8 flex items-start justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                        Order #{order._id.slice(-8).toUpperCase()}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                        })}
                    </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wide ${badgeClass}`}>
                    {order.deliveryStatus}
                </span>
            </div>

            <div className="mb-8 divide-y divide-gray-100 rounded-lg border border-gray-100">
                {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 p-4">
                        <img
                            src={item.product.images?.[0]}
                            alt={item.product.name}
                            className="h-16 w-16 rounded-md object-cover"
                        />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                            <p className="mt-1 text-xs text-gray-500">
                                Size: {item.size} · Qty: {item.quantity}
                            </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                    </div>
                ))}
            </div>

            <div className="space-y-2 rounded-lg border border-gray-100 p-5">
                {order.discount > 0 && (
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                        <span>−₹{order.discount.toLocaleString('en-IN')}</span>
                    </div>
                )}
                <div className="flex justify-between text-sm font-semibold text-gray-900">
                    <span>Total</span>
                    <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
                    <span>Payment Status</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${statusColors[order.paymentStatus?.toLowerCase()] ?? 'bg-gray-100 text-gray-600'}`}>
                        {order.paymentStatus}
                    </span>
                </div>
                {order.notes && (
                    <div className="pt-2 text-xs text-gray-500">
                        <span className="font-medium text-gray-700">Notes: </span>{order.notes}
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrderDetailPage