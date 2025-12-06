
import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Badge } from '../../components/ui/Elements';
import { Modal } from '../../components/ui/Modal';
import { Edit2, CheckCircle, XCircle, Building2 } from 'lucide-react';
import { Company } from '../../types';
import { CompanyService } from '../../services/db';
import { companySchema } from '../../utils/validation/schemas';
import { z } from 'zod';
import toast from 'react-hot-toast';

export const CompanyManagement: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({ name: '', code: '', isActive: true });
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
    setFormData({ name: company.name, code: company.code, isActive: company.isActive });
    setValidationErrors({});
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingCompany(null);
    setFormData({ name: '', code: '', isActive: true });
    setValidationErrors({});
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const validatedData = companySchema.parse(formData);
      setValidationErrors({});

      if (editingCompany) {
        // Update existing company
        await CompanyService.update(editingCompany.id, validatedData);
        setCompanies(prev => prev.map(c => c.id === editingCompany.id ? { ...c, ...validatedData } : c));
      } else {
        // Create new company
        const companyId = validatedData.code.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const newCompany = {
          id: companyId,
          name: validatedData.name,
          code: validatedData.code,
          isActive: validatedData.isActive,
          createdAt: new Date().toISOString().split('T')[0]
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Created At</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{company.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-500">{company.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge color={company.isActive ? 'green' : 'red'}>{company.isActive ? 'Active' : 'Inactive'}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.createdAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => handleEdit(company)} className="text-indigo-600 hover:text-indigo-900 p-1">
                      <Edit2 className="h-4 w-4" />
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
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setModalOpen(false)} type="button">Cancel</Button>
            <Button type="submit">Save Company</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
