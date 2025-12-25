import React from 'react';
import { Card, Button } from '../../../components/ui/Elements';
import { DispatchRow } from '../../../types/reports';
import { Printer, CalendarClock } from 'lucide-react';
import { printContent } from '../../../lib/printUtils';

interface DispatchReportProps {
  data: DispatchRow[];
  rescheduledData?: DispatchRow[];
}

export const DispatchReport: React.FC<DispatchReportProps> = ({ data, rescheduledData = [] }) => {
  const handlePrint = () => {
    printContent('Dispatch / Packing List', 'dispatch-report-table');
  };

  const renderTable = (rows: DispatchRow[], isRescheduled = false) => (
    <table className="min-w-full divide-y divide-gray-200 text-sm">
      <thead className={isRescheduled ? "bg-amber-100" : "bg-gray-100"}>
        <tr>
          <th className={`px-4 py-3 text-left font-medium ${isRescheduled ? 'text-amber-700' : 'text-gray-600'}`}>Company</th>
          <th className={`px-4 py-3 text-left font-medium ${isRescheduled ? 'text-amber-700' : 'text-gray-600'}`}>Product</th>
          <th className={`px-4 py-3 text-center font-medium ${isRescheduled ? 'text-amber-700' : 'text-gray-600'}`}>Cartons</th>
          <th className={`px-4 py-3 text-center font-medium ${isRescheduled ? 'text-amber-700' : 'text-gray-600'}`}>Packets</th>
          <th className={`px-4 py-3 text-center font-medium ${isRescheduled ? 'text-amber-700' : 'text-gray-600'}`}>Pieces</th>
          <th className={`px-4 py-3 text-center font-bold ${isRescheduled ? 'text-amber-800 bg-amber-50' : 'text-indigo-700 bg-indigo-50'}`}>Total Qty</th>
          <th className={`px-4 py-3 text-right font-medium ${isRescheduled ? 'text-amber-700' : 'text-gray-600'}`}>Value</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {rows.map(row => (
          <tr key={row.productId} className={isRescheduled ? "hover:bg-amber-50" : "hover:bg-gray-50"}>
            <td className="px-4 py-2 text-gray-500">{row.companyName}</td>
            <td className="px-4 py-2 font-medium text-gray-900">{row.productName}</td>
            <td className="px-4 py-2 text-center">{row.cartons}</td>
            <td className="px-4 py-2 text-center">{row.packets}</td>
            <td className="px-4 py-2 text-center">{row.pieces}</td>
            <td className="px-4 py-2 text-center font-bold bg-gray-50">{row.totalQty}</td>
            <td className="px-4 py-2 text-right">₹{row.totalAmount.toLocaleString()}</td>
          </tr>
        ))}
        {rows.length === 0 && (
          <tr>
            <td colSpan={7} className="text-center p-8">
              <div className="text-gray-400 space-y-2">
                <p className="font-medium">No dispatch/packing data found.</p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
      {rows.length > 0 && (
        <tfoot className={`font-bold text-gray-900 border-t-2 ${isRescheduled ? 'bg-amber-100 border-amber-300' : 'bg-gray-100 border-gray-300'}`}>
          <tr>
            <td colSpan={2} className="px-4 py-3 text-right text-gray-700 uppercase tracking-wider">Total</td>
            <td className="px-4 py-3 text-center">{rows.reduce((sum, row) => sum + row.cartons, 0)}</td>
            <td className="px-4 py-3 text-center">{rows.reduce((sum, row) => sum + row.packets, 0)}</td>
            <td className="px-4 py-3 text-center">{rows.reduce((sum, row) => sum + row.pieces, 0)}</td>
            <td className={`px-4 py-3 text-center text-lg ${isRescheduled ? 'bg-amber-200 text-amber-900' : 'bg-indigo-100 text-indigo-900'}`}>
              {rows.reduce((sum, row) => sum + row.totalQty, 0)}
            </td>
            <td className={`px-4 py-3 text-right text-lg ${isRescheduled ? 'text-amber-900' : 'text-indigo-900'}`}>
              ₹{rows.reduce((sum, row) => sum + row.totalAmount, 0).toLocaleString()}
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Dispatch / Packing List</h3>
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" /> Print Packing List
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto" id="dispatch-report-table">
          {renderTable(data)}
        </div>
      </Card>

      {/* Rescheduled Orders Section */}
      {rescheduledData.length > 0 && (
        <Card className="overflow-hidden mt-6 border-2 border-amber-300">
          <div className="bg-amber-50 px-4 py-3 border-b border-amber-200 flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-amber-600" />
            <h4 className="font-bold text-amber-800">📅 Rescheduled Orders Dispatch ({rescheduledData.length} items)</h4>
            <span className="ml-auto text-amber-700 font-semibold">
              ₹{rescheduledData.reduce((s, r) => s + r.totalAmount, 0).toLocaleString()}
            </span>
          </div>
          <div className="overflow-x-auto">
            {renderTable(rescheduledData, true)}
          </div>
        </Card>
      )}
    </div>
  );
};