import React from 'react';

export const SuspenseLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full min-h-[50vh] w-full">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
        <p className="text-gray-500 font-medium text-sm">Loading module...</p>
      </div>
    </div>
  );
};
