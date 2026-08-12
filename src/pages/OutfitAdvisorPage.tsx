import { useState } from 'react'
import { useLazyQuery } from '@apollo/client/react'
import { Sparkles, Loader2 } from 'lucide-react'
import { GET_OUTFIT_RECOMMENDATION } from '../features/ai/queries'

export default function OutfitAdvisorPage() {
    const [occasion, setOccasion] = useState('')
    const [budget, setBudget] = useState('')
    const [gender, setGender] = useState('unisex')
    const [formError, setFormError] = useState('')

    const [fetchRecommendation, { data, loading, error }] = useLazyQuery<any>(GET_OUTFIT_RECOMMENDATION)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setFormError('')

        if (!occasion.trim() || !budget) {
            setFormError('Please fill in the occasion and budget.')
            return
        }

        fetchRecommendation({
            variables: { occasion: occasion.trim(), budget: parseFloat(budget), gender },
        })
    }

    const recommendation = data?.getOutfitRecommendation?.recommendation

    return (
        <div className="mx-auto max-w-lg px-6 py-16">
            <div className="mb-8 text-center">
                <div className="mb-3 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900">
                        <Sparkles size={20} strokeWidth={1.5} className="text-white" />
                    </div>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Outfit Advisor</h1>
                <p className="mt-1 text-sm text-gray-500">Tell us the occasion, we'll suggest a look</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">Occasion</label>
                    <input
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        placeholder="e.g. wedding guest, weekend brunch, job interview"
                        className="rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-gray-900"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-500">Budget (₹)</label>
                        <input
                            type="number"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            placeholder="3000"
                            className="rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-gray-900"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-500">Gender</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-gray-900"
                        >
                            <option value="unisex">Unisex</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                </div>

                {formError && <p className="text-sm text-red-600">{formError}</p>}
                {error && (
                    <p className="text-sm text-red-600">
                        {error.message.includes('RATE_LIMITED') || error.message.includes('Too many')
                            ? "You've hit the limit for outfit suggestions right now — try again in a bit."
                            : "Couldn't get a recommendation. Please try again."}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Styling your look...
                        </>
                    ) : (
                        'Get recommendation'
                    )}
                </button>
            </form>

            {recommendation && (
                <div className="mt-6 rounded-lg border border-gray-100 bg-gray-50 p-5 text-sm leading-relaxed text-gray-700">
                    {recommendation}
                </div>
            )}
        </div>
    )
}