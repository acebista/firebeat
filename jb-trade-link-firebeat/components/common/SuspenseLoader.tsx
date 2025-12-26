import React from 'react';
import { LoadingOverlay } from '../auth/LoadingOverlay';

/**
 * SuspenseLoader Component
 *
 * A full-screen loader to be used as a fallback for React.Suspense
 * when lazily loading route components.
 */
export const SuspenseLoader: React.FC = () => {
  return <LoadingOverlay message="Loading page..." />;
};
