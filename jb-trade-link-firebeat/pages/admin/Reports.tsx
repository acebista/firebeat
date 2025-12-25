import React, { useState, useEffect } from 'react';
import { ReportFilterState, SalesReportRow, DispatchRow, SchemeRow, ChallanValidationRow } from '../../types/reports';
import { ReportFilters } from '../../components/reports/ReportFilters';
import { SalesReport } from './reports/SalesRepo';
import { DispatchReport } from './reports/DispatchRepo';
import { SchemeReport } from './reports/SchemeRepo';
import { DamagedGoodsReport } from './DamagedGoods';
import { ChallanReport } from './reports/ChallanRepo';
import { DeliveryReport, DeliveryReportData } from './reports/DeliveryRepo';
import { DeliveryReportFilters, DeliveryReportFilters as DeliveryFiltersType } from '../../components/reports/DeliveryReportFilters';
import { FileText, Truck, Percent, AlertTriangle, FileCheck, UserCheck } from 'lucide-react';
import { OrderService, ProductService, UserService, ReturnService, CompanyService } from '../../services/db';
import { CommissionRateService } from '../../services/hr'; // Import CommissionRateService
import { Order, Product, User, SalesReturn, Company } from '../../types';
import { CommissionRate } from '../../types/hr'; // Import CommissionRate type
import { HRCommissionReport } from './reports/HRCommissionRepo'; // Component

// --- Metric Calculation Helper ---
// This moves the logic from MockReportService to the Client Component
// In a production app with thousands of orders, this should be a Firebase Cloud Function or Aggregation Query.
const calculateMetrics = (orders: Order[], filters: ReportFilterState, products: Product[]) => {

  // Separate regular orders from rescheduled orders
  const regularOrders = orders.filter(o => !(o as any).rescheduled_from);
  const rescheduledOrders = orders.filter(o => !!(o as any).rescheduled_from);

  // Helper to map order to sales row
  const mapToSalesRow = (o: Order): SalesReportRow => {
    const discountAmount = o.discount || 0;
    const subTotal = o.totalAmount + discountAmount;
    const comps = Array.from(new Set((o.items || []).map(i => i.companyName || 'Unknown')));

    return {
      id: o.id,
      date: o.date,
      invoiceNo: o.id,
      salespersonName: o.salespersonName,
      customerName: o.customerName,
      companyName: comps.length > 1 ? 'Mixed' : (comps[0] || 'Unknown'),
      subTotal: subTotal,
      discountAmount: discountAmount,
      grandTotal: o.totalAmount,
      paymentMode: (o as any).paymentMethod || 'Cash',
      netAmount: o.totalAmount,
      order: o
    };
  };

  // 1. Sales Rows - Regular Orders
  const salesRows: SalesReportRow[] = regularOrders.map(mapToSalesRow);

  // 1b. Sales Rows - Rescheduled Orders
  const rescheduledSalesRows: SalesReportRow[] = rescheduledOrders.map(mapToSalesRow);

  // 2. Dispatch Rows - Use products table for packaging data
  const productMap = new Map<string, DispatchRow>();

  // Create a quick lookup map for products
  const productLookup = new Map<string, Product>();
  products.forEach(p => productLookup.set(p.id, p));

  console.log('[Dispatch Report] Starting calculation with:', {
    totalOrders: orders.length,
    totalProducts: products.length,
    companyFilter: filters.companyIds
  });

  // Log first order to inspect structure
  if (orders.length > 0) {
    console.log('[Dispatch Report] Sample order:', {
      id: orders[0].id,
      hasItems: !!orders[0].items,
      itemsIsArray: Array.isArray(orders[0].items),
      itemsType: typeof orders[0].items,
      itemsCount: Array.isArray(orders[0].items) ? orders[0].items.length : 'N/A',
      firstItem: Array.isArray(orders[0].items) ? orders[0].items[0] : orders[0].items
    });
  }

  regularOrders.forEach(order => {
    // Parse items if they're stored as JSON string
    let items = order.items;

    if (typeof items === 'string') {
      try {
        items = JSON.parse(items);
      } catch (e) {
        console.error('[Dispatch Report] Failed to parse items JSON for order:', order.id, e);
        return;
      }
    }

    if (!items || !Array.isArray(items)) {
      console.warn('[Dispatch Report] Order missing or invalid items:', order.id);
      return; // Safety check
    }

    items.forEach((item: any) => {
      // Robust field mapping
      const pId = item.productId;
      const masterProduct = productLookup.get(pId);

      // Resolve fields with fallbacks
      const resolvedProductName = masterProduct?.name || item.productName || item.tempProductName || 'Unknown Product';
      const resolvedCompanyName = masterProduct?.companyName || item.companyName || 'Unknown';
      const resolvedQty = Number(item.qty || item.quantity) || 0;
      const resolvedTotal = Number(item.total || item.amount) || 0;

      // Log if we had to fallback to unknown
      if (resolvedCompanyName === 'Unknown' || resolvedProductName === 'Unknown Product') {
        // Keep log concise
        // console.warn('[Dispatch Report] Could not resolve product/company details for item:', item);
      }

      if (filters.companyIds.length > 0 && !filters.companyIds.includes(masterProduct?.companyId || item.companyId || '')) return;

      if (!productMap.has(pId)) {
        productMap.set(pId, {
          productId: pId,
          productName: resolvedProductName,
          companyName: resolvedCompanyName,
          totalQty: 0,
          cartons: 0,
          packets: 0,
          pieces: 0,
          totalAmount: 0
        });
      }
      const entry = productMap.get(pId)!;
      entry.totalQty += resolvedQty;
      entry.totalAmount += resolvedTotal;
    });
  });

  console.log('[Dispatch Report] Product map size:', productMap.size);

  // Calculate cartons, packets, and pieces breakdown using products table
  const dispatchRows = Array.from(productMap.values()).map(row => {
    // Lookup product from products table
    const product = productLookup.get(row.productId);

    // Default to 0 if missing to avoid division by zero (logic already protected below)
    const packetsPerCarton = product?.packetsPerCarton || 0;
    const piecesPerPacket = product?.piecesPerPacket || 0;
    const totalPieces = row.totalQty; // Total quantity in pieces

    // Calculate pieces per carton (avoid division by zero)
    const piecesPerCartonTotal = packetsPerCarton * piecesPerPacket;

    // Break down into cartons, packets, and pieces
    let cartons = 0;
    let packets = 0;
    let pieces = 0;

    if (piecesPerCartonTotal > 0) {
      cartons = Math.floor(totalPieces / piecesPerCartonTotal);
      const remainingAfterCartons = totalPieces - (cartons * piecesPerCartonTotal);

      if (piecesPerPacket > 0) {
        packets = Math.floor(remainingAfterCartons / piecesPerPacket);
        pieces = remainingAfterCartons % piecesPerPacket;
      } else {
        pieces = remainingAfterCartons;
      }
    } else {
      // If no packaging data, show all as pieces
      pieces = totalPieces;
    }

    return {
      productId: row.productId,
      productName: row.productName,
      companyName: row.companyName,
      totalQty: row.totalQty,
      cartons: cartons,
      packets: packets,
      pieces: pieces,
      totalAmount: row.totalAmount
    };
  });

  console.log('[Dispatch Report] Final dispatch rows:', dispatchRows.length);

  // 2b. Rescheduled Dispatch Rows
  const rescheduledProductMap = new Map<string, DispatchRow>();
  rescheduledOrders.forEach(order => {
    let items = order.items;
    if (typeof items === 'string') {
      try { items = JSON.parse(items); } catch (e) { return; }
    }
    if (!items || !Array.isArray(items)) return;
    items.forEach((item: any) => {
      const pId = item.productId;
      const masterProduct = productLookup.get(pId);
      const resolvedProductName = masterProduct?.name || item.productName || 'Unknown Product';
      const resolvedCompanyName = masterProduct?.companyName || item.companyName || 'Unknown';
      const resolvedQty = Number(item.qty || item.quantity) || 0;
      const resolvedTotal = Number(item.total || item.amount) || 0;
      if (filters.companyIds.length > 0 && !filters.companyIds.includes(masterProduct?.companyId || item.companyId || '')) return;
      if (!rescheduledProductMap.has(pId)) {
        rescheduledProductMap.set(pId, { productId: pId, productName: resolvedProductName, companyName: resolvedCompanyName, totalQty: 0, cartons: 0, packets: 0, pieces: 0, totalAmount: 0 });
      }
      const entry = rescheduledProductMap.get(pId)!;
      entry.totalQty += resolvedQty;
      entry.totalAmount += resolvedTotal;
    });
  });

  const rescheduledDispatchRows = Array.from(rescheduledProductMap.values()).map(row => {
    const product = productLookup.get(row.productId);
    const packetsPerCarton = product?.packetsPerCarton || 0;
    const piecesPerPacket = product?.piecesPerPacket || 0;
    const piecesPerCartonTotal = packetsPerCarton * piecesPerPacket;
    let cartons = 0, packets = 0, pieces = 0;
    const totalPieces = row.totalQty;
    if (piecesPerCartonTotal > 0) {
      cartons = Math.floor(totalPieces / piecesPerCartonTotal);
      const remaining = totalPieces - (cartons * piecesPerCartonTotal);
      if (piecesPerPacket > 0) { packets = Math.floor(remaining / piecesPerPacket); pieces = remaining % piecesPerPacket; } else { pieces = remaining; }
    } else { pieces = totalPieces; }
    return { productId: row.productId, productName: row.productName, companyName: row.companyName, totalQty: row.totalQty, cartons, packets, pieces, totalAmount: row.totalAmount };
  });

  console.log('[Dispatch Report] Rescheduled dispatch rows:', rescheduledDispatchRows.length);

  // 3. Scheme Rows (Simplified)
  const schemeRows: SchemeRow[] = [];

  // 4. Challan Rows
  const challanRows: ChallanValidationRow[] = orders.map(o => ({
    orderId: o.id,
    invoiceNo: o.id,
    customerName: o.customerName,
    date: o.date,
    expectedTotal: o.totalAmount,
    calculatedTotal: o.totalAmount,
    difference: 0,
    status: 'MATCH',
    itemsCount: o.totalItems
  }));

  return { salesRows, rescheduledSalesRows, dispatchRows, rescheduledDispatchRows, schemeRows, challanRows };
};



// Inside Reports component
export const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sales' | 'dispatch' | 'scheme' | 'damage' | 'challan' | 'delivery' | 'hr'>('sales');

  const [filters, setFilters] = useState<ReportFilterState>({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    companyIds: [],
    employeeIds: []
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [commissionRates, setCommissionRates] = useState<CommissionRate[]>([]);

  const [reportData, setReportData] = useState<{
    salesRows: SalesReportRow[],
    rescheduledSalesRows: SalesReportRow[],
    dispatchRows: DispatchRow[],
    rescheduledDispatchRows: DispatchRow[],
    schemeRows: SchemeRow[],
    challanRows: ChallanValidationRow[]
  }>({ salesRows: [], rescheduledSalesRows: [], dispatchRows: [], rescheduledDispatchRows: [], schemeRows: [], challanRows: [] });

  const [deliveryReportData, setDeliveryReportData] = useState<DeliveryReportData>({
    rows: [],
    summary: {
      totalInvoices: 0,
      totalDelivered: 0,
      totalReturned: 0,
      totalPartiallyReturned: 0,
      totalAmount: 0,
      totalCollected: 0,
      paymentBreakdown: {}
    }
  });

  // Delivery report specific filters
  const [deliveryFilters, setDeliveryFilters] = useState<DeliveryFiltersType>({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    deliveryUserId: ''
  });

  // Delivery users for filter dropdown
  const [deliveryUsers, setDeliveryUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(false);
  const [deliveryReportError, setDeliveryReportError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Use server-side filtering for efficiency
      // Note: getOrdersFiltered currently supports single salesperson ID. 
      // If multiple are selected, we might need to fetch by date range and filter client side, 
      // or update the service to support array. For now, we fetch by date range and filter client side for multiple employees.

      let orders: Order[] = [];

      if (filters.employeeIds.length === 1) {
        // Optimized path for single employee
        orders = await OrderService.getOrdersFilteredPaged(
          filters.startDate,
          filters.endDate,
          filters.employeeIds[0]
        );
      } else {
        // Fetch by date range and filter in memory for multiple employees
        orders = await OrderService.getOrdersByDateRangePaged(
          filters.startDate,
          filters.endDate
        );

        if (filters.employeeIds.length > 0) {
          orders = orders.filter(o => filters.employeeIds.includes(o.salespersonId));
        }
      }

      // Fetch all products for packaging data lookup
      const products = await ProductService.getAll();
      const companies = await CompanyService.getAll();
      const commissionRates = await CommissionRateService.getAll();

      // Update state for HR Report
      setProducts(products);
      setCompanies(companies);
      setCommissionRates(commissionRates);

      console.log('[Reports] Fetched data:', {
        ordersCount: orders.length,
        productsCount: products.length,
        companiesCount: companies.length,
        ratesCount: commissionRates.length,
        filters: filters
      });

      const calculated = calculateMetrics(orders, filters, products);

      console.log('[Reports] Calculated metrics:', {
        salesRows: calculated.salesRows.length,
        dispatchRows: calculated.dispatchRows.length,
        schemeRows: calculated.schemeRows.length,
        challanRows: calculated.challanRows.length
      });

      setReportData(calculated);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryData = async () => {
    setLoading(true);
    try {
      console.log('[Delivery] Starting data fetch...');

      // Fetch orders for the date range with delivered/completed status
      let orders = await OrderService.getOrdersByDateRangePaged(
        deliveryFilters.startDate,
        deliveryFilters.endDate
      );

      // Filter to only delivered/completed/returned orders
      const deliveryStatuses = ['delivered', 'completed', 'dispatched', 'partially_returned', 'returned'];
      orders = orders.filter(o => deliveryStatuses.includes(o.status));

      // Fetch all users to resolve delivery user names
      const allUsers = await UserService.getAll();
      const userMap = new Map<string, User>();
      allUsers.forEach(u => userMap.set(u.id, u));

      // Store delivery users for filter dropdown (only delivery role users)
      const deliveryRoleUsers = allUsers.filter(u => u.role === 'delivery');
      setDeliveryUsers(deliveryRoleUsers);

      // Fetch all returns to link with invoices
      const allReturns = await ReturnService.getAll();
      const returnsByInvoiceId = new Map<string, SalesReturn>();
      allReturns.forEach(r => returnsByInvoiceId.set(r.invoiceId, r));

      // Process each order into a report row
      const rows = orders.map(order => {
        const discountAmount = order.discount || 0;
        const subtotal = order.totalAmount + discountAmount;
        const salesReturn = returnsByInvoiceId.get(order.id);
        const returnAmount = salesReturn?.totalReturnAmount || 0;

        // Use the newly added AR/Reporting fields
        const deliveryUserId = order.delivered_by || '';
        const deliveryUser = deliveryUserId ? userMap.get(deliveryUserId) : null;
        const deliveryUserName = deliveryUser?.name || '';

        // Get payment method from the delivery capture field
        const paymentMethod = order.payment_method_at_delivery || order.paymentMode || 'cash';

        // Use the actual collected amount recorded at delivery
        const collectedAmount = (order.payment_collected !== undefined && order.payment_collected !== null)
          ? Number(order.payment_collected)
          : (order.status === 'delivered' || order.status === 'completed' ? order.totalAmount : 0);

        return {
          invoiceId: order.id,
          invoiceNumber: order.id,
          customerName: order.customerName,
          salespersonName: order.salespersonName,
          deliveryUserName,
          deliveryUserId,
          status: order.status,
          subtotal,
          discount: discountAmount,
          netAmount: order.totalAmount,
          paymentMethod,
          collectedAmount,
          returnAmount: salesReturn ? salesReturn.totalReturnAmount : undefined,
          returnQty: salesReturn ? (salesReturn as any).totalReturnQty : undefined,
          date: order.date,
          order,
          salesReturn
        };
      });

      // Filter by delivery user if selected
      let filteredRows = rows;
      if (deliveryFilters.deliveryUserId) {
        filteredRows = rows.filter(r => r.deliveryUserId === deliveryFilters.deliveryUserId);
      }

      // Calculate summary statistics
      const summary = {
        totalInvoices: filteredRows.length,
        totalDelivered: filteredRows.filter(r => r.status.toLowerCase() === 'delivered' || r.status.toLowerCase() === 'completed').length,
        totalReturned: filteredRows.filter(r => r.status.toLowerCase() === 'returned' || r.status.toLowerCase() === 'cancelled').length,
        totalPartiallyReturned: filteredRows.filter(r => r.status.toLowerCase() === 'partially_returned').length,
        totalAmount: filteredRows.reduce((sum, r) => sum + r.netAmount, 0),
        totalCollected: filteredRows.reduce((sum, r) => sum + r.collectedAmount, 0),
        paymentBreakdown: filteredRows.reduce((breakdown, row) => {
          const method = (row.paymentMethod || 'cash').toString().toLowerCase();
          if (!breakdown[method]) {
            breakdown[method] = { count: 0, amount: 0 };
          }
          breakdown[method].count++;
          breakdown[method].amount += row.collectedAmount;
          return breakdown;
        }, {} as Record<string, { count: number; amount: number }>)
      };

      console.log('[Delivery] Data processed successfully:', {
        ordersCount: filteredRows.length,
        totalCollected: summary.totalCollected,
        summary
      });

      setDeliveryReportData({ rows: filteredRows, summary });
      setDeliveryReportError(null);

    } catch (e: any) {
      console.error('[Delivery] Error fetching data:', e);
      const errorMsg = e?.message || 'Failed to fetch delivery data';
      setDeliveryReportError(errorMsg);

      // Set empty data instead of leaving stale data
      setDeliveryReportData({
        rows: [],
        summary: {
          totalInvoices: 0,
          totalDelivered: 0,
          totalReturned: 0,
          totalPartiallyReturned: 0,
          totalAmount: 0,
          totalCollected: 0,
          paymentBreakdown: {},
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'delivery') {
      fetchDeliveryData();
    } else if (activeTab !== 'damage') {
      fetchData();
    }
  }, [filters, activeTab, deliveryFilters]);

  const tabs = [
    { id: 'sales', label: 'Sales Report', icon: FileText },
    { id: 'dispatch', label: 'Dispatch / Packing', icon: Truck },
    { id: 'scheme', label: 'Secondary Scheme', icon: Percent },
    { id: 'damage', label: 'Damaged Goods', icon: AlertTriangle },
    { id: 'challan', label: 'Challan Validation', icon: FileCheck },
    { id: 'delivery', label: 'Delivery Report', icon: UserCheck },
    { id: 'hr', label: 'HR & Commission', icon: UserCheck }, // Reusing UserCheck icon
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
        {loading && <span className="text-sm text-gray-500 animate-pulse">Updating data...</span>}
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all ${activeTab === tab.id
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
              }`}
          >
            <tab.icon className="mr-2 h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'delivery' && (
        <DeliveryReportFilters
          filters={deliveryFilters}
          setFilters={setDeliveryFilters}
          deliveryUsers={deliveryUsers}
          onGenerate={fetchDeliveryData}
          loading={loading}
        />
      )}

      {activeTab !== 'damage' && activeTab !== 'delivery' && (
        <ReportFilters filters={filters} setFilters={setFilters} onGenerate={fetchData} />
      )}

      {loading && activeTab !== 'delivery' && (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {!loading && (
        <>
          {activeTab === 'sales' && <SalesReport data={reportData.salesRows} rescheduledData={reportData.rescheduledSalesRows} />}
          {activeTab === 'dispatch' && <DispatchReport data={reportData.dispatchRows} rescheduledData={reportData.rescheduledDispatchRows} />}
          {activeTab === 'scheme' && <SchemeReport data={reportData.schemeRows} />}
          {activeTab === 'damage' && <DamagedGoodsReport />}
          {activeTab === 'challan' && <ChallanReport data={reportData.challanRows} />}
          {activeTab === 'delivery' && (
            <>
              {deliveryReportError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded-lg text-red-700">
                  <strong>Error loading delivery data:</strong> {deliveryReportError}
                  <button
                    onClick={() => fetchDeliveryData()}
                    className="ml-2 text-red-600 hover:text-red-800 font-semibold"
                  >
                    Retry
                  </button>
                </div>
              )}
              {loading && <div className="text-center py-8 text-gray-500">Loading delivery data...</div>}
              {!loading && <DeliveryReport data={deliveryReportData} />}
            </>
          )}
          {activeTab === 'hr' && <HRCommissionReport data={reportData.salesRows} products={products} companies={companies} commissionRates={commissionRates} />}
        </>
      )}
    </div>
  );
};

export default Reports;