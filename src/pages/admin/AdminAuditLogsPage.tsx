import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ScrollText, Plus, Pencil, Trash2, Ban } from 'lucide-react'
import { GET_ALL_ADMINS, GET_AUDIT_LOGS } from '../../features/admin-management/queries'

const actionIcon: Record<string, any> = {
    CREATE: Plus,
    UPDATE: Pencil,
    DELETE: Trash2,
    DEACTIVATE: Ban,
}

const actionColor: Record<string, string> = {
    CREATE: 'text-emerald-600 bg-emerald-50',
    UPDATE: 'text-blue-600 bg-blue-50',
    DELETE: 'text-red-600 bg-red-50',
    DEACTIVATE: 'text-amber-600 bg-amber-50',
}

export default function AdminAuditLogsPage() {
    const { data: adminsData, loading: adminsLoading } = useQuery(GET_ALL_ADMINS)
    const [selectedAdminId, setSelectedAdminId] = useState('')

    const admins = adminsData?.getAllAdmins ?? []

    const { data: logsData, loading: logsLoading } = useQuery(GET_AUDIT_LOGS, {
        variables: { adminId: selectedAdminId, page: 1, limit: 100 },
        skip: !selectedAdminId,
    })

    const logs = logsData?.getAuditLogs ?? []

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Audit Logs</h1>
                <p className="mt-0.5 text-sm text-gray-400">Action history per admin</p>
            </div>

            <div className="mb-6">
                <label className="mb-1.5 block text-xs font-medium text-gray-500">Select admin</label>
                <select
                    value={selectedAdminId}
                    onChange={(e) => setSelectedAdminId(e.target.value)}
                    className="w-full max-w-sm rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-gray-900"
                    disabled={adminsLoading}
                >
                    <option value="">Select an admin...</option>
                    {admins.map((admin: any) => (
                        <option key={admin._id} value={admin._id}>
                            {admin.user.name} ({admin.user.email})
                        </option>
                    ))}
                </select>
            </div>

            {!selectedAdminId ? (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-200 py-16">
                    <ScrollText size={32} strokeWidth={1.2} className="text-gray-300" />
                    <p className="text-sm text-gray-500">Select an admin to view their activity</p>
                </div>
            ) : logsLoading ? (
                <p className="text-sm text-gray-500">Loading logs...</p>
            ) : logs.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-200 py-16">
                    <ScrollText size={32} strokeWidth={1.2} className="text-gray-300" />
                    <p className="text-sm text-gray-500">No activity recorded yet</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-100">
                    {logs.map((log: any, i: number) => {
                        const Icon = actionIcon[log.action] ?? ScrollText
                        const colorClass = actionColor[log.action] ?? 'text-gray-600 bg-gray-50'

                        return (
                            <div
                                key={i}
                                className={`flex items-center gap-4 p-4 ${i !== logs.length - 1 ? 'border-b border-gray-100' : ''}`}
                            >
                                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${colorClass}`}>
                                    <Icon size={16} strokeWidth={1.5} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900">
                                        <span className="font-medium">{log.action}</span>
                                        {' '}
                                        <span className="text-gray-500">{log.entity}</span>
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        ID: {log.entityId} {log.ip && `· IP: ${log.ip}`}
                                    </p>
                                </div>
                                <p className="shrink-0 text-xs text-gray-400">
                                    {new Date(log.timestamp).toLocaleDateString('en-IN', {
                                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}