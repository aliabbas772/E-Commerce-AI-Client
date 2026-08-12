import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { SearchX } from 'lucide-react'
import { SEARCH_PRODUCTS } from '../features/search/queries'
import ProductCard from '../components/ProductCard'

export default function SearchResultsPage() {
    const [searchParams] = useSearchParams()
    const query = searchParams.get('q') ?? ''

    const { data, loading, error } = useQuery<any>(SEARCH_PRODUCTS, {
        variables: { query, page: 1, limit: 24 },
        skip: !query,
    })

    if (loading) {
        return <p className="px-6 py-24 text-center text-sm text-gray-500">Searching...</p>
    }

    if (error) {
        return <p className="px-6 py-24 text-center text-sm text-red-600">Search failed: {error.message}</p>
    }

    const products = data?.searchProducts?.data ?? []
    const totalCount = data?.searchProducts?.totalCount ?? 0

    return (
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            <h1 className="mb-1 text-xl font-semibold text-gray-900">
                Results for "{query}"
            </h1>
            <p className="mb-8 text-sm text-gray-400">
                {totalCount} product{totalCount !== 1 ? 's' : ''} found
            </p>

            {products.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                    <SearchX size={32} strokeWidth={1.2} className="text-gray-300" />
                    <p className="text-sm text-gray-500">
                        No products matched "{query}"
                    </p>
                    <p className="text-xs text-gray-400">
                        Try a different search term or check your spelling
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                    {products.map((product: any) => (
                        <ProductCard
                            key={product._id}
                            productId={product._id}
                            name={product.name}
                            price={product.price}
                            image={product.images?.[0] ?? ''}
                            sizes={product.sizes}
                            stock={product.stock}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}