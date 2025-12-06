import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth';
import { UserRole } from '../../types';

interface WorkspaceSwitcherProps {
    className?: string;
}

export const WorkspaceSwitcher: React.FC<WorkspaceSwitcherProps> = ({ className = '' }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Only show for admin users
    if (!user || user.role !== 'admin') {
        return null;
    }

    const workspaces = [
        {
            id: 'admin',
            label: 'Admin',
            path: '/admin/dashboard',
            icon: '⚙️',
            color: 'bg-indigo-100 text-indigo-700 border-indigo-300'
        },
        {
            id: 'sales',
            label: 'Sales',
            path: '/sales/dashboard',
            icon: '💼',
            color: 'bg-green-100 text-green-700 border-green-300'
        },
        {
            id: 'delivery',
            label: 'Delivery',
            path: '/delivery/dashboard',
            icon: '🚚',
            color: 'bg-blue-100 text-blue-700 border-blue-300'
        },
    ];

    // Determine current workspace from URL
    const currentPath = window.location.hash.substring(1); // Remove #
    const currentWorkspace = workspaces.find(w => currentPath.startsWith(w.path.split('/')[1])) || workspaces[0];

    const handleSwitch = (path: string) => {
        navigate(path);
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <span className="text-xs text-gray-500 font-medium hidden sm:inline">DEV MODE:</span>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
                {workspaces.map((workspace) => {
                    const isActive = currentWorkspace.id === workspace.id;
                    return (
                        <button
                            key={workspace.id}
                            onClick={() => handleSwitch(workspace.path)}
                            className={`
                px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200
                flex items-center gap-1.5
                ${isActive
                                    ? `${workspace.color} border shadow-sm`
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-transparent'
                                }
              `}
                            title={`Switch to ${workspace.label} workspace`}
                        >
                            <span className="text-sm">{workspace.icon}</span>
                            <span className="hidden sm:inline">{workspace.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
