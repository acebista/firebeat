import React, { Suspense } from 'react';
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
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const UserManagement = React.lazy(() => import('./pages/admin/Users').then(module => ({ default: module.UserManagement })));
const CustomerManagement = React.lazy(() => import('./pages/admin/Customers').then(module => ({ default: module.CustomerManagement })));
const CompanyManagement = React.lazy(() => import('./pages/admin/Companies').then(module => ({ default: module.CompanyManagement })));
const UnknownProductCleanup = React.lazy(() => import('./pages/admin/UnknownProductCleanup').then(module => ({ default: module.UnknownProductCleanup })));
const ProductManagement = React.lazy(() => import('./pages/admin/Products').then(module => ({ default: module.ProductManagement })));
const OrderManagement = React.lazy(() => import('./pages/admin/Orders').then(module => ({ default: module.OrderManagement })));
const DispatchPlanner = React.lazy(() => import('./pages/admin/Dispatch').then(module => ({ default: module.DispatchPlanner })));
const DispatchTripDetails = React.lazy(() => import('./pages/admin/DispatchTripDetails').then(module => ({ default: module.DispatchTripDetails })));
const TripsOverview = React.lazy(() => import('./pages/admin/TripsOverview').then(module => ({ default: module.TripsOverview })));
const VehicleManagement = React.lazy(() => import('./pages/admin/Vehicles').then(module => ({ default: module.VehicleManagement })));
const Purchases = React.lazy(() => import('./pages/admin/Purchases').then(module => ({ default: module.Purchases })));
const Reports = React.lazy(() => import('./pages/admin/Reports').then(module => ({ default: module.Reports })));
const SystemHealth = React.lazy(() => import('./pages/admin/SystemHealth').then(module => ({ default: module.SystemHealth })));
const HRPanel = React.lazy(() => import('./components/admin/HRPanel')); // Default export
const CustomerLedgerPage = React.lazy(() => import('./pages/admin/CustomerLedgerPage').then(module => ({ default: module.CustomerLedgerPage })));
const AllCreditsPage = React.lazy(() => import('./pages/admin/AllCreditsPage').then(module => ({ default: module.AllCreditsPage })));

// Returns & Damages
const ReturnsList = React.lazy(() => import('./pages/admin/Returns').then(module => ({ default: module.ReturnsList })));
const CreateReturn = React.lazy(() => import('./pages/admin/CreateReturn').then(module => ({ default: module.CreateReturn })));
const DamagedGoodsReport = React.lazy(() => import('./pages/admin/DamagedGoods').then(module => ({ default: module.DamagedGoodsReport })));
const Migration = React.lazy(() => import('./pages/admin/Migration').then(module => ({ default: module.Migration })));
const SupabaseTest = React.lazy(() => import('./pages/admin/SupabaseTest').then(module => ({ default: module.SupabaseTest })));
const InventoryPage = React.lazy(() => import('./pages/inventory/InventoryPage').then(module => ({ default: module.InventoryPage })));

// Sales Pages
const SalesDashboard = React.lazy(() => import('./pages/sales/SalesDashboard').then(module => ({ default: module.SalesDashboard })));
// CreateOrder is reused in admin/create-order, let's keep it lazy
const CreateOrder = React.lazy(() => import('./pages/sales/CreateOrder').then(module => ({ default: module.CreateOrder })));
const EditOrder = React.lazy(() => import('./pages/sales/EditOrder').then(module => ({ default: module.EditOrder })));
const MyOrders = React.lazy(() => import('./pages/sales/MyOrders').then(module => ({ default: module.MyOrders })));
const PerformanceDashboard = React.lazy(() => import('./pages/sales/PerformanceDashboard').then(module => ({ default: module.PerformanceDashboard })));

// Delivery Pages
const DeliveryDashboard = React.lazy(() => import('./pages/delivery/DeliveryDashboard').then(module => ({ default: module.DeliveryDashboard })));
const DeliveryOrderDetails = React.lazy(() => import('./pages/delivery/DeliveryOrderDetails').then(module => ({ default: module.DeliveryOrderDetails })));
const RouteMap = React.lazy(() => import('./pages/delivery/RouteMap').then(module => ({ default: module.RouteMap })));
const PackingListPage = React.lazy(() => import('./pages/delivery/PackingListPage').then(module => ({ default: module.PackingListPage })));

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
      <Suspense fallback={<LoadingOverlay message="Loading page..." />}>
        <Outlet />
      </Suspense>
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
          <Route path="/test" element={
            <Suspense fallback={<LoadingOverlay />}>
              <SupabaseTest />
            </Suspense>
          } />
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
