import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { Loader2 } from 'lucide-react'
import { CREATE_ADDRESS, GET_MY_ADDRESSES } from '../features/addresses/queries'

interface AddressFormProps {
    onSuccess: (addressId: string) => void
    onCancel: () => void
}

export default function AddressForm({ onSuccess, onCancel }: AddressFormProps) {
    const [fullName, setFullName] = useState('')
    const [phone, setPhone] = useState('')
    const [street, setStreet] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [pincode, setPincode] = useState('')
    const [label, setLabel] = useState<'home' | 'office' | 'other'>('home')
    const [formError, setFormError] = useState('')

    const [createAddress, { loading }] = useMutation(CREATE_ADDRESS, {
        refetchQueries: [{ query: GET_MY_ADDRESSES }],
        onCompleted: (data) => {
            onSuccess(data.createAddress._id)
        },
        onError: (err) => setFormError(err.message),
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setFormError('')

        if (!fullName || !phone || !street || !city || !state || !pincode) {
            setFormError('Please fill in all fields.')
            return
        }

        createAddress({
            variables: {
                input: { fullName, phone, street, city, state, pincode, label },
            },
        })
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-2 gap-3">
                <input
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900"
                />
                <input
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900"
                />
            </div>

            <input
                placeholder="Street address"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900"
            />

            <div className="grid grid-cols-3 gap-3">
                <input
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900"
                />
                <input
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900"
                />
                <input
                    placeholder="Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900"
                />
            </div>

            <div className="flex gap-2">
                {(['home', 'office', 'other'] as const).map((opt) => (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => setLabel(opt)}
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${label === opt ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>

            {formError && <p className="text-sm text-red-600">{formError}</p>}

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                >
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    Save address
                </button>
                <button type="button" onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-900">
                    Cancel
                </button>
            </div>
        </form>
    )
}