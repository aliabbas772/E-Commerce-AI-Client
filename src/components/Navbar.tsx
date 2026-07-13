import { logout } from '@/store/slices/authSlice'
import { RootState } from '@/store/store'
import { Search, ShoppingBag, UserIcon } from 'lucide-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const cartCount = useSelector((state: RootState) =>
        state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
    )

    return (
        <nav className='sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md'>
            <div className='mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8'>
                <span className='text-lg font-semibold tracking-tight text-gray-900'>Aliy's</span>

                <div className='hidden gap-10 text-[13px] font-medium uppercase tracking-wider text-gray-500 md:flex'>
                    <a href="#" className="transition-colors hover:text-gray-900">Shop</a>
                    <a href="#" className="transition-colors hover:text-gray-900">New Arrivals</a>
                    <a href="#" className="transition-colors hover:text-gray-900">Collections</a>
                    <a href="#" className="transition-colors hover:text-gray-900">Sale</a>
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
                        <button aria-label="Account" className="hidden text-gray-500 transition-colors hover:text-gray-900 sm:block">
                            <UserIcon size={19} strokeWidth={1.5} />
                        </button>
                    )}

                    <button aria-label="Cart" className="relative text-gray-500 transition-colors hover:text-gray-900">
                        <ShoppingBag size={19} strokeWidth={1.5} />
                        <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[10px] font-medium text-white">
                            {cartCount}
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
