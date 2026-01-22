import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/ui/Elements';
import { ChallanValidationRow } from '../../../types/reports';
import { Printer, CheckCircle, AlertTriangle, Layout as LayoutIcon } from 'lucide-react';
import { printChallan, printChallans } from '../../../components/ChallanPrint';
import { OrderService, CustomerService, ProductService, UserService } from '../../../services/db';
import { Order, Customer, Product, User } from '../../../types';
import toast from 'react-hot-toast';

export const ChallanReport: React.FC<{ data: ChallanValidationRow[] }> = ({ data }) => {
  const issuesCount = data.filter(r => r.status === 'MISMATCH').length;
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    loadOrdersAndCustomers();
  }, [data]);

  const loadOrdersAndCustomers = async () => {
    setLoading(true);
    try {
      const orderIds = data.map(d => d.orderId);
      const [ordersData, productsData] = await Promise.all([
        OrderService.getOrdersByIds(orderIds),
        ProductService.getAll()
      ]);
      setOrders(ordersData);
      setProducts(productsData);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintAll = async () => {
    const validOrders = orders.filter(o => {
      const challanRow = data.find(d => d.orderId === o.id);
      return challanRow?.status === 'MATCH';
    });

    if (validOrders.length === 0) {
      toast.error('No valid challans to print');
      return;
    }

    // Sort by invoice number (ascending)
    validOrders.sort((a, b) => a.id.localeCompare(b.id));

    // Check for orders missing GPS data
    const ordersWithoutGPS = validOrders.filter(o => {
      const gps = (o as any)?.GPS;
      if (!gps || typeof gps !== 'string') return true;
      const parts = gps.split(',').map((p: string) => p.trim());
      return !(parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1])));
    });

    if (ordersWithoutGPS.length > 0) {
      const proceed = window.confirm(
        `⚠️ ${ordersWithoutGPS.length} of ${validOrders.length} order(s) are missing GPS location data.\n\n` +
        `Customers without location:\n${ordersWithoutGPS.slice(0, 5).map(o => `• ${o.customerName}`).join('\n')}` +
        `${ordersWithoutGPS.length > 5 ? `\n... and ${ordersWithoutGPS.length - 5} more` : ''}\n\n` +
        `QR codes will not appear on these challans.\n\n` +
        `Print anyway?`
      );
      if (!proceed) return;
    }

    // Orders are already enriched by OrderService
    const enrichedOrders = [...validOrders];

    // Get GPS coordinates for QR code - only return valid lat,lng format
    const getCustomerLocation = (order: Order) => {
      const gps = (order as any)?.GPS;
      if (gps && typeof gps === 'string') {
        const parts = gps.split(',').map((p: string) => p.trim());
        if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
          return gps;
        }
      }
      return undefined; // No valid GPS - QR won't appear
    };

    // Use the new printChallans function with orientation support
    printChallans(enrichedOrders, orientation, getCustomerLocation);
  };

  const handlePrintSingle = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      toast.error('Order not found');
      return;
    }

    const enrichedOrder = { ...order };

    // Use GPS location from order - only if valid coordinates
    const gps = (order as any)?.GPS;
    let customerLocation: string | undefined;
    if (gps && typeof gps === 'string') {
      const parts = gps.split(',').map((p: string) => p.trim());
      if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
        customerLocation = gps;
      }
    }
    printChallan(enrichedOrder, customerLocation, orientation);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Challan Validation & Generation</h3>
          {issuesCount > 0 ? (
            <p className="text-sm text-red-600 font-medium flex items-center mt-1">
              <AlertTriangle className="h-4 w-4 mr-1" /> {issuesCount} discrepancies found.
            </p>
          ) : (
            <p className="text-sm text-green-600 font-medium flex items-center mt-1">
              <CheckCircle className="h-4 w-4 mr-1" /> All calculations match system totals.
            </p>
          )}
        </div>
        <div className="flex gap-2 items-center">
          {/* Orientation Toggle */}
          <div className="flex gap-1 border border-gray-300 rounded-lg p-1 bg-gray-50">
            <button
              onClick={() => setOrientation('portrait')}
              className={`px-3 py-1 text-sm font-medium rounded flex items-center gap-1 transition ${orientation === 'portrait'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              title="Portrait (210mm × 297mm)"
            >
              <LayoutIcon className="h-4 w-4" />
              Portrait
            </button>
            <button
              onClick={() => setOrientation('landscape')}
              className={`px-3 py-1 text-sm font-medium rounded flex items-center gap-1 transition ${orientation === 'landscape'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              title="Landscape (297mm × 210mm)"
            >
              <LayoutIcon className="h-4 w-4 rotate-90" />
              Landscape
            </button>
          </div>
          <Button variant="primary" size="sm" disabled={issuesCount > 0 || loading} onClick={handlePrintAll}>
            <Printer className="mr-2 h-4 w-4" /> Print All Valid Challans
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto" id="challan-report-table">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Inv No</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Customer</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">Items</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Total</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600 no-print">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {data.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-400">No data available.</td></tr>
              ) : (
                data.map(row => (
                  <tr key={row.orderId} className={row.status === 'MISMATCH' ? 'bg-red-50' : 'hover:bg-gray-50'}>
                    <td className="px-4 py-2 font-mono text-xs text-indigo-600">{row.orderId}</td>
                    <td className="px-4 py-2">{row.date}</td>
                    <td className="px-4 py-2">{row.customerName}</td>
                    <td className="px-4 py-2 text-center">{row.itemsCount}</td>
                    <td className="px-4 py-2 text-right">₹{row.expectedTotal.toLocaleString()}</td>
                    <td className="px-4 py-2 text-center">
                      <Badge color={row.status === 'MATCH' ? 'emerald' : 'red'}>{row.status}</Badge>
                    </td>
                    <td className="px-4 py-2 text-center no-print">
                      {row.status === 'MATCH' && (
                        <button
                          onClick={() => handlePrintSingle(row.orderId)}
                          disabled={loading}
                          className="text-indigo-600 hover:text-indigo-900 font-medium text-xs disabled:opacity-50">
                          Print Challan
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};