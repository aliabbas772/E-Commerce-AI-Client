import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { GET_PRODUCT_BY_ID } from '../features/products/queries'
import ReviewsSection from '../components/ReviewsSection'
import { useAddToCart } from '@/features/cart/useAddToCart'
import WishlistButton from '@/components/WishlistButton'
import { Sparkles } from 'lucide-react'
import SizeRecommendationModal from '../components/SizeRecommendationModal'

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>()
    const [selectedSize, setSelectedSize] = useState<string | null>(null)
    const [activeImage, setActiveImage] = useState(0)
    const [showSizeHelper, setShowSizeHelper] = useState(false)

    const addToCart = useAddToCart()

    const { data, loading, error } = useQuery<any>(GET_PRODUCT_BY_ID, {
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

        addToCart({
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            size: selectedSize,
        })

    }

    return (
        <div className="mx-auto max-w-5xl px-6 py-12">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
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
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
                            <p className="mt-2 text-lg font-semibold text-gray-900">₹{product.price}</p>
                        </div>
                        <WishlistButton productId={product._id} size={22} />
                    </div>

                    <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">Size</span>
                            <button
                                onClick={() => setShowSizeHelper(true)}
                                className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900"
                            >
                                <Sparkles size={13} strokeWidth={1.5} />
                                Not sure? Get help
                            </button>
                        </div>
                        <div className="flex gap-2">
                            {product.sizes.map((item: any) => (
                                <button
                                    key={item.size}
                                    disabled={item.stock === 0}
                                    onClick={() => setSelectedSize(item.size)}
                                    className={`h-10 w-10 rounded-md border text-sm font-medium ${selectedSize === item.size
                                            ? 'border-gray-900 bg-gray-900 text-white'
                                            : 'border-gray-300 text-gray-700 hover:border-gray-900'
                                        } ${item.stock === 0
                                            ? 'cursor-not-allowed opacity-40'
                                            : 'hover:border-gray-900'
                                        }`}
                                >
                                    {item.size}
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

            <ReviewsSection productId={product._id} />

            {showSizeHelper && (
                <SizeRecommendationModal
                    category={product.category?.name ?? ''}
                    onClose={() => setShowSizeHelper(false)}
                />
            )}
        </div>
    )
}