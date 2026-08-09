import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { Loader2, Upload, X, ImageIcon } from 'lucide-react'
import { CREATE_PRODUCT, UPDATE_PRODUCT, UPLOAD_PRODUCT_IMAGE, GET_ADMIN_PRODUCTS } from '../features/admin/queries'
import { GET_CATEGORIES } from '../features/categories/queries'

interface ProductFormProps {
    editingProduct?: any
    onDone: () => void
}

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">{label}</label>
            {children}
        </div>
    )
}

const inputClass =
    'rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-900'

export default function ProductForm({ editingProduct, onDone }: ProductFormProps) {
    const isEditMode = !!editingProduct

    const { data: categoryData } = useQuery(GET_CATEGORIES)
    const categories = categoryData?.getCategories ?? []

    const [name, setName] = useState(editingProduct?.name ?? '')
    const [description, setDescription] = useState(editingProduct?.description ?? '')
    const [price, setPrice] = useState(editingProduct?.price?.toString() ?? '')
    const [comparePrice, setComparePrice] = useState(editingProduct?.comparePrice?.toString() ?? '')
    const [categoryId, setCategoryId] = useState(editingProduct?.category?._id ?? '')
    // const [sizes, setSizes] = useState<string[]>(editingProduct?.sizes ?? [])
    const [stock, setStock] = useState(editingProduct?.stock?.toString() ?? '')
    const [sku, setSku] = useState(editingProduct?.sku ?? '')
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [uploading, setUploading] = useState(false)
    const [formError, setFormError] = useState('')

    const [createProduct, { loading: createLoading }] = useMutation(CREATE_PRODUCT, {
        refetchQueries: [{ query: GET_ADMIN_PRODUCTS, variables: { page: 1, limit: 50 } }],
    })
    const [updateProduct, { loading: updateLoading }] = useMutation(UPDATE_PRODUCT, {
        refetchQueries: [{ query: GET_ADMIN_PRODUCTS, variables: { page: 1, limit: 50 } }],
    })
    const [uploadImage] = useMutation(UPLOAD_PRODUCT_IMAGE)

    const [sizeStocks, setSizeStocks] = useState<Record<string, number>>(
        Object.fromEntries((editingProduct?.sizes ?? []).map((s: any) => [s.size, s.stock]))
    )

    const toggleSize = (size: string) => {
        setSizeStocks((prev) => {
            const next = { ...prev }
            if (size in next) delete next[size]
            else next[size] = 0
            return next
        })
    }

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
                const result = reader.result as string
                // Strip the "data:image/xxx;base64," prefix — backend adds its own
                const base64Only = result.split(',')[1]
                resolve(base64Only)
            }
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError('')

        if (!name || !description || !price || !categoryId || sizeStocks.length === 0 || !stock) {
            setFormError('Please fill in all required fields and select at least one size.')
            return
        }

        const input = {
            name,
            description,
            price: parseFloat(price),
            comparePrice: comparePrice ? parseFloat(comparePrice) : undefined,
            category: categoryId,
            sizes: sizeStocks,
            // stock: parseInt(stock, 10),
            sku: sku || undefined,
        }

        try {
            let productId: string

            if (isEditMode) {
                const result = await updateProduct({ variables: { id: editingProduct._id, input } })
                productId = result.data.updateProduct._id
            } else {
                const result = await createProduct({ variables: { input } })
                productId = result.data.createProduct._id
            }

            if (imageFiles.length > 0) {
                setUploading(true)
                for (const file of imageFiles) {
                    const base64 = await fileToBase64(file)
                    await uploadImage({ variables: { productId, base64Image: base64 } })
                }
                setUploading(false)
            }

            onDone()
        } catch (err: any) {
            setFormError(err.message ?? 'Something went wrong.')
            setUploading(false)
        }
    }

    const isSubmitting = createLoading || updateLoading || uploading

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div>
                <h2 className="text-sm font-semibold text-gray-900">
                    {isEditMode ? 'Edit product' : 'New product'}
                </h2>
                <p className="mt-0.5 text-xs text-gray-400">Basic details shown to customers</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Field label="Product name">
                    <input
                        placeholder="e.g. Classic Cotton Shirt"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputClass}
                    />
                </Field>
                <Field label="Category">
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className={inputClass}
                    >
                        <option value="">Select category</option>
                        {categories.map((cat: any) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </Field>
            </div>

            <Field label="Description">
                <textarea
                    placeholder="Describe the product..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className={`resize-none ${inputClass}`}
                />
            </Field>

            <div className="border-t border-gray-100 pt-6">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Pricing & Inventory</h3>
                <div className="grid grid-cols-4 gap-4">
                    <Field label="Price (₹)">
                        <input type="number" placeholder="999" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Compare price (₹)">
                        <input type="number" placeholder="1299" value={comparePrice} onChange={(e) => setComparePrice(e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Stock">
                        <input type="number" placeholder="50" value={stock} onChange={(e) => setStock(e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="SKU (optional)">
                        <input placeholder="SHIRT-001" value={sku} onChange={(e) => setSku(e.target.value)} className={inputClass} />
                    </Field>
                </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Sizes</h3>
                <div className="flex gap-2">
                    {AVAILABLE_SIZES.map((size) => (
                        <button
                            key={size}
                            type="button"
                            onClick={() => toggleSize(size)}
                            className={`h-10 w-10 rounded-lg border text-xs font-semibold transition-colors ${size in sizeStocks // 👈 FIXED: Matches your toggleSize dictionary logic
                                ? 'border-gray-900 bg-gray-900 text-white'
                                : 'border-gray-200 text-gray-500 hover:border-gray-400'
                                }`}
                        >
                            {size}
                        </button>

                    ))}
                </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Images</h3>
                <p className="mb-4 text-xs text-gray-400">
                    {isEditMode ? 'New uploads are added — existing images stay.' : 'Optional — you can add images now or after creating.'}
                </p>
                <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2.5 text-sm text-gray-500 transition-colors hover:border-gray-900 hover:text-gray-900">
                    <Upload size={16} strokeWidth={1.5} />
                    Choose images
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => setImageFiles(Array.from(e.target.files ?? []))}
                        className="hidden"
                    />
                </label>
                {imageFiles.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {imageFiles.map((file, i) => (
                            <span key={i} className="flex items-center gap-1.5 rounded-full bg-gray-100 py-1.5 pl-3 pr-2 text-xs text-gray-600">
                                <ImageIcon size={12} strokeWidth={1.5} />
                                {file.name}
                                <button
                                    type="button"
                                    onClick={() => setImageFiles((prev) => prev.filter((_, idx) => idx !== i))}
                                    className="ml-0.5 rounded-full p-0.5 hover:bg-gray-200"
                                >
                                    <X size={12} strokeWidth={2} />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {formError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>
            )}

            <div className="flex gap-3 border-t border-gray-100 pt-6">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                >
                    {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                    {uploading ? 'Uploading images...' : isEditMode ? 'Update product' : 'Create product'}
                </button>
                <button type="button" onClick={onDone} className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-900">
                    Cancel
                </button>
            </div>
        </form>
    )
}