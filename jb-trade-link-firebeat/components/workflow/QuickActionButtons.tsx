/**
 * Quick Action Buttons Component
 * 
 * Displays buttons for valid state transitions based on user role and current status
 * Compact component for easy state changes across the application
 * 
 * Phase 3.1: Status Model & Workflow Canon
 */

import React, { useState } from 'react';
import { StateManager } from '@/services/workflow/stateManager';
import { StateTransitionModal } from '@/components/workflow/StateTransitionModal';
import { OrderStatus, UserRole, StateTransitionResponse } from '@/types/workflow';
import { ChevronDown } from 'lucide-react';

interface QuickActionButtonsProps {
  orderId: string;
  currentStatus: OrderStatus;
  userRole: UserRole;
  userId: string;
  onTransitionSuccess?: (response: StateTransitionResponse) => void;
  className?: string;
  compact?: boolean;
}

// Action button configuration with icons and labels
const ACTION_CONFIG: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  'DRAFT': { label: '✏️ Draft', color: 'bg-gray-500', icon: '✏️' },
  'APPROVED': { label: '✓ Approve', color: 'bg-green-500', icon: '✓' },
  'DISPATCHED': { label: '📦 Dispatch', color: 'bg-blue-500', icon: '📦' },
  'OUT_FOR_DELIVERY': { label: '🚚 Out', color: 'bg-yellow-500', icon: '🚚' },
  'DELIVERED': { label: '✅ Delivered', color: 'bg-green-600', icon: '✅' },
  'FAILED': { label: '❌ Failed', color: 'bg-red-500', icon: '❌' },
  'RESCHEDULED': { label: '🔄 Reschedule', color: 'bg-purple-500', icon: '🔄' },
  'CANCELLED': { label: '⛔ Cancel', color: 'bg-red-600', icon: '⛔' },
  'RETURNED': { label: '↩️ Returned', color: 'bg-orange-500', icon: '↩️' },
  'DAMAGED': { label: '🔨 Damaged', color: 'bg-red-700', icon: '🔨' }
};

export function QuickActionButtons({
  orderId,
  currentStatus,
  userRole,
  userId,
  onTransitionSuccess,
  className = '',
  compact = false
}: QuickActionButtonsProps) {
  const [selectedTarget, setSelectedTarget] = useState<OrderStatus | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Get valid transitions for current role and status
  const validTransitions = StateManager.getValidTransitions(currentStatus, userRole);

  if (validTransitions.length === 0) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        No actions available
      </div>
    );
  }

  const handleActionClick = (targetStatus: OrderStatus) => {
    setSelectedTarget(targetStatus);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedTarget(null);
  };

  if (compact) {
    // Dropdown style for compact spaces
    return (
      <>
        <div className={`relative inline-block ${className}`}>
          <button
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
            title={`${validTransitions.length} action${validTransitions.length !== 1 ? 's' : ''} available`}
          >
            Actions
            <ChevronDown size={14} />
          </button>

          {/* Dropdown menu */}
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-max">
            {validTransitions.map(targetStatus => {
              const config = ACTION_CONFIG[targetStatus];
              return (
                <button
                  key={targetStatus}
                  onClick={() => handleActionClick(targetStatus)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 border-b last:border-b-0 transition-colors"
                >
                  <span className="mr-2">{config.icon}</span>
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  // Full button style
  return (
    <>
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {validTransitions.length === 0 ? (
          <p className="text-sm text-gray-500">No actions available</p>
        ) : (
          validTransitions.map(targetStatus => {
            const config = ACTION_CONFIG[targetStatus];
            return (
              <button
                key={targetStatus}
                onClick={() => handleActionClick(targetStatus)}
                className={`px-4 py-2 text-white text-sm rounded hover:opacity-90 transition-opacity ${config.color}`}
                title={StateManager.getStatusMessage(targetStatus)}
              >
                {config.label}
              </button>
            );
          })
        )}
      </div>

      {/* Transition Modal */}
      {selectedTarget && (
        <StateTransitionModal
          isOpen={showModal}
          orderId={orderId}
          currentStatus={currentStatus}
          targetStatus={selectedTarget}
          userRole={userRole}
          userId={userId}
          onSuccess={(response) => {
            onTransitionSuccess?.(response);
            handleModalClose();
          }}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}

export default QuickActionButtons;
