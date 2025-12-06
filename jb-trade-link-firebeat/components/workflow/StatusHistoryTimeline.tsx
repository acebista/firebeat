/**
 * Status History Timeline Component
 * 
 * Displays a visual timeline of all status transitions for an order
 * Shows who changed the status, when, and any notes
 * 
 * Phase 3.1: Status Model & Workflow Canon
 */

import React, { useState, useEffect } from 'react';
import { StateManager } from '@/services/workflow/stateManager';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { StatusHistoryEntry } from '@/types/workflow';
import { Clock, User } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface StatusHistoryTimelineProps {
  orderId: string;
  className?: string;
}

export function StatusHistoryTimeline({
  orderId,
  className = ''
}: StatusHistoryTimelineProps) {
  const [history, setHistory] = useState<StatusHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, [orderId]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const entries = await StateManager.getStatusHistory(orderId);
      setHistory(entries);
    } catch (err) {
      console.error('Failed to load status history:', err);
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <p className="text-sm text-red-800">
          <strong>Error:</strong> {error}
        </p>
        <button
          onClick={loadHistory}
          className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <Clock size={24} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">No status history yet</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {history.map((entry, index) => (
          <div key={entry.id} className="flex gap-4">
            {/* Timeline column */}
            <div className="flex flex-col items-center flex-shrink-0">
              {/* Dot */}
              <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-md" />

              {/* Line connector */}
              {index < history.length - 1 && (
                <div className="w-0.5 h-16 bg-gradient-to-b from-blue-200 to-gray-300 my-2" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <StatusBadge
                    status={entry.new_status}
                    size="sm"
                    showMessage={false}
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    {entry.new_status}
                  </span>
                </div>

                <div className="text-xs text-gray-600 flex items-center gap-1">
                  <Clock size={12} />
                  {formatDistanceToNow(new Date(entry.created_at), {
                    addSuffix: true
                  })}
                </div>
              </div>

              {/* User & Time */}
              <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                <User size={14} className="opacity-60" />
                <span>
                  {entry.user?.full_name || 'System'}
                </span>
              </div>

              {/* Full timestamp */}
              <div className="text-xs text-gray-500 mb-2">
                {format(new Date(entry.created_at), 'PPpp')}
              </div>

              {/* Reason/Notes */}
              {entry.reason && (
                <div className="bg-gray-50 border-l-2 border-blue-300 p-2 rounded text-sm text-gray-700 mb-2">
                  {entry.reason}
                </div>
              )}

              {/* From status if available */}
              {entry.previous_status && (
                <div className="text-xs text-gray-600">
                  Changed from <StatusBadge
                    status={entry.previous_status}
                    size="sm"
                    showMessage={false}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={loadHistory}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          Refresh History
        </button>
        <p className="text-xs text-gray-500 mt-2">
          {history.length} state transition{history.length !== 1 ? 's' : ''} recorded
        </p>
      </div>
    </div>
  );
}

export default StatusHistoryTimeline;
