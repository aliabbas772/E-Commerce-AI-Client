import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAddToCart } from '@/features/cart/useAddToCart'
import WishlistButton from './WishlistButton'
import { withStockStatus } from './withStockStatus'

interface ProductCardProps {
    productId: string
    name: string
    price: number
    image: string
    sizes: string[]
    stock?: number
}

function ProductCardBase({
    productId,
    name,
    price,
    image,
    sizes,
    isOutOfStock,
}: ProductCardProps & { isOutOfStock: boolean }) {
    const safeSizes = sizes ?? []
    const [selectedSize, setSelectedSize] = useState(safeSizes[0] ?? '')
    const addToCart = useAddToCart()

    return (
        <div className="flex flex-col gap-3">
            <Link to={`/products/${productId}`} className="relative block">
                <div className={`aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 ${isOutOfStock ? 'opacity-60' : ''}`}>
                    <img src={image} alt={name} className="h-full w-full object-cover transition-transform hover:scale-105" />
                </div>
                <WishlistButton
                    productId={productId}
                    size={16}
                    className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 backdrop-blur-sm"
                />
            </Link>

            <div className="flex items-center justify-between">
                <div>
                    <Link to={`/products/${productId}`}>
                        <h3 className="text-sm font-medium text-gray-900 hover:underline">{name}</h3>
                    </Link>
                    <p className="text-sm text-gray-500">₹{price}</p>
                </div>

                {safeSizes.length > 0 && (
                    <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        disabled={isOutOfStock}
                        className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700 disabled:opacity-50"
                    >
                        {safeSizes.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                )}

                <button
                    onClick={() => addToCart({ productId, name, price, image, size: selectedSize })}
                    disabled={!selectedSize || isOutOfStock}
                    className={`rounded-lg px-4 py-2 text-xs font-medium text-white transition-colors ${isOutOfStock
                            ? 'cursor-not-allowed bg-gray-300'
                            : 'cursor-pointer bg-gray-900 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40'
                        }`}
                >
                    {isOutOfStock ? 'Sold out' : 'Add'}
                </button>
            </div>
        </div>
    )
}

export default withStockStatus(ProductCardBase)