/**
 * State Transition Modal Component
 * 
 * Provides UI for transitioning an order between states
 * Includes validation, confirmation, and audit logging
 * 
 * Phase 3.1: Status Model & Workflow Canon
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { StateManager } from '@/services/workflow/stateManager';
import { OrderStatus, UserRole, StateTransitionResponse } from '@/types/workflow';
import toast from 'react-hot-toast';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface StateTransitionModalProps {
  isOpen: boolean;
  orderId: string;
  currentStatus: OrderStatus;
  targetStatus: OrderStatus;
  userRole: UserRole;
  userId: string;
  onSuccess?: (response: StateTransitionResponse) => void;
  onClose: () => void;
}

export function StateTransitionModal({
  isOpen,
  orderId,
  currentStatus,
  targetStatus,
  userRole,
  userId,
  onSuccess,
  onClose
}: StateTransitionModalProps) {
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Validation: Check if transition is allowed
  const canTransition = StateManager.canTransition(
    currentStatus,
    targetStatus,
    userRole
  );

  const handleConfirm = async () => {
    setValidationErrors([]);
    setIsLoading(true);

    try {
      // Pre-flight validation
      const isValid = await StateManager.validateTransitionRequirements(
        orderId,
        targetStatus
      );

      if (!isValid) {
        setValidationErrors(['Order does not meet requirements for this transition']);
        setIsLoading(false);
        return;
      }

      // Execute transition
      const response = await StateManager.executeTransition({
        entityId: orderId,
        entityType: 'order',
        currentStatus,
        targetStatus,
        userRole,
        userId,
        reason: notes || StateManager.getStatusMessage(targetStatus),
        metadata: {
          timestamp: new Date().toISOString()
        }
      });

      if (response.success) {
        toast.success(`Order ${StateManager.getStatusMessage(targetStatus)}`);
        onSuccess?.(response);
        onClose();
      } else {
        setValidationErrors([response.error || 'Transition failed']);
      }
    } catch (error) {
      console.error('State transition error:', error);
      setValidationErrors([
        error instanceof Error ? error.message : 'An unexpected error occurred'
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!canTransition) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle size={20} />
              Not Authorized
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              You don't have permission to transition this order to{' '}
              <span className="font-semibold">
                {StateManager.getStatusMessage(targetStatus)}
              </span>
              .
            </p>

            <p className="text-xs text-gray-500">
              Required role: Admin, Manager, or Supervisor
              <br />
              Current role: {userRole}
            </p>

            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Status Change</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status transition visualization */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Status Transition</p>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <StatusBadge status={currentStatus} size="md" showMessage={true} />
              </div>

              <div className="flex-shrink-0">
                <div className="text-gray-400 text-2xl">→</div>
              </div>

              <div className="flex-1 text-right">
                <StatusBadge status={targetStatus} size="md" showMessage={true} />
              </div>
            </div>
          </div>

          {/* Validation errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex gap-2 mb-2">
                <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-800">Validation Errors</p>
              </div>
              <ul className="space-y-1 text-sm text-red-700">
                {validationErrors.map((error, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span>•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Notes input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this transition for the audit log..."
              disabled={isLoading}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Notes will be recorded in the audit log
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirm}
              disabled={isLoading || validationErrors.length > 0}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Confirm
                </>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default StateTransitionModal;
