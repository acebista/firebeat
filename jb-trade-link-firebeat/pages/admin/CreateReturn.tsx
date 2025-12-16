
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Input, Select, Badge } from '../../components/ui/Elements';
import { ArrowLeft, Save, AlertTriangle, Search, Package, CheckCircle, Calendar, Filter, X } from 'lucide-react';
import { Invoice, ReturnReason, ReturnType, Order, SalesReturn, SalesReturnItem, DamagedGoodsLog, DamageReason } from '../../types';
import { OrderService, ReturnService, DamageLogService, ProductService, CompanyService } from '../../services/db';
import { useAuth } from '../../services/auth';
import toast from 'react-hot-toast';

// --- Adapting Order to Invoice Interface for this View ---
// The app treats 'Order' with status 'delivered' as an Invoice.

// Session storage keys for state persistence
const SESSION_KEYS = {
  INVOICES: 'return_flow_invoices',
  DATE: 'return_flow_date',
  SEARCH: 'return_flow_search',
  PROCESSED: 'return_flow_processed'
};

const SelectInvoiceStep = ({
  onSelect,
  markAsProcessed,
  onStateChange
}: {
  onSelect: (id: string) => void;
  markAsProcessed: (id: string) => void;
  onStateChange?: (state: { invoices: Order[], processed: Set<string>, filteredInvoices: Order[] }) => void;
}) => {
  // Restore state from sessionStorage on mount
  const [allInvoices, setAllInvoices] = useState<Order[]>(() => {
    const stored = sessionStorage.getItem(SESSION_KEYS.INVOICES);
    return stored ? JSON.parse(stored) : [];
  });
  const [filteredInvoices, setFilteredInvoices] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters - restore from sessionStorage
  const [searchTerm, setSearchTerm] = useState(() => {
    return sessionStorage.getItem(SESSION_KEYS.SEARCH) || '';
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    const stored = sessionStorage.getItem(SESSION_KEYS.DATE);
    if (stored) return stored;
    // Default to today's date
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [appliedDateFilter, setAppliedDateFilter] = useState<string>(() => {
    return sessionStorage.getItem(SESSION_KEYS.DATE) || '';
  });

  // Track processed invoices in this session
  const [processedInvoices, setProcessedInvoices] = useState<Set<string>>(() => {
    const stored = sessionStorage.getItem(SESSION_KEYS.PROCESSED);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange({ invoices: allInvoices, processed: processedInvoices, filteredInvoices });
    }
  }, [allInvoices, processedInvoices, filteredInvoices]);

  // Persist state to sessionStorage whenever it changes
  useEffect(() => {
    if (allInvoices.length > 0) {
      sessionStorage.setItem(SESSION_KEYS.INVOICES, JSON.stringify(allInvoices));
    }
  }, [allInvoices]);

  useEffect(() => {
    if (appliedDateFilter) {
      sessionStorage.setItem(SESSION_KEYS.DATE, appliedDateFilter);
    }
  }, [appliedDateFilter]);

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEYS.SEARCH, searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEYS.PROCESSED, JSON.stringify(Array.from(processedInvoices)));
  }, [processedInvoices]);

  // Load invoices for a specific date
  const loadInvoicesForDate = async () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    setLoading(true);
    try {
      // Fetch orders for the selected date using date range query
      const data = await OrderService.getOrdersByDateRangePaged(selectedDate, selectedDate);
      // Include all statuses that represent valid invoices eligible for returns
      const eligibleStatuses = ['completed', 'delivered', 'dispatched', 'approved'];
      const eligibleInvoices = data.filter(o => eligibleStatuses.includes(o.status));
      setAllInvoices(eligibleInvoices);
      setAppliedDateFilter(selectedDate);
      // Clear processed list when loading new date
      setProcessedInvoices(new Set());
    } catch (e) {
      console.error(e);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = allInvoices;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(inv =>
        inv.customerName.toLowerCase().includes(lower) ||
        inv.id.toLowerCase().includes(lower)
      );
    }

    if (appliedDateFilter) {
      result = result.filter(inv => inv.date === appliedDateFilter);
    }

    setFilteredInvoices(result);
  }, [searchTerm, appliedDateFilter, allInvoices]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center py-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1"></div>
          <h2 className="text-3xl font-bold text-gray-800 flex-1">Process Sales Return</h2>
          <div className="flex-1 flex justify-end">
            {processedInvoices.size > 0 && (
              <button
                onClick={() => {
                  setProcessedInvoices(new Set());
                  sessionStorage.removeItem(SESSION_KEYS.PROCESSED);
                  toast.success('Session cleared. All invoices marked as unprocessed.');
                }}
                className="px-3 py-1.5 text-xs bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors font-medium"
              >
                Clear Session ({processedInvoices.size})
              </button>
            )}
          </div>
        </div>
        <p className="text-gray-600 mt-2">Select a date to view all invoices, then choose one to process returns</p>
      </div>

      {/* Date Selection - Prominent */}
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-5 w-5 text-indigo-600" />
            <h3 className="font-bold text-lg text-gray-800">Select Invoice Date</h3>
          </div>

          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
              <input
                type="date"
                className="w-full rounded-md border-2 border-gray-300 pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <Button
              onClick={loadInvoicesForDate}
              className="whitespace-nowrap min-w-[140px]"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load Invoices'}
            </Button>
          </div>

          {appliedDateFilter && !loading && (
            <div className="text-sm text-gray-600 bg-white/60 px-3 py-2 rounded-md">
              Showing invoices for <span className="font-semibold">{new Date(appliedDateFilter).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Search Filter - Only show if invoices are loaded */}
      {appliedDateFilter && (
        <Card className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by customer name or invoice number..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {searchTerm && (
              <Button variant="ghost" onClick={() => setSearchTerm('')}>
                Clear Search
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Results Summary */}
      {!loading && appliedDateFilter && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-gray-600">
            Showing <span className="font-bold text-indigo-600">{filteredInvoices.length}</span> invoice{filteredInvoices.length !== 1 ? 's' : ''}
          </div>
          {processedInvoices.size > 0 && (
            <div className="text-sm text-gray-600">
              <span className="font-bold text-purple-600">{processedInvoices.size}</span> processed this session
              {' • '}
              <span className="font-bold text-emerald-600">
                {filteredInvoices.filter(inv => !processedInvoices.has(inv.id)).length}
              </span> remaining
            </div>
          )}
        </div>
      )}

      {/* Invoice List */}
      <div className="grid gap-3">
        {loading ? (
          <div className="text-center p-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-500">Loading invoices...</p>
          </div>
        ) : appliedDateFilter ? (
          filteredInvoices.length > 0 ? (
            filteredInvoices.map(inv => (
              <Card
                key={inv.id}
                className="p-4 hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-indigo-500 hover:bg-indigo-50 hover:border-l-indigo-600"
                onClick={() => onSelect(inv.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{inv.customerName}</h3>
                      <Badge color={
                        inv.status === 'completed' ? 'emerald' :
                          inv.status === 'delivered' ? 'emerald' :
                            inv.status === 'dispatched' ? 'blue' :
                              'amber'
                      }>
                        {inv.status}
                      </Badge>
                      {processedInvoices.has(inv.id) && (
                        <Badge color="purple">
                          ✓ Returned
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <span className="font-mono font-medium bg-gray-100 px-2 py-1 rounded text-xs">
                        #{inv.id}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {inv.totalItems} items
                      </span>
                      {inv.salespersonName && (
                        <span className="text-gray-500">
                          SP: {inv.salespersonName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-indigo-600 text-xl">₹{inv.totalAmount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Click to process return</p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center p-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium text-lg">No invoices found</p>
              <p className="text-sm text-gray-500 mt-2">
                No invoices for {new Date(appliedDateFilter).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          )
        ) : (
          <div className="text-center p-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium text-lg">Select a date to load invoices</p>
            <p className="text-sm text-gray-500 mt-2">
              Choose a date above and click "Load Invoices" to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export const CreateReturn: React.FC = () => {
  const navigate = useNavigate();
  const { invoiceId: paramInvoiceId } = useParams();
  const { user } = useAuth();

  const [invoice, setInvoice] = useState<Order | null>(null);
  const [step, setStep] = useState<'select' | 'details'>(paramInvoiceId ? 'details' : 'select');

  // Track current session state for "Next Invoice" functionality
  const [sessionState, setSessionState] = useState<{
    invoices: Order[];
    processed: Set<string>;
    filteredInvoices: Order[];
  }>({
    invoices: [],
    processed: new Set(),
    filteredInvoices: []
  });

  // Form State
  const [returnType, setReturnType] = useState<ReturnType>('partial');
  const [reason, setReason] = useState<ReturnReason>('customer_rejected_partial');
  const [notes, setNotes] = useState('');

  // Line Items State: { [itemId]: { good: number, damaged: number } }
  const [lineItems, setLineItems] = useState<Record<string, { good: number, damaged: number }>>({});

  // --- Load Invoice ---
  const loadInvoice = async (id: string) => {
    try {
      const orders = await OrderService.getOrdersByIds([id]);
      if (orders.length > 0) {
        const inv = orders[0];

        // Parse and normalize items
        let items = inv.items;

        // If items is a string (from Supabase JSON column), parse it
        if (typeof items === 'string') {
          try {
            items = JSON.parse(items);
          } catch (e) {
            console.error('Failed to parse items JSON:', e);
            toast.error('Invalid order items data');
            return;
          }
        }

        // Ensure items is an array
        if (!Array.isArray(items)) {
          console.error('Items is not an array:', items);
          toast.error('Invalid order items format');
          return;
        }

        // Fetch all products and companies to enrich item data
        const [allProducts, allCompanies] = await Promise.all([
          ProductService.getAll(),
          CompanyService.getAll()
        ]);
        const productMap = new Map(allProducts.map((p: any) => [p.id, p]));
        const companyMap = new Map(allCompanies.map((c: any) => [c.id, c]));

        // Normalize each item with safe defaults and enrich with product data
        const normalizedItems = items.map((item: any, index: number) => {
          // Handle both new format and migrated format
          const productId = item.productId || item.product_id || `unknown-${index}`;
          const product: any = productMap.get(productId);

          // Use actual product data if available, otherwise use temp/fallback data
          const productName = product?.name ||
            item.productName ||
            item.product_name ||
            item.tempProductName ||
            item.name ||
            'Unknown Product';

          // Get company name from company table via companyId (ID-first approach)
          let companyName = '';
          let companyId = '';

          if (product?.companyId) {
            // Product has companyId - lookup from companies table
            companyId = product.companyId;
            const company: any = companyMap.get(product.companyId);
            companyName = company?.name || product?.companyName || '';
          } else if (product?.companyName) {
            // Product has companyName but no companyId (legacy data)
            companyName = product.companyName;
            companyId = item.companyId || item.company_id || '';
          } else if (item.companyName || item.company_name) {
            // Item has company data (from order items JSON)
            companyName = item.companyName || item.company_name;
            companyId = item.companyId || item.company_id || '';
          }

          // If still no company, show diagnostic info
          if (!companyName) {
            companyName = product
              ? `[No Company - Fix Product ID: ${productId.substring(0, 8)}...]`
              : `[Product Not Found - ID: ${productId.substring(0, 8)}...]`;
          }

          // Handle different quantity/price field names
          const qty = Number(item.qty || item.quantity || item.qtyPieces || 0);

          // Use baseRate (pre-discount) for returns, fallback to rate/price
          // This ensures returns are processed at the original price before any discounts
          const rate = Number(item.baseRate || item.rate || item.price || item.unitPrice || 0);
          const total = Number(item.total || item.amount || item.lineTotal || 0) || (qty * rate);

          return {
            productId,
            productName,
            companyName,
            qty,
            rate,
            total,
            baseRate: item.baseRate ? Number(item.baseRate) : rate, // Store baseRate for reference
            discountPct: item.discountPct ? Number(item.discountPct) : undefined,
            schemeAppliedText: item.schemeAppliedText || undefined,
            companyId: companyId || undefined
          };
        });

        // Check for products missing company data (ID-based check)
        const productsWithoutCompany = normalizedItems.filter(item =>
          !item.companyId || item.companyName.includes('[No Company') || item.companyName.includes('[Product Not Found')
        );

        if (productsWithoutCompany.length > 0) {
          // Detailed diagnostic logging
          const diagnostics = productsWithoutCompany.map(i => {
            const product = productMap.get(i.productId);
            return {
              productId: i.productId,
              productName: i.productName,
              existsInDB: productMap.has(i.productId),
              hasCompanyId: !!product?.companyId,
              hasCompanyName: !!product?.companyName,
              productCompanyId: product?.companyId || 'MISSING',
              productCompanyName: product?.companyName || 'MISSING'
            };
          });

          console.error('❌ Products missing company data (ID-based check):', diagnostics);
          console.error('🔧 Fix by updating products table: UPDATE products SET "companyId" = <company-id>, "companyName" = <company-name> WHERE id IN (...)');

          toast.error(
            `${productsWithoutCompany.length} product(s) missing company info. Check browser console for product IDs to fix.`,
            { duration: 8000 }
          );
        }

        // Check for missing critical data
        const missingData = normalizedItems.filter(item =>
          item.productName === 'Unknown Product' ||
          item.qty === 0 ||
          item.rate === 0
        );

        if (missingData.length > 0) {
          console.warn('Some items have missing data:', missingData);
          toast.error(
            `Warning: ${missingData.length} item(s) have incomplete data. Please verify before processing return.`,
            { duration: 6000 }
          );
        }

        // Update invoice with normalized items
        const normalizedInvoice = {
          ...inv,
          items: normalizedItems
        };

        setInvoice(normalizedInvoice);

        // Initialize Line Items with 0
        const initialLines: Record<string, { good: number, damaged: number }> = {};
        normalizedItems.forEach(item => {
          initialLines[item.productId] = { good: 0, damaged: 0 };
        });
        setLineItems(initialLines);
        setStep('details');
      } else {
        toast.error('Invoice not found');
      }
    } catch (error) {
      console.error('Failed to load invoice:', error);
      toast.error('Failed to load invoice');
    }
  };

  useEffect(() => {
    if (paramInvoiceId) loadInvoice(paramInvoiceId);
  }, [paramInvoiceId]);

  // --- Helper: Get Next Unprocessed Invoice ---
  const getNextUnprocessedInvoice = (): Order | null => {
    const unprocessed = sessionState.filteredInvoices.filter(
      inv => !sessionState.processed.has(inv.id)
    );
    return unprocessed.length > 0 ? unprocessed[0] : null;
  };

  // --- Handlers ---

  const handleQtyChange = (itemId: string, field: 'good' | 'damaged', val: string) => {
    const numVal = parseInt(val) || 0;
    if (numVal < 0) return;

    setLineItems(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: numVal
      }
    }));
  };

  const handleConfirm = async () => {
    if (!invoice) return;

    // Validation
    let hasItems = false;
    let isValid = true;
    const itemsPayload: any[] = [];
    let totalReturnAmt = 0;

    const isFull = returnType === 'full';

    invoice.items.forEach(item => {
      const entry = lineItems[item.productId] || { good: 0, damaged: 0 };

      let qtyGood = 0;
      let qtyDamaged = 0;

      if (isFull) {
        const isDamagedReason = reason.includes('damage') || reason.includes('expiry');
        qtyGood = isDamagedReason ? 0 : item.qty;
        qtyDamaged = isDamagedReason ? item.qty : 0;
      } else {
        qtyGood = entry.good;
        qtyDamaged = entry.damaged;
      }

      if (qtyGood + qtyDamaged > 0) {
        hasItems = true;
        if (qtyGood + qtyDamaged > item.qty) isValid = false;

        const lineTotal = (qtyGood + qtyDamaged) * item.rate;
        totalReturnAmt += lineTotal;

        itemsPayload.push({
          productId: item.productId,
          productName: item.productName,
          companyName: item.companyName || 'Unknown',
          qtyInvoiced: item.qty,
          qtyReturnedGood: qtyGood,
          qtyReturnedDamaged: qtyDamaged,
          rate: item.rate,
          lineReturnAmount: lineTotal
        });
      }
    });

    if (!isValid) {
      toast.error("Error: Returned quantity cannot exceed invoiced quantity.");
      return;
    }
    if (!hasItems) {
      toast.error("Error: Please select at least one item to return.");
      return;
    }

    try {
      // 1. Create Sales Return Record
      const returnId = `RET-${Date.now()}`;
      const salesReturn: SalesReturn = {
        id: returnId,
        invoiceId: invoice.id,
        invoiceNumber: invoice.id,
        customerId: invoice.customerId,
        customerName: invoice.customerName,
        returnType,
        reason,
        notes,
        createdByUserId: user?.id || 'admin',
        createdByUserName: user?.name || 'Admin User',
        createdAt: new Date().toISOString(),
        totalReturnAmount: totalReturnAmt
      };
      await ReturnService.add(salesReturn);

      // 2. Log Damaged Goods
      for (const item of itemsPayload) {
        if (item.qtyReturnedDamaged > 0) {
          const log: DamagedGoodsLog = {
            id: `DMG-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            productId: item.productId,
            productName: item.productName,
            companyName: item.companyName,
            qtyPieces: item.qtyReturnedDamaged,
            damageReason: reason as DamageReason,
            sourceType: 'return',
            sourceInvoiceId: invoice.id,
            sourceInvoiceNumber: invoice.id,
            createdByUserId: user?.id || 'admin',
            createdByUserName: user?.name || 'Admin User',
            createdAt: new Date().toISOString(),
            notes: `Return from ${invoice.customerName}`
          };
          await DamageLogService.add(log);
        }
      }

      // 3. Update Invoice Status? (Optional)
      // await OrderService.updateStatus(invoice.id, returnType === 'full' ? 'returned' : 'partially_returned');

      // Mark this invoice as processed
      const stored = sessionStorage.getItem(SESSION_KEYS.PROCESSED);
      const processed = stored ? new Set(JSON.parse(stored)) : new Set();
      processed.add(invoice.id);
      sessionStorage.setItem(SESSION_KEYS.PROCESSED, JSON.stringify(Array.from(processed)));

      // Update session state
      setSessionState(prev => ({
        ...prev,
        processed: new Set([...prev.processed, invoice.id])
      }));

      // Check if there's a next unprocessed invoice
      const nextInvoice = getNextUnprocessedInvoice();

      if (nextInvoice && nextInvoice.id !== invoice.id) {
        // Show success with "Next Invoice" option
        toast.success(
          (t) => (
            <div className="flex flex-col gap-2">
              <div className="font-semibold">Return processed successfully!</div>
              <div className="text-sm opacity-90">
                Next: {nextInvoice.customerName} (₹{nextInvoice.totalAmount.toLocaleString()})
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    loadInvoice(nextInvoice.id);
                  }}
                  className="px-3 py-1.5 bg-white text-emerald-600 rounded-md text-sm font-medium hover:bg-emerald-50 transition-colors"
                >
                  Process Next →
                </button>
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    setStep('select');
                    setInvoice(null);
                    setLineItems({});
                    setNotes('');
                  }}
                  className="px-3 py-1.5 bg-white/50 text-white rounded-md text-sm hover:bg-white/70 transition-colors"
                >
                  Back to List
                </button>
              </div>
            </div>
          ),
          { duration: 8000 }
        );
      } else {
        // No more invoices - just show success and return to list
        toast.success("Return processed successfully! No more unprocessed invoices.");
        setStep('select');
        setInvoice(null);
        setLineItems({});
        setNotes('');
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to create return");
    }
  };

  // Mark invoice as processed callback
  const markInvoiceAsProcessed = (id: string) => {
    const stored = sessionStorage.getItem(SESSION_KEYS.PROCESSED);
    const processed = stored ? new Set(JSON.parse(stored)) : new Set();
    processed.add(id);
    sessionStorage.setItem(SESSION_KEYS.PROCESSED, JSON.stringify(Array.from(processed)));
  };

  // --- Render Select Step ---
  if (step === 'select') {
    return (
      <SelectInvoiceStep
        onSelect={loadInvoice}
        markAsProcessed={markInvoiceAsProcessed}
        onStateChange={setSessionState}
      />
    );
  }

  if (!invoice) return <div>Loading...</div>;

  // --- Calculations for Summary ---
  const totalReturnAmount = invoice.items.reduce((sum, item) => {
    if (returnType === 'full') return sum + (Number(item.total) || 0);
    const entry = lineItems[item.productId] || { good: 0, damaged: 0 };
    const qty = (Number(entry.good) || 0) + (Number(entry.damaged) || 0);
    const rate = Number(item.rate) || 0;
    return sum + (qty * rate);
  }, 0);

  const totalReturnQty = invoice.items.reduce((sum, item) => {
    if (returnType === 'full') return sum + (Number(item.qty) || 0);
    const entry = lineItems[item.productId] || { good: 0, damaged: 0 };
    return sum + (Number(entry.good) || 0) + (Number(entry.damaged) || 0);
  }, 0);

  // Quick action: Return all items as good
  const handleReturnAllGood = () => {
    const newLineItems: Record<string, { good: number, damaged: number }> = {};
    invoice.items.forEach(item => {
      newLineItems[item.productId] = { good: item.qty, damaged: 0 };
    });
    setLineItems(newLineItems);
    setReturnType('partial');
  };

  // Quick action: Return all items as damaged
  const handleReturnAllDamaged = () => {
    const newLineItems: Record<string, { good: number, damaged: number }> = {};
    invoice.items.forEach(item => {
      newLineItems[item.productId] = { good: 0, damaged: item.qty };
    });
    setLineItems(newLineItems);
    setReturnType('partial');
  };

  // Quick action: Clear all returns
  const handleClearAll = () => {
    const newLineItems: Record<string, { good: number, damaged: number }> = {};
    invoice.items.forEach(item => {
      newLineItems[item.productId] = { good: 0, damaged: 0 };
    });
    setLineItems(newLineItems);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => {
            setStep('select');
            setInvoice(null);
            setLineItems({});
            setNotes('');
          }}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Process Return</h2>
            <p className="text-sm text-gray-500">Invoice: <span className="font-mono font-semibold">#{invoice.id}</span></p>
          </div>
        </div>
        <Badge color="blue">
          {invoice.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Configuration */}
        <div className="space-y-6">
          <Card className="p-4 bg-gray-50">
            <h4 className="font-bold text-gray-700 mb-3">Invoice Summary</h4>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Customer</span>
                <span className="font-medium">{invoice.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-medium">{invoice.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Salesperson</span>
                <span className="font-medium">{invoice.salespersonName || 'N/A'}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-500">Invoice Value</span>
                <span className="font-bold">₹{invoice.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Items</span>
                <span className="font-bold">{invoice.totalItems}</span>
              </div>
            </div>
          </Card>

          <Card className="p-4" title="Return Details">
            <div className="space-y-4">
              <Select
                label="Reason"
                value={reason}
                onChange={(value) => setReason(value as ReturnReason)}
                options={[
                  { label: 'Customer Rejected (Partial)', value: 'customer_rejected_partial' },
                  { label: 'Customer Rejected (Full)', value: 'customer_rejected_full' },
                  { label: 'Damaged / Quality Issue', value: 'quality_issue' },
                  { label: 'Expired', value: 'expiry_issue' },
                  { label: 'Price Issue', value: 'price_issue' },
                  { label: 'Other', value: 'other' },
                ]}
              />

              <Input
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional remarks..."
              />
            </div>
          </Card>

          {/* Return Summary */}
          <Card className="p-4 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Return Summary
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Items Returning</span>
                <span className="font-bold text-gray-900">{totalReturnQty} / {invoice.totalItems}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-red-200">
                <span className="text-gray-600">Return Value</span>
                <span className="font-bold text-red-600 text-xl">₹{totalReturnAmount.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Items Grid */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-500 px-4 py-4 text-white">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg">Select Items to Return</h3>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  {invoice.items.length} Products
                </span>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleReturnAllGood}
                  className="px-3 py-1.5 bg-white/90 hover:bg-white text-indigo-700 rounded-md text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <CheckCircle className="h-3 w-3" />
                  Return All (Good)
                </button>
                <button
                  onClick={handleReturnAllDamaged}
                  className="px-3 py-1.5 bg-white/90 hover:bg-white text-indigo-700 rounded-md text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <AlertTriangle className="h-3 w-3" />
                  Return All (Damaged)
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-3 py-1.5 bg-white/90 hover:bg-white text-indigo-700 rounded-md text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Clear All
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Product</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Inv Qty</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase w-28">Good Qty</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase w-28">Dmg Qty</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Return Amt</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoice.items.map(item => {
                    const entry = lineItems[item.productId] || { good: 0, damaged: 0 };
                    const currentReturnQty = (Number(entry.good) || 0) + (Number(entry.damaged) || 0);
                    const currentAmt = currentReturnQty * (Number(item.rate) || 0);
                    const isError = ((Number(entry.good) || 0) + (Number(entry.damaged) || 0)) > (Number(item.qty) || 0);
                    const hasReturn = currentReturnQty > 0;

                    return (
                      <tr
                        key={item.productId}
                        className={`transition-colors ${hasReturn ? 'bg-red-50 border-l-4 border-l-red-500' : 'hover:bg-gray-50'}`}
                      >
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                          <div className="text-xs text-gray-500">
                            {item.companyName} • Rate: ₹{item.rate}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-sm font-bold text-gray-700">
                            {item.qty}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            max={item.qty}
                            className={`w-20 text-center text-sm border-2 rounded-md py-2 font-medium transition-all ${isError
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : entry.good > 0
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                              }`}
                            value={entry.good}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              if (val <= item.qty) {
                                handleQtyChange(item.productId, 'good', e.target.value);
                              }
                            }}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            max={item.qty}
                            className={`w-20 text-center text-sm border-2 rounded-md py-2 font-medium transition-all ${isError
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : entry.damaged > 0
                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                              }`}
                            value={entry.damaged}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              if (val <= item.qty) {
                                handleQtyChange(item.productId, 'damaged', e.target.value);
                              }
                            }}
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className={`text-sm font-bold ${hasReturn ? 'text-red-600' : 'text-gray-400'}`}>
                            ₹{currentAmt.toFixed(2)}
                          </div>
                          {isError && (
                            <div className="text-[10px] text-red-600 font-bold mt-1 flex items-center justify-end gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Exceeds Qty!
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="bg-gray-50 p-4 border-t-2 border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Verify physical stock before confirming
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Total Return</div>
                    <div className="text-2xl font-bold text-red-600">₹{totalReturnAmount.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-6 flex justify-end gap-4">
            <Button variant="outline" size="lg" onClick={() => {
              setStep('select');
              setInvoice(null);
              setLineItems({});
              setNotes('');
            }}>
              Cancel
            </Button>
            <Button
              size="lg"
              onClick={handleConfirm}
              disabled={totalReturnQty === 0}
              className="min-w-[200px]"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Confirm Return ({totalReturnQty} items)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
