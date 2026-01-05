import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Badge } from '../../components/ui/Elements';
import { AuditLogger, AuditAction, EntityType } from '../../services/audit/AuditLogger';
import { Search, Filter, Download, RefreshCw, Calendar, User, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface AuditLog {
    id: string;
    user_id: string;
    action: AuditAction;
    entity_type: EntityType;
    entity_id: string;
    old_data: any;
    new_data: any;
    reason: string | null;
    metadata: any;
    created_at: string;
}

export const AuditLogsPage: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEntityType, setFilterEntityType] = useState<EntityType | ''>('');
    const [filterAction, setFilterAction] = useState<AuditAction | ''>('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [expandedLog, setExpandedLog] = useState<string | null>(null);

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        setLoading(true);
        const result = await AuditLogger.query({
            entityType: filterEntityType || undefined,
            action: filterAction || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            limit: 500,
        });

        if (result.success) {
            setLogs(result.data as AuditLog[]);
        }
        setLoading(false);
    };

    const handleSearch = () => {
        loadLogs();
    };

    const handleReset = () => {
        setSearchTerm('');
        setFilterEntityType('');
        setFilterAction('');
        setStartDate('');
        setEndDate('');
        loadLogs();
    };

    const exportToCSV = () => {
        const headers = ['Timestamp', 'Action', 'Entity Type', 'Entity ID', 'User ID', 'Reason', 'Changes'];
        const rows = filteredLogs.map(log => [
            format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss'),
            log.action,
            log.entity_type,
            log.entity_id,
            log.user_id || 'system',
            log.reason || '',
            JSON.stringify({ old: log.old_data, new: log.new_data }),
        ]);

        const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
    };

    const filteredLogs = logs.filter(log => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            log.entity_id.toLowerCase().includes(search) ||
            log.action.toLowerCase().includes(search) ||
            log.entity_type.toLowerCase().includes(search) ||
            (log.reason && log.reason.toLowerCase().includes(search))
        );
    });

    const getActionBadgeColor = (action: AuditAction): string => {
        if (action.includes('CREATED')) return 'emerald';
        if (action.includes('UPDATED') || action.includes('CHANGED')) return 'blue';
        if (action.includes('DELETED') || action.includes('FAILED')) return 'red';
        if (action.includes('COMPLETED')) return 'green';
        if (action.includes('BULK')) return 'amber';
        return 'gray';
    };

    const getEntityIcon = (entityType: EntityType) => {
        switch (entityType) {
            case 'order': return '📦';
            case 'trip': return '🚚';
            case 'payment': return '💰';
            case 'user': return '👤';
            case 'product': return '📦';
            case 'customer': return '🏪';
            case 'return': return '↩️';
            case 'damage': return '⚠️';
            case 'system': return '⚙️';
            default: return '📄';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
                    <p className="text-gray-600 mt-1">Complete activity trail for all system operations</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={exportToCSV} className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </Button>
                    <Button onClick={loadLogs} className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search logs..."
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
                        <select
                            value={filterEntityType}
                            onChange={(e) => setFilterEntityType(e.target.value as EntityType | '')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Types</option>
                            <option value="order">Orders</option>
                            <option value="trip">Trips</option>
                            <option value="payment">Payments</option>
                            <option value="user">Users</option>
                            <option value="product">Products</option>
                            <option value="customer">Customers</option>
                            <option value="return">Returns</option>
                            <option value="damage">Damages</option>
                            <option value="system">System</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>

                    <div className="flex items-end gap-2">
                        <Button onClick={handleSearch} className="flex-1">
                            <Filter className="w-4 h-4 mr-2" />
                            Apply
                        </Button>
                        <Button onClick={handleReset} variant="outline">
                            Reset
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="text-sm text-gray-600">Total Logs</div>
                    <div className="text-2xl font-bold text-gray-900">{filteredLogs.length}</div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-gray-600">Today</div>
                    <div className="text-2xl font-bold text-blue-600">
                        {filteredLogs.filter(log =>
                            new Date(log.created_at).toDateString() === new Date().toDateString()
                        ).length}
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-gray-600">Errors</div>
                    <div className="text-2xl font-bold text-red-600">
                        {filteredLogs.filter(log => log.action === 'SYSTEM_ERROR').length}
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-gray-600">Bulk Operations</div>
                    <div className="text-2xl font-bold text-amber-600">
                        {filteredLogs.filter(log => log.action.includes('BULK')).length}
                    </div>
                </Card>
            </div>

            {/* Logs Table */}
            <Card className="overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading audit logs...</div>
                ) : filteredLogs.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No audit logs found</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Timestamp</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Action</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Entity</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Entity ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">User</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Reason</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase">Details</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredLogs.map((log) => (
                                    <React.Fragment key={log.id}>
                                        <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}>
                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm:ss')}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge color={getActionBadgeColor(log.action)}>
                                                    {log.action.replace(/_/g, ' ')}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className="flex items-center gap-2">
                                                    <span>{getEntityIcon(log.entity_type)}</span>
                                                    <span className="capitalize">{log.entity_type}</span>
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm font-mono text-gray-700">
                                                {log.entity_id}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {log.user_id ? log.user_id.slice(0, 8) : 'system'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {log.reason || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Button size="sm" variant="outline">
                                                    {expandedLog === log.id ? 'Hide' : 'View'}
                                                </Button>
                                            </td>
                                        </tr>
                                        {expandedLog === log.id && (
                                            <tr>
                                                <td colSpan={7} className="px-4 py-4 bg-gray-50">
                                                    <div className="space-y-3">
                                                        {log.old_data && (
                                                            <div>
                                                                <div className="text-xs font-semibold text-gray-600 mb-1">OLD DATA:</div>
                                                                <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-x-auto">
                                                                    {JSON.stringify(log.old_data, null, 2)}
                                                                </pre>
                                                            </div>
                                                        )}
                                                        {log.new_data && (
                                                            <div>
                                                                <div className="text-xs font-semibold text-gray-600 mb-1">NEW DATA:</div>
                                                                <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-x-auto">
                                                                    {JSON.stringify(log.new_data, null, 2)}
                                                                </pre>
                                                            </div>
                                                        )}
                                                        {log.metadata && (
                                                            <div>
                                                                <div className="text-xs font-semibold text-gray-600 mb-1">METADATA:</div>
                                                                <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-x-auto">
                                                                    {JSON.stringify(log.metadata, null, 2)}
                                                                </pre>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};
