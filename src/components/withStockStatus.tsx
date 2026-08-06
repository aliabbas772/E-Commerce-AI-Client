import type { ComponentType } from 'react'

interface StockAwareProps {
    stock?: number
}

export function withStockStatus<P extends StockAwareProps>(
    WrappedComponent: ComponentType<P & { isOutOfStock: boolean }>
) {
    return function WithStockStatus(props: P) {
        const isOutOfStock = (props.stock ?? 1) <= 0

        return (
            <div className="relative">
                {isOutOfStock && (
                    <span className="absolute left-2 top-2 z-10 rounded-full bg-gray-900/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-white">
                        Out of stock
                    </span>
                )}
                <WrappedComponent {...props} isOutOfStock={isOutOfStock} />
            </div>
        )
    }
}