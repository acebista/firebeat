/**
 * ProtectedRoute Integration Tests
 * 
 * Tests for:
 * - Route gating based on auth status
 * - Loading state during boot
 * - Error display on auth failure
 * - Role-based access control
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import { ProtectedRouteV2 } from '../../components/auth/ProtectedRouteV2';
import { AuthProvider } from '../../services/auth';
import { useUserStore } from '../../services/auth/userStore';

// Mock component to render when authorized
const MockProtectedPage = () => <div>Protected Content - User Admin</div>;

// Mock admin-only component
const MockAdminPage = () => <div>Admin Only Content</div>;

// Mock public component
const MockLoginPage = () => <div>Login Page</div>;

describe('ProtectedRouteV2 - Auth Gating', () => {
  beforeEach(() => {
    localStorage.clear();
    useUserStore.setState({
      user: null,
      session: null,
      bootStatus: 'idle',
      error: null,
      bootError: null,
    });
  });

  it('should show loading overlay while bootStatus is checking', async () => {
    // Set checking state
    useUserStore.setState({
      bootStatus: 'checking',
      user: null,
    });

    render(
      <HashRouter>
        <AuthProvider>
          <ProtectedRouteV2
            element={<MockProtectedPage />}
            requiredRole="admin"
            fallback={<MockLoginPage />}
          />
        </AuthProvider>
      </HashRouter>
    );

    // Should show loading indicator, not content
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should redirect to fallback when bootStatus=ready but no user', async () => {
    // Set ready state with no user
    useUserStore.setState({
      bootStatus: 'ready',
      user: null,
    });

    render(
      <HashRouter>
        <AuthProvider>
          <ProtectedRouteV2
            element={<MockProtectedPage />}
            requiredRole="admin"
            fallback={<MockLoginPage />}
          />
        </AuthProvider>
      </HashRouter>
    );

    // Should show fallback (login page), not protected content
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render protected content when user is authenticated', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin',
      company_id: 'company-1',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    // Set authenticated state
    useUserStore.setState({
      bootStatus: 'ready',
      user: mockUser,
      session: { access_token: 'mock-token' },
    });

    render(
      <HashRouter>
        <AuthProvider>
          <ProtectedRouteV2
            element={<MockProtectedPage />}
            requiredRole="admin"
            fallback={<MockLoginPage />}
          />
        </AuthProvider>
      </HashRouter>
    );

    // Should show protected content
    expect(screen.getByText('Protected Content - User Admin')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('should deny access when user lacks required role', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user', // Not admin
      company_id: 'company-1',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    // Set authenticated but non-admin user
    useUserStore.setState({
      bootStatus: 'ready',
      user: mockUser,
      session: { access_token: 'mock-token' },
    });

    render(
      <HashRouter>
        <AuthProvider>
          <ProtectedRouteV2
            element={<MockAdminPage />}
            requiredRole="admin"
            fallback={<MockLoginPage />}
          />
        </AuthProvider>
      </HashRouter>
    );

    // Should show fallback, not admin content
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Only Content')).not.toBeInTheDocument();
  });

  it('should display boot error when bootError is set', async () => {
    useUserStore.setState({
      bootStatus: 'ready',
      user: null,
      bootError: 'Session check timed out. Please try refreshing.',
    });

    render(
      <HashRouter>
        <AuthProvider>
          <ProtectedRouteV2
            element={<MockProtectedPage />}
            requiredRole="admin"
            fallback={<MockLoginPage />}
          />
        </AuthProvider>
      </HashRouter>
    );

    // Should show error message
    expect(screen.getByText(/Session check timed out/)).toBeInTheDocument();
  });

  it('should handle bootStatus=ready transition from checking', async () => {
    // Start with checking
    const { rerender } = render(
      <HashRouter>
        <AuthProvider>
          <ProtectedRouteV2
            element={<MockProtectedPage />}
            requiredRole="admin"
            fallback={<MockLoginPage />}
          />
        </AuthProvider>
      </HashRouter>
    );

    // Set checking state
    useUserStore.setState({
      bootStatus: 'checking',
      user: null,
    });

    rerender(
      <HashRouter>
        <AuthProvider>
          <ProtectedRouteV2
            element={<MockProtectedPage />}
            requiredRole="admin"
            fallback={<MockLoginPage />}
          />
        </AuthProvider>
      </HashRouter>
    );

    // Should show loading
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Transition to ready
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test',
      role: 'admin',
      company_id: 'company-1',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    useUserStore.setState({
      bootStatus: 'ready',
      user: mockUser,
    });

    rerender(
      <HashRouter>
        <AuthProvider>
          <ProtectedRouteV2
            element={<MockProtectedPage />}
            requiredRole="admin"
            fallback={<MockLoginPage />}
          />
        </AuthProvider>
      </HashRouter>
    );

    // Should now show protected content
    await waitFor(() => {
      expect(screen.getByText('Protected Content - User Admin')).toBeInTheDocument();
    });
  });
});

describe('ProtectedRoute - Role-Based Access Control', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should allow admin role when required', () => {
    const adminUser = {
      id: 'user-1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      company_id: 'company-1',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    useUserStore.setState({
      bootStatus: 'ready',
      user: adminUser,
    });

    render(
      <HashRouter>
        <AuthProvider>
          <ProtectedRouteV2
            element={<MockAdminPage />}
            requiredRole="admin"
            fallback={<MockLoginPage />}
          />
        </AuthProvider>
      </HashRouter>
    );

    expect(screen.getByText('Admin Only Content')).toBeInTheDocument();
  });

  it('should allow manager role when required', () => {
    const managerUser = {
      id: 'user-2',
      email: 'manager@example.com',
      name: 'Manager User',
      role: 'manager',
      company_id: 'company-1',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    useUserStore.setState({
      bootStatus: 'ready',
      user: managerUser,
    });

    render(
      <HashRouter>
        <AuthProvider>
          <ProtectedRouteV2
            element={<MockAdminPage />}
            requiredRole="manager"
            fallback={<MockLoginPage />}
          />
        </AuthProvider>
      </HashRouter>
    );

    // Manager should be able to access manager-only route
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('should deny user role when admin required', () => {
    const regularUser = {
      id: 'user-3',
      email: 'user@example.com',
      name: 'Regular User',
      role: 'user',
      company_id: 'company-1',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    useUserStore.setState({
      bootStatus: 'ready',
      user: regularUser,
    });

    render(
      <HashRouter>
        <AuthProvider>
          <ProtectedRouteV2
            element={<MockAdminPage />}
            requiredRole="admin"
            fallback={<MockLoginPage />}
          />
        </AuthProvider>
      </HashRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Only Content')).not.toBeInTheDocument();
  });
});

describe('ProtectedRoute - Inactive User Handling', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should deny access to inactive users', () => {
    const inactiveUser = {
      id: 'user-1',
      email: 'inactive@example.com',
      name: 'Inactive User',
      role: 'admin',
      company_id: 'company-1',
      is_active: false, // Inactive
      created_at: new Date().toISOString(),
    };

    useUserStore.setState({
      bootStatus: 'ready',
      user: inactiveUser,
    });

    render(
      <HashRouter>
        <AuthProvider>
          <ProtectedRouteV2
            element={<MockAdminPage />}
            requiredRole="admin"
            fallback={<MockLoginPage />}
          />
        </AuthProvider>
      </HashRouter>
    );

    // Should redirect even though role matches
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
