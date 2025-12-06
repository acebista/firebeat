
import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Select } from '../../components/ui/Elements';
import {
  Activity, CheckCircle, XCircle, Database,
  Upload, Download, FileText, Terminal,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { COLS } from '../../services/db';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

interface CheckResult {
  name: string;
  status: 'pending' | 'success' | 'failure';
  message?: string;
  duration?: number;
}

type ImportType = 'customers' | 'products' | 'orders' | 'purchases' | 'returns';
const BATCH_SIZE = 400;

// --- TEMPLATES ---
const CSV_TEMPLATES: Record<ImportType, string> = {
  customers: `Shop Name,Contact,PAN,Credit Limit,Current Outstanding,Location,Route,GSTIN,Owner Name
Gupta General Store,9876543210,ABCDE1234F,50000,1200,"28.4595, 77.0266",Sector 15,07AAAAA0000A1Z5,Mr. Gupta`,

  products: `Company,Item Name,Rate,Primary Discount,K,L,M,N,O,Category
Parle,Parle-G 100g,10,0,2,24,0,0,1,Biscuits`,

  orders: `id,customerId,customerName,salespersonId,salespersonName,date,totalItems,totalAmount,status,items,remarks,assignedTripId,discount,GPS,time,paymentMethod,vatRequired?
250325-001,ad97bdd1-4ced-4d5c-b215-64aab8e8e45d,Rezi Kirana pasal,5937213a-3380-46c6-8d13-88e45039a3df,Shushant Budathoki,2025-03-25,2,672.59,completed,"[{""qty"": 24, ""rate"": 7.42, ""total"": 178.14, ""productName"": ""Butter 20-20""}]",,0,"27.715034, 85.324468",2025-03-25T00:00:00Z,Cash,false`,

  purchases: `billId,date,vendorName,productName,qty,rate,taxMode
PR-001,2025-02-15,Parle Distributor,Parle-G 100g,100,8.5,EXCLUSIVE`,

  returns: `invoiceNumber,date,customerName,returnType,productName,qtyGood,qtyDamaged,rate
INV-1001,2025-02-22,Gupta General Store,partial,Parle-G 100g,0,2,10`
};

const cleanString = (val: any) => (val ? String(val).trim() : '');
const createKey = (...args: string[]) => args.map(s => cleanString(s).toLowerCase().replace(/[^a-z0-9]/g, '')).join('_');

export const SystemHealth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'status' | 'import' | 'console'>('import');
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [results, setResults] = useState<CheckResult[]>([]);

  // Import State
  const [importType, setImportType] = useState<ImportType>('customers');
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  const addLog = (msg: string, type: 'info' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'error' ? '❌ ' : type === 'success' ? '✅ ' : '➜ ';
    setLogs(prev => [...prev, `[${timestamp}] ${prefix}${msg}`]);
  };

  useEffect(() => {
    if (logsEndRef.current) logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // --- FILE HANDLING ---

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      if (jsonData.length === 0) {
        toast.error("No data found in the file.");
        return;
      }
      setParsedData(jsonData);
      addLog(`Loaded ${jsonData.length} rows from ${file.name}`, 'success');
    } catch (err) {
      console.error(err);
      toast.error("Failed to parse file.");
      addLog("Failed to parse file", "error");
    }
  };

  const downloadTemplate = () => {
    const csv = CSV_TEMPLATES[importType];
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${importType}_template.csv`;
    a.click();
  };

  // --- SUPABASE BATCH PROCESSING ---

  const runBatchUpsert = async (collectionName: string, items: any[], label: string) => {
    const total = items.length;
    let processed = 0;

    addLog(`Starting Supabase batch upload for ${total} ${label}...`, "info");

    for (let i = 0; i < total; i += BATCH_SIZE) {
      const chunk = items.slice(i, i + BATCH_SIZE);

      try {
        const { error } = await supabase.from(collectionName).upsert(chunk);
        if (error) throw error;

        processed += chunk.length;
        addLog(`Progress: ${processed}/${total} records...`, "info");
      } catch (err: any) {
        console.error(err);
        addLog(`Batch failed: ${err.message}`, "error");
      }
    }

    addLog(`✅ Successfully processed ${processed} ${label}.`, "success");
  };

  // --- SMART IMPORT LOGIC ---

  const processImport = async () => {
    if (parsedData.length === 0) return;
    setIsImporting(true);
    addLog(`Analyzing ${parsedData.length} rows for ${importType}...`, "info");

    try {
      if (importType === 'customers') {
        await smartImportCustomers(parsedData);
      } else if (importType === 'products') {
        await smartImportProducts(parsedData);
      } else {
        if (importType === 'orders') await importOrders(parsedData);
        if (importType === 'purchases') await importPurchases(parsedData);
        if (importType === 'returns') await importReturns(parsedData);
      }

      setParsedData([]);
      setFileName('');
    } catch (e: any) {
      addLog(`Import Failure: ${e.message}`, "error");
    } finally {
      setIsImporting(false);
    }
  };

  const smartImportCustomers = async (rows: any[]) => {
    const upsertPayload = rows.map(row => {
      const name = cleanString(row['Shop Name'] || row['name']);
      const rawPhone = cleanString(row['Contact'] || row['phone']);
      const phoneDigits = rawPhone.replace(/[^0-9]/g, '');

      if (!name) return null;

      const idSuffix = phoneDigits.length >= 6 ? phoneDigits : createKey(name);
      const id = `cust_${idSuffix}`.substring(0, 40);

      const coreData = {
        id,
        name,
        phone: rawPhone,
        panNumber: cleanString(row['PAN'] || row['panNumber']),
        locationText: cleanString(row['Location'] || row['locationText']),
        routeName: cleanString(row['Route'] || row['routeName']),
        creditLimit: parseFloat(row['Credit Limit']) || 0,
        currentOutstanding: parseFloat(row['Current Outstanding']) || 0,
        isActive: true,
        status: 'active'
      };
      return coreData;
    }).filter(Boolean);

    if (upsertPayload.length > 0) {
      await runBatchUpsert(COLS.CUSTOMERS, upsertPayload, 'customers');
    }
  };

  const smartImportProducts = async (rows: any[]) => {
    // Map companies first? For now, just ensure they exist in products
    const upsertPayload = rows.map(row => {
      const name = cleanString(row['Item Name'] || row['name']);
      const companyName = cleanString(row['Company'] || row['company']);

      if (!name) return null;

      const id = `prod_${createKey(companyName, name)}`.substring(0, 40);
      const companyId = `comp_${createKey(companyName)}`;

      const coreData = {
        id,
        name,
        companyName,
        companyId,
        baseRate: parseFloat(row['Rate'] || row['baseRate']) || 0,
        discountedRate: parseFloat(row['Rate'] || row['baseRate']) || 0,
        packetsPerCarton: 1,
        piecesPerPacket: 1,
        category: cleanString(row['Category']),
        secondaryDiscountPct: parseFloat(row['K']) || 0,
        secondaryQualifyingQty: parseInt(row['L']) || 0,
        isActive: true
      };
      return coreData;
    }).filter(Boolean);

    if (upsertPayload.length > 0) {
      await runBatchUpsert(COLS.PRODUCTS, upsertPayload, 'products');
    }
  };

  const importOrders = async (rows: any[]) => {
    const orders = rows.map(row => {
      try {
        // Parse items JSON if it's a string
        let items = [];
        if (typeof row.items === 'string' && row.items) {
          items = JSON.parse(row.items);
        } else if (Array.isArray(row.items)) {
          items = row.items;
        }

        // Parse GPS coordinates - format: "27.715034, 85.324468"
        let gps = null;
        if (row.GPS) {
          const gpsStr = cleanString(row.GPS);
          if (gpsStr) gps = gpsStr;
        }

        // Parse timestamp
        let timestamp = null;
        if (row.time) {
          try {
            timestamp = new Date(row.time).toISOString();
          } catch (e) {
            timestamp = null;
          }
        }

        return {
          id: cleanString(row.id),
          customerId: cleanString(row.customerId),
          customerName: cleanString(row.customerName),
          salespersonId: cleanString(row.salespersonId),
          salespersonName: cleanString(row.salespersonName),
          date: cleanString(row.date),
          totalItems: parseInt(row.totalItems) || 0,
          totalAmount: parseFloat(row.totalAmount) || 0,
          status: cleanString(row.status) || 'completed',
          items: items,
          remarks: cleanString(row.remarks),
          assignedTripId: cleanString(row.assignedTripId),
          discount: parseFloat(row.discount) || 0,
          GPS: gps,
          time: timestamp,
          paymentMethod: cleanString(row.paymentMethod),
          'vatRequired?': row['vatRequired?'] === 'true' || row['vatRequired?'] === true
        };
      } catch (err) {
        console.error('Error parsing row:', row, err);
        addLog(`Error parsing row: ${err instanceof Error ? err.message : String(err)}`, 'error');
        return null;
      }
    }).filter(Boolean);

    if (orders.length > 0) {
      await runBatchUpsert(COLS.ORDERS, orders, 'orders');
    } else {
      addLog('No valid orders to import', 'error');
    }
  };

  const importPurchases = async (rows: any[]) => {
    // Simplified import
    addLog("Purchase import not fully implemented in this demo version.", "info");
  };

  const importReturns = async (rows: any[]) => {
    addLog("Returns import not fully implemented in this demo version.", "info");
  };

  // --- DIAGNOSTICS ---

  const runDiagnostics = async () => {
    setIsDiagnosticRunning(true);
    setResults([]);
    addLog("Running Supabase Diagnostics...", "info");

    const tables = Object.values(COLS);
    for (const table of tables) {
      const t0 = Date.now();
      try {
        const { error } = await supabase.from(table).select('*').limit(1);
        if (error) throw error;
        addResult({ name: table, status: 'success', message: 'Accessible', duration: Date.now() - t0 });
      } catch (e: any) {
        addResult({ name: table, status: 'failure', message: e.message });
      }
    }
    setIsDiagnosticRunning(false);
  };

  const addResult = (res: CheckResult) => setResults(prev => [...prev, res]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Database className="text-indigo-600" /> System Manager (Supabase)
        </h2>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit overflow-x-auto">
        <button onClick={() => setActiveTab('import')} className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'import' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600'}`}>Data Import</button>
        <button onClick={() => setActiveTab('status')} className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'status' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600'}`}>Health Checks</button>
      </div>

      {/* --- TAB: DATA IMPORT --- */}
      {activeTab === 'import' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Upload className="text-indigo-600" /> Smart Import (Excel / CSV)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">1. Select Data Type</label>
                  <Select
                    value={importType}
                    onChange={(e) => { setImportType(e.target.value as ImportType); setParsedData([]); setFileName(''); }}
                    options={[
                      { label: 'Customers', value: 'customers' },
                      { label: 'Products', value: 'products' },
                      { label: 'Sales Orders', value: 'orders' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">2. Reference Template</label>
                  <Button variant="outline" onClick={downloadTemplate} className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Download Template
                  </Button>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative">
                <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="pointer-events-none">
                  {fileName ? (
                    <div className="flex flex-col items-center">
                      <FileText className="h-10 w-10 text-green-500 mb-2" />
                      <span className="text-sm font-bold text-gray-900">{fileName}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-indigo-600">Upload Excel or CSV</span>
                    </div>
                  )}
                </div>
              </div>

              {parsedData.length > 0 && (
                <div className="mt-6">
                  <Button onClick={processImport} isLoading={isImporting}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Run Import
                  </Button>
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-gray-900 text-green-400 font-mono text-sm h-full flex flex-col shadow-lg min-h-[400px]">
              <div className="p-3 border-b border-gray-800 bg-gray-950 flex justify-between items-center">
                <span className="flex items-center gap-2 text-xs"><Terminal size={12} /> Import Logs</span>
                <button onClick={() => setLogs([])} className="text-xs hover:text-white">Clear</button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-1 text-xs">
                {logs.map((log, i) => <div key={i}>{log}</div>)}
                <div ref={logsEndRef}></div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* --- TAB: STATUS CHECKS --- */}
      {activeTab === 'status' && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Supabase Diagnostics</h3>
            <Button onClick={runDiagnostics} isLoading={isDiagnosticRunning}>
              <Activity className="mr-2 h-4 w-4" /> Run Checks
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((res, idx) => (
              <div key={idx} className={`p-3 rounded border flex items-center justify-between ${res.status === 'success' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                <div className="flex items-center gap-3">
                  {res.status === 'success' ? <CheckCircle className="text-green-600 h-5 w-5" /> : <XCircle className="text-red-600 h-5 w-5" />}
                  <span className="font-medium text-gray-900">{res.name}</span>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-bold ${res.status === 'success' ? 'text-green-700' : 'text-red-700'}`}>{res.status.toUpperCase()}</div>
                  {res.message && <div className="text-[10px] text-gray-500 truncate max-w-[150px]" title={res.message}>{res.message}</div>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
