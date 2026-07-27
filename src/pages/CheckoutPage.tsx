import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { RootState } from '../store/store'
import { clearCart } from '../store/slices/cartSlice'
import { CREATE_ORDER, VERIFY_PAYMENT } from '../features/checkout/queries'
import { loadRazorpayScript } from '../lib/loadRazorpay'

declare global {
    interface Window {
        Razorpay: any
    }
}

export default function CheckoutPage() {
    const items = useSelector((state: RootState) => state.cart.items)
    const user = useSelector((state: RootState) => state.auth.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [addressId, setAddressId] = useState('')
    const [processing, setProcessing] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const [createOrder] = useMutation(CREATE_ORDER)
    const [verifyPayment] = useMutation(VERIFY_PAYMENT)

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const handlePayment = async () => {
        if (!addressId) {
            setErrorMsg('Please enter an address ID.')
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
                    addressId,
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
                    })
                    if (result.data.verifyPayment.message) {
                        dispatch(clearCart())
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

            <label className="text-sm font-medium text-gray-900">Address ID (temporary — real address form comes later)</label>
            <input
                value={addressId}
                onChange={(e) => setAddressId(e.target.value)}
                placeholder="Paste a valid address _id from your DB"
                className="mt-2 mb-4 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-900"
            />

            <div className="mb-6 flex justify-between text-base font-semibold text-gray-900">
                <span>Total</span>
                <span>₹{subtotal}</span>
            </div>

            {errorMsg && <p className="mb-4 text-sm text-red-600">{errorMsg}</p>}

            <button
                onClick={handlePayment}
                disabled={processing || items.length === 0}
                className="w-full rounded-lg bg-gray-900 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-40"
            >
                {processing ? 'Processing...' : 'Pay Now'}
            </button>
        </div>
    )
}