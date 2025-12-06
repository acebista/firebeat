// src/components/Migration.tsx
import React, { useState, useRef } from 'react';
import { Card, Button } from '../../components/ui/Elements';
import { CustomerService, ProductService, OrderService, CompanyService, UserService } from '../../services/db';
import { Customer } from '../../types';

// --- Helper: Generate UUID v4 ---
const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

// --- CSV Parsing Helpers ---

const parseCSV = (text: string) => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentField = '';
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (insideQuotes && nextChar === '"') {
                currentField += '"';
                i++;
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            currentRow.push(currentField.trim());
            currentField = '';
        } else if ((char === '\n' || char === '\r') && !insideQuotes) {
            if (char === '\r' && nextChar === '\n') i++;
            currentRow.push(currentField.trim());
            if (currentRow.some(field => field)) rows.push(currentRow);
            currentRow = [];
            currentField = '';
        } else {
            currentField += char;
        }
    }
    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
    }
    return rows;
};

const parseAmount = (val: string) => {
    if (!val) return 0;
    return parseFloat(String(val).replace(/,/g, '').trim()) || 0;
};

const parseProductValue = (val: string) => {
    if (!val || !val.includes('|')) return { quantity: 0, amount: 0 };
    const parts = val.split('|');
    return {
        quantity: parseAmount(parts[0]),
        amount: parseAmount(parts[1])
    };
};

const parseDateFromInvoice = (invoice: string) => {
    try {
        if (!invoice) return new Date().toISOString();
        const datePart = invoice.split('-')[0];
        if (datePart.length === 6) {
            const year = '20' + datePart.substring(0, 2);
            const month = datePart.substring(2, 4);
            const day = datePart.substring(4, 6);
            return new Date(`${year}-${month}-${day}`).toISOString();
        }
    } catch (e) {
        console.warn('Date parsing error', e);
    }
    return new Date().toISOString();
};

// --- NEW: Header + value normalizers ---

/** Case-insensitive header finder with fallbacks */
const findHeaderIndex = (headers: string[], candidates: string[]) => {
    const norm = (s: string) => s?.toString().trim().toLowerCase().replace(/\s+/g, ' ');
    const normalizedHeaders = headers.map(h => norm(h));
    for (const c of candidates) {
        const target = norm(c);
        const idx = normalizedHeaders.indexOf(target);
        if (idx !== -1) return idx;
    }
    // fuzzy contains as last resort (e.g., anything containing "vat")
    for (let i = 0; i < normalizedHeaders.length; i++) {
        const h = normalizedHeaders[i];
        if (candidates.some(c => h.includes(norm(c)))) return i;
    }
    return -1;
};

/** Convert VAT status text → boolean */
const parseVatStatus = (raw: string | undefined): boolean => {
    const v = (raw || '').toString().trim().toLowerCase();
    if (!v) return false; // default false if empty
    // Treat explicit non-VAT as false
    if (/\bnon[-\s]?vat\b/.test(v)) return false;
    if (/\bno\b/.test(v)) return false;
    if (v === '0' || v === 'false') return false;
    // Treat presence of 'vat', 'yes', '1', 'true' as true
    if (/\bvat\b/.test(v)) return true;
    if (/\byes\b/.test(v)) return true;
    if (v === '1' || v === 'true') return true;
    return false;
};

/** Normalize payment method text */
const normalizePaymentMethod = (raw: string | undefined): string => {
    const v = (raw || '').toString().trim();
    if (!v) return '';
    const low = v.toLowerCase();

    // direct map
    const direct: Record<string, string> = {
        'cash': 'Cash',
        'credit': 'Credit',
        'bank': 'Bank Transfer',
        'bank transfer': 'Bank Transfer',
        'transfer': 'Bank Transfer',
        'cheque': 'Cheque',
        'check': 'Cheque',
        'esewa': 'eSewa',
        'e-sewa': 'eSewa',
        'khalti': 'Khalti',
        'fonepay': 'FonePay',
        'fone pay': 'FonePay',
    };
    if (direct[low]) return direct[low];

    if (/esewa/i.test(v)) return 'eSewa';
    if (/khalti/i.test(v)) return 'Khalti';
    if (/fone\s*pay/i.test(v)) return 'FonePay';
    if (/bank/i.test(v)) return 'Bank Transfer';
    if (/cheq|check/i.test(v)) return 'Cheque';
    if (/cash/i.test(v)) return 'Cash';
    if (/credit/i.test(v)) return 'Credit';

    return v; // keep as-is if unknown
};

interface MigrationStats {
    companies: { existing: number; new: number; skipped: number };
    users: { existing: number; new: number; skipped: number };
    products: { existing: number; new: number; skipped: number };
    customers: { existing: number; new: number; merged: number };
    orders: { existing: number; new: number; skipped: number };
}

export const Migration: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0, stage: '' });
    const [logs, setLogs] = useState<string[]>([]);
    
    const [migrationData, setMigrationData] = useState<any>(null);
    const [csvText, setCsvText] = useState<string>('');
    const [showPasteArea, setShowPasteArea] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const logsEndRef = useRef<HTMLDivElement>(null);

    // Mappings to link CSV data to Real DB IDs
    const idMappings = useRef({
        users: new Map<string, string>(),
        products: new Map<string, string>(),
        customers: new Map<string, string>()
    });

    const [stats, setStats] = useState<MigrationStats>({
        companies: { existing: 0, new: 0, skipped: 0 },
        users: { existing: 0, new: 0, skipped: 0 },
        products: { existing: 0, new: 0, skipped: 0 },
        customers: { existing: 0, new: 0, merged: 0 },
        orders: { existing: 0, new: 0, skipped: 0 }
    });

    const addLog = (msg: string) => {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `${timestamp}: ${msg}`;
        setLogs(prev => [...prev, logEntry]);
        console.log(logEntry);
        
        // Auto-scroll to bottom
        setTimeout(() => {
            if (logsEndRef.current) {
                logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 0);
    };

    // --- CSV Parsing ---

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            addLog('No file selected');
            return;
        }
        addLog(`File selected: ${file.name}`);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const result = e.target?.result;
                if (!result) {
                    addLog('Error: Failed to read file');
                    return;
                }
                addLog('File loaded. Parsing CSV...');
                processCSV(result as string);
            } catch (error: any) {
                addLog(`Error parsing file: ${error.message}`);
                console.error('File upload error:', error);
            }
        };
        reader.onerror = () => {
            addLog('Error: Failed to read file');
        };
        reader.readAsText(file);
    };

    const handlePasteCSV = () => {
        if (!csvText.trim()) {
            addLog('❌ Error: CSV text is empty');
            return;
        }
        addLog('📋 Processing pasted CSV...');
        processCSV(csvText);
        setCsvText('');
        setShowPasteArea(false);
    };

    const processCSV = (csvText: string) => {
        try {
            if (!csvText || csvText.trim().length === 0) {
                addLog('Error: CSV file is empty');
                return;
            }

            const rawRows = parseCSV(csvText);
            addLog(`Parsed ${rawRows.length} rows from CSV`);
            
            if (rawRows.length < 2) {
                addLog('Error: CSV file has no data rows (need header + at least 1 data row)');
                return;
            }

            const headers = rawRows[0];
            addLog(`Found ${headers.length} columns`);
            const dataRows = rawRows.slice(1);

        const salespersonIdx = findHeaderIndex(headers, ['Salesperson']);
        const invoiceIdx = findHeaderIndex(headers, ['Invoice Number']);
        const customerIdx = findHeaderIndex(headers, ['Customer Name']);
        const phoneIdx = findHeaderIndex(headers, ['Phone Number']);
        const panIdx = findHeaderIndex(headers, ['PAN Number']);
        const totalIdx = findHeaderIndex(headers, ['Total']);
        const gpsIdx = findHeaderIndex(headers, ['GPS']);

        // NEW: indices for Mode of Payment + VAT Status (matches your CSV)
        const paymentMethodIdx = findHeaderIndex(headers, [
            'Mode of Payment', 'Payment Method', 'Payment mode', 'Payment'
        ]);
        const vatStatusIdx = findHeaderIndex(headers, [
            'VAT Status', 'VAT', 'VAT Required?', 'VAT Required'
        ]);
        
        // Support both naming conventions for discount
        let discountIdx = findHeaderIndex(headers, ['Discount', 'Discount allowed']); 

        if (totalIdx === -1) {
            addLog('Error: Could not find "Total" column.');
            return;
        }

        const productColumns = headers.slice(totalIdx + 1).map((name, index) => ({
            name,
            originalIndex: totalIdx + 1 + index
        }));

        const usersMap = new Map<string, any>();
        const productsMap = new Map<string, any>();
        const customersMap = new Map<string, any>();
        const orders: any[] = [];
        const companies = [{ id: 'default-company', name: 'Main Company' }];

        // Initialize Products
        productColumns.forEach(col => {
            productsMap.set(col.name, {
                id: generateUUID(),
                name: col.name,
                description: col.name,
                price: 0 
            });
        });

        let earliestDate = new Date();
        let latestDate = new Date(0);

        dataRows.forEach((row) => {
            if (row.length < totalIdx) return; 

            // 1. Users (Salesperson)
            const salespersonNameRaw = salespersonIdx !== -1 ? row[salespersonIdx] : '';
            const salespersonName = (salespersonNameRaw || '').trim() || 'Default Salesperson';
            
            if (!usersMap.has(salespersonName)) {
                usersMap.set(salespersonName, {
                    id: generateUUID(),
                    name: salespersonName,
                    role: 'sales',
                    email: 'ace.bista@gmail.com',
                    phone: '9866288313',
                    isActive: true,
                    createdAt: new Date().toISOString()
                });
            }
            const user = usersMap.get(salespersonName);

            // 2. Customers
            const rawName = customerIdx !== -1 ? row[customerIdx]?.trim() : '';
            const phone = phoneIdx !== -1 ? (row[phoneIdx]?.trim() || '') : '';
            const pan = panIdx !== -1 ? (row[panIdx]?.trim() || '') : '';
            const gps = gpsIdx !== -1 ? (row[gpsIdx]?.trim() || '') : '';

            let customerName = rawName;
            if (!customerName) {
                if (phone) customerName = `Customer ${phone}`;
                else if (pan) customerName = `Customer ${pan}`;
                else customerName = 'Unknown Customer';
            }

            // Use a composite key including GPS for initial unique identification in CSV
            const customerKey = gps || pan || phone || customerName; 
            
            if (!customersMap.has(customerKey)) {
                customersMap.set(customerKey, {
                    id: generateUUID(),
                    name: customerName,
                    phone: phone,
                    panNumber: pan,
                    locationText: gps,
                    isActive: true,
                    createdAt: new Date().toISOString()
                });
            }
            const customer = customersMap.get(customerKey);

            // 3. Orders
            const invoiceNo = invoiceIdx !== -1 ? row[invoiceIdx] : generateUUID();
            const orderDateISO = parseDateFromInvoice(invoiceNo);
            const orderDateOnly = orderDateISO.split('T')[0];
            const orderTimestamp = orderDateISO;

            const orderDate = new Date(orderDateISO);
            if (orderDate < earliestDate) earliestDate = orderDate;
            if (orderDate > latestDate) latestDate = orderDate;

            const orderItems: any[] = [];
            let totalItemsCount = 0;
            
            productColumns.forEach(col => {
                const val = row[col.originalIndex];
                const { quantity, amount } = parseProductValue(val);

                if (quantity > 0) {
                    const product = productsMap.get(col.name);
                    totalItemsCount += quantity;

                    orderItems.push({
                        productId: product.id,
                        quantity,
                        price: quantity > 0 ? amount / quantity : 0,
                        amount,
                        tempProductName: col.name 
                    });
                }
            });

            // NEW: Read & normalize VAT + Payment
            const rawVat = vatStatusIdx !== -1 ? row[vatStatusIdx] : '';
            const vatRequired = parseVatStatus(rawVat);
            const rawPayment = paymentMethodIdx !== -1 ? row[paymentMethodIdx] : '';
            const paymentMethod = normalizePaymentMethod(rawPayment);

            if (orderItems.length > 0) {
                const finalGPS = gps || "27.715034, 85.324468";

                orders.push({
                    id: invoiceNo,
                    customerId: customer.id,
                    customerName: customer.name,

                    salespersonId: user.id,
                    salespersonName: user.name,
                    
                    date: orderDateOnly,
                    time: orderTimestamp,
                    GPS: finalGPS,

                    totalItems: totalItemsCount,
                    totalAmount: parseAmount(row[totalIdx]),
                    discount: discountIdx !== -1 ? parseAmount(row[discountIdx]) : 0,

                    // NEW fields
                    'vatRequired?': vatRequired,
                    paymentMethod,

                    items: orderItems,
                    status: 'completed'
                });
            }
        });

        const summary = {
            companies: companies.length,
            users: Array.from(usersMap.values()).length,
            products: Array.from(productsMap.values()).length,
            customers: Array.from(customersMap.values()).length,
            orders: orders.length
        };

        addLog(`📊 CSV Summary:`);
        addLog(`  • Companies: ${summary.companies}`);
        addLog(`  • Users/Salespersons: ${summary.users}`);
        addLog(`  • Products: ${summary.products}`);
        addLog(`  • Customers: ${summary.customers}`);
        addLog(`  • Orders: ${summary.orders}`);
        addLog(`✅ CSV parsed successfully! Ready for migration.`);

        setMigrationData({
            companies,
            users: Array.from(usersMap.values()),
            products: Array.from(productsMap.values()),
            customers: Array.from(customersMap.values()),
            orders,
            stats: {
                dateRange: {
                    earliest: earliestDate.toLocaleDateString(),
                    latest: latestDate.toLocaleDateString()
                }
            }
        });
        
        setCurrentStep(1);
        } catch (error: any) {
            addLog(`❌ Error processing CSV: ${error.message}`);
            console.error('CSV processing error:', error);
        }
    };

    // --- Migration Steps ---

    const processBatch = async <T extends unknown>(
        items: T[],
        serviceFn: (item: T) => Promise<any>,
        stageName: string
    ) => {
        let processed = 0;
        const batchSize = 50;
        setProgress({ current: 0, total: items.length, stage: stageName });

        for (let i = 0; i < items.length; i += batchSize) {
            const batch = items.slice(i, i + batchSize);
            await Promise.all(batch.map(async (item) => {
                try {
                    await serviceFn(item);
                } catch (e: any) {
                    console.error(`Error in ${stageName}:`, e);
                    addLog(`Error in ${stageName}: ${e.message}`);
                }
            }));
            processed += batch.length;
            setProgress({ current: processed, total: items.length, stage: stageName });
        }
    };

    // Step 1: Users & Companies
    const handleStep1 = async () => {
        setIsProcessing(true);
        addLog('Step 1: Migrating Companies & Users...');
        try {
            const existingCompanies = await CompanyService.getAll().catch(() => []);
            const existingUsers = await UserService.getAll().catch(() => []);

            for (const company of migrationData.companies) {
                const exists = existingCompanies.find((c: any) => c.name === company.name);
                if (!exists) await CompanyService.add(company);
            }

            let newUsersCount = 0;
            for (const user of migrationData.users) {
                const exists = existingUsers.find((u: any) => u.name.toLowerCase() === user.name.toLowerCase());
                
                if (exists) {
                    idMappings.current.users.set(user.id, exists.id);
                } else {
                    try {
                        await UserService.add(user);
                        idMappings.current.users.set(user.id, user.id);
                        newUsersCount++;
                    } catch (err: any) {
                        addLog(`⚠️ User skip (${user.name}): ${err.message}`);
                    }
                }
            }
            
            setStats(prev => ({ ...prev, users: { ...prev.users, new: newUsersCount } }));
            addLog(`Step 1 Complete. ${newUsersCount} new users created.`);
            setCurrentStep(2);
        } catch (e: any) {
            addLog(`Error in Step 1: ${e.message}`);
        }
        setIsProcessing(false);
    };

    // Step 2: Products
    const handleStep2 = async () => {
        setIsProcessing(true);
        addLog('Step 2: Migrating Products...');
        try {
            const existingProducts = await ProductService.getAll().catch(() => []);
            let newProductsCount = 0;
            const productsToInsert: any[] = [];

            for (const product of migrationData.products) {
                const exists = existingProducts.find((p: any) => p.name === product.name);
                if (exists) {
                    idMappings.current.products.set(product.id, exists.id);
                } else {
                    productsToInsert.push(product);
                    idMappings.current.products.set(product.id, product.id);
                    newProductsCount++;
                }
            }

            await processBatch(productsToInsert, (p) => ProductService.add(p), 'Products');
            
            setStats(prev => ({ ...prev, products: { ...prev.products, new: newProductsCount } }));
            addLog(`Step 2 Complete. ${newProductsCount} new products created.`);
            setCurrentStep(3);
        } catch (e: any) {
            addLog(`Error in Step 2: ${e.message}`);
        }
        setIsProcessing(false);
    };

    // Step 3: Customers (DEDUPE WITH GPS PRIORITY)
    const handleStep3 = async () => {
        setIsProcessing(true);
        addLog('Step 3: Migrating Customers with GPS & Data Deduplication...');
        try {
            const existingCustomers = await CustomerService.getAll().catch(() => []);
            let newCount = 0;
            let mergedCount = 0;
            const customersToInsert: Customer[] = [];
            
            const createdInThisSession = new Map<string, string>(); 

            for (const customer of migrationData.customers) {
                let exists: Customer | undefined = undefined;

                if (customer.locationText) {
                    exists = existingCustomers.find((c: any) => c.locationText === customer.locationText);
                }
                if (!exists && customer.panNumber) {
                    exists = existingCustomers.find((c: any) => c.panNumber === customer.panNumber);
                }
                if (!exists && customer.phone) {
                    exists = existingCustomers.find((c: any) => c.phone === customer.phone);
                }
                if (!exists) {
                    exists = existingCustomers.find((c: any) => c.name.toLowerCase().trim() === customer.name.toLowerCase().trim());
                }

                if (exists) {
                    idMappings.current.customers.set(customer.id, exists.id);
                    mergedCount++;
                } else {
                    const sessionKey = customer.locationText || customer.panNumber || customer.phone || customer.name;
                    const alreadyCreatedId = createdInThisSession.get(sessionKey);

                    if (alreadyCreatedId) {
                        idMappings.current.customers.set(customer.id, alreadyCreatedId);
                        mergedCount++;
                    } else {
                        customersToInsert.push(customer);
                        idMappings.current.customers.set(customer.id, customer.id);
                        createdInThisSession.set(sessionKey, customer.id);
                        newCount++;
                    }
                }
            }

            await processBatch(customersToInsert, (c) => CustomerService.add(c), 'Customers');
            
            setStats(prev => ({ ...prev, customers: { ...prev.customers, new: newCount, merged: mergedCount } }));
            addLog(`Step 3 Complete. ${newCount} new customers created, ${mergedCount} matched to existing.`);
            setCurrentStep(4);
        } catch (e: any) {
            addLog(`Error in Step 3: ${e.message}`);
        }
        setIsProcessing(false);
    };

    // Step 4: Orders (WITH CORRECT FORMAT)
    const handleStep4 = async () => {
        setIsProcessing(true);
        addLog('Step 4: Migrating Orders...');
        try {
            const allCustomers = await CustomerService.getAll().catch(() => []);
            const allUsers = await UserService.getAll().catch(() => []);
            const allProducts = await ProductService.getAll().catch(() => []); 
            const allCompanies = await CompanyService.getAll().catch(() => []);

            const getCompany = (id: string) => allCompanies.find((c: any) => c.id === id);
            const getProduct = (id: string) => allProducts.find((p: any) => p.id === id);

            const ordersToInsert: any[] = [];

            for (const order of migrationData.orders) {
                // 1. Resolve Customer
                let realCustomerId = idMappings.current.customers.get(order.customerId);
                let resolvedCustomer: any = null;
                
                if (realCustomerId) {
                    resolvedCustomer = allCustomers.find((c: any) => c.id === realCustomerId);
                } else {
                    if (order.GPS) resolvedCustomer = allCustomers.find((c: any) => c.locationText === order.GPS);
                    if (!resolvedCustomer && order.customerPan) resolvedCustomer = allCustomers.find((c: any) => c.panNumber === order.customerPan);
                    if (!resolvedCustomer && order.customerPhone) resolvedCustomer = allCustomers.find((c: any) => c.phone === order.customerPhone);
                    if (!resolvedCustomer && order.customerName) resolvedCustomer = allCustomers.find((c: any) => c.name === order.customerName);
                    if (resolvedCustomer) realCustomerId = resolvedCustomer.id;
                }
                
                if (!realCustomerId) {
                    realCustomerId = order.customerId;
                }

                // 2. Resolve Salesperson
                let realSalespersonId = idMappings.current.users.get(order.salespersonId);
                let resolvedUser: any = null;
                
                if (realSalespersonId) {
                    resolvedUser = allUsers.find((u: any) => u.id === realSalespersonId);
                }

                if (!resolvedUser) {
                    resolvedUser = allUsers.find((u: any) => u.name === order.salespersonName);
                    if (resolvedUser) realSalespersonId = resolvedUser.id;
                    else realSalespersonId = order.salespersonId;
                }

                // 3. Construct Valid Items JSON
                const validItems = order.items.map((item: any) => {
                    const realProductId = idMappings.current.products.get(item.productId) || item.productId;
                    const product = getProduct(realProductId);
                    
                    const productName = product?.name || item.tempProductName || 'Unknown Product';
                    const companyId = product?.companyId || 'default-company';
                    const company = getCompany(companyId);
                    const companyName = company?.name || 'Amrapali';

                    const qty = Number(item.quantity || 0);
                    const rate = Number(item.price || 0);
                    const total = Number(item.amount || 0);

                    return {
                        qty,
                        rate,
                        total,
                        baseRate: rate,
                        companyId,
                        productId: realProductId,
                        companyName,
                        discountPct: 0,
                        productName,
                        schemeAppliedText: ""
                    };
                });

                ordersToInsert.push({
                    id: order.id,
                    customerId: realCustomerId,
                    customerName: resolvedCustomer ? resolvedCustomer.name : (order.customerName || 'Unknown Customer'),
                    salespersonId: realSalespersonId,
                    salespersonName: resolvedUser ? resolvedUser.name : (order.salespersonName || 'Default Salesperson'),
                    date: order.date,
                    time: order.time,
                    GPS: order.GPS,
                    totalItems: order.totalItems,
                    totalAmount: order.totalAmount,
                    discount: order.discount,

                    // Pass-through NEW fields
                    'vatRequired?': !!order['vatRequired?'], // keep boolean
                    paymentMethod: order.paymentMethod || '',

                    items: validItems,
                    status: 'completed'
                });
            }
            
            await processBatch(ordersToInsert, async (o) => {
                try {
                    await OrderService.add(o);
                } catch (err: any) {
                    console.error("Failed order:", o, err);
                    throw new Error(`Order ${o.id} failed: ${err.message}`);
                }
            }, 'Orders');
            
            setStats(prev => ({ ...prev, orders: { ...prev.orders, new: ordersToInsert.length } }));
            addLog(`Step 4 Complete. Migration Finished.`);
            setCurrentStep(5); 
        } catch (e: any) {
            addLog(`Error in Step 4: ${e.message}`);
        }
        setIsProcessing(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">📊 Smart Data Migration</h2>
                <div className="flex gap-2">
                    {currentStep === 0 && (
                        <>
                            <input 
                                type="file" 
                                accept=".csv" 
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                            <Button 
                                onClick={() => fileInputRef.current?.click()} 
                                variant="outline"
                            >
                                📁 Select CSV File
                            </Button>
                            <Button 
                                onClick={() => setShowPasteArea(!showPasteArea)} 
                                variant="outline"
                            >
                                📋 {showPasteArea ? 'Hide' : 'Paste'} CSV
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {currentStep === 0 && showPasteArea && (
                <Card className="p-4 border-2 border-blue-300 bg-blue-50">
                    <h3 className="font-bold text-gray-800 mb-2">📋 Paste Raw CSV Data</h3>
                    <textarea
                        value={csvText}
                        onChange={(e) => setCsvText(e.target.value)}
                        placeholder="Paste your CSV data here... (headers in first row, data in following rows)"
                        className="w-full h-40 p-3 border border-gray-300 rounded font-mono text-sm mb-3"
                    />
                    <div className="flex gap-2">
                        <Button onClick={handlePasteCSV} variant="primary">
                            ✅ Process Pasted CSV
                        </Button>
                        <Button 
                            onClick={() => {
                                setCsvText('');
                                setShowPasteArea(false);
                            }} 
                            variant="outline"
                        >
                            ❌ Cancel
                        </Button>
                    </div>
                </Card>
            )}

            {migrationData && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                        <div className="text-xs text-gray-500">👥 Users</div>
                        <div className="font-bold text-lg text-blue-700">{migrationData.users.length}</div>
                        {stats.users.new > 0 && <div className="text-xs text-green-600">✅ +{stats.users.new} new</div>}
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded">
                        <div className="text-xs text-gray-500">🛍️ Products</div>
                        <div className="font-bold text-lg text-green-700">{migrationData.products.length}</div>
                        {stats.products.new > 0 && <div className="text-xs text-green-600">✅ +{stats.products.new} new</div>}
                    </div>
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                        <div className="text-xs text-gray-500">👫 Customers</div>
                        <div className="font-bold text-lg text-purple-700">{migrationData.customers.length}</div>
                        {stats.customers.new > 0 && <div className="text-xs text-green-600">✅ +{stats.customers.new} new</div>}
                    </div>
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                        <div className="text-xs text-gray-500">📦 Orders</div>
                        <div className="font-bold text-lg text-orange-700">{migrationData.orders.length}</div>
                        {stats.orders.new > 0 && <div className="text-xs text-green-600">✅ +{stats.orders.new} imported</div>}
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                        <div className="text-xs text-gray-500">📅 Date Range</div>
                        <div className="font-bold text-xs text-gray-700">{migrationData.stats.dateRange.earliest}</div>
                        <div className="font-bold text-xs text-gray-700 mt-1">→ {migrationData.stats.dateRange.latest}</div>
                    </div>
                </div>
            )}

            {migrationData && (
                <Card className="p-6">
                    <div className="mb-6 flex justify-between items-center">
                        <h3 className="text-lg font-bold">🚀 Migration Progress</h3>
                        <div className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
                            Step: {currentStep} / 4
                        </div>
                    </div>

                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        <Button 
                            disabled={currentStep !== 1 || isProcessing} 
                            variant={currentStep > 1 ? "outline" : "primary"}
                            onClick={handleStep1}
                        >
                            {currentStep > 1 ? "✅ Users Done" : "⚙️ Step 1: Users"}
                        </Button>
                        <Button 
                            disabled={currentStep !== 2 || isProcessing} 
                            variant={currentStep > 2 ? "outline" : "primary"}
                            onClick={handleStep2}
                        >
                            {currentStep > 2 ? "✅ Products Done" : "⚙️ Step 2: Products"}
                        </Button>
                        <Button 
                            disabled={currentStep !== 3 || isProcessing} 
                            variant={currentStep > 3 ? "outline" : "primary"}
                            onClick={handleStep3}
                        >
                            {currentStep > 3 ? "✅ Customers Done" : "⚙️ Step 3: Customers"}
                        </Button>
                        <Button 
                            disabled={currentStep !== 4 || isProcessing} 
                            variant={currentStep > 4 ? "outline" : "primary"}
                            onClick={handleStep4}
                        >
                            {currentStep > 4 ? "✅ Orders Done" : "⚙️ Step 4: Orders"}
                        </Button>
                    </div>

                    {isProcessing && (
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-semibold text-gray-700">
                                    {progress.stage}
                                </span>
                                <span className="text-sm font-mono text-blue-600">
                                    {progress.current} / {progress.total}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 flex items-center justify-center"
                                    style={{ width: `${Math.max(3, (progress.current / progress.total) * 100)}%` }}
                                >
                                    {progress.current > 0 && (
                                        <span className="text-xs text-white font-bold px-1">
                                            {Math.round((progress.current / progress.total) * 100)}%
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-gray-900 text-green-400 p-4 rounded-md h-80 overflow-y-auto font-mono text-xs border border-gray-700">
                        {logs.length === 0 ? (
                            <div className="text-gray-500">Logs will appear here...</div>
                        ) : (
                            logs.map((log, i) => (
                                <div key={i} className="py-0.5 hover:bg-gray-800 px-1">
                                    {log}
                                </div>
                            ))
                        )}
                        <div ref={logsEndRef} />
                    </div>
                </Card>
            )}

            {!migrationData && currentStep === 0 && logs.length === 0 && (
                <Card className="p-8 text-center">
                    <div className="text-4xl mb-4">📥</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Upload Your Sales Data</h3>
                    <p className="text-gray-600 mb-4">
                        Select a CSV file or paste raw CSV data to begin migration
                    </p>
                </Card>
            )}
        </div>
    );
};