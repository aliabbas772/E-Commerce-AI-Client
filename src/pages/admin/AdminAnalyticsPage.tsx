import { useQuery } from '@apollo/client/react'
import { TrendingUp, ShoppingCart, Wallet, Package } from 'lucide-react'
import { GET_SALES_ANALYTICS, GET_TOP_PRODUCTS } from '../../features/admin/queries'

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-white p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">
                <Icon size={17} strokeWidth={1.5} className="text-gray-600" />
            </div>
            <p className="text-xs font-medium text-gray-400">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
    )
}

export default function AdminAnalyticsPage() {
    const { data: salesData, loading: salesLoading } = useQuery<any>(GET_SALES_ANALYTICS)
    const { data: productsData, loading: productsLoading } = useQuery<any>(GET_TOP_PRODUCTS)

    const analytics = salesData?.getSalesAnalytics
    const topProducts = productsData?.getTopProducts ?? []

    const maxRevenue = Math.max(...topProducts.map((p: any) => p.revenue), 1)

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
                <p className="mt-0.5 text-sm text-gray-400">Sales performance overview</p>
            </div>

            {salesLoading ? (
                <p className="text-sm text-gray-500">Loading stats...</p>
            ) : (
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                        label="Total revenue"
                        value={`₹${(analytics?.totalRevenue ?? 0).toLocaleString('en-IN')}`}
                        icon={Wallet}
                    />
                    <StatCard
                        label="Total orders"
                        value={(analytics?.totalOrders ?? 0).toString()}
                        icon={ShoppingCart}
                    />
                    <StatCard
                        label="Average order value"
                        value={`₹${(analytics?.averageOrderValue ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                        icon={TrendingUp}
                    />
                </div>
            )}

            <div className="rounded-xl border border-gray-100 bg-white p-6">
                <h2 className="mb-5 text-sm font-semibold text-gray-900">Top products by revenue</h2>

                {productsLoading ? (
                    <p className="text-sm text-gray-500">Loading top products...</p>
                ) : topProducts.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-12 text-center">
                        <Package size={28} strokeWidth={1.2} className="text-gray-300" />
                        <p className="text-sm text-gray-500">No sales data yet</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {topProducts.map((product: any) => (
                            <div key={product.productId}>
                                <div className="mb-1.5 flex items-center justify-between text-sm">
                                    <span className="font-medium text-gray-900">{product.name}</span>
                                    <span className="text-gray-500">
                                        ₹{product.revenue.toLocaleString('en-IN')} · {product.totalSold} sold
                                    </span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                    <div
                                        className="h-full rounded-full bg-gray-900"
                                        style={{ width: `${(product.revenue / maxRevenue) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}