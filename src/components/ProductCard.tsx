import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'

interface ProductCardProps {
    productId: string
    name: string
    price: number
    image: string
    sizes: string[]
}

export default function ProductCard({ productId, name, price, image, sizes }: ProductCardProps) {
    const dispatch = useDispatch()
    const [selectedSize, setSelectedSize] = useState(sizes[0])

    return (
        <div className="flex flex-col gap-3">
            <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
                <img src={image} alt={name} className="h-full w-full object-cover" />
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium text-gray-900">{name}</h3>
                    <p className="text-sm text-gray-500">₹{price}</p>
                </div>

                <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700"
                >
                    {sizes.map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>

                <button
                    onClick={() => dispatch(addToCart({ productId, name, price, image, size: selectedSize }))}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-800"
                >
                    Add
                </button>
            </div>
        </div>
    )
}