import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { useDispatch } from 'react-redux'
import { GET_PRODUCT_BY_ID } from '../features/products/queries'
import { addToCart } from '../store/slices/cartSlice'

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>()
    const dispatch = useDispatch()
    const [selectedSize, setSelectedSize] = useState<string | null>(null)
    const [activeImage, setActiveImage] = useState(0)

    const { data, loading, error } = useQuery(GET_PRODUCT_BY_ID, {
        variables: { id },
    })

    if (loading) {
        return <p className="px-6 py-24 text-center text-sm text-gray-500">Loading product...</p>
    }

    if (error || !data?.getProductById) {
        return <p className="px-6 py-24 text-center text-sm text-red-600">Product not found.</p>
    }

    const product = data.getProductById

    const handleAddToCart = () => {
        if (!selectedSize) return
        dispatch(
            addToCart({
                productId: product._id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                size: selectedSize,
            })
        )
    }

    return (
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 px-6 py-12 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
                    <img src={product.images[activeImage]} alt={product.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex gap-3">
                    {product.images.map((img: string, i: number) => (
                        <button
                            key={img}
                            onClick={() => setActiveImage(i)}
                            className={`h-20 w-16 overflow-hidden rounded-md border-2 ${i === activeImage ? 'border-gray-900' : 'border-transparent'
                                }`}
                        >
                            <img src={img} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
                    <p className="mt-2 text-lg font-semibold text-gray-900">₹{product.price}</p>
                </div>

                <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>

                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-gray-900">Size</span>
                    <div className="flex gap-2">
                        {product.sizes.map((size: string) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`h-10 w-10 rounded-md border text-sm font-medium ${selectedSize === size
                                        ? 'border-gray-900 bg-gray-900 text-white'
                                        : 'border-gray-300 text-gray-700 hover:border-gray-900'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={!selectedSize}
                    className="rounded-lg bg-gray-900 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-40"
                >
                    Add to cart
                </button>

                {product.stock < 10 && (
                    <p className="text-xs text-amber-600">Only {product.stock} left in stock</p>
                )}
            </div>
        </div>
    )
}