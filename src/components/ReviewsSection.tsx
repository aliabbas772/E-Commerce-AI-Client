import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { useSelector } from 'react-redux'
import { Loader2, Pencil, Trash2 } from 'lucide-react'
import type { RootState } from '../store/store'
import {
    GET_PRODUCT_REVIEWS,
    CREATE_REVIEW,
    UPDATE_REVIEW,
    DELETE_REVIEW,
} from '../features/reviews/queries'
import StarRating from './StarRating'

interface ReviewsSectionProps {
    productId: string
}

export default function ReviewsSection({ productId }: ReviewsSectionProps) {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

    const { data, loading, error, refetch } = useQuery(GET_PRODUCT_REVIEWS, {
        variables: { productId, page: 1, limit: 20 },
    })

    const [isEditing, setIsEditing] = useState(false)
    const [rating, setRating] = useState(0)
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [formError, setFormError] = useState('')

    const [createReview, { loading: createLoading }] = useMutation(CREATE_REVIEW, {
        onCompleted: () => {
            resetForm()
            refetch()
        },
        onError: (err) => setFormError(err.message),
    })

    const [updateReview, { loading: updateLoading }] = useMutation(UPDATE_REVIEW, {
        onCompleted: () => {
            resetForm()
            refetch()
        },
        onError: (err) => setFormError(err.message),
    })

    const [deleteReview] = useMutation(DELETE_REVIEW, {
        onCompleted: () => refetch(),
    })

    const reviews = data?.getProductReviews?.data ?? []
    const myReview = reviews.find((r: any) => r.user._id === user?._id)

    const resetForm = () => {
        setIsEditing(false)
        setRating(0)
        setTitle('')
        setBody('')
        setFormError('')
    }

    const startEdit = () => {
        if (myReview) {
            setRating(myReview.rating)
            setTitle(myReview.title)
            setBody(myReview.body)
        }
        setIsEditing(true)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setFormError('')

        if (rating === 0) {
            setFormError('Please select a rating.')
            return
        }
        if (!title.trim() || !body.trim()) {
            setFormError('Please fill in both title and review.')
            return
        }

        if (myReview) {
            updateReview({ variables: { id: myReview._id, input: { rating, title, body } } })
        } else {
            createReview({ variables: { input: { productId, rating, title, body } } })
        }
    }

    const handleDelete = () => {
        if (myReview && confirm('Delete your review?')) {
            deleteReview({ variables: { id: myReview._id } })
        }
    }

    if (loading) {
        return <p className="text-sm text-gray-500">Loading reviews...</p>
    }

    if (error) {
        return <p className="text-sm text-red-600">Failed to load reviews: {error.message}</p>
    }

    return (
        <div className="mt-16 border-t border-gray-100 pt-10">
            <h2 className="mb-6 text-lg font-semibold text-gray-900">
                Reviews {data?.getProductReviews?.totalCount ? `(${data.getProductReviews.totalCount})` : ''}
            </h2>

            {isAuthenticated && (
                <div className="mb-8 rounded-lg border border-gray-100 p-5">
                    {!isEditing && myReview ? (
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">Your review</span>
                                <div className="flex gap-3">
                                    <button
                                        onClick={startEdit}
                                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900"
                                    >
                                        <Pencil size={13} strokeWidth={1.5} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={13} strokeWidth={1.5} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <StarRating value={myReview.rating} />
                            <p className="mt-2 text-sm font-medium text-gray-900">{myReview.title}</p>
                            <p className="mt-1 text-sm text-gray-600">{myReview.body}</p>
                        </div>
                    ) : !isEditing ? (
                        <button
                            onClick={startEdit}
                            className="text-sm font-medium text-gray-900 hover:underline"
                        >
                            + Write a review
                        </button>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <StarRating value={rating} onChange={setRating} size={22} />

                            <input
                                type="text"
                                placeholder="Review title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-gray-900"
                                maxLength={100}
                            />

                            <textarea
                                placeholder="Share your thoughts about this product..."
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                rows={4}
                                className="resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-gray-900"
                                maxLength={2000}
                            />

                            {formError && <p className="text-sm text-red-600">{formError}</p>}

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={createLoading || updateLoading}
                                    className="flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {(createLoading || updateLoading) && <Loader2 size={14} className="animate-spin" />}
                                    {myReview ? 'Update review' : 'Submit review'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="text-sm text-gray-500 hover:text-gray-900"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {reviews.length === 0 ? (
                <p className="text-sm text-gray-500">No reviews yet. Be the first to share your thoughts.</p>
            ) : (
                <div className="flex flex-col gap-6">
                    {reviews
                        .filter((r: any) => r._id !== myReview?._id)
                        .map((review: any) => (
                            <div key={review._id} className="border-b border-gray-50 pb-6 last:border-0">
                                <div className="mb-1 flex items-center gap-2">
                                    <StarRating value={review.rating} />
                                    {review.isVerifiedPurchase && (
                                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                                            Verified Purchase
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm font-medium text-gray-900">{review.title}</p>
                                <p className="mt-1 text-sm text-gray-600">{review.body}</p>
                                <p className="mt-2 text-xs text-gray-400">
                                    {review.user.name} · {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                        day: 'numeric', month: 'short', year: 'numeric'
                                    })}
                                </p>
                            </div>
                        ))}
                </div>
            )}
        </div>
    )
}