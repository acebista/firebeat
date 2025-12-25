import React from 'react';
import { Card, Button, Select } from '../../components/ui/Elements';
import { Calendar, User, RefreshCw, UserCircle } from 'lucide-react';

export interface DeliveryReportFilters {
    startDate: string;
    endDate: string;
    deliveryUserId: string;
    salespersonId: string;
}

interface DeliveryReportFiltersProps {
    filters: DeliveryReportFilters;
    setFilters: (filters: DeliveryReportFilters) => void;
    onGenerate: () => void;
    deliveryUsers: Array<{ id: string; name: string }>;
    salesUsers: Array<{ id: string; name: string }>;
    loading?: boolean;
}

export const DeliveryReportFilters: React.FC<DeliveryReportFiltersProps> = ({
    filters,
    setFilters,
    onGenerate,
    deliveryUsers,
    salesUsers,
    loading = false
}) => {
    const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
        setFilters({ ...filters, [field]: value });
    };

    const handleDeliveryUserChange = (value: string) => {
        setFilters({ ...filters, deliveryUserId: value });
    };

    const handleSalespersonChange = (value: string) => {
        setFilters({ ...filters, salespersonId: value });
    };

    const handleClearFilters = () => {
        const today = new Date().toISOString().split('T')[0];
        setFilters({
            startDate: today,
            endDate: today,
            deliveryUserId: '',
            salespersonId: ''
        });
    };

    // Prepare delivery user options
    const deliveryUserOptions = [
        { label: 'All Delivery Users', value: '' },
        ...deliveryUsers.map(user => ({
            label: user.name,
            value: user.id
        }))
    ];

    // Prepare salesperson options
    const salespersonOptions = [
        { label: 'All Salespersons', value: '' },
        ...salesUsers.map(user => ({
            label: user.name,
            value: user.id
        }))
    ];

    return (
        <Card className="p-4">
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-indigo-600" />
                        Delivery Report Filters
                    </h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        disabled={loading}
                    >
                        Clear Filters
                    </Button>
                </div>

                {/* Filter Grid */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Start Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                            <input
                                type="date"
                                className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={filters.startDate}
                                onChange={(e) => handleDateChange('startDate', e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* End Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                            <input
                                type="date"
                                className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={filters.endDate}
                                onChange={(e) => handleDateChange('endDate', e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Delivery User Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <User className="h-4 w-4" />
                            Delivery User
                        </label>
                        <Select
                            options={deliveryUserOptions}
                            value={filters.deliveryUserId}
                            onChange={handleDeliveryUserChange}
                            disabled={loading}
                        />
                    </div>

                    {/* Salesperson Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <UserCircle className="h-4 w-4" />
                            Salesperson
                        </label>
                        <Select
                            options={salespersonOptions}
                            value={filters.salespersonId}
                            onChange={handleSalespersonChange}
                            disabled={loading}
                        />
                    </div>

                    {/* Generate Button */}
                    <div className="flex items-end">
                        <Button
                            onClick={onGenerate}
                            disabled={loading}
                            className="w-full"
                        >
                            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            {loading ? 'Loading...' : 'Generate Report'}
                        </Button>
                    </div>
                </div>

                {/* Active Filters Summary */}
                {(filters.deliveryUserId || filters.salespersonId || filters.startDate !== filters.endDate) && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                        <span className="text-xs text-gray-600 font-medium">Active Filters:</span>

                        {filters.startDate !== filters.endDate && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {new Date(filters.startDate).toLocaleDateString()} - {new Date(filters.endDate).toLocaleDateString()}
                            </span>
                        )}

                        {filters.deliveryUserId && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <User className="h-3 w-3 mr-1" />
                                {deliveryUsers.find(u => u.id === filters.deliveryUserId)?.name || 'Selected User'}
                            </span>
                        )}

                        {filters.salespersonId && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                <UserCircle className="h-3 w-3 mr-1" />
                                {salesUsers.find(u => u.id === filters.salespersonId)?.name || 'Selected Salesperson'}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
};
