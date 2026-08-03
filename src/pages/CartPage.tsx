import { useNavigate } from 'react-router-dom'
import { Minus, Plus, X, ShoppingBag } from 'lucide-react'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import { useCart } from '../features/cart/useCart'

export default function CartPage() {
    const { items, subtotal, loading, increaseQuantity, decreaseQuantity, removeItem } = useCart()
    const { isAuthenticated } = useSelector((state: RootState) => state.auth)
    const navigate = useNavigate()

    if (loading) {
        return <p className="px-6 py-32 text-center text-sm text-gray-500">Loading cart...</p>
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center gap-4 py-32 text-center">
                <ShoppingBag size={40} strokeWidth={1.2} className="text-gray-300" />
                <p className="text-sm text-gray-500">Your cart is empty.</p>
            </div>
        )
    }

    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate('/login')
            return
        }
        navigate('/checkout')
    }

    return (
        <div className="mx-auto max-w-3xl px-6 py-12">
            <h1 className="mb-8 text-xl font-semibold text-gray-900">Your Cart</h1>

            <div className="flex flex-col gap-6">
                {items.map((item) => (
                    <div key={`${item.productId}-${item.size}`} className="flex items-center gap-4 border-b border-gray-100 pb-6">
                        <img src={item.image} alt={item.name} className="h-20 w-16 rounded-md object-cover" />

                        <div className="flex flex-1 items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                                <p className="text-sm text-gray-500">₹{item.price} · Size {item.size}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => decreaseQuantity(item.productId, item.size)}
                                    className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:border-gray-900 hover:text-gray-900"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="w-4 text-center text-sm">{item.quantity}</span>
                                <button
                                    onClick={() => increaseQuantity(item.productId, item.size)}
                                    className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:border-gray-900 hover:text-gray-900"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>

                            <button
                                onClick={() => removeItem(item.productId, item.size)}
                                className="text-gray-300 hover:text-red-500"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-between text-base font-semibold text-gray-900">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
            </div>

            <button
                onClick={handleCheckout}
                className="mt-6 w-full rounded-lg bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
                Proceed to Checkout
            </button>

            {!isAuthenticated && (
                <p className="mt-3 text-center text-xs text-gray-400">
                    You'll need to sign in to complete checkout
                </p>
            )}
        </div>
    )
}