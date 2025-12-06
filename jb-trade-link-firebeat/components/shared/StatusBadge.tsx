/**
 * Status Badge Component
 * 
 * Displays order status with color-coding and optional message
 * Consistent UI across the application
 * 
 * Phase 3.1: Status Model & Workflow Canon
 */

import React from 'react';
import { OrderStatus, STATUS_MESSAGES } from '@/types/workflow';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showMessage?: boolean;
  className?: string;
}

/**
 * Color scheme for each status
 * Follows common conventions:
 * - Green: Success (DELIVERED)
 * - Red: Failure/Problem (FAILED, DAMAGED, CANCELLED)
 * - Yellow: In Progress (OUT_FOR_DELIVERY)
 * - Blue: Pending approval (APPROVED, DISPATCHED)
 * - Purple: Process flow (RESCHEDULED)
 * - Gray: Draft/Placeholder (DRAFT)
 */
const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; border: string }> = {
  DRAFT: { 
    bg: 'bg-gray-100', 
    text: 'text-gray-800', 
    border: 'border-gray-300' 
  },
  APPROVED: { 
    bg: 'bg-blue-100', 
    text: 'text-blue-800', 
    border: 'border-blue-300' 
  },
  DISPATCHED: { 
    bg: 'bg-purple-100', 
    text: 'text-purple-800', 
    border: 'border-purple-300' 
  },
  OUT_FOR_DELIVERY: { 
    bg: 'bg-yellow-100', 
    text: 'text-yellow-800', 
    border: 'border-yellow-300' 
  },
  DELIVERED: { 
    bg: 'bg-green-100', 
    text: 'text-green-800', 
    border: 'border-green-300' 
  },
  FAILED: { 
    bg: 'bg-red-100', 
    text: 'text-red-800', 
    border: 'border-red-300' 
  },
  RESCHEDULED: { 
    bg: 'bg-orange-100', 
    text: 'text-orange-800', 
    border: 'border-orange-300' 
  },
  CANCELLED: { 
    bg: 'bg-gray-100', 
    text: 'text-gray-600', 
    border: 'border-gray-300' 
  },
  RETURNED: { 
    bg: 'bg-indigo-100', 
    text: 'text-indigo-800', 
    border: 'border-indigo-300' 
  },
  DAMAGED: { 
    bg: 'bg-red-100', 
    text: 'text-red-800', 
    border: 'border-red-300' 
  }
};

const SIZE_CLASSES = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showMessage = false,
  className = ''
}) => {
  const colors = STATUS_COLORS[status];
  const message = STATUS_MESSAGES[status];

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span
        className={`
          inline-block
          rounded-full
          border
          font-medium
          whitespace-nowrap
          ${SIZE_CLASSES[size]}
          ${colors.bg}
          ${colors.text}
          ${colors.border}
        `}
      >
        {status}
      </span>
      {showMessage && (
        <span className="text-xs text-gray-600 italic">
          {message}
        </span>
      )}
    </div>
  );
};

export default StatusBadge;
