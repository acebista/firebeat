/**
 * HR Panel Component - NEW REDESIGN
 * Compensation calculator and salesperson filter
 * Commission rate management moved to Company Management page
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Table } from '../ui/Elements';
import { Modal } from '../ui/Modal';
import { UserCompensationService, CommissionRateService } from '../../services/hr';
import { UserCompensation, CommissionRate } from '../../types/hr';
import {
  calculateCommission,
  formatCurrency,
} from '../../utils/commissionCalculator';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface HRPanelState {
  salespeople: UserCompensation[];
  salesOrders: Record<string, any[]>;
  commissionRates: CommissionRate[];
  startDate: string;
  endDate: string;
  activeFilter: string; // 'all', 'commission', 'fixed', 'active'
  loading: boolean;
  error: string | null;
}

const HRPanel: React.FC = () => {
  const [state, setState] = useState<HRPanelState>({
    salespeople: [],
    salesOrders: {},
    commissionRates: [],
    startDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    activeFilter: 'all',
    loading: false,
    error: null,
  });

  const [editingCompensation, setEditingCompensation] = useState<UserCompensation | null>(null);
  const [showCompensationModal, setShowCompensationModal] = useState(false);

  // Load initial data
  useEffect(() => {
    loadData();
  }, [state.startDate, state.endDate, state.activeFilter]);

  const loadData = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const [salespeople, rates] = await Promise.all([
        UserCompensationService.getSalespeople(),
        CommissionRateService.getDefaultSlabs(),
      ]);

      // Filter salespeople based on active filter
      let filteredSalespeople = salespeople;
      if (state.activeFilter === 'active') {
        filteredSalespeople = salespeople.filter((s) => s.isActive);
      } else if (state.activeFilter === 'commission') {
        filteredSalespeople = salespeople.filter((s) => s.comp_plan_type === 'commission' && s.isActive);
      } else if (state.activeFilter === 'fixed') {
        filteredSalespeople = salespeople.filter((s) => s.comp_plan_type === 'fixed' && s.isActive);
      }

      // Fetch sales data for each salesperson from orders table
      const salesByUser: Record<string, any[]> = {};
      
      for (const person of filteredSalespeople) {
        try {
          const { data: supabase } = window as any;
          if (!supabase) {
            console.warn('Supabase client not available');
            salesByUser[person.id] = [];
            continue;
          }

          // Query orders for this salesperson in date range
          const { data, error } = await (window as any).__supabase?.client
            ?.from('orders')
            ?.select('id, totalAmount, companyId, status, date, items_summary')
            ?.eq('salespersonId', person.id)
            ?.in('status', ['APPROVED', 'DISPATCHED', 'DELIVERED'])
            ?.gte('date', state.startDate)
            ?.lte('date', state.endDate);

          if (!error && data) {
            salesByUser[person.id] = data;
          } else {
            salesByUser[person.id] = [];
          }
        } catch (err) {
          console.error(`Error fetching sales for ${person.name}:`, err);
          salesByUser[person.id] = [];
        }
      }

      setState((prev) => ({
        ...prev,
        salespeople: filteredSalespeople,
        salesOrders: salesByUser,
        commissionRates: rates,
        loading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load data';
      setState((prev) => ({ ...prev, error: message, loading: false }));
      toast.error(message);
    }
  };

  const handleEditCompensation = (user: UserCompensation) => {
    setEditingCompensation({ ...user });
    setShowCompensationModal(true);
  };

  const handleSaveCompensation = async () => {
    if (!editingCompensation) return;

    try {
      await UserCompensationService.update({
        id: editingCompensation.id,
        base_salary: editingCompensation.base_salary,
        comp_plan_type: editingCompensation.comp_plan_type,
        commission_rate_set: editingCompensation.commission_rate_set,
      });
      toast.success('Compensation updated successfully');
      setShowCompensationModal(false);
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update compensation');
    }
  };

  const getSalesDetails = (userId: string) => {
    const orders = state.salesOrders[userId] || [];
    const totalSales = orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);
    return { orders, totalSales };
  };

  const calculateSummary = () => {
    let totalSales = 0;
    let totalCommission = 0;
    let totalBaseSalary = 0;

    state.salespeople.forEach((person) => {
      const { totalSales: sales } = getSalesDetails(person.id);
      const baseSalary = person.base_salary || 0;
      totalSales += sales;
      totalBaseSalary += baseSalary;

      if (person.comp_plan_type === 'commission' && sales > 0) {
        const { totalCommission: commission } = calculateCommission(sales, state.commissionRates);
        totalCommission += commission;
      }
    });

    return {
      total_sales: totalSales,
      total_commission: totalCommission,
      total_base_salary: totalBaseSalary,
      total_payout: totalBaseSalary + totalCommission,
      employee_count: state.salespeople.length,
    };
  };

  const summary = calculateSummary();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">HR & Commissions</h1>
        <p className="text-gray-600 mt-2">Compensation calculator and salesperson performance tracker</p>
      </div>

      {state.error && (
        <Card className="bg-red-50 border-red-200 p-4">
          <p className="text-red-800">{state.error}</p>
        </Card>
      )}

      {/* Filters & Date Range */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Filters & Date Range</h2>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <Input
              label="Start Date"
              type="date"
              value={state.startDate}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  startDate: e.currentTarget.value,
                }))
              }
            />
          </div>
          <div>
            <Input
              label="End Date"
              type="date"
              value={state.endDate}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  endDate: e.currentTarget.value,
                }))
              }
            />
          </div>
          <div>
            <Select
              label="Filter By"
              options={[
                { label: 'All Salespeople', value: 'all' },
                { label: 'Active Only', value: 'active' },
                { label: 'Commission-Based', value: 'commission' },
                { label: 'Fixed Salary', value: 'fixed' },
              ]}
              value={state.activeFilter}
              onChange={(value: string) =>
                setState((prev) => ({
                  ...prev,
                  activeFilter: value,
                }))
              }
            />
          </div>
          <div className="flex items-end">
            <Button onClick={loadData} className="w-full">
              {state.loading ? 'Loading...' : 'Apply Filters'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Compensation & Sales Table */}
      <Card>
        <h2 className="text-xl font-semibold mb-6">Salesperson Compensation & Sales</h2>

        <Table
          columns={[
            { header: 'Name', accessor: 'name' },
            { header: 'Company', accessor: 'company_name' },
            { header: 'Plan Type', accessor: 'comp_plan_type' },
            {
              header: 'Base Salary (₹)',
              accessor: 'base_salary',
              cell: (val) => formatCurrency(val || 0),
            },
            {
              header: 'Sales Itemized',
              accessor: (row: UserCompensation) => {
                const { orders, totalSales } = getSalesDetails(row.id);
                return (
                  <div className="text-sm">
                    <p className="font-semibold">{formatCurrency(totalSales)}</p>
                    <p className="text-gray-500">{orders.length} orders</p>
                  </div>
                );
              },
            },
            {
              header: 'Commission Rate',
              accessor: (row: UserCompensation) => {
                if (row.comp_plan_type !== 'commission') return '—';
                const rates = state.commissionRates.map((r) => `${r.rate_pct}%`).join(', ');
                return rates || '—';
              },
            },
            {
              header: 'Commission (₹)',
              accessor: (row: UserCompensation) => {
                if (row.comp_plan_type !== 'commission') return formatCurrency(0);
                const { totalSales } = getSalesDetails(row.id);
                const { totalCommission } = calculateCommission(totalSales, state.commissionRates);
                return formatCurrency(totalCommission);
              },
            },
            {
              header: 'Total Payout (₹)',
              accessor: (row: UserCompensation) => {
                const { totalSales } = getSalesDetails(row.id);
                let commission = 0;
                if (row.comp_plan_type === 'commission') {
                  const calc = calculateCommission(totalSales, state.commissionRates);
                  commission = calc.totalCommission;
                }
                const payout = (row.base_salary || 0) + commission;
                return formatCurrency(payout);
              },
            },
            {
              header: 'Actions',
              accessor: (row: UserCompensation) => (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditCompensation(row)}
                >
                  Edit
                </Button>
              ),
            },
          ]}
          data={state.salespeople}
        />

        {/* Summary Row */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="font-semibold text-lg mb-4">Summary</h3>
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(summary.total_sales)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-gray-600">Total Commission</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(summary.total_commission)}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <p className="text-sm text-gray-600">Total Base Salary</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(summary.total_base_salary)}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded">
              <p className="text-sm text-gray-600">Total Payout</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(summary.total_payout)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Salespeople</p>
              <p className="text-2xl font-bold text-gray-600">{summary.employee_count}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Compensation Edit Modal */}
      {editingCompensation && (
        <Modal
          isOpen={showCompensationModal}
          title={`Edit ${editingCompensation.name}'s Compensation`}
          onClose={() => setShowCompensationModal(false)}
        >
          <CompensationModalContent
            user={editingCompensation}
            onChange={(user: UserCompensation) => setEditingCompensation(user)}
            onSave={handleSaveCompensation}
            onClose={() => setShowCompensationModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default HRPanel;

// Compensation Edit Modal Component
const CompensationModalContent: React.FC<{
  user: UserCompensation;
  onChange: (user: UserCompensation) => void;
  onSave: () => void;
  onClose: () => void;
}> = ({ user, onChange, onSave, onClose }) => {
  return (
    <div className="space-y-4">
      <div>
        <Input
          label="Base Salary (₹)"
          type="number"
          value={String(user.base_salary || 0)}
          onChange={(e) =>
            onChange({ ...user, base_salary: parseFloat(e.currentTarget.value) || null })
          }
        />
      </div>

      <div>
        <Select
          label="Compensation Plan"
          options={[
            { label: 'Fixed Salary Only', value: 'fixed' },
            { label: 'Commission-Based', value: 'commission' },
          ]}
          value={user.comp_plan_type}
          onChange={(value: string) =>
            onChange({
              ...user,
              comp_plan_type: value as 'fixed' | 'commission',
            })
          }
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onSave}>Save Changes</Button>
      </div>
    </div>
  );
};
