import React from 'react';

export const SuspenseLoader: React.FC = () => {
    return (
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
                <p className="text-gray-500 font-medium">Loading...</p>
            </div>
        </div>
    );
};
