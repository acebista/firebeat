// src/components/Migration.tsx
import React, { useState, useRef } from 'react';
import { Card, Button } from '../../components/ui/Elements';
import { CustomerService, ProductService, OrderService, CompanyService, UserService } from '../../services/db';
import { Customer } from '../../types';
import { supabase } from '../../lib/supabase';

// --- Helper: Generate UUID v4 ---
const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
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

const DEFAULT_GPS = "27.715034, 85.324468";

// --- Fuzzy Matching Helpers ---
const levenshteinDistance = (a: string, b: string) => {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
    for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                );
            }
        }
    }
    return matrix[b.length][a.length];
};

const normalizeNameForComparison = (name: string) => {
    if (!name) return '';
    let n = name.toLowerCase().trim();
    // Remove special chars (encoding errors like )
    n = n.replace(/[^a-z0-9\s]/g, '');
    // Synonyms & Standardizations
    n = n.replace(/\bpasal\b/g, 'store');
    n = n.replace(/\bshop\b/g, 'store');
    n = n.replace(/\bkirena\b/g, 'kirana'); // Common type
    n = n.replace(/\benterprises\b/g, 'enterprise');
    n = n.replace(/\bsuppliers\b/g, 'supplier');
    n = n.replace(/\btraders\b/g, 'trader');
    // Remove spaces for density check
    return n.replace(/\s+/g, ' ');
};

export const Migration: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0, stage: '' });
    const [logs, setLogs] = useState<string[]>([]);

    const [migrationData, setMigrationData] = useState<any>(null);
    const [csvText, setCsvText] = useState<string>('');
    const [showPasteArea, setShowPasteArea] = useState<boolean>(false);
    const [migrationMode, setMigrationMode] = useState<'clean-slate' | 'upsert'>('clean-slate');
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

            // Pre-flight: track zero-qty rows and CSV totals
            let zeroQtyRows = 0;
            let totalCSVAmount = 0;

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
                    companyId: 'default-company',
                    companyName: 'Imported',
                    baseRate: 0,
                    discountedRate: 0,
                    orderMultiple: 1,
                    stockOut: false,
                    discountEditable: true,
                    isActive: true,
                    category: 'Imported'
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

                // Use Phone or Name as primary key for customer uniqueness during parsing
                // CRITICAL: Do NOT use GPS as a key - multiple distinct shops share GPS in dense areas!
                const customerKey = phone || customerName || pan;

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
                    totalCSVAmount += parseAmount(row[totalIdx]);
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
                } else {
                    zeroQtyRows++;
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
            addLog(`  • Orders (usable): ${summary.orders}`);
            if (zeroQtyRows > 0) {
                addLog(`  • Rows skipped (zero quantity): ${zeroQtyRows}`);
            }
            addLog(`  • Total CSV Sales Amount: ₹${totalCSVAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
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
                    },
                    totalCSVAmount,
                    zeroQtyRows
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

    // Step 3: Customers (DEDUPE WITH GPS PRIORITY, BUT IGNORE DEFAULT GPS)
    const handleStep3 = async () => {
        setIsProcessing(true);
        addLog('Step 3: Migrating Customers with Smart Deduplication...');
        try {
            const existingCustomers = await CustomerService.getAllRecursively().catch(() => []);
            let newCount = 0;
            let mergedCount = 0;
            const customersToInsert: Customer[] = [];

            const createdInThisSession = new Map<string, string>();

            for (const customer of migrationData.customers) {
                let exists: Customer | undefined = undefined;

                // 1. Phone (Primary Key for Dedupe - strongest signal)
                if (customer.phone) {
                    exists = existingCustomers.find((c: any) => c.phone === customer.phone);
                }

                // 2. Strict Name Match (High Confidence)
                if (!exists) {
                    exists = existingCustomers.find((c: any) => c.name.toLowerCase().trim() === customer.name.toLowerCase().trim());
                }

                // 3. PAN (Legal Identifier)
                if (!exists && customer.panNumber) {
                    exists = existingCustomers.find((c: any) => c.panNumber === customer.panNumber);
                }

                // 4. Fallback: GPS + Fuzzy Name Verification (Last Resort)
                // Only if GPS is valid and NOT default
                if (!exists && customer.locationText && customer.locationText.trim() !== DEFAULT_GPS) {
                    const gpsCandidates = existingCustomers.filter((c: any) => c.locationText === customer.locationText);
                    const nCsv = normalizeNameForComparison(customer.name || '');

                    exists = gpsCandidates.find((c: any) => {
                        const nDb = normalizeNameForComparison(c.name);
                        // If exact normalized match (e.g. "Store" vs "Pasal")
                        if (nDb === nCsv) return true;

                        // Strict Fuzzy: > 80% similarity required
                        const dist = levenshteinDistance(nCsv, nDb);
                        const maxLen = Math.max(nCsv.length, nDb.length);
                        const sim = 1 - (dist / maxLen);
                        return sim > 0.8;
                    });
                }

                // 5. Session Deduplication (Check if we just created them in this run)
                if (!exists) {
                    // Prefer Phone -> Name -> GPS -> PAN for session key
                    let sessionKey = '';
                    if (customer.phone) sessionKey = `phone:${customer.phone}`;
                    else sessionKey = `name:${customer.name.toLowerCase().trim()}`;

                    const alreadyCreatedId = createdInThisSession.get(sessionKey);
                    if (alreadyCreatedId) {
                        idMappings.current.customers.set(customer.id, alreadyCreatedId);
                        mergedCount++;
                        exists = { id: alreadyCreatedId } as any; // Mark found
                    } else {
                        // Add new to map
                        createdInThisSession.set(sessionKey, customer.id);
                    }
                }

                if (exists) {
                    idMappings.current.customers.set(customer.id, exists.id);
                    mergedCount++;
                } else {
                    customersToInsert.push(customer);
                    idMappings.current.customers.set(customer.id, customer.id);
                    newCount++;
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

    // Step 4: Orders (CSV AS SOURCE OF TRUTH - CLEAN SLATE OR UPSERT MODE)
    const handleStep4 = async () => {
        if (!migrationData) return;

        setIsProcessing(true);
        addLog(`🚀 Starting Step 4: ${(migrationMode === 'clean-slate' ? 'Clean Slate' : 'Update/Upsert')} Orders Migration...`);
        setProgress({ current: 0, total: 100, stage: 'Starting...' });

        try {
            // STEP 1: PREPARATION & RESOLUTION
            addLog('⚙️ resolving entities for orders...');
            // Need latest lists for fallback resolution
            const allCustomers: any[] = await CustomerService.getAllRecursively().catch(() => []);
            // const allUsers = await UserService.getAll().catch(() => []); // Used in map check

            const ordersToInsert: any[] = [];
            const newCustomersToCreate: any[] = []; // If we need to create on fly

            // Build CSV map for verification later
            const csvCustomerNameByInvoice = new Map<string, string>();

            for (const o of migrationData.orders) {
                csvCustomerNameByInvoice.set(o.id, o.customerName || 'Unknown');

                // 1. SALESPERSON RESOLUTION
                const finalSalespersonId = idMappings.current.users.get(o.salespersonId) || o.salespersonId;

                // 2. CUSTOMER RESOLUTION (Strict Hierarchy)
                let finalCustomerId = idMappings.current.customers.get(o.customerId);
                let fallbackMethod = '';

                // If mapping missing, try robust fallback
                if (!finalCustomerId) {
                    let resolvedCustomer: any = null;

                    // A. Phone (Primary)
                    if (!resolvedCustomer && o.customerPhone) {
                        resolvedCustomer = allCustomers.find((c: any) => c.phone === o.customerPhone);
                        if (resolvedCustomer) fallbackMethod = 'Phone';
                    }

                    // B. Exact Name
                    if (!resolvedCustomer && o.customerName) {
                        resolvedCustomer = allCustomers.find((c: any) => c.name.toLowerCase().trim() === o.customerName.toLowerCase().trim());
                        if (resolvedCustomer) fallbackMethod = 'Name';
                    }

                    // C. PAN
                    if (!resolvedCustomer && o.customerPan) {
                        resolvedCustomer = allCustomers.find((c: any) => c.panNumber === o.customerPan);
                        if (resolvedCustomer) fallbackMethod = 'PAN';
                    }

                    // D. GPS + Verification (Last Resort)
                    if (!resolvedCustomer && o.GPS && o.GPS.trim() !== DEFAULT_GPS) {
                        const gpsCandidates = allCustomers.filter((c: any) => c.locationText === o.GPS);
                        const nCsv = normalizeNameForComparison(o.customerName || '');

                        resolvedCustomer = gpsCandidates.find((c: any) => {
                            const nDb = normalizeNameForComparison(c.name);
                            if (nDb === nCsv) return true;

                            const dist = levenshteinDistance(nCsv, nDb);
                            const maxLen = Math.max(nCsv.length, nDb.length);
                            return (1 - (dist / maxLen)) > 0.8;
                        });
                        if (resolvedCustomer) fallbackMethod = 'GPS+Verify';
                    }

                    if (resolvedCustomer) {
                        finalCustomerId = resolvedCustomer.id;
                        // Cache for future
                        idMappings.current.customers.set(String(o.customerId || ''), finalCustomerId);
                    } else {
                        // E. Create New (Emergency Fallback)
                        // If we truly can't find them, we should create a new customer to avoid data loss
                        // using the CSV details for this order
                        addLog(`⚠️ Order ${o.id}: Customer '${o.customerName}' not found. Creating new...`);
                        const newCust = {
                            id: o.customerId, // Use CSV ID if possible or generate new? Use CSV ID for mapping consistency
                            name: o.customerName || 'Unknown Customer',
                            phone: o.customerPhone || '',
                            panNumber: o.customerPan || '',
                            locationText: o.GPS && o.GPS !== DEFAULT_GPS ? o.GPS : '',
                            // minimal fields
                        };
                        // We push to list to create in batch or create immediately?
                        // For safety in this complex loop, let's create immediately or use service
                        try {
                            const created = await CustomerService.add(newCust as any);
                            finalCustomerId = created.id;
                            // Critical: Update cache so subsequent orders in this batch find it
                            idMappings.current.customers.set(String(o.customerId || ''), finalCustomerId);
                            allCustomers.push(created as any);
                            fallbackMethod = 'CreatedOnFly';
                        } catch (err) {
                            console.error('Failed to create fallback cust', err);
                            // Worst case: default or skip. Let's keep original ID and hope.
                            finalCustomerId = o.customerId;
                            fallbackMethod = 'FailedToResolve';
                        }
                    }
                } else {
                    fallbackMethod = 'Mapping';
                }

                // Log significant fallbacks if needed (verbose)
                // if (fallbackMethod !== 'Mapping') console.log(`Order ${o.id} customer resolved via ${fallbackMethod}`);

                // Map product IDs in order items to actual database IDs
                const mappedItems = (o.items || []).map((item: any) => {
                    const csvProductId = item.productId;
                    const dbProductId = idMappings.current.products.get(csvProductId) || csvProductId;

                    return {
                        ...item,
                        productId: dbProductId
                    };
                });

                const orderWithCorrectIds = {
                    ...o,
                    customerId: finalCustomerId,
                    // Ensure name matches the resolved customer for consistency in DB
                    customerName: allCustomers.find((c: any) => c.id === finalCustomerId)?.name || o.customerName,
                    salespersonId: finalSalespersonId,
                    // Use mapped product IDs in items
                    items: mappedItems
                };
                ordersToInsert.push(orderWithCorrectIds);
            }

            // Calculate expected totals from CSV data for verification
            const csvSalesBySP = new Map<string, number>();
            const csvInvoicesBySP = new Map<string, string[]>();

            ordersToInsert.forEach((order: any) => {
                const spName = order.salespersonName || 'Unknown';
                csvSalesBySP.set(spName, (csvSalesBySP.get(spName) || 0) + (order.totalAmount || 0));

                if (!csvInvoicesBySP.has(spName)) {
                    csvInvoicesBySP.set(spName, []);
                }
                csvInvoicesBySP.get(spName)!.push(order.id);
            });

            // STEP 2: MIGRATION (Clean Slate vs Upsert)
            let successCount = 0;
            let failedInvoices: Array<{ id: string; error: string }> = [];

            if (migrationMode === 'clean-slate') {
                addLog('⚠️ Mode: Clean Slate - Deleting ALL existing orders first...');

                addLog('   Fetching existing order IDs to delete...');
                const allOldIds = await OrderService.getAllOrderIds();
                addLog(`   Found ${allOldIds.length} existing orders to delete.`);

                if (allOldIds.length > 0) {
                    // Delete in batches of 1000
                    const deleteBatchSize = 1000;
                    for (let i = 0; i < allOldIds.length; i += deleteBatchSize) {
                        const batchIds = allOldIds.slice(i, i + deleteBatchSize);
                        const { error } = await supabase.from('orders').delete().in('id', batchIds);
                        if (error) {
                            addLog(`❌ Failed to delete batch ${i / deleteBatchSize + 1}: ${error.message}`);
                            throw error;
                        }
                        setProgress({
                            current: Math.min(i + batchIds.length, allOldIds.length),
                            total: allOldIds.length,
                            stage: `Deleting old orders...`
                        });
                    }
                    addLog('✅ All old orders deleted.');
                }

                addLog(`📦 Function: Batch Inserting ${ordersToInsert.length} orders...`);
                // Use batchInsert
                const result = await OrderService.batchInsert(
                    ordersToInsert,
                    200, // batch size
                    (subSuccess, subFail, subTotal) => {
                        successCount = subSuccess;
                        setProgress({
                            current: successCount + subFail,
                            total: ordersToInsert.length,
                            stage: `Orders Inserted: ${successCount} | Failed: ${subFail}`
                        });
                    }
                );
                successCount = result.success;
                failedInvoices = result.failed;

            } else {
                // UPDATE/UPSERT MODE
                addLog(`🔄 Mode: Update/Upsert - Merging ${ordersToInsert.length} orders...`);
                addLog('   Existing orders not matching these IDs will remain untouched.');

                const result = await OrderService.batchUpsert(
                    ordersToInsert,
                    200, // batch size
                    (subSuccess, subFail, subTotal) => {
                        successCount = subSuccess;
                        setProgress({
                            current: successCount + subFail,
                            total: ordersToInsert.length,
                            stage: `Orders Upserted: ${successCount} | Failed: ${subFail}`
                        });
                    }
                );
                successCount = result.success;
                failedInvoices = result.failed;
            }

            addLog(`✅ Operation completed: ${successCount} orders processed successfully.`);

            if (failedInvoices.length > 0) {
                addLog(`❌ Failed to process ${failedInvoices.length} orders:`);
                failedInvoices.slice(0, 10).forEach(f => {
                    addLog(`   • ${f.id}: ${f.error}`);
                });
                if (failedInvoices.length > 10) {
                    addLog(`   ... and ${failedInvoices.length - 10} more failures`);
                }
                addLog(`💡 Check browser console for full error details`);
            }

            // STEP 3: SALES VERIFICATION & COMPARISON
            addLog('');
            addLog('🔍 ===== VERIFICATION & INTEGRITY CHECK =====');
            addLog('Comparing CSV data vs Database data...');
            addLog('(Fetching ALL database orders in pages, this may take a moment...)');

            const dbSalesBySP = new Map<string, number>();
            const dbInvoicesBySP = new Map<string, Set<string>>();
            const dbCustomerNameByInvoice = new Map<string, string>();
            const dbOrderCountByCustomer = new Map<string, { name: string, count: number }>();

            let totalDbOrders = 0;

            // Use paginated fetch to ensure we get everything
            await OrderService.getAllPaged((batchOrders, batchNum) => {
                batchOrders.forEach((order: any) => {
                    const spName = order.salespersonName || 'Unknown';
                    dbSalesBySP.set(spName, (dbSalesBySP.get(spName) || 0) + (order.totalAmount || 0));

                    if (!dbInvoicesBySP.has(spName)) {
                        dbInvoicesBySP.set(spName, new Set());
                    }
                    dbInvoicesBySP.get(spName)!.add(order.id);

                    // Comparison data
                    dbCustomerNameByInvoice.set(order.id, order.customerName || 'Unknown');

                    // Top customer stats
                    const cid = order.customerId || 'unknown';
                    const cname = order.customerName || 'Unknown';
                    const curr = dbOrderCountByCustomer.get(cid) || { name: cname, count: 0 };
                    curr.count++;
                    dbOrderCountByCustomer.set(cid, curr);
                });
                totalDbOrders += batchOrders.length;
                setProgress({
                    current: totalDbOrders,
                    total: ordersToInsert.length, // rough indicator
                    stage: `Verifying... Fetched ${totalDbOrders} DB records`
                });
            });

            addLog(`✅ Verification complete. Analyzed ${totalDbOrders} orders from Database.`);

            // 3.1 Customer Name Mismatches
            addLog('🔎 Checking for Customer Name Data Integrity (Smart Verification)...');
            const nameMismatches: string[] = [];
            let processedComparisons = 0;

            csvCustomerNameByInvoice.forEach((csvName, invoiceId) => {
                const dbName = dbCustomerNameByInvoice.get(invoiceId);
                // Only compare if present in DB
                if (dbName) {
                    processedComparisons++;

                    const nCsv = normalizeNameForComparison(csvName);
                    const nDb = normalizeNameForComparison(dbName);

                    if (nCsv !== nDb) {
                        // If normalized exact match fails, try fuzzy
                        const dist = levenshteinDistance(nCsv, nDb);
                        const maxLength = Math.max(nCsv.length, nDb.length);
                        const similarity = 1 - (dist / maxLength);

                        // Heuristic: If > 70% similar or distance <= 3, consider it "Same" (just typical typo/spelling var)
                        const isCloseMatch = similarity > 0.70 || dist <= 3;

                        // Special check: One contains the other? (e.g. "Abc Store" vs "Abc Store & Suppliers")
                        const isSubstring = nCsv.includes(nDb) || nDb.includes(nCsv);

                        if (!isCloseMatch && !isSubstring) {
                            nameMismatches.push(`Inv #${invoiceId}: CSV="${csvName}" vs DB="${dbName}" (Sim: ${(similarity * 100).toFixed(0)}%)`);
                        }
                    }
                }
            });

            addLog(`   • Compared ${processedComparisons} invoices`);
            if (nameMismatches.length > 0) {
                addLog(`   ⚠️ Found ${nameMismatches.length} Significant customer name mismatches!`);
                addLog(`      (Note: Minor typos, case differences, and synonyms like Pasal/Store are ignored)`);
                nameMismatches.slice(0, 10).forEach(m => addLog(`      - ${m}`));
                if (nameMismatches.length > 10) addLog(`      ...and ${nameMismatches.length - 10} more`);
            } else {
                addLog(`   ✅ Customer names match (or are distinct matching aliases) for all invoices.`);
            }

            // 3.2 Top Customers by Order Count (Spotlight Check)
            addLog('🔎 Top Customers by Order Count (Check for collapsed data):');
            const topCustomers = Array.from(dbOrderCountByCustomer.entries())
                .sort((a, b) => b[1].count - a[1].count)
                .slice(0, 5);

            topCustomers.forEach(([cid, data]) => {
                addLog(`   • ${data.name} (ID: ...${cid.slice(-4)}): ${data.count} orders`);
            });

            // 3.3 Salesperson Totals
            addLog('🔎 Salesperson Totals Verification:');
            const allSalespersons = new Set([...csvSalesBySP.keys(), ...dbSalesBySP.keys()]);
            let hasDiscrepancies = false;

            allSalespersons.forEach(spName => {
                const csvTotal = csvSalesBySP.get(spName) || 0;
                const dbTotal = dbSalesBySP.get(spName) || 0;
                const difference = dbTotal - csvTotal;
                const percentDiff = csvTotal > 0 ? ((difference / csvTotal) * 100) : 0;

                if (Math.abs(difference) > 1.0) {
                    hasDiscrepancies = true;
                    const status = difference < 0 ? '⚠️ MISSING' : '⚠️ EXTRA';
                    addLog(`${status} - ${spName}:`);
                    addLog(`  CSV Total: ₹${csvTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
                    addLog(`  DB Total:  ₹${dbTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
                    addLog(`  Diff:      ₹${difference.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${percentDiff.toFixed(2)}%)`);

                    const csvInvoices = csvInvoicesBySP.get(spName) || [];
                    const dbInvoices = dbInvoicesBySP.get(spName) || new Set();
                    const missingInvoices = csvInvoices.filter(inv => !dbInvoices.has(inv));

                    if (missingInvoices.length > 0) {
                        addLog(`  📋 ${missingInvoices.length} invoices from CSV NOT in DB:`);
                        const sample = missingInvoices.slice(0, 5);
                        addLog(`     ${sample.join(', ')}${missingInvoices.length > 5 ? ` ...and ${missingInvoices.length - 5} more` : ''}`);
                    }
                } else {
                    addLog(`✅ ${spName}: ₹${dbTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (perfect match!)`);
                }
            });

            if (!hasDiscrepancies && nameMismatches.length === 0) {
                addLog('');
                addLog('🎉 SUCCESS! All sales data matches CSV perfectly!');
                addLog('✅ Database is now 100% in sync with your CSV');
            } else {
                addLog('');
                addLog('⚠️ DISCREPANCIES FOUND!');
                addLog('💡 Check error logs above details');
            }
            addLog('========================================');

            setStats(prev => ({
                ...prev,
                orders: {
                    ...prev.orders,
                    new: successCount,
                    existing: totalDbOrders - successCount,
                    skipped: failedInvoices.length
                }
            }));
            addLog(`Step 4 Complete.`);
            setCurrentStep(5);
        } catch (e: any) {
            console.error(e);
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
