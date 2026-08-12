import { useState, useRef, useEffect } from 'react'
import { Search, User as UserIcon, ShoppingBag, ChevronDown, Package, LogOut, Heart, Sparkles } from 'lucide-react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useMutation, useQuery } from '@apollo/client/react'
import type { RootState } from '../store/store'
import { logout } from '../store/slices/authSlice'
import { GET_CATEGORIES } from '../features/categories/queries'
import { LOGOUT } from '@/features/auth/queries'
import { useCart } from '@/features/cart/useCart'
import SearchBar from './SearchBar'
import NotificationBell from './NotificationBell'

export default function Navbar() {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { itemCount } = useCart()

    const [logoutMutation] = useMutation(LOGOUT)
    const { data } = useQuery(GET_CATEGORIES)
    const contextData = data as { getCategories?: () => any[] };
    // const categories = contextData?.getCategories?.() ?? [];
    const categories = typeof contextData?.getCategories === 'function'
        ? contextData.getCategories()
        : [];

    const [searchParams] = useSearchParams()
    const activeCategory = searchParams.get('category')

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = async () => {
        try {
            await logoutMutation()
        } catch (err) {
            // Even if the server call fails (e.g. offline, expired token),
            // we still want to log the user out locally below.
            console.error('Logout mutation failed:', err)
        }
        dispatch(logout())
        setDropdownOpen(false)
        navigate('/')
    }

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
                            to={`/?category=${cat._id}`}
                            className={`transition-colors hover:text-gray-900 ${activeCategory === cat._id ? 'text-gray-900' : ''}`}
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-6">
                    <SearchBar />
                    <NotificationBell />

                    {isAuthenticated ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen((prev) => !prev)}
                                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
                            >
                                <span className="hidden sm:block">Hi, {user?.name}</span>
                                <UserIcon size={19} strokeWidth={1.5} className="sm:hidden" />
                                <ChevronDown size={14} strokeWidth={1.5} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-44 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
                                    <Link
                                        to="/account/orders"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <Package size={15} strokeWidth={1.5} />
                                        My Orders
                                    </Link>
                                    <Link
                                        to="/account/wishlist"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <Heart size={15} strokeWidth={1.5} />
                                        My Wishlist
                                    </Link>
                                    <Link
                                        to="/outfit-advisor"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <Sparkles size={15} strokeWidth={1.5} />
                                        Outfit Advisor
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <LogOut size={15} strokeWidth={1.5} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" aria-label="Account" className="hidden text-gray-500 transition-colors hover:text-gray-900 sm:block">
                            <UserIcon size={19} strokeWidth={1.5} />
                        </Link>
                    )}

                    <Link to="/cart" aria-label="Cart" className="relative text-gray-500 transition-colors hover:text-gray-900">
                        <ShoppingBag size={19} strokeWidth={1.5} />
                        {itemCount > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[10px] font-medium text-white">
                                {itemCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    )
}