import { Heart } from 'lucide-react'
import { useWishlist } from '../features/wishlist/useWishlist'
import ProductCard from '../components/ProductCard'

export default function WishlistPage() {
    const { products, loading } = useWishlist()

    if (loading) {
        return <p className="px-6 py-24 text-center text-sm text-gray-500">Loading wishlist...</p>
    }

    return (
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            <h1 className="mb-8 text-xl font-semibold text-gray-900">My Wishlist</h1>

            {products.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                    <Heart size={32} strokeWidth={1.2} className="text-gray-300" />
                    <p className="text-sm text-gray-500">Your wishlist is empty</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                    {products.map((product: any) => (
                        <ProductCard
                            key={product._id}
                            productId={product._id}
                            name={product.name}
                            price={product.price}
                            image={product.images?.[0] ?? ''}
                            sizes={product.sizes}
                            stock={product.stock}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}