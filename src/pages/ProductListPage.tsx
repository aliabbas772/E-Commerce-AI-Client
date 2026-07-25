import ProductCard from '@/components/ProductCard';
import { GET_PRODUCTS } from '@/features/products/queries'
import { useQuery } from '@apollo/client/react'
import React from 'react'

const ProductListPage = () => {
    const { data, loading, error } = useQuery(GET_PRODUCTS, {
        variables: { page: 1, limit: 12 }
    });

    if (loading) {
        return <p className="px-6 py-12 text-center text-sm text-gray-500">Loading products...</p>
    }

    if (error) {
        return <p className="px-6 py-12 text-center text-sm text-red-600">Failed to load products: {error.message}</p>
    }

    const products = data?.getProducts?.data ?? []

    return (
        <div className="mx-auto max-w-6xl px-6 py-12">
            <h1 className="mb-8 text-xl font-semibold text-gray-900">All Products</h1>

            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((product: any) => (
                    <ProductCard
                        key={product._id}
                        productId={product._id}
                        name={product.name}
                        price={product.price}
                        image={product.images[0]}
                        sizes={product.sizes}
                    />
                ))}
            </div>
        </div>
    )
}

export default ProductListPage
