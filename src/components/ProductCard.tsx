import { useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'

interface ProductCardProps {
    id: string
    name: string
    price: number
    imageUrl: string
}

export default function ProductCard({ id, name, price, imageUrl }: ProductCardProps) {
    const dispatch = useDispatch()

    return (
        <div className="flex flex-col gap-3">
            <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
                <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium text-gray-900">{name}</h3>
                    <p className="text-sm text-gray-500">₹{price}</p>
                </div>
                <button
                    onClick={() => dispatch(addToCart({ id, name, price, imageUrl }))}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-800"
                >
                    Add
                </button>
            </div>
        </div>
    )
}