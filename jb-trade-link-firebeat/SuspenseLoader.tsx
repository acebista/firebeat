import React from 'react';
import { LoadingOverlay } from './components/auth/LoadingOverlay';

export const SuspenseLoader: React.FC = () => {
    return <LoadingOverlay message="Loading module..." />;
};
