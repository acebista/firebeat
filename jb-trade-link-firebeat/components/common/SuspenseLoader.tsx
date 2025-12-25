import React from 'react';
import { LoadingOverlay } from '../auth/LoadingOverlay';

interface SuspenseLoaderProps {
  message?: string;
}

export const SuspenseLoader: React.FC<SuspenseLoaderProps> = ({ message = 'Loading module...' }) => {
  return <LoadingOverlay message={message} />;
};
