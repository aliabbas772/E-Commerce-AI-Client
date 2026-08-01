import { Star } from 'lucide-react'

interface StarRatingProps {
    value: number
    onChange?: (rating: number) => void
    size?: number
}

export default function StarRating({ value, onChange, size = 18 }: StarRatingProps) {
    const isInteractive = !!onChange

    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={!isInteractive}
                    onClick={() => onChange?.(star)}
                    className={isInteractive ? 'cursor-pointer' : 'cursor-default'}
                    tabIndex={isInteractive ? 0 : -1}
                >
                    <Star
                        size={size}
                        strokeWidth={1.5}
                        className={star <= value ? 'fill-amber-400 text-amber-400' : 'fill-none text-gray-300'}
                    />
                </button>
            ))}
        </div>
    )
}