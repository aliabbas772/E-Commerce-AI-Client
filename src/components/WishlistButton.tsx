import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useWishlist } from '../features/wishlist/useWishlist'

interface WishlistButtonProps {
    productId: string
    size?: number
    className?: string
}

export default function WishlistButton({ productId, size = 18, className = '' }: WishlistButtonProps) {
    const { isWishlisted, toggle, isAuthenticated } = useWishlist()
    const navigate = useNavigate()

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!isAuthenticated) {
            navigate('/login')
            return
        }
        toggle(productId)
    }

    const wishlisted = isWishlisted(productId)

    return (
        <button
            onClick={handleClick}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`transition-colors ${className}`}
        >
            <Heart
                size={size}
                strokeWidth={1.5}
                className={wishlisted ? 'fill-red-500 text-red-500' : 'fill-none text-gray-400 hover:text-gray-600'}
            />
        </button>
    )
}