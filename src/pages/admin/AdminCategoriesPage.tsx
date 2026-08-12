import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { Trash2, Loader2, Plus, FolderOpen } from 'lucide-react'
import { GET_CATEGORIES } from '../../features/categories/queries'
import { CREATE_CATEGORY, DELETE_CATEGORY } from '../../features/admin/queries'

export default function AdminCategoriesPage() {
    const { data, loading, refetch } = useQuery<any>(GET_CATEGORIES)

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [formError, setFormError] = useState('')

    const [createCategory, { loading: createLoading }] = useMutation<any>(CREATE_CATEGORY, {
        onCompleted: () => {
            setName('')
            setDescription('')
            refetch()
        },
        onError: (err) => setFormError(err.message),
    })

    const [deleteCategory] = useMutation<any>(DELETE_CATEGORY, {
        onCompleted: () => refetch(),
    })

    const categories = data?.getCategories ?? []

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setFormError('')

        if (!name.trim()) {
            setFormError('Category name is required.')
            return
        }

        createCategory({ variables: { input: { name, description: description || undefined } } })
    }

    const handleDelete = (id: string) => {
        if (confirm('Delete this category? Products using it may be affected.')) {
            deleteCategory({ variables: { id } })
        }
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Categories</h1>
                <p className="mt-0.5 text-sm text-gray-400">{categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}</p>
            </div>

            <form onSubmit={handleSubmit} className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold text-gray-900">New category</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-500">Name</label>
                        <input
                            placeholder="e.g. T-Shirts"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-gray-900"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-500">Description (optional)</label>
                        <input
                            placeholder="Short description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-gray-900"
                        />
                    </div>
                </div>
                {formError && <p className="mt-3 text-sm text-red-600">{formError}</p>}
                <button
                    type="submit"
                    disabled={createLoading}
                    className="mt-4 flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                >
                    {createLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={16} strokeWidth={1.5} />}
                    Add category
                </button>
            </form>

            {loading ? (
                <p className="text-sm text-gray-500">Loading categories...</p>
            ) : categories.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-200 py-16">
                    <FolderOpen size={32} strokeWidth={1.2} className="text-gray-300" />
                    <p className="text-sm text-gray-500">No categories yet — add one above</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-100">
                    {categories.map((cat: any, i: number) => (
                        <div
                            key={cat._id}
                            className={`flex items-center justify-between p-4 transition-colors hover:bg-gray-50 ${i !== categories.length - 1 ? 'border-b border-gray-100' : ''
                                }`}
                        >
                            <div>
                                <p className="text-sm font-medium text-gray-900">{cat.name}</p>
                                <p className="text-xs text-gray-400">/{cat.slug}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(cat._id)}
                                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                            >
                                <Trash2 size={16} strokeWidth={1.5} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}