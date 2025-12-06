import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { AuthErrorType } from '../../services/auth/authTypes';

interface ErrorBannerProps {
    error: AuthErrorType;
    onRetry?: () => void;
    onDismiss?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ error, onRetry, onDismiss }) => {
    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
                <p className="text-sm font-medium text-red-800">{error.message}</p>
                {error.retryable && onRetry && (
                    <button
                        onClick={onRetry}
                        className="mt-2 text-sm font-medium text-red-600 hover:text-red-700 underline"
                    >
                        Try again
                    </button>
                )}
            </div>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="text-red-400 hover:text-red-600 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
            )}
        </div>
    );
};
