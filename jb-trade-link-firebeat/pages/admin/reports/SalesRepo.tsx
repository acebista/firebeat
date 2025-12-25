import React from 'react';
import { Card, Button } from '../../../components/ui/Elements';
import { SalesReportRow } from '../../../types/reports';
import { Download, Printer, CalendarClock } from 'lucide-react';
import { printContent } from '../../../lib/printUtils';

interface SalesReportProps {
  data: SalesReportRow[];
  rescheduledData?: SalesReportRow[];
}

export const SalesReport: React.FC<SalesReportProps> = ({ data, rescheduledData = [] }) => {
  // Calc Totals
  const totalSub = data.reduce((s, r) => s + r.subTotal, 0);
  const totalDisc = data.reduce((s, r) => s + r.discountAmount, 0);
  const totalGrand = data.reduce((s, r) => s + r.grandTotal, 0);

  const reschTotalGrand = rescheduledData.reduce((s, r) => s + r.grandTotal, 0);

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

      {/* Rescheduled Orders Section */}
      {rescheduledData.length > 0 && (
        <Card className="overflow-hidden mt-6 border-2 border-amber-300">
          <div className="bg-amber-50 px-4 py-3 border-b border-amber-200 flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-amber-600" />
            <h4 className="font-bold text-amber-800">📅 Rescheduled Orders ({rescheduledData.length})</h4>
            <span className="ml-auto text-amber-700 font-semibold">₹{reschTotalGrand.toFixed(2)}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-amber-200 text-sm">
              <thead className="bg-amber-100">
                <tr>
                  <th className="px-3 py-3 text-center text-xs font-medium text-amber-700 uppercase">S.N.</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-amber-700 uppercase">Salesperson</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-amber-700 uppercase">Invoice</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-amber-700 uppercase">Customer</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-amber-700 uppercase">Orig. Date</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-amber-700 uppercase">Grand Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-amber-100">
                {rescheduledData.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-amber-50">
                    <td className="px-3 py-2 text-center text-gray-900">{idx + 1}</td>
                    <td className="px-3 py-2 text-center text-gray-700">{row.salespersonName}</td>
                    <td className="px-3 py-2 text-center font-mono text-xs text-amber-600">{row.invoiceNo}</td>
                    <td className="px-3 py-2 text-gray-900">{row.customerName}</td>
                    <td className="px-3 py-2 text-center">
                      <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs">
                        ↩ {(row.order as any).rescheduled_from || 'N/A'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-gray-900">₹{row.grandTotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Print View - Hidden on screen, with remarks and dark borders */}
      <div id="sales-report-print" style={{ display: 'none' }}>
        <style>{`
          @media print {
            @page { size: landscape; margin: 10mm; }
            body { -webkit-print-color-adjust: exact; }
          }
        `}</style>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px', tableLayout: 'auto' }}>
          <thead style={{ backgroundColor: '#f3f4f6' }}>
            <tr>
              <th style={{ width: '3%', border: '1px solid #4b5563', padding: '4px', textAlign: 'center' }}>S.N.</th>
              <th style={{ width: '8%', border: '1px solid #4b5563', padding: '4px', textAlign: 'center' }}>Salesperson</th>
              <th style={{ width: '10%', border: '1px solid #4b5563', padding: '4px', textAlign: 'center' }}>Invoice</th>
              <th style={{ width: '15%', border: '1px solid #4b5563', padding: '4px', textAlign: 'left' }}>Customer</th>
              <th style={{ width: '6%', border: '1px solid #4b5563', padding: '4px', textAlign: 'center' }}>Pay</th>
              <th style={{ width: '8%', border: '1px solid #4b5563', padding: '4px', textAlign: 'right' }}>Subtotal</th>
              <th style={{ width: '7%', border: '1px solid #4b5563', padding: '4px', textAlign: 'right' }}>Disc</th>
              <th style={{ width: '5%', border: '1px solid #4b5563', padding: '4px', textAlign: 'center' }}>%</th>
              <th style={{ width: '9%', border: '1px solid #4b5563', padding: '4px', textAlign: 'right' }}>Total</th>
              <th style={{ width: '29%', border: '1px solid #4b5563', padding: '4px', textAlign: 'left' }}>Remarks</th>
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
              // Print only first name
              const spFirstName = salesperson.split(' ')[0];

              return (
                <React.Fragment key={salesperson}>
                  {rows.map((row, idx) => {
                    const discountPct = row.subTotal > 0 ? ((row.discountAmount / row.subTotal) * 100).toFixed(1) : '0.0';
                    return (
                      <tr key={row.id}>
                        <td style={{ border: '1px solid #4b5563', padding: '2px', textAlign: 'center' }}>{idx + 1}</td>
                        <td style={{ border: '1px solid #4b5563', padding: '2px', textAlign: 'center' }}>{spFirstName}</td>
                        <td style={{ border: '1px solid #4b5563', padding: '2px', textAlign: 'center', fontFamily: 'monospace' }}>{row.invoiceNo.slice(0, 8)}</td>
                        <td style={{ border: '1px solid #4b5563', padding: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>{row.customerName}</td>
                        <td style={{ border: '1px solid #4b5563', padding: '2px', textAlign: 'center' }}>{row.paymentMode === 'Cash' ? 'Cash' : row.paymentMode === 'Credit' ? 'Cr' : row.paymentMode?.slice(0, 4)}</td>
                        <td style={{ border: '1px solid #4b5563', padding: '2px', textAlign: 'right' }}>{Math.round(row.subTotal)}</td>
                        <td style={{ border: '1px solid #4b5563', padding: '2px', textAlign: 'right' }}>{Math.round(row.discountAmount)}</td>
                        <td style={{ border: '1px solid #4b5563', padding: '2px', textAlign: 'center' }}>{discountPct}</td>
                        <td style={{ border: '1px solid #4b5563', padding: '2px', textAlign: 'right', fontWeight: 'bold' }}>{Math.round(row.grandTotal)}</td>
                        <td style={{ border: '1px solid #4b5563', padding: '2px' }}></td>
                      </tr>
                    );
                  })}
                  <tr style={{ backgroundColor: '#f3f4f6', fontWeight: 'bold' }}>
                    <td colSpan={5} style={{ border: '1px solid #4b5563', padding: '4px', textAlign: 'right' }}>Total {spFirstName}:</td>
                    <td style={{ border: '1px solid #4b5563', padding: '4px', textAlign: 'right' }}>{Math.round(spSubTotal)}</td>
                    <td style={{ border: '1px solid #4b5563', padding: '4px', textAlign: 'right' }}>{Math.round(spDiscTotal)}</td>
                    <td style={{ border: '1px solid #4b5563', padding: '4px' }}></td>
                    <td style={{ border: '1px solid #4b5563', padding: '4px', textAlign: 'right' }}>{Math.round(spGrandTotal)}</td>
                    <td style={{ border: '1px solid #4b5563', padding: '4px' }}></td>
                  </tr>
                </React.Fragment>
              );
            })}
            {/* Grand Total Row for Print */}
            {data.length > 0 && (
              <tr style={{ backgroundColor: '#e5e7eb', fontWeight: 'bold', fontSize: '10px' }}>
                <td colSpan={5} style={{ border: '2px solid #4b5563', padding: '6px', textAlign: 'right' }}>GRAND TOTAL:</td>
                <td style={{ border: '2px solid #4b5563', padding: '6px', textAlign: 'right' }}>{Math.round(totalSub)}</td>
                <td style={{ border: '2px solid #4b5563', padding: '6px', textAlign: 'right' }}>{Math.round(totalDisc)}</td>
                <td style={{ border: '2px solid #4b5563', padding: '6px' }}></td>
                <td style={{ border: '2px solid #4b5563', padding: '10px', textAlign: 'right' }}>{Math.round(totalGrand)}</td>
                <td style={{ border: '2px solid #4b5563', padding: '6px' }}></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};