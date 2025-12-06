
import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../ui/Elements';
import { Filter, RefreshCw } from 'lucide-react';
import { ReportFilterState } from '../../types/reports';
import { CompanyService, UserService } from '../../services/db';
import { Company, User } from '../../types';

interface ReportFiltersProps {
  filters: ReportFilterState;
  setFilters: React.Dispatch<React.SetStateAction<ReportFilterState>>;
  onGenerate: () => void;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({ filters, setFilters, onGenerate }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [companiesData, usersData] = await Promise.all([
        CompanyService.getAll(),
        UserService.getAll()
      ]);
      setCompanies(companiesData.filter(c => c.isActive));
      setEmployees(usersData.filter(u => u.role === 'sales'));
    } catch (error) {
      console.error('Failed to load filter data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompany = (id: string) => {
    const current = filters.companyIds;
    if (current.includes(id)) {
      setFilters({ ...filters, companyIds: current.filter(c => c !== id) });
    } else {
      setFilters({ ...filters, companyIds: [...current, id] });
    }
  };

  const toggleEmployee = (id: string) => {
    const current = filters.employeeIds;
    if (current.includes(id)) {
      setFilters({ ...filters, employeeIds: current.filter(e => e !== id) });
    } else {
      setFilters({ ...filters, employeeIds: [...current, id] });
    }
  };

  return (
    <Card className="p-4 mb-6 border-t-4 border-t-indigo-500">
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-end">
        <div className="flex-grow">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-medium">From</span>
              <input
                type="date"
                className="w-full pl-12 pr-3 py-2 rounded-l-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                value={filters.startDate}
                onChange={e => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            <div className="relative flex-grow">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-medium">To</span>
              <input
                type="date"
                className="w-full pl-8 pr-3 py-2 rounded-r-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                value={filters.endDate}
                onChange={e => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                setFilters({ ...filters, startDate: today, endDate: today });
              }}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
            >
              Today
            </button>
            <button
              onClick={() => {
                const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
                setFilters({ ...filters, startDate: yesterday, endDate: yesterday });
              }}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
            >
              Yesterday
            </button>
            <button
              onClick={() => {
                const today = new Date();
                const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
                const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
                setFilters({ ...filters, startDate: firstDay, endDate: lastDay });
              }}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
            >
              This Month
            </button>
          </div>
        </div>

        <div className="md:w-48">
          <Button onClick={onGenerate} className="w-full bg-indigo-600 hover:bg-indigo-700 h-[42px]">
            <RefreshCw className="mr-2 h-4 w-4" /> Generate Report
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4 text-gray-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto mb-2"></div>
          <p className="text-sm">Loading filters...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
          {/* Company Multi-select */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Companies</label>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
              <button
                onClick={() => setFilters({ ...filters, companyIds: [] })}
                className={`px-3 py-1 text-xs rounded-full border ${filters.companyIds.length === 0 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300'}`}
              >
                All
              </button>
              {companies.map(c => (
                <button
                  key={c.id}
                  onClick={() => toggleCompany(c.id)}
                  className={`px-3 py-1 text-xs rounded-full border ${filters.companyIds.includes(c.id) ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-white text-gray-600 border-gray-300'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Employee Multi-select */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Salespeople</label>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
              <button
                onClick={() => setFilters({ ...filters, employeeIds: [] })}
                className={`px-3 py-1 text-xs rounded-full border ${filters.employeeIds.length === 0 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300'}`}
              >
                All
              </button>
              {employees.map(e => (
                <button
                  key={e.id}
                  onClick={() => toggleEmployee(e.id)}
                  className={`px-3 py-1 text-xs rounded-full border ${filters.employeeIds.includes(e.id) ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-white text-gray-600 border-gray-300'}`}
                >
                  {e.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
