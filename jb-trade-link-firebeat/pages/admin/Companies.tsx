
import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Badge } from '../../components/ui/Elements';
import { Modal } from '../../components/ui/Modal';
import { Edit2, CheckCircle, XCircle, Building2, Settings } from 'lucide-react';
import { Company } from '../../types';
import { CompanyService } from '../../services/db';
import { companySchema } from '../../utils/validation/schemas';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { CommissionRateManager } from '../../components/admin/CommissionRateManager';

export const CompanyManagement: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isRatesModalOpen, setRatesModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [selectedCompanyForRates, setSelectedCompanyForRates] = useState<Company | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    code: string;
    isActive: boolean;
    commission_rate?: number;
    commission_type: 'flat' | 'slab';
  }>({ name: '', code: '', isActive: true, commission_type: 'flat' });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Load companies from database
  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const data = await CompanyService.getAll();
      setCompanies(data);
    } catch (error) {
      console.error('Failed to load companies:', error);
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      code: company.code,
      isActive: company.isActive,
      commission_rate: company.commission_rate,
      commission_type: company.commission_type || 'flat'
    });
    setValidationErrors({});
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingCompany(null);
    setFormData({ name: '', code: '', isActive: true, commission_type: 'flat' });
    setValidationErrors({});
    setModalOpen(true);
  };


  const handleManageRates = (company: Company) => {
    setSelectedCompanyForRates(company);
    setRatesModalOpen(true);
  };

  const handleSave = async () => {
    try {
      // Clean up empty optional fields
      const dataToValidate = {
        ...formData,
        commission_rate: formData.commission_rate === undefined || formData.commission_rate === null
          ? null // send as null if undefined/null
          : Number(formData.commission_rate) // ensure number
      };

      const validatedData = companySchema.parse(dataToValidate);
      setValidationErrors({});

      // Ensure commission_rate is undefined if null to match backend/type expectation if strictly needed, 
      // but Supabase/DB usually handles null fine. The Type requires 'number | undefined' maybe?
      // Let's coerce null to undefined for the TS type if needed, but DB stores null.
      const finalData = {
        ...validatedData,
        commission_rate: validatedData.commission_rate ?? undefined
      };

      if (editingCompany) {
        // Update existing company
        await CompanyService.update(editingCompany.id, finalData);
        setCompanies(prev => prev.map(c => c.id === editingCompany.id ? { ...c, ...finalData } : c));
      } else {
        // Create new company
        const companyId = validatedData.code.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const newCompany: Company = {
          id: companyId,
          name: validatedData.name,
          code: validatedData.code,
          isActive: validatedData.isActive,
          createdAt: new Date().toISOString().split('T')[0],
          commission_rate: finalData.commission_rate
        };
        const saved = await CompanyService.add(newCompany);
        setCompanies([...companies, saved]);
      }
      setModalOpen(false);
    } catch (e: any) {
      if (e instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        (e as any).errors.forEach((err: any) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setValidationErrors(errors);
      } else {
        console.error('Failed to save company:', e);
        toast.error('Failed to save company');
      }
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const company = companies.find(c => c.id === id);
      if (!company) return;

      await CompanyService.update(id, { isActive: !company.isActive });
      setCompanies(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
    } catch (error) {
      console.error('Failed to toggle status:', error);
      toast.error('Failed to update company status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Companies</h2>
        <Button onClick={handleAdd}>
          <Building2 className="mr-2 h-4 w-4" /> Add Company
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Company Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Commission %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{company.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-500">{company.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-500">
                    {company.commission_type === 'slab' ? (
                      <Badge color="blue">Slab Based</Badge>
                    ) : (
                      company.commission_rate ? `${company.commission_rate}%` : '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge color={company.isActive ? 'emerald' : 'red'}>{company.isActive ? 'Active' : 'Inactive'}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => handleEdit(company)} className="text-indigo-600 hover:text-indigo-900 p-1" title="Edit company">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleManageRates(company)} className="text-blue-600 hover:text-blue-900 p-1" title="Manage commission rates">
                      <Settings className="h-4 w-4" />
                    </button>
                    <button onClick={() => toggleStatus(company.id)} className={`${company.isActive ? 'text-red-600' : 'text-green-600'} p-1`}>
                      {company.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={editingCompany ? "Edit Company" : "Add Company"}>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
          <Input
            label="Company Name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Parle"
            error={validationErrors.name}
          />
          <Input
            label="Company Code"
            value={formData.code}
            onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            placeholder="e.g. PAR"
            error={validationErrors.code}
          />
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label className="text-sm text-gray-700">Active</label>
          </div>

          <div className="pt-2 border-t mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Commission Setting</label>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div
                onClick={() => setFormData({ ...formData, commission_type: 'flat' })}
                className={`cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 ${formData.commission_type === 'flat' ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.commission_type === 'flat' ? 'border-indigo-600' : 'border-gray-400'}`}>
                  {formData.commission_type === 'flat' && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                </div>
                <span className={`text-sm font-medium ${formData.commission_type === 'flat' ? 'text-indigo-900' : 'text-gray-600'}`}>Default Flat Rate</span>
              </div>

              <div
                onClick={() => setFormData({ ...formData, commission_type: 'slab' })}
                className={`cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 ${formData.commission_type === 'slab' ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.commission_type === 'slab' ? 'border-indigo-600' : 'border-gray-400'}`}>
                  {formData.commission_type === 'slab' && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                </div>
                <span className={`text-sm font-medium ${formData.commission_type === 'slab' ? 'text-indigo-900' : 'text-gray-600'}`}>Slab / Target Based</span>
              </div>
            </div>

            {formData.commission_type === 'flat' ? (
              <div>
                <Input
                  label="Default Commission Rate (%)"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.commission_rate ?? ''}
                  onChange={e => setFormData({ ...formData, commission_rate: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="e.g. 5.0"
                  error={validationErrors.commission_rate}
                />
                <p className="text-xs text-gray-500 mt-1">Base commission rate for all products. Can be overridden per product.</p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Configure target-based commission slabs.</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    // Save first if we are in edit mode to ensure context exists, 
                    // or just open the manager if we persist context some other way.
                    // Here we'll just open the modal if we have an ID (Edit Mode).
                    // If Add Mode, we ask user to save first.
                    if (editingCompany) {
                      handleManageRates(editingCompany);
                    } else {
                      toast('Please save the company first to manage slabs.', { icon: 'ℹ️' });
                    }
                  }}
                  className="w-full"
                >
                  <Settings className="mr-2 h-4 w-4" /> Manage Slab Rules
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setModalOpen(false)} type="button">Cancel</Button>
            <Button type="submit">Save Company</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isRatesModalOpen}
        onClose={() => {
          setRatesModalOpen(false);
          setSelectedCompanyForRates(null);
        }}
        title={selectedCompanyForRates ? `Commission Rates - ${selectedCompanyForRates.name}` : 'Commission Rates'}
        size="lg"
      >
        {selectedCompanyForRates && (
          <CommissionRateManager
            companyId={selectedCompanyForRates.id}
            companyName={selectedCompanyForRates.name}
          />
        )}
      </Modal>
    </div >
  );
};
