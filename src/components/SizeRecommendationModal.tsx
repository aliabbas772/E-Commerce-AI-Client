import { useState } from 'react'
import { useLazyQuery } from '@apollo/client/react'
import { X, Sparkles, Loader2 } from 'lucide-react'
import { GET_SIZE_RECOMMENDATION } from '../features/ai/queries'

interface SizeRecommendationModalProps {
    category: string
    onClose: () => void
}

export default function SizeRecommendationModal({ category, onClose }: SizeRecommendationModalProps) {
    const [height, setHeight] = useState('')
    const [weight, setWeight] = useState('')
    const [gender, setGender] = useState('unisex')
    const [formError, setFormError] = useState('')

    const [fetchRecommendation, { data, loading, error }] = useLazyQuery(GET_SIZE_RECOMMENDATION)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setFormError('')

        if (!height || !weight) {
            setFormError('Please enter both height and weight.')
            return
        }

        fetchRecommendation({
            variables: {
                height: parseFloat(height),
                weight: parseFloat(weight),
                gender,
                category,
            },
        })
    }

    const recommendation = data?.getSizeRecommendation?.recommendation

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles size={18} strokeWidth={1.5} className="text-gray-700" />
                        <h2 className="text-sm font-semibold text-gray-900">Size assistant</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={18} strokeWidth={1.5} />
                    </button>
                </div>

                {!recommendation && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-gray-500">Height (cm)</label>
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    placeholder="170"
                                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-gray-500">Weight (kg)</label>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    placeholder="65"
                                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-500">Gender</label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-900"
                            >
                                <option value="unisex">Unisex</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        {formError && <p className="text-sm text-red-600">{formError}</p>}
                        {error && (
                            <p className="text-sm text-red-600">
                                {error.message.includes('RATE_LIMITED') || error.message.includes('Too many')
                                    ? "You've reached the limit for size suggestions right now — try again in a bit."
                                    : "Couldn't get a recommendation. Please try again."}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Thinking...
                                </>
                            ) : (
                                'Get my size'
                            )}
                        </button>
                    </form>
                )}

                {recommendation && (
                    <div className="flex flex-col gap-4">
                        <div className="rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
                            {recommendation}
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                        >
                            Got it
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}