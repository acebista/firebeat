import React, { useState } from 'react';
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

  const reschTotalSub = rescheduledData.reduce((s, r) => s + r.subTotal, 0);
  const reschTotalDisc = rescheduledData.reduce((s, r) => s + r.discountAmount, 0);
  const reschTotalGrand = rescheduledData.reduce((s, r) => s + r.grandTotal, 0);

  const handlePrint = (includeRescheduled = false) => {
    const printId = includeRescheduled ? 'sales-report-print-all' : 'sales-report-print-today';
    printContent('Sales Report', printId);
  };

  const renderPrintTable = (rows: SalesReportRow[], title: string) => {
    const rowsTotalSub = rows.reduce((s, r) => s + r.subTotal, 0);
    const rowsTotalDisc = rows.reduce((s, r) => s + r.discountAmount, 0);
    const rowsTotalGrand = rows.reduce((s, r) => s + r.grandTotal, 0);

    return (
      <div className="print-section" style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '14pt', textAlign: 'center', marginBottom: '10px' }}>{title}</h2>
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
            {Object.entries(rows.reduce((groups, row) => {
              const key = row.salespersonName || 'Unknown';
              if (!groups[key]) groups[key] = [];
              groups[key].push(row);
              return groups;
            }, {} as Record<string, SalesReportRow[]>)).map(([salesperson, salespersonRows]) => {
              const spSubTotal = salespersonRows.reduce((s, r) => s + r.subTotal, 0);
              const spDiscTotal = salespersonRows.reduce((s, r) => s + r.discountAmount, 0);
              const spGrandTotal = salespersonRows.reduce((s, r) => s + r.grandTotal, 0);
              const spFirstName = salesperson.split(' ')[0];

              return (
                <React.Fragment key={salesperson}>
                  {salespersonRows.map((row, idx) => {
                    const discountPct = row.subTotal > 0 ? ((row.discountAmount / row.subTotal) * 100).toFixed(1) : '0.0';
                    return (
                      <tr key={row.id}>
                        <td style={{ border: '1px solid #4b5563', padding: '2px', textAlign: 'center' }}>{idx + 1}</td>
                        <td style={{ border: '1px solid #4b5563', padding: '2px', textAlign: 'center' }}>{spFirstName}</td>
                        <td style={{ border: '1px solid #4b5563', padding: '2px', textAlign: 'center', fontFamily: 'monospace' }}>{row.invoiceNo}</td>
                        <td style={{ border: '1px solid #4b5563', padding: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>{row.customerName}</td>
                        <td style={{ border: '1px solid #4b5563', padding: '2px', textAlign: 'center' }}>{row.paymentMode === 'Cash' ? 'Cash' : row.paymentMode === 'Credit' ? 'Cr' : row.paymentMode?.slice(0, 4)}</td>
                        <td style={{ border: '1px solid #4b5563', padding: '2px', textAlign: 'right' }}>{Math.round(row.subTotal)}</td>
                        <td style={{ border: '1px solid #4b5563', padding: '2px', textAlign: 'right' }}>{Math.round(row.discountAmount)}</td>
                        <td style={{ border: '1px solid #4b5563', padding: '2px', textAlign: 'center' }}>{discountPct}</td>
                        <td style={{ border: '1px solid #4b5563', padding: '2px', textAlign: 'right', fontWeight: 'bold' }}>{Math.round(row.grandTotal)}</td>
                        <td style={{ border: '1px solid #4b5563', padding: '2px' }}>{(row.order as any)?.rescheduled_from ? `↩ ${(row.order as any).rescheduled_from}` : ''}</td>
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
            <tr style={{ backgroundColor: '#e5e7eb', fontWeight: 'bold', fontSize: '10px' }}>
              <td colSpan={5} style={{ border: '2px solid #4b5563', padding: '6px', textAlign: 'right' }}>SECTION TOTAL:</td>
              <td style={{ border: '2px solid #4b5563', padding: '6px', textAlign: 'right' }}>{Math.round(rowsTotalSub)}</td>
              <td style={{ border: '2px solid #4b5563', padding: '6px', textAlign: 'right' }}>{Math.round(rowsTotalDisc)}</td>
              <td style={{ border: '2px solid #4b5563', padding: '6px' }}></td>
              <td style={{ border: '2px solid #4b5563', padding: '10px', textAlign: 'right' }}>{Math.round(rowsTotalGrand)}</td>
              <td style={{ border: '2px solid #4b5563', padding: '6px' }}></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-lg font-bold text-gray-800">Sales Report</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => handlePrint(false)}>
            <Printer className="mr-2 h-4 w-4" /> Print Today Only ({data.length})
          </Button>
          <Button variant="primary" size="sm" onClick={() => handlePrint(true)}>
            <Printer className="mr-2 h-4 w-4" /> Print All ({data.length + rescheduledData.length})
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export Excel
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-2 border-indigo-100">
        <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex items-center justify-between">
          <h4 className="font-bold text-indigo-800">Today's Original Sales</h4>
          <span className="text-indigo-900 font-bold">₹{totalGrand.toLocaleString()}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">S.N.</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Salesperson</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Grand Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No today's sales data found.</td></tr>
              ) : (
                data.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-center text-gray-900">{idx + 1}</td>
                    <td className="px-3 py-2 text-center text-gray-700">{row.salespersonName}</td>
                    <td className="px-3 py-2 text-center font-mono text-xs text-indigo-600">{row.invoiceNo}</td>
                    <td className="px-3 py-2 text-gray-900">{row.customerName}</td>
                    <td className="px-3 py-2 text-center text-gray-700">{row.paymentMode || 'Cash'}</td>
                    <td className="px-3 py-2 text-right font-semibold text-gray-900">₹{row.grandTotal.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {rescheduledData.length > 0 && (
        <Card className="overflow-hidden border-2 border-amber-300">
          <div className="bg-amber-50 px-4 py-3 border-b border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-amber-600" />
              <h4 className="font-bold text-amber-800">Rescheduled Orders ({rescheduledData.length})</h4>
            </div>
            <span className="text-amber-900 font-bold">₹{reschTotalGrand.toLocaleString()}</span>
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
                  <th className="px-3 py-3 text-right text-xs font-medium text-amber-700 uppercase tracking-wider">Total</th>
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
                      <Badge color="amber">↩ {(row.order as any).rescheduled_from || 'N/A'}</Badge>
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-gray-900">₹{row.grandTotal.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Print Areas */}
      <div style={{ display: 'none' }}>
        <div id="sales-report-print-today">
          {renderPrintTable(data, "Today's Original Sales Report")}
        </div>
        <div id="sales-report-print-all">
          {renderPrintTable(data, "Today's Original Sales Report")}
          {rescheduledData.length > 0 && renderPrintTable(rescheduledData, "Rescheduled Orders Sales Report")}
          <div style={{ borderTop: '3px double black', padding: '10px', marginTop: '20px', textAlign: 'right', fontSize: '14pt', fontWeight: 'bold' }}>
            TOTAL REVENUE (TODAY + RESCH): ₹{(totalGrand + reschTotalGrand).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};