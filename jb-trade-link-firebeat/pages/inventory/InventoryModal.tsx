/**
 * Inventory Modal
 * 
 * Main modal component with tabs for:
 * - Summary: Inventory report by product
 * - Movements: Detailed transaction history
 * - Adjustments: Manual inventory adjustments (admin only)
 * - Stock in Transit: Dispatched but not delivered items
 */

import React, { useState, useCallback } from 'react';
import { X, AlertCircle, RefreshCw } from 'lucide-react';
import { SummaryTab } from './tabs/SummaryTab';
import { MovementsTab } from './tabs/MovementsTab';
import { AdjustmentsTab } from './tabs/AdjustmentsTab';
import { StockInTransitTab } from './tabs/StockInTransitTab';

type TabType = 'summary' | 'movements' | 'adjustments' | 'transit';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

export function InventoryModal({ isOpen, onClose, isAdmin = false }: InventoryModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  if (!isOpen) return null;

  const tabs: Array<{ id: TabType; label: string; component: React.FC<any>; adminOnly?: boolean }> = [
    { id: 'summary', label: 'Summary', component: SummaryTab },
    { id: 'movements', label: 'Movements', component: MovementsTab },
    { id: 'adjustments', label: 'Adjustments', component: AdjustmentsTab, adminOnly: true },
    { id: 'transit', label: 'Stock in Transit', component: StockInTransitTab },
  ];

  const visibleTabs = tabs.filter(t => !t.adminOnly || isAdmin);
  const CurrentTabComponent = tabs.find(t => t.id === activeTab)?.component;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh data"
            >
              <RefreshCw size={20} className="text-gray-600" />
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 bg-gray-50 px-6">
          <div className="flex space-x-8">
            {visibleTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {CurrentTabComponent && (
            <div className="p-6">
              <CurrentTabComponent key={refreshKey} isAdmin={isAdmin} />
            </div>
          )}
        </div>

        {/* Footer with admin notice */}
        {!isAdmin && (
          <div className="border-t border-gray-200 bg-amber-50 px-6 py-3 flex items-center space-x-2">
            <AlertCircle size={16} className="text-amber-600" />
            <p className="text-sm text-amber-700">
              Some inventory management features require admin access.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
