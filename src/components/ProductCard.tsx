import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import { useAddToCart } from '@/features/cart/useAddToCart'

interface ProductCardProps {
    productId: string
    name: string
    price: number
    image: string
    sizes: string[]
}

export default function ProductCard({ productId, name, price, image, sizes }: ProductCardProps) {
    const dispatch = useDispatch()
    const safeSizes = sizes ?? []
    const [selectedSize, setSelectedSize] = useState(safeSizes[0] ?? '');
    const addToCart = useAddToCart()

    return (
        <div className="flex flex-col gap-3">
            <Link to={`/products/${productId}`}>
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
                    <img src={image} alt={name} className="h-full w-full object-cover transition-transform hover:scale-105" />
                </div>
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
                        className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700"
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
                    disabled={!selectedSize}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-40"
                >
                    Add
                </button>
            </div>
        </div>
    )
}