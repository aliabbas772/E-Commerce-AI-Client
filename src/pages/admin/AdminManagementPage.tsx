import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { Loader2, ShieldCheck, ShieldOff, ChevronDown } from 'lucide-react'
import {
    GET_ALL_ADMINS,
    CREATE_ADMIN,
    UPDATE_ADMIN_PERMISSIONS,
    DEACTIVATE_ADMIN,
} from '../../features/admin-management/queries'

const ALL_PERMISSIONS = [
    'manage_products',
    'manage_categories',
    'manage_orders',
    'manage_users',
    'manage_reviews',
    'issue_refunds',
    'view_analytics',
    'manage_admins',
]

export default function AdminManagementPage() {
    const { data, loading, refetch } = useQuery<any>(GET_ALL_ADMINS)

    const [userId, setUserId] = useState('')
    const [newPermissions, setNewPermissions] = useState<string[]>([
        'manage_products',
        'manage_orders',
        'view_analytics',
    ])
    const [formError, setFormError] = useState('')
    const [expandedAdminId, setExpandedAdminId] = useState<string | null>(null)

    const [createAdmin, { loading: createLoading }] = useMutation(CREATE_ADMIN, {
        onCompleted: () => {
            setUserId('')
            refetch()
        },
        onError: (err) => setFormError(err.message),
    })

    const [updateAdminPermissions] = useMutation(UPDATE_ADMIN_PERMISSIONS, {
        onCompleted: () => refetch(),
    })

    const [deactivateAdmin] = useMutation(DEACTIVATE_ADMIN, {
        onCompleted: () => refetch(),
    })

    const admins = data?.getAllAdmins ?? []

    const togglePermission = (perm: string) => {
        setNewPermissions((prev) =>
            prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
        )
    }

    const handleCreateAdmin = (e: React.FormEvent) => {
        e.preventDefault()
        setFormError('')

        if (!userId.trim()) {
            setFormError('Please enter a user ID.')
            return
        }
        if (newPermissions.length === 0) {
            setFormError('Select at least one permission.')
            return
        }

        createAdmin({ variables: { userId: userId.trim(), permissions: newPermissions } })
    }

    const togglePermissionForAdmin = (admin: any, perm: string) => {
        const has = admin.permissions.includes(perm)
        const updated = has
            ? admin.permissions.filter((p: string) => p !== perm)
            : [...admin.permissions, perm]
        updateAdminPermissions({ variables: { adminId: admin._id, permissions: updated } })
    }

    const handleDeactivate = (adminId: string) => {
        if (confirm('Deactivate this admin? They will lose admin access immediately.')) {
            deactivateAdmin({ variables: { adminId } })
        }
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Admin Management</h1>
                <p className="mt-0.5 text-sm text-gray-400">{admins.length} admin{admins.length !== 1 ? 's' : ''}</p>
            </div>

            <form onSubmit={handleCreateAdmin} className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-1 text-sm font-semibold text-gray-900">Promote a user to admin</h2>
                <p className="mb-4 text-xs text-gray-400">
                    Paste the target user's ID — a "search by email" option can be added once a Users list page exists.
                </p>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">User ID</label>
                    <input
                        placeholder="Mongo _id of the user"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-gray-900"
                    />
                </div>

                <div className="mt-4">
                    <span className="mb-2 block text-xs font-medium text-gray-500">Permissions</span>
                    <div className="flex flex-wrap gap-2">
                        {ALL_PERMISSIONS.map((perm) => (
                            <button
                                key={perm}
                                type="button"
                                onClick={() => togglePermission(perm)}
                                className={`rounded-full px-3 py-1.5 text-xs font-medium ${newPermissions.includes(perm)
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-500'
                                    }`}
                            >
                                {perm.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {formError && <p className="mt-3 text-sm text-red-600">{formError}</p>}

                <button
                    type="submit"
                    disabled={createLoading}
                    className="mt-4 flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                >
                    {createLoading && <Loader2 size={14} className="animate-spin" />}
                    Grant admin access
                </button>
            </form>

            {loading ? (
                <p className="text-sm text-gray-500">Loading admins...</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {admins.map((admin: any) => (
                        <div key={admin._id} className="rounded-xl border border-gray-100 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {admin.isActive ? (
                                        <ShieldCheck size={18} strokeWidth={1.5} className="text-emerald-600" />
                                    ) : (
                                        <ShieldOff size={18} strokeWidth={1.5} className="text-gray-300" />
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{admin.user.name}</p>
                                        <p className="text-xs text-gray-400">{admin.user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setExpandedAdminId(expandedAdminId === admin._id ? null : admin._id)}
                                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900"
                                    >
                                        Permissions
                                        <ChevronDown size={14} className={`transition-transform ${expandedAdminId === admin._id ? 'rotate-180' : ''}`} />
                                    </button>
                                    {admin.isActive && (
                                        <button
                                            onClick={() => handleDeactivate(admin._id)}
                                            className="text-xs font-medium text-red-500 hover:text-red-700"
                                        >
                                            Deactivate
                                        </button>
                                    )}
                                </div>
                            </div>

                            {expandedAdminId === admin._id && (
                                <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                                    {ALL_PERMISSIONS.map((perm) => (
                                        <button
                                            key={perm}
                                            onClick={() => togglePermissionForAdmin(admin, perm)}
                                            className={`rounded-full px-3 py-1.5 text-xs font-medium ${admin.permissions.includes(perm)
                                                ? 'bg-gray-900 text-white'
                                                : 'bg-gray-100 text-gray-500'
                                                }`}
                                        >
                                            {perm.replace('_', ' ')}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}