/**
 * Inventory Page
 * 
 * Main page for inventory management
 * Displays the inventory modal and manages admin access
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../services/auth';
import { InventoryModal } from './InventoryModal';
import { Boxes } from 'lucide-react';

export function InventoryPage() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin
    setIsAdmin(user?.role === 'admin' || false);
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <Boxes className="text-blue-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        </div>
        <p className="text-gray-600">
          Track inventory movements, manage stock levels, and monitor items in transit.
        </p>
      </div>

      {/* Modal - Always open on this page */}
      <InventoryModal
        isOpen={true}
        onClose={() => window.history.back()}
        isAdmin={isAdmin}
      />
    </div>
  );
}
