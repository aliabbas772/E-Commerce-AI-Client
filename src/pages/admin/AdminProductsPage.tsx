import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { Pencil, Trash2, Plus, PackageOpen } from 'lucide-react'
import { GET_ADMIN_PRODUCTS, DELETE_PRODUCT } from '../../features/admin/queries'
import ProductForm from '../../components/ProductForm'

export default function AdminProductsPage() {
    const { data, loading, refetch } = useQuery(GET_ADMIN_PRODUCTS, {
        variables: { page: 1, limit: 50 },
    })

    const [deleteProduct] = useMutation(DELETE_PRODUCT, {
        onCompleted: () => refetch(),
    })

    const [showForm, setShowForm] = useState(false)
    const [editingProduct, setEditingProduct] = useState<any>(null)

    const products = data?.getProducts?.data ?? []

    const handleDelete = (id: string) => {
        if (confirm('Delete this product? This cannot be undone.')) {
            deleteProduct({ variables: { id } })
        }
    }

    const handleFormDone = () => {
        setShowForm(false)
        setEditingProduct(null)
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Products</h1>
                    <p className="mt-0.5 text-sm text-gray-400">{products.length} product{products.length !== 1 ? 's' : ''}</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                    >
                        <Plus size={16} strokeWidth={1.5} />
                        Add product
                    </button>
                )}
            </div>

            {showForm && (
                <div className="mb-8">
                    <ProductForm editingProduct={editingProduct} onDone={handleFormDone} />
                </div>
            )}

            {loading ? (
                <p className="text-sm text-gray-500">Loading products...</p>
            ) : products.length === 0 && !showForm ? (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-200 py-16">
                    <PackageOpen size={32} strokeWidth={1.2} className="text-gray-300" />
                    <p className="text-sm text-gray-500">No products yet</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="text-sm font-medium text-gray-900 hover:underline"
                    >
                        Add your first product
                    </button>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-100">
                    {products.map((product: any, i: number) => (
                        <div
                            key={product._id}
                            className={`flex items-center justify-between p-4 transition-colors hover:bg-gray-50 ${i !== products.length - 1 ? 'border-b border-gray-100' : ''
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                {product.images?.[0] ? (
                                    <img src={product.images[0]} alt={product.name} className="h-14 w-14 rounded-lg object-cover" />
                                ) : (
                                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-50">
                                        <PackageOpen size={18} strokeWidth={1.2} className="text-gray-300" />
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                                        <span>{product.category?.name ?? 'Uncategorized'}</span>
                                        <span>·</span>
                                        <span className="font-medium text-gray-600">₹{product.price}</span>
                                        <span>·</span>
                                        <span className={product.stock < 10 ? 'text-amber-600' : ''}>
                                            {product.stock} in stock
                                        </span>
                                        {!product.isActive && (
                                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => {
                                        setEditingProduct(product)
                                        setShowForm(true)
                                    }}
                                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
                                >
                                    <Pencil size={16} strokeWidth={1.5} />
                                </button>
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                >
                                    <Trash2 size={16} strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}