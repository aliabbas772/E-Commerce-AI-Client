import { useQuery } from '@apollo/client/react'
import { Link } from 'react-router-dom'
import { GET_MY_ORDERS } from '@/features/orders/queries'

const OrdersPage = () => {
    const { data, loading, error } = useQuery<any>(GET_MY_ORDERS, {
        variables: { page: 1, limit: 10 }
    })

    if (loading) {
        return <p className="px-6 py-12 text-center text-sm text-gray-500">Loading your orders...</p>
    }

    if (error) {
        return <p className="px-6 py-12 text-center text-sm text-red-600">Failed to load orders: {error.message}</p>
    }

    const orders = data?.getMyOrders?.data ?? []

    return (
        <div className="mx-auto max-w-4xl px-6 py-12">
            <h1 className="mb-8 text-xl font-semibold text-gray-900">My Orders</h1>

            {orders.length === 0 ? (
                <p className="text-sm text-gray-500">You haven't placed any orders yet.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order: any) => (
                        <Link
                            key={order._id}
                            to={`/account/orders/${order._id}`}
                            className="block rounded-lg border border-gray-100 p-5 transition-colors hover:border-gray-300"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Order #{order._id.slice(-8).toUpperCase()}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                        {' · '}
                                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">
                                        ₹{order.totalAmount.toLocaleString('en-IN')}
                                    </p>
                                    <span className="mt-1 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-gray-600">
                                        {order.deliveryStatus}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default OrdersPage