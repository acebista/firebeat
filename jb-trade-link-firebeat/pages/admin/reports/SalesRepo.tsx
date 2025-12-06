import React from 'react';
import { Card, Button } from '../../../components/ui/Elements';
import { SalesReportRow } from '../../../types/reports';
import { Download, Printer } from 'lucide-react';
import { printContent } from '../../../lib/printUtils';

export const SalesReport: React.FC<{ data: SalesReportRow[] }> = ({ data }) => {
  // Calc Totals
  const totalSub = data.reduce((s, r) => s + r.subTotal, 0);
  const totalDisc = data.reduce((s, r) => s + r.discountAmount, 0);
  const totalGrand = data.reduce((s, r) => s + r.grandTotal, 0);

  const handlePrint = () => {
    printContent('Sales Report', 'sales-report-print');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Sales Report</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export Excel
          </Button>
        </div>
      </div>

      {/* Screen View - Clean and pleasing */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">S.N.</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Salesperson</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Disc %</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Grand Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr><td colSpan={9} className="p-8 text-center text-gray-500">No sales data found for selected range.</td></tr>
              ) : (
                // Group by Salesperson
                Object.entries(data.reduce((groups, row) => {
                  const key = row.salespersonName || 'Unknown';
                  if (!groups[key]) groups[key] = [];
                  groups[key].push(row);
                  return groups;
                }, {} as Record<string, SalesReportRow[]>)).map(([salesperson, rows]) => {
                  const spSubTotal = rows.reduce((s, r) => s + r.subTotal, 0);
                  const spDiscTotal = rows.reduce((s, r) => s + r.discountAmount, 0);
                  const spGrandTotal = rows.reduce((s, r) => s + r.grandTotal, 0);

                  return (
                    <React.Fragment key={salesperson}>
                      {/* Rows */}
                      {rows.map((row, idx) => {
                        const discountPct = row.subTotal > 0 ? ((row.discountAmount / row.subTotal) * 100).toFixed(2) : '0.00';
                        return (
                          <tr key={row.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-center text-gray-900">{idx + 1}</td>
                            <td className="px-3 py-2 text-center text-gray-700">{salesperson}</td>
                            <td className="px-3 py-2 text-center font-mono text-xs text-indigo-600">{row.invoiceNo}</td>
                            <td className="px-3 py-2 text-gray-900">{row.customerName}</td>
                            <td className="px-3 py-2 text-center text-gray-700">{row.paymentMode || 'Cash'}</td>
                            <td className="px-3 py-2 text-right text-gray-900">₹{row.subTotal.toFixed(2)}</td>
                            <td className="px-3 py-2 text-right text-red-600">₹{row.discountAmount.toFixed(2)}</td>
                            <td className="px-3 py-2 text-center text-gray-700">{discountPct}%</td>
                            <td className="px-3 py-2 text-right font-semibold text-gray-900">₹{row.grandTotal.toFixed(2)}</td>
                          </tr>
                        );
                      })}

                      {/* Salesperson Subtotal */}
                      <tr className="bg-indigo-50 font-semibold">
                        <td colSpan={5} className="px-3 py-2 text-right text-gray-700">Total for {salesperson}:</td>
                        <td className="px-3 py-2 text-right text-gray-900">₹{spSubTotal.toFixed(2)}</td>
                        <td className="px-3 py-2 text-right text-red-600">₹{spDiscTotal.toFixed(2)}</td>
                        <td className="px-3 py-2"></td>
                        <td className="px-3 py-2 text-right text-gray-900">₹{spGrandTotal.toFixed(2)}</td>
                      </tr>
                    </React.Fragment>
                  );
                })
              )}
              {/* Grand Total Row */}
              {data.length > 0 && (
                <tr className="bg-green-100 font-bold text-lg">
                  <td colSpan={5} className="px-3 py-3 text-right text-gray-900">GRAND TOTAL:</td>
                  <td className="px-3 py-3 text-right text-gray-900">₹{totalSub.toFixed(2)}</td>
                  <td className="px-3 py-3 text-right text-red-600">₹{totalDisc.toFixed(2)}</td>
                  <td className="px-3 py-3"></td>
                  <td className="px-3 py-3 text-right text-gray-900">₹{totalGrand.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Print View - Hidden on screen, with remarks and dark borders */}
      <div id="sales-report-print" style={{ display: 'none' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10pt' }}>
          <thead style={{ backgroundColor: '#f3f4f6' }}>
            <tr>
              <th style={{ width: '30px', border: '2px solid #4b5563', padding: '8px', textAlign: 'center' }}>S.N.</th>
              <th style={{ width: '80px', border: '2px solid #4b5563', padding: '8px', textAlign: 'center' }}>Salesperson</th>
              <th style={{ width: '90px', border: '2px solid #4b5563', padding: '8px', textAlign: 'center' }}>Invoice</th>
              <th style={{ width: '180px', border: '2px solid #4b5563', padding: '8px', textAlign: 'left' }}>Customer</th>
              <th style={{ width: '70px', border: '2px solid #4b5563', padding: '8px', textAlign: 'center' }}>Payment</th>
              <th style={{ width: '80px', border: '2px solid #4b5563', padding: '8px', textAlign: 'right' }}>Subtotal</th>
              <th style={{ width: '70px', border: '2px solid #4b5563', padding: '8px', textAlign: 'right' }}>Discount</th>
              <th style={{ width: '75px', border: '2px solid #4b5563', padding: '8px', textAlign: 'center' }}>Discount %</th>
              <th style={{ width: '90px', border: '2px solid #4b5563', padding: '8px', textAlign: 'right' }}>Grand Total</th>
              <th style={{ border: '2px solid #4b5563', padding: '8px', textAlign: 'left' }}>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data.reduce((groups, row) => {
              const key = row.salespersonName || 'Unknown';
              if (!groups[key]) groups[key] = [];
              groups[key].push(row);
              return groups;
            }, {} as Record<string, SalesReportRow[]>)).map(([salesperson, rows]) => {
              const spSubTotal = rows.reduce((s, r) => s + r.subTotal, 0);
              const spDiscTotal = rows.reduce((s, r) => s + r.discountAmount, 0);
              const spGrandTotal = rows.reduce((s, r) => s + r.grandTotal, 0);

              return (
                <React.Fragment key={salesperson}>
                  {rows.map((row, idx) => {
                    const discountPct = row.subTotal > 0 ? ((row.discountAmount / row.subTotal) * 100).toFixed(2) : '0.00';
                    return (
                      <tr key={row.id}>
                        <td style={{ border: '1px solid #4b5563', padding: '6px', textAlign: 'center' }}>{idx + 1}</td>
                        <td style={{ border: '1px solid #4b5563', padding: '6px', textAlign: 'center' }}>{salesperson}</td>
                        <td style={{ border: '1px solid #4b5563', padding: '6px', textAlign: 'center', fontFamily: 'monospace', fontSize: '9pt' }}>{row.invoiceNo}</td>
                        <td style={{ border: '1px solid #4b5563', padding: '6px' }}>{row.customerName}</td>
                        <td style={{ border: '1px solid #4b5563', padding: '6px', textAlign: 'center' }}>{row.paymentMode || 'Cash'}</td>
                        <td style={{ border: '1px solid #4b5563', padding: '6px', textAlign: 'right' }}>{row.subTotal.toFixed(2)}</td>
                        <td style={{ border: '1px solid #4b5563', padding: '6px', textAlign: 'right' }}>{row.discountAmount.toFixed(2)}</td>
                        <td style={{ border: '1px solid #4b5563', padding: '6px', textAlign: 'center' }}>{discountPct}%</td>
                        <td style={{ border: '1px solid #4b5563', padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>{row.grandTotal.toFixed(2)}</td>
                        <td style={{ border: '1px solid #4b5563', padding: '6px' }}></td>
                      </tr>
                    );
                  })}
                  <tr style={{ backgroundColor: '#f3f4f6', fontWeight: 'bold' }}>
                    <td colSpan={5} style={{ border: '1px solid #4b5563', padding: '8px', textAlign: 'right' }}>Total for {salesperson}:</td>
                    <td style={{ border: '1px solid #4b5563', padding: '8px', textAlign: 'right' }}>{spSubTotal.toFixed(2)}</td>
                    <td style={{ border: '1px solid #4b5563', padding: '8px', textAlign: 'right' }}>{spDiscTotal.toFixed(2)}</td>
                    <td style={{ border: '1px solid #4b5563', padding: '8px' }}></td>
                    <td style={{ border: '1px solid #4b5563', padding: '8px', textAlign: 'right' }}>{spGrandTotal.toFixed(2)}</td>
                    <td style={{ border: '1px solid #4b5563', padding: '8px' }}></td>
                  </tr>
                </React.Fragment>
              );
            })}
            {/* Grand Total Row for Print */}
            {data.length > 0 && (
              <tr style={{ backgroundColor: '#86efac', fontWeight: 'bold', fontSize: '12pt' }}>
                <td colSpan={5} style={{ border: '2px solid #4b5563', padding: '10px', textAlign: 'right' }}>GRAND TOTAL:</td>
                <td style={{ border: '2px solid #4b5563', padding: '10px', textAlign: 'right' }}>{totalSub.toFixed(2)}</td>
                <td style={{ border: '2px solid #4b5563', padding: '10px', textAlign: 'right' }}>{totalDisc.toFixed(2)}</td>
                <td style={{ border: '2px solid #4b5563', padding: '10px' }}></td>
                <td style={{ border: '2px solid #4b5563', padding: '10px', textAlign: 'right' }}>{totalGrand.toFixed(2)}</td>
                <td style={{ border: '2px solid #4b5563', padding: '10px' }}></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};