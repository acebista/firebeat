import React from 'react';

export const SuspenseLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full min-h-[50vh] bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading module...</p>
      </div>
    </div>
  );
};
