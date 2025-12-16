import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Badge } from '../../components/ui/Elements';
import { Modal } from '../../components/ui/Modal';
import { Edit2, Lock, UserPlus, CheckCircle, XCircle, Trash2, Mail, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { User, UserRole } from '../../types';
import { UserService } from '../../services/db';
import { supabase } from '../../lib/supabase';
import { userSchema } from '../../utils/validation/schemas';
import { validatePasswordStrength, generateTemporaryPassword, adminSetPassword } from '../../services/admin/passwordManagement';
import { z } from 'zod';
import toast from 'react-hot-toast';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('admin');
  const workspaceOptions = [
    { label: 'Admin', value: 'admin' },
    { label: 'Sales', value: 'sales' },
    { label: 'Delivery', value: 'delivery' },
  ];

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'sales' as UserRole,
    isActive: true,
    comp_plan_type: 'commission' as 'fixed' | 'commission',
    base_salary: null as number | null,
  });

  const [sendingResetEmail, setSendingResetEmail] = useState(false);
  const [resetEmailSuccess, setResetEmailSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Password management state
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [settingPassword, setSettingPassword] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await UserService.getAll();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      isActive: user.isActive,
      comp_plan_type: user.comp_plan_type || 'commission',
      base_salary: user.base_salary || null,
    });
    setValidationErrors({});
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'sales',
      isActive: true,
      comp_plan_type: 'commission',
      base_salary: null,
    });
    setValidationErrors({});
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      // Ensure phone is a string and not empty
      const dataToValidate = {
        ...formData,
        phone: String(formData.phone || ''),
      };

      // Validate form data
      const validatedData = userSchema.parse(dataToValidate);
      setValidationErrors({});

      if (editingUser) {
        // Prepare update data (no password field)
        const updateData: Partial<User> = { ...validatedData };

        await UserService.update(editingUser.id, updateData);
        setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...updateData } : u));
      } else {
        // Create new user
        const newUser: User = {
          id: crypto.randomUUID(),
          ...validatedData,
          createdAt: new Date().toISOString(),
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(validatedData.name)}&background=6366f1&color=fff`,
        } as User;

        await UserService.add(newUser);
        setUsers(prev => [...prev, newUser]);
      }
      setModalOpen(false);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Failed to save user:", error);

      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        (error as any).errors?.forEach((err: any) => {
          const field = err.path[0] as string;
          errors[field] = err.message;
        });
        setValidationErrors(errors);
        const firstError = Object.values(errors)[0];
        toast.error(firstError || 'Validation error. Please check your inputs.');
      } else {
        toast.error("Failed to save user. Please try again.");
      }
    }
  };

  const toggleStatus = async (user: User) => {
    try {
      const newStatus = !user.isActive;
      await UserService.update(user.id, { isActive: newStatus });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: newStatus } : u));
    } catch (error) {
      console.error("Failed to toggle user status:", error);
      toast.error("Failed to update user status. Please try again.");
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await UserService.delete(user.id);
      setUsers(prev => prev.filter(u => u.id !== user.id));
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user. They may have associated records.");
    }
  };

  const handleSendPasswordReset = async (email: string) => {
    setSendingResetEmail(true);
    setResetEmailSuccess('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#/reset-password`,
      });

      if (error) throw error;

      setResetEmailSuccess(`Password reset email sent to ${email}`);
      setTimeout(() => setResetEmailSuccess(''), 5000);
    } catch (error: any) {
      console.error('Failed to send password reset email:', error);
      toast.error(`Failed to send password reset email: ${error.message}`);
    } finally {
      setSendingResetEmail(false);
    }
  };

  const openPasswordModal = (user: User) => {
    setSelectedUserForPassword(user);
    setNewPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setPasswordErrors([]);
    setPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setPasswordModalOpen(false);
    setSelectedUserForPassword(null);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordErrors([]);
  };

  const generateAndSetPassword = () => {
    const tempPassword = generateTemporaryPassword();
    setNewPassword(tempPassword);
    setConfirmPassword(tempPassword);
    setPasswordErrors([]);
  };

  const handleSetPassword = async () => {
    if (!selectedUserForPassword) return;

    // Validate passwords
    const errors: string[] = [];

    if (!newPassword) {
      errors.push('Password is required');
    } else if (newPassword !== confirmPassword) {
      errors.push('Passwords do not match');
    } else {
      const validation = validatePasswordStrength(newPassword);
      if (!validation.valid) {
        errors.push(...validation.errors);
      }
    }

    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setSettingPassword(true);
    try {
      console.log('[Users] Setting password for user:', selectedUserForPassword.id, selectedUserForPassword.name);
      // Call the admin password management Edge Function
      const result = await adminSetPassword(selectedUserForPassword.id, newPassword);
      console.log('[Users] Password set result:', result);

      toast.success(`Password set for ${selectedUserForPassword.name}`);
      closePasswordModal();
    } catch (error: any) {
      console.error('[Users] Failed to set password:', error);
      toast.error(error.message || 'Failed to set password. Make sure you are an admin.');
    } finally {
      setSettingPassword(false);
    }
  };

  // Filter users based on search and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'all' || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <Button onClick={handleAdd}>
          <UserPlus className="mr-2 h-4 w-4" /> Add User Profile
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={[
                { label: 'All Roles', value: 'all' },
                { label: 'Admin', value: 'admin' },
                { label: 'Sales', value: 'sales' },
                { label: 'Delivery', value: 'delivery' }
              ]}
              value={filterRole}
              onChange={(v: any) => setFilterRole(typeof v === 'string' ? v : v.target?.value)}
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Activity</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading users...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No users found.</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 overflow-hidden">
                          {user.avatarUrl ? <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" /> : user.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-xs text-gray-500">{user.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge color={user.role === 'admin' ? 'blue' : user.role === 'sales' ? 'emerald' : 'amber'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge color={user.isActive ? 'emerald' : 'red'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>Created: {new Date(user.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => openPasswordModal(user)}
                        className="text-purple-600 hover:text-purple-900 p-1 hover:bg-purple-50 rounded"
                        title="Set Password"
                      >
                        <Lock className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                        title="Edit User"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleStatus(user)}
                        className={`${user.isActive ? 'text-red-600 hover:text-red-900 hover:bg-red-50' : 'text-green-600 hover:text-green-900 hover:bg-green-50'} p-1 rounded`}
                        title={user.isActive ? "Deactivate" : "Activate"}
                      >
                        {user.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
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
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? "Edit User Profile" : "Add User Profile"}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
          {!editingUser && (
            <div className="bg-yellow-50 p-3 text-sm text-yellow-800 rounded border border-yellow-200 mb-4">
              <strong>Note:</strong> After creating the user profile, use the lock icon to set their initial password.
            </div>
          )}

          <Input
            label="Full Name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. John Doe"
            required
            autoComplete="name"
            error={validationErrors.name}
          />
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
            required
            autoComplete="email"
            error={validationErrors.email}
          />

          {editingUser && (
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Password Management:</strong> Use the lock icon (🔒) next to this user's name in the table to set or change their password.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="10 digit mobile"
              autoComplete="tel"
              error={validationErrors.phone}
            />
            <Select
              label="Role"
              value={formData.role}
              onChange={(v: any) => setFormData({ ...formData, role: (typeof v === 'string' ? v : v.target?.value) as UserRole })}
              options={[
                { label: 'Admin', value: 'admin' },
                { label: 'Sales', value: 'sales' },
                { label: 'Delivery', value: 'delivery' }
              ]}
            />
          </div>

          {/* Compensation Settings */}
          <div className="mt-4 p-3 border rounded bg-gray-50">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Compensation</h4>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Plan Type"
                value={String(formData.comp_plan_type || 'commission')}
                onChange={(v: any) => setFormData({ ...formData, comp_plan_type: (typeof v === 'string' ? v : v.target?.value) as 'fixed' | 'commission' })}
                options={[
                  { label: 'Commission', value: 'commission' },
                  { label: 'Fixed / Salary', value: 'fixed' }
                ]}
              />

              <Input
                label="Base Salary (₹)"
                type="number"
                step="0.01"
                value={String(formData.base_salary ?? '')}
                onChange={(e) => setFormData({ ...formData, base_salary: e.currentTarget.value ? parseFloat(e.currentTarget.value) : null })}
                placeholder="e.g. 20000"
              />
            </div>
            <div className="text-xs text-gray-500 mt-2">If Plan Type is 'Fixed', commission fields will be ignored by the HR calculator.</div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="activeUser"
              checked={formData.isActive}
              onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="activeUser" className="text-sm text-gray-700 select-none">User is active</label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setModalOpen(false)} type="button">Cancel</Button>
            <Button type="submit">
              {editingUser ? 'Update Profile' : 'Create Profile'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Password Setting Modal */}
      <Modal
        isOpen={passwordModalOpen}
        onClose={closePasswordModal}
        title={`Set Password for ${selectedUserForPassword?.name}`}
      >
        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Email:</strong> {selectedUserForPassword?.email}
            </p>
          </div>

          {passwordErrors.length > 0 && (
            <div className="bg-red-50 p-3 rounded border border-red-200">
              <p className="text-sm font-medium text-red-700 mb-1">Password errors:</p>
              <ul className="text-sm text-red-600 list-disc list-inside">
                {passwordErrors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Requirements:
            </label>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>✓ Minimum 8 characters</li>
              <li>✓ At least one uppercase letter (A-Z)</li>
              <li>✓ At least one lowercase letter (a-z)</li>
              <li>✓ At least one number (0-9)</li>
            </ul>
          </div>

          <div className="relative">
            <Input
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordErrors([]);
              }}
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              title={showPassword ? 'Hide' : 'Show'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <Input
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setPasswordErrors([]);
            }}
            placeholder="Confirm password"
          />

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={generateAndSetPassword}
              variant="secondary"
              className="w-full flex items-center justify-center gap-2"
              disabled={settingPassword}
            >
              <RefreshCw className="h-4 w-4" />
              Generate Random Password
            </Button>
          </div>

          <div className="bg-amber-50 p-3 rounded border border-amber-200 text-sm text-amber-800">
            <strong>Tip:</strong> Generate a random password and give it to the user securely.
            They can change it later.
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={closePasswordModal}
              disabled={settingPassword}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSetPassword}
              isLoading={settingPassword}
              disabled={!newPassword || !confirmPassword}
            >
              Set Password
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
