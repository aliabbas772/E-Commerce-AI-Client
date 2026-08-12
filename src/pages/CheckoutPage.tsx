import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { MapPin, Loader2 } from 'lucide-react'
import type { RootState } from '../store/store'
import { clearCart } from '../store/slices/cartSlice'
import { CREATE_ORDER, VERIFY_PAYMENT } from '../features/checkout/queries'
import { GET_MY_ADDRESSES } from '../features/addresses/queries'
import { loadRazorpayScript } from '../lib/loadRazorpay'
import AddressForm from '../components/AddressForm'
import { useCart } from '@/features/cart/useCart'
import { GET_MY_CART } from '@/features/cart/queries'

declare global {
    interface Window {
        Razorpay: any
    }
}

export default function CheckoutPage() {
    // const items = useSelector((state: RootState) => state.cart.items)
    const user = useSelector((state: RootState) => state.auth.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { items, subtotal } = useCart()

    const { data: addressData, loading: addressLoading } = useQuery<any>(GET_MY_ADDRESSES)

    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const [createOrder] = useMutation<any>(CREATE_ORDER)
    const [verifyPayment] = useMutation<any>(VERIFY_PAYMENT)

    const addresses = addressData?.getMyAddresses ?? []

    // Auto-select the default address once addresses load, if nothing's selected yet
    if (!selectedAddressId && addresses.length > 0 && !showAddForm) {
        const defaultAddr = addresses.find((a: any) => a.isDefault) ?? addresses[0]
        setSelectedAddressId(defaultAddr._id)
    }

    // const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const handleAddressCreated = (newAddressId: string) => {
        setSelectedAddressId(newAddressId)
        setShowAddForm(false)
    }

    const handlePayment = async () => {
        if (!selectedAddressId) {
            setErrorMsg('Please select or add a delivery address.')
            return
        }
        setErrorMsg('')
        setProcessing(true)

        const scriptLoaded = await loadRazorpayScript()
        if (!scriptLoaded) {
            setErrorMsg('Razorpay failed to load. Check your connection.')
            setProcessing(false)
            return
        }

        try {
            const { data } = await createOrder({
                variables: {
                    items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, size: i.size })),
                    addressId: selectedAddressId,
                },
            })

            const order = data.createOrder

            const razorpay = new window.Razorpay({
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                order_id: order.razorpayOrderId,
                name: 'EcommerceAI',
                prefill: { name: user?.name, email: user?.email },
                handler: async (response: any) => {
                    const result = await verifyPayment({
                        variables: {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        },
                        refetchQueries: [{ query: GET_MY_CART }],
                    })
                    if (result.data.verifyPayment.message) {
                        navigate('/')
                    }
                },
                modal: { ondismiss: () => setProcessing(false) },
            })

            razorpay.open()
        } catch (err: any) {
            setErrorMsg(err.message ?? 'Something went wrong.')
        } finally {
            setProcessing(false)
        }
    }

    return (
        <div className="mx-auto max-w-md px-6 py-16">
            <h1 className="mb-6 text-xl font-semibold text-gray-900">Checkout</h1>

            <h2 className="mb-3 text-sm font-medium text-gray-900">Delivery address</h2>

            {addressLoading ? (
                <p className="text-sm text-gray-500">Loading addresses...</p>
            ) : (
                <div className="mb-4 flex flex-col gap-3">
                    {addresses.map((addr: any) => (
                        <button
                            key={addr._id}
                            onClick={() => setSelectedAddressId(addr._id)}
                            className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-colors ${selectedAddressId === addr._id
                                ? 'border-gray-900 bg-gray-50'
                                : 'border-gray-200 hover:border-gray-400'
                                }`}
                        >
                            <MapPin size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-gray-400" />
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-900">{addr.fullName}</span>
                                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium capitalize text-gray-500">
                                        {addr.label}
                                    </span>
                                    {addr.isDefault && (
                                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                                            Default
                                        </span>
                                    )}
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    {addr.street}, {addr.city}, {addr.state} {addr.pincode}
                                </p>
                                <p className="text-xs text-gray-500">{addr.phone}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {showAddForm ? (
                <div className="mb-6">
                    <AddressForm onSuccess={handleAddressCreated} onCancel={() => setShowAddForm(false)} />
                </div>
            ) : (
                <button
                    onClick={() => setShowAddForm(true)}
                    className="mb-6 text-sm font-medium text-gray-900 hover:underline"
                >
                    + Add new address
                </button>
            )}

            <div className="mb-6 flex justify-between border-t border-gray-100 pt-4 text-base font-semibold text-gray-900">
                <span>Total</span>
                <span>₹{subtotal}</span>
            </div>

            {errorMsg && <p className="mb-4 text-sm text-red-600">{errorMsg}</p>}

            <button
                onClick={handlePayment}
                disabled={processing || items.length === 0}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-40"
            >
                {processing && <Loader2 size={16} className="animate-spin" />}
                {processing ? 'Processing...' : 'Pay Now'}
            </button>
        </div>
    )
}