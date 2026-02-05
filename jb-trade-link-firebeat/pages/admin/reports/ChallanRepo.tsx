import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/ui/Elements';
import { ChallanValidationRow } from '../../../types/reports';
import { Printer, CheckCircle, AlertTriangle, Layout as LayoutIcon, CalendarClock } from 'lucide-react';
import { printChallan, printChallans } from '../../../components/ChallanPrint';
import { OrderService, ProductService } from '../../../services/db';
import { Order, Product } from '../../../types';
import toast from 'react-hot-toast';

export const ChallanReport: React.FC<{ data: ChallanValidationRow[], rescheduledData?: ChallanValidationRow[] }> = ({ data, rescheduledData = [] }) => {
  const issuesCount = data.filter(r => r.status === 'MISMATCH').length + rescheduledData.filter(r => r.status === 'MISMATCH').length;
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    loadOrdersAndCustomers();
  }, [data, rescheduledData]);

  const loadOrdersAndCustomers = async () => {
    setLoading(true);
    try {
      const allData = [...data, ...rescheduledData];
      const orderIds = allData.map(d => d.orderId);
      if (orderIds.length === 0) {
        setOrders([]);
        return;
      }
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

  const handlePrintAll = async (includeRescheduled = false) => {
    const activeData = includeRescheduled ? [...data, ...rescheduledData] : data;
    const validOrders = orders.filter(o => {
      const challanRow = activeData.find(d => d.orderId === o.id);
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
        `QR codes will not appear on these challans. Print anyway?`
      );
      if (!proceed) return;
    }

    const getCustomerLocation = (order: Order) => {
      const gps = (order as any)?.GPS;
      if (gps && typeof gps === 'string') {
        const parts = gps.split(',').map((p: string) => p.trim());
        if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
          return gps;
        }
      }
      return undefined;
    };

    printChallans(validOrders, orientation, getCustomerLocation);
    toast.success(`Printing ${validOrders.length} challans`);
  };

  const handlePrintSingle = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      toast.error('Order not found');
      return;
    }

    const gps = (order as any)?.GPS;
    let customerLocation: string | undefined;
    if (gps && typeof gps === 'string') {
      const parts = gps.split(',').map((p: string) => p.trim());
      if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
        customerLocation = gps;
      }
    }
    printChallan(order, customerLocation, orientation);
  };

  const renderTableRows = (rows: ChallanValidationRow[], isRescheduled = false) => {
    if (rows.length === 0) return null;
    return rows.map(row => (
      <tr key={row.orderId} className={row.status === 'MISMATCH' ? 'bg-red-50' : isRescheduled ? 'hover:bg-amber-50' : 'hover:bg-gray-50'}>
        <td className="px-4 py-2 font-mono text-xs text-indigo-600">{row.orderId}</td>
        <td className="px-4 py-2">
          {isRescheduled ? <Badge color="amber">↩ {row.rescheduledFrom}</Badge> : row.date}
        </td>
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
              className={`${isRescheduled ? 'text-amber-700 underline' : 'text-indigo-600'} hover:opacity-75 font-medium text-xs disabled:opacity-50`}>
              Print {isRescheduled ? 'Challan' : 'Challan'}
            </button>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Challan Validation & Generation</h3>
          {issuesCount > 0 ? (
            <p className="text-sm text-red-600 font-medium flex items-center mt-1">
              <AlertTriangle className="h-4 w-4 mr-1" /> {issuesCount} discrepancies found.
            </p>
          ) : (
            <p className="text-sm text-green-600 font-medium flex items-center mt-1">
              <CheckCircle className="h-4 w-4 mr-1" /> All calculations match.
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex gap-1 border border-gray-300 rounded-lg p-1 bg-gray-50">
            <button onClick={() => setOrientation('portrait')} className={`px-3 py-1 text-sm font-medium rounded ${orientation === 'portrait' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}><LayoutIcon className="h-4 w-4" /></button>
            <button onClick={() => setOrientation('landscape')} className={`px-3 py-1 text-sm font-medium rounded ${orientation === 'landscape' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}><LayoutIcon className="h-4 w-4 rotate-90" /></button>
          </div>
          <Button variant="outline" size="sm" onClick={() => handlePrintAll(false)} disabled={loading}>
            <Printer className="mr-2 h-4 w-4" /> Today Only ({data.length})
          </Button>
          <Button variant="primary" size="sm" onClick={() => handlePrintAll(true)} disabled={loading}>
            <Printer className="mr-2 h-4 w-4" /> Today + Rescheduled ({data.length + rescheduledData.length})
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
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
              {data.length === 0 && rescheduledData.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-400">No data available.</td></tr>
              ) : (
                <>
                  {renderTableRows(data)}
                  {rescheduledData.length > 0 && (
                    <tr className="bg-amber-50">
                      <td colSpan={7} className="px-4 py-2">
                        <div className="flex items-center gap-2 font-bold text-amber-800 uppercase tracking-wider text-xs">
                          <CalendarClock className="h-4 w-4" /> Rescheduled Orders
                        </div>
                      </td>
                    </tr>
                  )}
                  {renderTableRows(rescheduledData, true)}
                </>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};