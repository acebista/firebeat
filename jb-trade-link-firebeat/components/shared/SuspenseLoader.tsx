import React from 'react';

export const SuspenseLoader: React.FC = () => {
    return (
        <div className="flex items-center justify-center w-full h-full min-h-[50vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                <p className="text-gray-500 text-sm">Loading...</p>
            </div>
        </div>
    );
};
