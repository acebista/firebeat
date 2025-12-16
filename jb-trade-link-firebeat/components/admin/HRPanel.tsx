/**
 * HR & Compensation Panel
 * Displays commission calculations and compensation tracking
 * Commission rate management moved to Company page
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select } from '../ui/Elements';
import { UserCompensationService } from '../../services/hr';
import { SalesServiceExtended } from '../../services/hr-extended';
import { CompensationDetail } from '../../types/hr-extended';
import { formatCurrency } from '../../utils/commissionCalculator';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { format, startOfMonth, endOfMonth } from 'date-fns';

interface CompensationDetailState extends CompensationDetail {
  // Extend if needed for UI-specific properties
}

interface HRPanelState {
  startDate: string;
  endDate: string;
  selectedSalesperson: string | null;
  activeOnly: boolean;
  compensationData: CompensationDetailState[];
  loading: boolean;
  error: string | null;
}

const HRPanel: React.FC = () => {
  const [state, setState] = useState<HRPanelState>({
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    selectedSalesperson: null,
    activeOnly: true,
    compensationData: [],
    loading: false,
    error: null,
  });

  const [salespeople, setSalespeople] = useState<any[]>([]);

  // Load salespeople on mount
  useEffect(() => {
    loadSalespeople();
  }, []);

  // Load compensation data when filters change
  useEffect(() => {
    if (state.startDate && state.endDate) {
      loadCompensationData();
    }
  }, [state.startDate, state.endDate, state.selectedSalesperson, state.activeOnly]);

  const loadSalespeople = async () => {
    try {
      const people = await UserCompensationService.getSalespeople();
      setSalespeople(people);
    } catch (error) {
      console.error('Error loading salespeople:', error);
      toast.error('Failed to load salespeople');
    }
  };

  const loadCompensationData = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      // Filter salespeople based on selection and active status
      let peopleToProcess = salespeople;
      if (state.selectedSalesperson) {
        peopleToProcess = salespeople.filter((p) => p.id === state.selectedSalesperson);
      }
      if (state.activeOnly) {
        peopleToProcess = peopleToProcess.filter((p) => p.isActive);
      }

      if (peopleToProcess.length === 0) {
        setState((prev) => ({
          ...prev,
          compensationData: [],
          loading: false,
        }));
        return;
      }

      // Use extended service to calculate compensation for all selected people
      const userIds = peopleToProcess.map((p) => p.id);
      const { compensations } = await SalesServiceExtended.calculateBulkCompensation(
        userIds,
        state.startDate,
        state.endDate
      );

      setState((prev) => ({
        ...prev,
        compensationData: compensations,
        loading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load compensation data';
      setState((prev) => ({ ...prev, error: message, loading: false }));
      toast.error(message);
    }
  };

  const handleStartDateChange = (date: string) => {
    setState((prev) => ({ ...prev, startDate: date }));
  };

  const handleEndDateChange = (date: string) => {
    setState((prev) => ({ ...prev, endDate: date }));
  };

  const handleSalespersonChange = (value: string) => {
    setState((prev) => ({
      ...prev,
      selectedSalesperson: value === 'all' ? null : value,
    }));
  };

  const handleActiveToggle = () => {
    setState((prev) => ({ ...prev, activeOnly: !prev.activeOnly }));
  };

  // Calculate summary totals
  const summary = {
    totalGrossSales: state.compensationData.reduce((sum, c) => sum + c.grossSales, 0),
    totalReturns: state.compensationData.reduce((sum, c) => sum + c.returns, 0),
    totalNetSales: state.compensationData.reduce((sum, c) => sum + c.netSales, 0),
    totalCommission: state.compensationData.reduce((sum, c) => sum + c.totalCommission, 0),
    totalBaseSalary: state.compensationData.reduce((sum, c) => sum + c.baseSalary, 0),
    totalPayout: state.compensationData.reduce((sum, c) => sum + c.totalPayout, 0),
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Compensation Calculator</h1>
        <p className="text-gray-600">
          View itemized sales and commission calculations by salesperson and company
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <Input
              type="date"
              value={state.startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <Input
              type="date"
              value={state.endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Salesperson Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salesperson</label>
            <select
              value={state.selectedSalesperson || 'all'}
              onChange={(e) => handleSalespersonChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Salespeople</option>
              {salespeople.map((sp) => (
                <option key={sp.id} value={sp.id}>
                  {sp.name || sp.email}
                </option>
              ))}
            </select>
          </div>

          {/* Active Only Toggle */}
          <div className="flex items-end">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={state.activeOnly}
                onChange={handleActiveToggle}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">Active Only</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Error Message */}
      {state.error && (
        <Card className="p-4 bg-red-50 border border-red-200">
          <p className="text-red-700 font-medium">{state.error}</p>
        </Card>
      )}

      {/* Summary Row */}
      {state.compensationData.length > 0 && (
        <Card className="p-4 bg-blue-50 border-2 border-blue-200">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div>
              <p className="text-sm text-gray-600">Gross Sales</p>
              <p className="text-lg font-bold text-blue-900">{formatCurrency(summary.totalGrossSales)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Returns</p>
              <p className="text-lg font-bold text-red-600">({formatCurrency(summary.totalReturns)})</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Net Sales</p>
              <p className="text-lg font-bold text-green-700">{formatCurrency(summary.totalNetSales)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Commission</p>
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(summary.totalCommission)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Base Salary</p>
              <p className="text-lg font-bold text-blue-900">
                {formatCurrency(summary.totalBaseSalary)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Payout</p>
              <p className="text-xl font-bold text-purple-900">
                {formatCurrency(summary.totalPayout)}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Compensation Details Table */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Compensation Summary</h2>
        {state.loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading compensation data...</p>
          </div>
        ) : state.compensationData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No compensation data found for selected filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <th className="text-left py-2 px-3 font-semibold">Salesperson</th>
                  <th className="text-left py-2 px-3 font-semibold">Company</th>
                  <th className="text-right py-2 px-3 font-semibold">Gross Sales</th>
                  <th className="text-right py-2 px-3 font-semibold">Returns</th>
                  <th className="text-right py-2 px-3 font-semibold">Net Sales</th>
                  <th className="text-center py-2 px-3 font-semibold">Mode</th>
                  <th className="text-right py-2 px-3 font-semibold">Commission</th>
                  <th className="text-right py-2 px-3 font-semibold">Base Salary</th>
                  <th className="text-right py-2 px-3 font-semibold">Total Payout</th>
                </tr>
              </thead>
              <tbody>
                {state.compensationData.map((comp, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-3">
                      <div>
                        <p className="font-medium">{comp.userName}</p>
                        <p className="text-xs text-gray-500">{comp.userEmail}</p>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-sm">{comp.companyName}</td>
                    <td className="py-3 px-3 text-right font-medium text-blue-900">
                      {formatCurrency(comp.grossSales)}
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-red-600">
                      ({formatCurrency(comp.returns)})
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-green-700">
                      {formatCurrency(comp.netSales)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${
                        comp.commissionMode === 'slab' 
                          ? 'bg-blue-500' 
                          : 'bg-green-500'
                      }`}>
                        {comp.commissionMode?.toUpperCase() || 'SLAB'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-green-600">
                      {formatCurrency(comp.totalCommission)}
                    </td>
                    <td className="py-3 px-3 text-right">{formatCurrency(comp.baseSalary)}</td>
                    <td className="py-3 px-3 text-right font-bold text-purple-900">
                      {formatCurrency(comp.totalPayout)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Summary by Mode */}
      {state.compensationData.length > 0 && (
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Commission Modes Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(() => {
              const slabUsers = state.compensationData.filter(c => c.commissionMode === 'slab');
              const levelUsers = state.compensationData.filter(c => c.commissionMode === 'level');
              
              return (
                <>
                  {slabUsers.length > 0 && (
                    <div className="border border-blue-200 rounded p-4 bg-blue-50">
                      <h3 className="font-semibold text-blue-900 mb-2">Slab Mode (Tiered)</h3>
                      <p className="text-sm text-gray-700 mb-3">{slabUsers.length} salesperson{slabUsers.length !== 1 ? 's' : ''}</p>
                      <div className="space-y-1">
                        {slabUsers.map((comp) => (
                          <div key={comp.userId} className="text-sm text-gray-600">
                            <span className="font-medium">{comp.userName}:</span> {formatCurrency(comp.netSales)} → {formatCurrency(comp.totalCommission)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {levelUsers.length > 0 && (
                    <div className="border border-green-200 rounded p-4 bg-green-50">
                      <h3 className="font-semibold text-green-900 mb-2">Level Mode (Bracket)</h3>
                      <p className="text-sm text-gray-700 mb-3">{levelUsers.length} salesperson{levelUsers.length !== 1 ? 's' : ''}</p>
                      <div className="space-y-1">
                        {levelUsers.map((comp) => (
                          <div key={comp.userId} className="text-sm text-gray-600">
                            <span className="font-medium">{comp.userName}:</span> {formatCurrency(comp.netSales)} → {formatCurrency(comp.totalCommission)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </Card>
      )}
    </div>
  );
};

export default HRPanel;
