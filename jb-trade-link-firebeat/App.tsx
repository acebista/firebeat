import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth, getDashboardPath } from './services/auth';
import { useUserStore } from './services/auth/userStore';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LoadingOverlay } from './components/auth/LoadingOverlay';
import { Login } from './pages/Login';
import { ResetPassword } from './pages/ResetPassword';
import { UserRole } from './types';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/Users';
import { CustomerManagement } from './pages/admin/Customers';
import { CompanyManagement } from './pages/admin/Companies';
import { UnknownProductCleanup } from './pages/admin/UnknownProductCleanup';
import { ProductManagement } from './pages/admin/Products';
import { OrderManagement } from './pages/admin/Orders';
import { DispatchPlanner } from './pages/admin/Dispatch';
import { DispatchTripDetails } from './pages/admin/DispatchTripDetails';
import { TripsOverview } from './pages/admin/TripsOverview';
import { VehicleManagement } from './pages/admin/Vehicles';
import { Purchases } from './pages/admin/Purchases';
import { Reports } from './pages/admin/Reports';
import { SystemHealth } from './pages/admin/SystemHealth';
import HRPanel from './components/admin/HRPanel';
import { CustomerLedgerPage } from './pages/admin/CustomerLedgerPage';
import { AllCreditsPage } from './pages/admin/AllCreditsPage';

// Returns & Damages
import { ReturnsList } from './pages/admin/Returns';
import { CreateReturn } from './pages/admin/CreateReturn';
import { DamagedGoodsReport } from './pages/admin/DamagedGoods';
import { Migration } from './pages/admin/Migration';
import { SupabaseTest } from './pages/admin/SupabaseTest';
import { InventoryPage } from './pages/inventory/InventoryPage';

// Sales Pages
import { SalesDashboard } from './pages/sales/SalesDashboard';
import { CreateOrder } from './pages/sales/CreateOrder';
import { EditOrder } from './pages/sales/EditOrder';
import { MyOrders } from './pages/sales/MyOrders';
import { PerformanceDashboard } from './pages/sales/PerformanceDashboard';

// Delivery Pages
import { DeliveryDashboard } from './pages/delivery/DeliveryDashboard';
import { DeliveryOrderDetails } from './pages/delivery/DeliveryOrderDetails';
import { RouteMap } from './pages/delivery/RouteMap';
import { PackingListPage } from './pages/delivery/PackingListPage';

// Placeholder for missing pages
const Placeholder = ({ title }: { title: string }) => (
  <div className="p-8 text-center text-gray-500">
    <h2 className="text-2xl font-bold mb-2">{title}</h2>
    <p>This module is under development.</p>
  </div>
);

// Protected Route Wrapper
const ProtectedRoute = ({ allowedRoles }: { allowedRoles: UserRole[] }) => {
  const { user, isLoading, isInitialized, state } = useAuth();
  const storeState = useUserStore();

  // Show loading overlay while boot is in progress
  // Don't redirect until boot is complete (bootStatus='ready')
  if (storeState.bootStatus === 'checking' || !isInitialized || isLoading) {
    const message = state.status === 'loading' ? state.message : 'Checking session...';
    return <LoadingOverlay message={message} />;
  }

  // Show error with retry option if boot failed
  if (storeState.bootStatus === 'ready' && storeState.bootError && !storeState.user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-red-600 mb-2">Session Check Failed</h2>
            <p className="text-gray-600 text-sm">{storeState.bootError}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => storeState.retryBoot()}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Retry
            </button>
            <button
              onClick={() => window.location.href = '/#/login'}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login only after we've confirmed no session exists
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to correct dashboard if accessing unauthorized route
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      <HashRouter>
        <Routes>
          <Route path="/test" element={<SupabaseTest />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/inventory" element={<InventoryPage />} />
            <Route path="/admin/companies" element={<CompanyManagement />} />
            <Route path="/admin/customers" element={<CustomerManagement />} />
            <Route path="/admin/customers/:customerId/ledger" element={<CustomerLedgerPage />} />
            <Route path="/admin/credits" element={<AllCreditsPage />} />
            <Route path="/admin/orders" element={<OrderManagement />} />
            <Route path="/admin/dispatch" element={<DispatchPlanner />} />
            <Route path="/admin/dispatch/trips/:id" element={<DispatchTripDetails />} />
            <Route path="/admin/trips" element={<TripsOverview />} />
            <Route path="/admin/vehicles" element={<VehicleManagement />} />
            <Route path="/admin/purchases" element={<Purchases />} />
            <Route path="/admin/hr" element={<HRPanel />} />

            {/* Returns & Damages */}
            <Route path="/admin/returns" element={<ReturnsList />} />
            <Route path="/admin/invoices/select-return" element={<CreateReturn />} />
            <Route path="/admin/invoices/:invoiceId/return" element={<CreateReturn />} />
            <Route path="/admin/damaged-goods" element={<DamagedGoodsReport />} />

            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/health" element={<SystemHealth />} />
            <Route path="/admin/migration" element={<Migration />} />
            <Route path="/admin/unknown-product-cleanup" element={<UnknownProductCleanup />} />
            <Route path="/admin/create-order" element={<CreateOrder />} />
          </Route>

          {/* Sales Routes */}
          <Route element={<ProtectedRoute allowedRoles={['sales', 'admin']} />}>
            <Route path="/sales/dashboard" element={<SalesDashboard />} />
            <Route path="/sales/create-order" element={<CreateOrder />} />
            <Route path="/sales/edit-order/:id" element={<EditOrder />} />
            <Route path="/sales/orders" element={<MyOrders />} />
            <Route path="/sales/performance" element={<PerformanceDashboard />} />
          </Route>

          {/* Delivery Routes */}
          <Route element={<ProtectedRoute allowedRoles={['delivery', 'admin']} />}>
            <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
            <Route path="/delivery/route-map" element={<RouteMap />} />
            <Route path="/delivery/invoice/:id" element={<DeliveryOrderDetails />} />
            <Route path="/delivery/packing-list/:tripId" element={<PackingListPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
