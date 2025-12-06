import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/ui/Elements';
import { ChallanValidationRow } from '../../../types/reports';
import { Printer, CheckCircle, AlertTriangle } from 'lucide-react';
import { printChallan } from '../../../components/ChallanPrint';
import { OrderService, CustomerService, ProductService } from '../../../services/db';
import { Order, Customer, Product } from '../../../types';
import toast from 'react-hot-toast';

export const ChallanReport: React.FC<{ data: ChallanValidationRow[] }> = ({ data }) => {
  const issuesCount = data.filter(r => r.status === 'MISMATCH').length;
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

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

    // Create single print window with all challans
    const printWindow = window.open('', '', 'height=800,width=600');
    if (!printWindow) {
      toast.error('Please allow popups to print');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Delivery Challans - Batch Print</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            @media print {
              @page { 
                size: A4 portrait;
                margin: 0;
              }
              body { 
                margin: 0;
                padding: 0;
              }
              .challan-page {
                page-break-after: always;
                page-break-inside: avoid;
              }
              .challan-page:last-child {
                page-break-after: auto;
              }
            }
            
            @media screen {
              body {
                background: #f0f0f0;
                padding: 20px;
              }
              .challan-page {
                margin-bottom: 20px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
              }
            }
            
            body { 
              font-family: Arial, sans-serif; 
              font-size: 11pt;
            }
            
            .challan-page {
              width: 210mm;
              min-height: 297mm;
              max-height: 297mm;
              padding: 10mm;
              border: 2px solid black;
              background: white;
              position: relative;
              overflow: hidden;
            }
            
            .header { 
              text-align: center; 
              margin-bottom: 15px; 
              position: relative;
              border-bottom: 2px solid black;
              padding-bottom: 10px;
            }
            .header h1 { 
              margin: 0; 
              font-size: 20pt; 
              font-weight: bold; 
            }
            .header h2 { 
              margin: 3px 0; 
              font-size: 14pt; 
              font-weight: normal; 
            }
            .header p { 
              margin: 2px 0; 
              font-size: 10pt; 
            }
            .qr-code { 
              position: absolute; 
              top: 0; 
              right: 0; 
            }
            
            .details { 
              margin-bottom: 12px; 
              font-size: 10pt; 
            }
            .details div { 
              margin-bottom: 3px; 
            }
            
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 15px; 
              font-size: 9pt; 
            }
            th { 
              border: 1.5px solid black; 
              padding: 6px 4px; 
              background-color: #e0e0e0; 
              font-weight: bold;
            }
            td { 
              border: 1px solid black; 
              padding: 4px; 
            }
            
            .totals { 
              margin-bottom: 20px; 
              font-size: 10pt; 
            }
            .totals div { 
              margin-bottom: 5px; 
            }
            .grand-total { 
              font-size: 13pt; 
              font-weight: bold; 
              margin-top: 8px; 
            }
            
            .signatures { 
              margin-top: 30px; 
              font-size: 10pt; 
            }
            .signatures div { 
              margin-bottom: 40px; 
            }
          </style>
        </head>
        <body>
    `);

    // Add each challan
    validOrders.forEach((order, index) => {
      const customer = customers.find(c => c.id === order.customerId);
      const customerLocation = (customer as any)?.location;
      const qrUrl = customerLocation
        ? `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`https://www.google.com/maps?q=${customerLocation}`)}`
        : '';

      const subtotal = order.items?.reduce((sum: number, item: any) => sum + (item.total || 0), 0) || 0;
      const discountAmount = order.discount || 0;
      const discountPct = subtotal > 0 ? ((discountAmount / subtotal) * 100).toFixed(2) : '0';
      const grandTotal = order.totalAmount || 0;
      const paymentMethod = (order as any).paymentMethod || 'Cash';

      // Determine how many copies to print
      const copies = paymentMethod.toLowerCase() === 'cash' ? ['Customer Copy'] : ['Customer Copy', 'Vendor Copy'];

      // Print each copy
      copies.forEach((copyType) => {
        printWindow.document.write(`
          <div class="challan-page">
            <div class="header">
              <h1>J.B Trade Link Pvt. Ltd.</h1>
              <h2>Delivery Challan</h2>
              <p>Phone: 9802379658</p>
              <p style="font-weight: bold;">${copyType}</p>
              ${qrUrl ? `<div class="qr-code"><img src="${qrUrl}" alt="Location QR" width="100" height="100" /></div>` : ''}
            </div>

            <div class="details">
              <div><strong>Invoice No:</strong> ${order.id}</div>
              <div><strong>Salesman:</strong> ${order.salespersonName}</div>
              <div><strong>Customer Name:</strong> ${order.customerName}</div>
              <div><strong>Payment Mode:</strong> ${paymentMethod}</div>
              <div><strong>Products Sold:</strong></div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="width: 30px; text-align: center;">#</th>
                  <th style="text-align: left;">Product</th>
                  <th style="width: 50px; text-align: center;">Qty</th>
                  <th style="width: 65px; text-align: right;">Rate</th>
                  <th style="width: 75px; text-align: right;">SubTotal</th>
                  <th style="width: 60px; text-align: right;">Disc</th>
                  <th style="width: 75px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items?.map((item: any, idx: number) => {
          // Find product to get baseRate and discountedRate
          const product = products.find(p => p.id === item.productId);
          const baseRate = product?.baseRate || item.rate || 0;
          const actualRate = item.rate || 0;

          // Calculate values
          const qty = item.qty || 0;
          const subtotalAtBase = baseRate * qty;
          const actualTotal = item.total || 0;
          const discountPct = baseRate > 0 ? (((baseRate - actualRate) / baseRate) * 100) : 0;

          return `
                    <tr>
                      <td style="text-align: center;">${idx + 1}</td>
                      <td>${item.productName}</td>
                      <td style="text-align: center;">${qty}</td>
                      <td style="text-align: right;">${baseRate.toFixed(2)}</td>
                      <td style="text-align: right;">${subtotalAtBase.toFixed(2)}</td>
                      <td style="text-align: right;">${discountPct.toFixed(2)}%</td>
                      <td style="text-align: right; font-weight: bold;">${actualTotal.toFixed(2)}</td>
                    </tr>
                  `;
        }).join('')}
              </tbody>
            </table>

            <div class="totals">
              <div><strong>Sub Total: Rs. ${subtotal.toFixed(2)}</strong></div>
              ${discountAmount > 0 ? `<div><strong>Discount (${discountPct}%): Rs. ${discountAmount.toFixed(2)}</strong></div>` : ''}
              <div class="grand-total">Grand Total: Rs. ${grandTotal.toFixed(2)}</div>
            </div>

            <div class="signatures">
              <div>For J.B. Trade Link: _______________________</div>
              <div>Customer Signature: _______________________</div>
            </div>
          </div>
        `);
      });
    });

    printWindow.document.write(`
        </body>
      </html>
    `);

    printWindow.document.close();

    // Wait for images (QR codes) to load before printing
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 1000);
  };

  const handlePrintSingle = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      toast.error('Order not found');
      return;
    }

    // Filter to only this order and use the print all logic
    const singleOrderList = [order];

    // Create print window
    const printWindow = window.open('', '', 'height=800,width=600');
    if (!printWindow) {
      toast.error('Please allow popups to print');
      return;
    }

    // Use same HTML structure as handlePrintAll
    printWindow.document.write(`
      <html>
        <head>
          <title>Delivery Challan - ${order.id}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            @media print {
              @page { size: A4 portrait; margin: 0; }
              body { margin: 0; padding: 0; }
              .challan-page { page-break-after: always; page-break-inside: avoid; }
              .challan-page:last-child { page-break-after: auto; }
            }
            @media screen {
              body { background: #f0f0f0; padding: 20px; }
              .challan-page { margin-bottom: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            }
            body { font-family: Arial, sans-serif; font-size: 11pt; }
            .challan-page { width: 210mm; min-height: 297mm; max-height: 297mm; padding: 10mm; border: 2px solid black; background: white; position: relative; overflow: hidden; }
            .header { text-align: center; margin-bottom: 15px; position: relative; border-bottom: 2px solid black; padding-bottom: 10px; }
            .header h1 { margin: 0; font-size: 20pt; font-weight: bold; }
            .header h2 { margin: 3px 0; font-size: 14pt; font-weight: normal; }
            .header p { margin: 2px 0; font-size: 10pt; }
            .qr-code { position: absolute; top: 0; right: 0; }
            .details { margin-bottom: 12px; font-size: 10pt; }
            .details div { margin-bottom: 3px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 9pt; }
            th { border: 1.5px solid black; padding: 6px 4px; background-color: #e0e0e0; font-weight: bold; }
            td { border: 1px solid black; padding: 4px; }
            .totals { margin-bottom: 20px; font-size: 10pt; }
            .totals div { margin-bottom: 5px; }
            .grand-total { font-size: 13pt; font-weight: bold; margin-top: 8px; }
            .signatures { margin-top: 30px; font-size: 10pt; }
            .signatures div { margin-bottom: 40px; }
          </style>
        </head>
        <body>
    `);

    const customer = customers.find(c => c.id === order.customerId);
    const customerLocation = (customer as any)?.location;
    const qrUrl = customerLocation
      ? `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`https://www.google.com/maps?q=${customerLocation}`)}`
      : '';

    const subtotal = order.items?.reduce((sum: number, item: any) => sum + (item.total || 0), 0) || 0;
    const discountAmount = order.discount || 0;
    const discountPct = subtotal > 0 ? ((discountAmount / subtotal) * 100).toFixed(2) : '0';
    const grandTotal = order.totalAmount || 0;
    const paymentMethod = (order as any).paymentMethod || 'Cash';

    const copies = paymentMethod.toLowerCase() === 'cash' ? ['Customer Copy'] : ['Customer Copy', 'Vendor Copy'];

    copies.forEach((copyType) => {
      printWindow.document.write(`
        <div class="challan-page">
          <div class="header">
            <h1>J.B Trade Link Pvt. Ltd.</h1>
            <h2>Delivery Challan</h2>
            <p>Phone: 9802379658</p>
            <p style="font-weight: bold;">${copyType}</p>
            ${qrUrl ? `<div class="qr-code"><img src="${qrUrl}" alt="Location QR" width="100" height="100" /></div>` : ''}
          </div>
          <div class="details">
            <div><strong>Invoice No:</strong> ${order.id}</div>
            <div><strong>Salesman:</strong> ${order.salespersonName}</div>
            <div><strong>Customer Name:</strong> ${order.customerName}</div>
            <div><strong>Payment Mode:</strong> ${paymentMethod}</div>
            <div><strong>Products Sold:</strong></div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 30px; text-align: center;">#</th>
                <th style="text-align: left;">Product</th>
                <th style="width: 50px; text-align: center;">Qty</th>
                <th style="width: 65px; text-align: right;">Rate</th>
                <th style="width: 75px; text-align: right;">SubTotal</th>
                <th style="width: 60px; text-align: right;">Disc</th>
                <th style="width: 75px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items?.map((item: any, idx: number) => {
        // Find product to get baseRate and discountedRate
        const product = products.find(p => p.id === item.productId);
        const baseRate = product?.baseRate || item.rate || 0;
        const actualRate = item.rate || 0;

        // Calculate values
        const qty = item.qty || 0;
        const subtotalAtBase = baseRate * qty;
        const actualTotal = item.total || 0;
        const discountPct = baseRate > 0 ? (((baseRate - actualRate) / baseRate) * 100) : 0;

        return `
                  <tr>
                    <td style="text-align: center;">${idx + 1}</td>
                    <td>${item.productName}</td>
                    <td style="text-align: center;">${qty}</td>
                    <td style="text-align: right;">${baseRate.toFixed(2)}</td>
                    <td style="text-align: right;">${subtotalAtBase.toFixed(2)}</td>
                    <td style="text-align: right;">${discountPct.toFixed(2)}%</td>
                    <td style="text-align: right; font-weight: bold;">${actualTotal.toFixed(2)}</td>
                  </tr>
                `;
      }).join('')}
            </tbody>
          </table>
          <div class="totals">
            <div><strong>Sub Total: Rs. ${subtotal.toFixed(2)}</strong></div>
            ${discountAmount > 0 ? `<div><strong>Discount (${discountPct}%): Rs. ${discountAmount.toFixed(2)}</strong></div>` : ''}
            <div class="grand-total">Grand Total: Rs. ${grandTotal.toFixed(2)}</div>
          </div>
          <div class="signatures">
            <div>For J.B. Trade Link: _______________________</div>
            <div>Customer Signature: _______________________</div>
          </div>
        </div>
      `);
    });

    printWindow.document.write(`</body></html>`);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
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
        <Button variant="primary" size="sm" disabled={issuesCount > 0 || loading} onClick={handlePrintAll}>
          <Printer className="mr-2 h-4 w-4" /> Print All Valid Challans
        </Button>
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