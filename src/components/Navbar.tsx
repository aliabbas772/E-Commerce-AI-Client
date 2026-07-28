import { Search, User as UserIcon, ShoppingBag } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useQuery } from '@apollo/client/react'
import type { RootState } from '../store/store'
import { logout } from '../store/slices/authSlice'
import { GET_CATEGORIES } from '../features/categories/queries'

export default function Navbar() {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
    const cartCount = useSelector((state: RootState) =>
        state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
    )
    const dispatch = useDispatch()

    const { data } = useQuery(GET_CATEGORIES)
    const categories = data?.getCategories ?? []
    console.log(categories)

    const [searchParams] = useSearchParams()
    const activeCategory = searchParams.get('category')

    return (
        <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
                <Link to="/" className="text-lg font-semibold tracking-tight text-gray-900">
                    Ecommerce<span className="text-gray-400">AI</span>
                </Link>

                <div className="hidden gap-10 text-[13px] font-medium uppercase tracking-wider text-gray-500 md:flex">
                    <Link
                        to="/"
                        className={`transition-colors hover:text-gray-900 ${!activeCategory ? 'text-gray-900' : ''}`}
                    >
                        Shop
                    </Link>
                    {categories.map((cat: any) => (
                        <Link
                            key={cat._id}
                            to={`/products?category=${cat._id}`}
                            className={`transition-colors hover:text-gray-900 ${activeCategory === cat._id ? 'text-gray-900' : ''}`}
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-6">
                    <button aria-label="Search" className="text-gray-500 transition-colors hover:text-gray-900">
                        <Search size={19} strokeWidth={1.5} />
                    </button>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <span className="hidden text-sm font-medium text-gray-700 sm:block">
                                Hi, {user?.name}
                            </span>
                            <button
                                onClick={() => dispatch(logout())}
                                className="text-sm font-medium text-gray-500 hover:text-gray-900"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" aria-label="Account" className="hidden text-gray-500 transition-colors hover:text-gray-900 sm:block">
                            <UserIcon size={19} strokeWidth={1.5} />
                        </Link>
                    )}

                    <Link to="/cart" aria-label="Cart" className="relative text-gray-500 transition-colors hover:text-gray-900">
                        <ShoppingBag size={19} strokeWidth={1.5} />
                        {cartCount > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[10px] font-medium text-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    )
}