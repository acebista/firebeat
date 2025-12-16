import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/ui/Elements';
import { ChallanValidationRow } from '../../../types/reports';
import { Printer, CheckCircle, AlertTriangle, Layout as LayoutIcon } from 'lucide-react';
import { printChallan, printChallans } from '../../../components/ChallanPrint';
import { OrderService, CustomerService, ProductService } from '../../../services/db';
import { Order, Customer, Product } from '../../../types';
import toast from 'react-hot-toast';

export const ChallanReport: React.FC<{ data: ChallanValidationRow[] }> = ({ data }) => {
  const issuesCount = data.filter(r => r.status === 'MISMATCH').length;
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
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
      const [ordersData, customersData, productsData] = await Promise.all([
        OrderService.getOrdersByIds(orderIds),
        CustomerService.getAll(),
        ProductService.getAll()
      ]);
      setOrders(ordersData);
      setCustomers(customersData);
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

    // Get customer location function - use GPS from order
    const getCustomerLocation = (order: Order) => {
      // GPS field has format: "27.715034, 85.324468" (lat, long)
      return (order as any)?.GPS;
    };

    // Use the new printChallans function with orientation support
    printChallans(validOrders, orientation, getCustomerLocation);
  };

  const handlePrintSingle = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      toast.error('Order not found');
      return;
    }

    // Use the new printChallan function with GPS location from order
    const customerLocation = (order as any)?.GPS;
    printChallan(order, customerLocation, orientation);
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
              className={`px-3 py-1 text-sm font-medium rounded flex items-center gap-1 transition ${
                orientation === 'portrait'
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
              className={`px-3 py-1 text-sm font-medium rounded flex items-center gap-1 transition ${
                orientation === 'landscape'
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
                      <Badge color={row.status === 'MATCH' ? 'green' : 'red'}>{row.status}</Badge>
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