import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Badge } from '../../components/ui/Elements';
import { Modal } from '../../components/ui/Modal';
import { Edit2, Eye, Plus, Trash2, Check, X } from 'lucide-react';
import { Vehicle } from '../../types';
import { VehicleService } from '../../services/db';
import { vehicleSchema } from '../../utils/validation/schemas';
import { z } from 'zod';
import toast from 'react-hot-toast';

export const VehicleManagement: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Vehicle>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Selection State
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const data = await VehicleService.getAll();
      setVehicles(data.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (e) {
      console.error('Error loading vehicles:', e);
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  // Clear selections when search changes
  useEffect(() => {
    setSelectedVehicleIds(new Set());
  }, [searchTerm]);

  const filteredVehicles = vehicles.filter(v =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.registrationNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
    setFormData({ ...vehicle });
    setValidationErrors({});
    setModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentVehicle(null);
    setFormData({
      name: '',
      registrationNo: '',
      capacityCases: undefined,
      isActive: true,
    });
    setValidationErrors({});
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setValidationErrors({});

      // Prepare data for validation
      const dataToValidate = {
        name: formData.name || '',
        registrationNo: formData.registrationNo || '',
        capacityCases: formData.capacityCases ? Number(formData.capacityCases) : undefined,
        isActive: formData.isActive ?? true,
      };

      const validatedData = vehicleSchema.parse(dataToValidate);

      if (currentVehicle) {
        // Update existing vehicle
        await VehicleService.update(currentVehicle.id, validatedData);
        setVehicles(prev =>
          prev.map(v => v.id === currentVehicle.id ? { ...v, ...validatedData } : v)
        );
        toast.success('Vehicle updated successfully');
      } else {
        // Add new vehicle
        const newVehicle = await VehicleService.add(validatedData);
        setVehicles([...vehicles, newVehicle]);
        toast.success('Vehicle added successfully');
      }
      setModalOpen(false);
    } catch (e: any) {
      if (e instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        e.issues.forEach((issue: any) => {
          if (issue.path[0]) {
            errors[issue.path[0] as string] = issue.message;
          }
        });
        setValidationErrors(errors);
        toast.error('Please fix validation errors');
      } else {
        const errorMsg = e?.message || 'Failed to save vehicle';
        toast.error(errorMsg);
        console.error('Save error:', e);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const openDetails = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
    setDetailsOpen(true);
  };

  // Selection Handlers
  const handleSelectRow = (id: string) => {
    setSelectedVehicleIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedVehicleIds.size === filteredVehicles.length) {
      setSelectedVehicleIds(new Set());
    } else {
      setSelectedVehicleIds(new Set(filteredVehicles.map(v => v.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedVehicleIds.size === 0) return;
    if (!window.confirm(`Delete ${selectedVehicleIds.size} vehicle(s)?`)) return;

    try {
      for (const id of selectedVehicleIds) {
        await VehicleService.delete(id);
      }
      setVehicles(prev => prev.filter(v => !selectedVehicleIds.has(v.id)));
      setSelectedVehicleIds(new Set());
      toast.success(`Deleted ${selectedVehicleIds.size} vehicle(s)`);
    } catch (e) {
      console.error('Delete error:', e);
      toast.error('Failed to delete vehicle(s)');
    }
  };

  const handleBulkStatusChange = async (isActive: boolean) => {
    if (selectedVehicleIds.size === 0) return;

    try {
      for (const id of selectedVehicleIds) {
        await VehicleService.update(id, { isActive });
      }
      setVehicles(prev =>
        prev.map(v =>
          selectedVehicleIds.has(v.id) ? { ...v, isActive } : v
        )
      );
      setSelectedVehicleIds(new Set());
      toast.success(`${isActive ? 'Activated' : 'Deactivated'} ${selectedVehicleIds.size} vehicle(s)`);
    } catch (e) {
      console.error('Status update error:', e);
      toast.error('Failed to update vehicle status');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehicles Management</h1>
          <p className="text-gray-600">Manage fleet of vehicles for dispatch</p>
        </div>
        <Button onClick={handleAdd} className="bg-indigo-600">
          <Plus className="mr-2 h-4 w-4" /> Add Vehicle
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-white p-4">
        <Input
          placeholder="Search by vehicle name or registration number..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </Card>

      {/* Bulk Actions */}
      {selectedVehicleIds.size > 0 && (
        <div className="bg-indigo-600 text-white p-4 rounded-lg flex justify-between items-center">
          <span className="font-medium">{selectedVehicleIds.size} vehicle(s) selected</span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleBulkStatusChange(true)}
              className="bg-white text-indigo-700 hover:bg-indigo-50 border-transparent"
            >
              <Check className="mr-2 h-4 w-4" /> Activate
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleBulkStatusChange(false)}
              className="bg-white text-indigo-700 hover:bg-indigo-50 border-transparent"
            >
              <X className="mr-2 h-4 w-4" /> Deactivate
            </Button>
            <div className="w-px bg-indigo-400 mx-1"></div>
            <Button
              variant="danger"
              size="sm"
              onClick={handleBulkDelete}
              className="bg-red-500 text-white hover:bg-red-600 border-transparent"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedVehicleIds(new Set())}
              className="bg-transparent text-white border-white hover:bg-indigo-700"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase w-10">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    checked={filteredVehicles.length > 0 && selectedVehicleIds.size === filteredVehicles.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Vehicle Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Registration No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Capacity (Cases)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={6} className="text-center p-4">Loading vehicles...</td></tr>
              ) : filteredVehicles.length === 0 ? (
                <tr><td colSpan={6} className="text-center p-4">No vehicles found.</td></tr>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className={`hover:bg-gray-50 ${selectedVehicleIds.has(vehicle.id) ? 'bg-indigo-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        checked={selectedVehicleIds.has(vehicle.id)}
                        onChange={() => handleSelectRow(vehicle.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{vehicle.name}</div>
                      <div className="text-xs text-gray-500">ID: {vehicle.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {vehicle.registrationNo || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {vehicle.capacityCases ? `${vehicle.capacityCases} cases` : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge color={vehicle.isActive ? 'green' : 'red'}>
                        {vehicle.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button onClick={() => openDetails(vehicle)} className="text-gray-600 hover:text-gray-900 p-1">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleEdit(vehicle)} className="text-indigo-600 hover:text-indigo-900 p-1">
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={currentVehicle ? "Edit Vehicle" : "Add Vehicle"}>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
          <div>
            <Input
              label="Vehicle Name"
              placeholder="e.g., Van 1, Bike A, Truck Alpha"
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              error={validationErrors.name}
              disabled={isSaving}
            />
          </div>

          <div>
            <Input
              label="Registration Number"
              placeholder="e.g., KA-51-XY-1234"
              value={formData.registrationNo || ''}
              onChange={e => setFormData({ ...formData, registrationNo: e.target.value })}
              error={validationErrors.registrationNo}
              disabled={isSaving}
            />
          </div>

          <div>
            <Input
              label="Capacity (Cases)"
              type="number"
              min={0}
              step={1}
              placeholder="e.g., 50"
              value={formData.capacityCases ?? ''}
              onChange={e => setFormData({ ...formData, capacityCases: e.target.value ? Number(e.target.value) : undefined })}
              error={validationErrors.capacityCases}
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive ?? true}
                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded text-green-600"
                disabled={isSaving}
              />
              Vehicle is Active
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              type="button"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-indigo-600"
            >
              {isSaving ? 'Saving...' : 'Save Vehicle'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Detail View Modal */}
      <Modal isOpen={isDetailsOpen} onClose={() => setDetailsOpen(false)} title="Vehicle Details">
        {currentVehicle && (
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="text-xl font-bold text-gray-800">{currentVehicle.name}</h3>
              <p className="text-sm text-gray-500">ID: {currentVehicle.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded">
                <span className="block text-gray-500 font-medium">Registration</span>
                <span className="block text-lg font-semibold">{currentVehicle.registrationNo || '—'}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <span className="block text-gray-500 font-medium">Capacity</span>
                <span className="block text-lg font-semibold">{currentVehicle.capacityCases ? `${currentVehicle.capacityCases} cases` : '—'}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <span className="block text-gray-500 font-medium">Status</span>
                <Badge color={currentVehicle.isActive ? 'green' : 'red'}>
                  {currentVehicle.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <span className="block text-gray-500 font-medium">Created</span>
                <span className="block text-sm">{new Date(currentVehicle.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {currentVehicle.updatedAt && currentVehicle.updatedAt !== currentVehicle.createdAt && (
              <div className="p-3 bg-blue-50 rounded text-sm">
                <span className="text-gray-500">Last Updated: </span>
                <span>{new Date(currentVehicle.updatedAt).toLocaleString()}</span>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
