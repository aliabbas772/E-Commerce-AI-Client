import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { Search, Users, Copy, Check } from 'lucide-react'
import { GET_ALL_USERS } from '../../features/admin/queries'
import { useDebounce } from '../../hooks/useDebounce'

export default function AdminUsersPage() {
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 350)
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const { data, loading } = useQuery<any>(GET_ALL_USERS, {
        variables: { search: debouncedSearch || undefined, page: 1, limit: 50 },
    })

    const users = data?.getAllUsers?.data ?? []
    const totalCount = data?.getAllUsers?.totalCount ?? 0

    const copyId = (id: string) => {
        navigator.clipboard.writeText(id)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 1500)
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Users</h1>
                <p className="mt-0.5 text-sm text-gray-400">{totalCount} user{totalCount !== 1 ? 's' : ''}</p>
            </div>

            <div className="relative mb-6 max-w-sm">
                <Search size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-gray-900"
                />
            </div>

            {loading ? (
                <p className="text-sm text-gray-500">Loading users...</p>
            ) : users.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-200 py-16">
                    <Users size={32} strokeWidth={1.2} className="text-gray-300" />
                    <p className="text-sm text-gray-500">No users found</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-100">
                    {users.map((u: any, i: number) => (
                        <div
                            key={u._id}
                            className={`flex items-center justify-between p-4 ${i !== users.length - 1 ? 'border-b border-gray-100' : ''}`}
                        >
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-gray-900">{u.name}</p>
                                    {u.role === 'admin' && (
                                        <span className="rounded-full bg-gray-900 px-2 py-0.5 text-[10px] font-medium text-white">
                                            Admin
                                        </span>
                                    )}
                                    {!u.isVerified && (
                                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                                            Unverified
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400">{u.email}</p>
                            </div>

                            <button
                                onClick={() => copyId(u._id)}
                                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:border-gray-900 hover:text-gray-900"
                            >
                                {copiedId === u._id ? (
                                    <>
                                        <Check size={12} strokeWidth={2} />
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy size={12} strokeWidth={1.5} />
                                        Copy ID
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}