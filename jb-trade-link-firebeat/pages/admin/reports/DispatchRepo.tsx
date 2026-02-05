import React from 'react';
import { Card, Button } from '../../../components/ui/Elements';
import { DispatchRow } from '../../../types/reports';
import { Printer, CalendarClock, Users } from 'lucide-react';
import { printContent } from '../../../lib/printUtils';

interface DispatchReportProps {
  data: DispatchRow[];
  rescheduledData?: DispatchRow[];
  salespeople?: string[]; // Unique salesperson names
}

export const DispatchReport: React.FC<DispatchReportProps> = ({ data, rescheduledData = [], salespeople = [] }) => {
  const handlePrint = (includeRescheduled = false) => {
    const printId = includeRescheduled ? 'dispatch-print-area-all' : 'dispatch-print-area-today';
    printContent('Dispatch / Packing List', printId);
  };

  const renderTable = (rows: DispatchRow[], isRescheduled = false) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10pt', marginBottom: '20px' }} className="dispatch-table">
      <thead>
        <tr style={{ backgroundColor: isRescheduled ? '#fff7ed' : '#f9fafb' }}>
          <th style={{ border: '1px solid black', padding: '6px', textAlign: 'left' }}>Company</th>
          <th style={{ border: '1px solid black', padding: '6px', textAlign: 'left' }}>Product</th>
          <th style={{ border: '1px solid black', padding: '6px', textAlign: 'center' }}>CTN</th>
          <th style={{ border: '1px solid black', padding: '6px', textAlign: 'center' }}>PKT</th>
          <th style={{ border: '1px solid black', padding: '6px', textAlign: 'center' }}>PCS</th>
          <th style={{ border: '1px solid black', padding: '6px', textAlign: 'center', backgroundColor: isRescheduled ? '#fffbe6' : '#eff6ff', fontWeight: 'bold' }}>TOTAL</th>
          <th style={{ border: '1px solid black', padding: '6px', textAlign: 'right' }}>VALUE</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.productId}>
            <td style={{ border: '1px solid black', padding: '6px' }}>{row.companyName}</td>
            <td style={{ border: '1px solid black', padding: '6px', fontWeight: 'bold' }}>{row.productName}</td>
            <td style={{ border: '1px solid black', padding: '6px', textAlign: 'center' }}>{row.cartons}</td>
            <td style={{ border: '1px solid black', padding: '6px', textAlign: 'center' }}>{row.packets}</td>
            <td style={{ border: '1px solid black', padding: '6px', textAlign: 'center' }}>{row.pieces}</td>
            <td style={{ border: '1px solid black', padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>{row.totalQty}</td>
            <td style={{ border: '1px solid black', padding: '6px', textAlign: 'right' }}>₹{row.totalAmount.toLocaleString()}</td>
          </tr>
        ))}
        {rows.length > 0 && (
          <tr style={{ fontWeight: 'bold', backgroundColor: isRescheduled ? '#fff7ed' : '#f9fafb' }}>
            <td colSpan={2} style={{ border: '1px solid black', padding: '6px', textAlign: 'right' }}>TOTAL</td>
            <td style={{ border: '1px solid black', padding: '6px', textAlign: 'center' }}>{rows.reduce((s, r) => s + r.cartons, 0)}</td>
            <td style={{ border: '1px solid black', padding: '6px', textAlign: 'center' }}>{rows.reduce((s, r) => s + r.packets, 0)}</td>
            <td style={{ border: '1px solid black', padding: '6px', textAlign: 'center' }}>{rows.reduce((s, r) => s + r.pieces, 0)}</td>
            <td style={{ border: '1px solid black', padding: '6px', textAlign: 'center', backgroundColor: isRescheduled ? '#fef3c7' : '#dbeafe' }}>{rows.reduce((s, r) => s + r.totalQty, 0)}</td>
            <td style={{ border: '1px solid black', padding: '6px', textAlign: 'right' }}>₹{rows.reduce((s, r) => s + r.totalAmount, 0).toLocaleString()}</td>
          </tr>
        )}
      </tbody>
    </table>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-lg font-bold text-gray-800">Dispatch / Packing List</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => handlePrint(false)}>
            <Printer className="mr-2 h-4 w-4" /> Today Only ({data.length} items)
          </Button>
          <Button variant="primary" size="sm" onClick={() => handlePrint(true)}>
            <Printer className="mr-2 h-4 w-4" /> Today + Rescheduled ({data.length + rescheduledData.length} items)
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Salespeople Summary */}
        {salespeople.length > 0 && (
          <Card className="p-4 bg-purple-50 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-purple-800">Salespeople for this Load ({salespeople.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {salespeople.map(name => (
                <span key={name} className="inline-block bg-white text-purple-700 text-sm font-medium px-3 py-1 rounded-full border border-purple-300">
                  {name}
                </span>
              ))}
            </div>
          </Card>
        )}

        <Card className="overflow-hidden border-2 border-indigo-100">
          <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex items-center gap-2">
            <h4 className="font-bold text-indigo-800 uppercase tracking-tight">Today's Dispatch List</h4>
          </div>
          <div className="overflow-x-auto">
            {renderTable(data)}
          </div>
        </Card>

        {/* Rescheduled Orders Section (Screen) */}
        {rescheduledData.length > 0 && (
          <Card className="overflow-hidden border-2 border-amber-300">
            <div className="bg-amber-50 px-4 py-3 border-b border-amber-200 flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-amber-600" />
              <h4 className="font-bold text-amber-800 text-lg uppercase tracking-tight">Rescheduled Orders Dispatch</h4>
            </div>
            <div className="overflow-x-auto">
              {renderTable(rescheduledData, true)}
            </div>
          </Card>
        )}
      </div>

      {/* Print Containers (Hidden) */}
      <div style={{ display: 'none' }}>
        <div id="dispatch-print-area-today">
          <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Today's Dispatch / Packing List</h1>
          {renderTable(data)}
        </div>
        <div id="dispatch-print-area-all">
          <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>Dispatch / Packing List (Full Load)</h1>
          <h3 style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>Regular Orders + Rescheduled Backlog</h3>
          <div style={{ padding: '10px', backgroundColor: '#f9fafb', border: '1px solid #eee', marginBottom: '15px' }}>
            <strong>Salespeople Involved:</strong> {salespeople.join(', ')}
          </div>

          <h4 style={{ color: '#444', textTransform: 'uppercase', borderBottom: '2px solid #ccc', paddingBottom: '5px', marginBottom: '10px' }}>1. Regular Dispatch</h4>
          {renderTable(data)}

          {rescheduledData.length > 0 && (
            <div style={{ marginTop: '30px' }}>
              <h4 style={{ color: '#854d0e', textTransform: 'uppercase', borderBottom: '2px solid #fcd34d', paddingBottom: '5px', marginBottom: '10px' }}>2. Rescheduled Orders Dispatch</h4>
              {renderTable(rescheduledData, true)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};