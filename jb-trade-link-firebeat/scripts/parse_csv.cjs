const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const csvPath = path.join(__dirname, '../sales_source.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

const lines = csvContent.split('\n').filter(l => l.trim());
const headers = parseLine(lines[0]);

// Fixed company mapping from your actual data
const COMPANY_MAP = {
    'c1': { id: 'c1', name: 'Jasmine Masala', code: 'JSMN', isActive: true },
    'c2': { id: 'c2', name: 'Parle', code: 'PAR', isActive: true },
    'c3': { id: 'c3', name: 'Godrej', code: 'GDR', isActive: true },
    'c4': { id: 'c4', name: 'Bimal Trade', code: 'BMTR', isActive: true },
    'c5': { id: 'c5', name: 'Himgiri', code: 'HMG', isActive: true },
    'c6': { id: 'c6', name: 'Amrapali', code: 'AMRP', isActive: true },
    'c7': { id: 'c7', name: 'Manakamana', code: 'MNKM', isActive: false }
};

// Simple company detection from product name
function detectCompany(productName) {
    const name = productName.toLowerCase();

    if (name.includes('jasmine')) return 'c1';
    if (name.includes('parle') || name.includes('hide') || name.includes('monaco') ||
        name.includes('krack') || name.includes('marie') || name.includes('cashew') ||
        name.includes('h&s') || name.includes('happy') || name.includes('mango bite') ||
        name.includes('orange bite') || name.includes('melody') || name.includes('mazelo') ||
        name.includes('rola') || name.includes('royale') || name.includes('rusk') ||
        name.includes('top ') || name.includes('nice ') || name.includes('nutr') ||
        name.includes('butter cookies') || name.includes('gauva') || name.includes('imli') ||
        name.includes('jam-') || name.includes('kachha') || name.includes('kream') ||
        name.includes('londan') || name.includes('magix') || name.includes('ellachi') ||
        name.includes('chocolate cream') || name.includes('orange cream') || name.includes('orange kream')) return 'c2';
    if (name.includes('godrej') || name.includes('aer ') || name.includes('hit ') ||
        name.includes('protekt') || name.includes('ezee') || name.includes('gk ') ||
        name.includes('goodnight') || name.includes('parkavenue') || name.includes('park avenue') ||
        name.includes('rich cream') || name.includes('nupur') || name.includes('phc') ||
        name.includes('rat kill') || name.includes('no. 1 soap') || name.includes('no.1 soap') ||
        name.includes('expert easy') || name.includes('cinthol') || name.includes('kamasutra')) return 'c3';
    if (name.includes('bimal') || name.includes('gusto') || name.includes('nabil') ||
        name.includes('anmol') || name.includes('phaner')) return 'c4';
    if (name.includes('himgiri') || name.includes('dhoni') || name.includes('fizz') ||
        name.includes('shova') || name.includes('tika') || name.includes('xtraa') ||
        name.includes('aura') || name.includes('saino') || name.includes('kasturi') ||
        name.includes('tia ')) return 'c5';
    if (name.includes('amrapali') || name.includes('kool') || name.includes('ruchi')) return 'c6';
    if (name.includes('manakamana') || name.includes('nimbu fresh') || name.includes('class soda') ||
        name.includes('shikanji') || name.includes('lichee') || name.includes('peach masti') ||
        name.includes('mint lemonade') || name.includes('free ')) return 'c7';

    return 'unknown';
}

// Product start index in sales CSV
const productStartIndex = 11;

// Maps for deduplication
const customerMap = new Map();
const productMap = new Map(); // productName -> product details
const userMap = new Map(); // salesperson name -> user object
const orders = [];

function parseLine(text) {
    const result = [];
    let cur = '';
    let inQuote = false;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"') {
            inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
            result.push(cur.trim());
            cur = '';
        } else {
            cur += char;
        }
    }
    result.push(cur.trim());
    return result;
}

function parseAmount(str) {
    if (!str) return 0;
    return parseFloat(str.replace(/,/g, '')) || 0;
}

function generateUUID() {
    return crypto.randomUUID();
}

function sanitizeForId(str) {
    return str.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
}

function getCustomerDedupKey(pan, phone, name) {
    if (pan && pan !== 'N/A') return `pan_${pan.toLowerCase()}`;
    if (phone && phone !== 'N/A') return `phone_${phone}`;
    return `name_${sanitizeForId(name)}`;
}

console.log('Starting CSV parsing with actual company data...');

// Process orders
for (let i = 1; i < lines.length; i++) {
    const row = parseLine(lines[i]);
    if (row.length < productStartIndex) continue;

    const salesperson = row[0];
    const invoiceNum = row[1];
    const shopName = row[2];
    const phone = row[3] === 'N/A' ? null : row[3];
    const pan = row[4] === 'N/A' ? null : row[4];
    const totalAmount = parseAmount(row[9]);

    // Create user for salesperson if doesn't exist
    if (salesperson && !userMap.has(salesperson)) {
        const userId = sanitizeForId(salesperson);
        const email = `${userId}@jbtradelink.com`; // Temporary email

        userMap.set(salesperson, {
            id: userId,
            email: email,
            name: salesperson,
            role: 'sales',
            isActive: true,
            createdAt: new Date().toISOString(),
            avatarUrl: null
        });
    }

    const user = userMap.get(salesperson);

    const dedupKey = getCustomerDedupKey(pan, phone, shopName);

    if (!customerMap.has(dedupKey)) {
        customerMap.set(dedupKey, {
            id: generateUUID(),
            name: shopName,
            phone: phone,
            panNumber: pan,
            routeName: null,
            locationText: null,
            isActive: true,
            submittedBy: salesperson,
            createdAt: new Date().toISOString(),
            creditLimit: null,
            currentOutstanding: null,
            status: 'active',
            creditDays: null,
            metadata: {
                source: 'migration',
                originalName: shopName,
                dedupKey: dedupKey
            }
        });
    }

    const customer = customerMap.get(dedupKey);
    const items = [];
    let totalItemsCount = 0;

    for (let p = productStartIndex; p < row.length; p++) {
        const cell = row[p];
        if (cell && cell.includes('|')) {
            const productName = headers[p];

            if (!productMap.has(productName)) {
                const companyId = detectCompany(productName);
                const company = COMPANY_MAP[companyId] || { id: 'unknown', name: 'Unknown', code: 'UNK' };

                productMap.set(productName, {
                    id: sanitizeForId(productName),
                    name: productName,
                    companyId: company.id,
                    companyName: company.name,
                    baseRate: 0,
                    discountedRate: 0,
                    orderMultiple: 1,
                    packetsPerCarton: null,
                    piecesPerPacket: null,
                    stockOut: false,
                    isActive: true,
                    discountEditable: false,
                    secondaryAvailable: false,
                    secondaryDiscountPct: null,
                    secondaryQualifyingQty: null,
                    category: null,
                    additionalSecondaryDiscountPct: null,
                    additionalQualifyingQty: null,
                    metadata: {
                        source: 'migration',
                        originalName: productName
                    }
                });
            }

            const product = productMap.get(productName);
            const [qtyStr, amountStr] = cell.split('|');
            const qty = parseFloat(qtyStr);
            const amount = parseFloat(amountStr);

            if (qty > 0) {
                const rate = amount / qty;

                items.push({
                    productId: product.id,
                    productName: product.name,
                    companyId: product.companyId,
                    companyName: product.companyName,
                    qty: qty,
                    rate: rate,
                    baseRate: rate,
                    total: amount,
                    discountPct: 0
                });
                totalItemsCount += qty;
            }
        }
    }

    let date = new Date().toISOString().split('T')[0];
    const dateMatch = invoiceNum.match(/^(\d{2})(\d{2})(\d{2})/);
    if (dateMatch) {
        const year = '20' + dateMatch[1];
        const month = dateMatch[2];
        const day = dateMatch[3];
        date = `${year}-${month}-${day}`;
    }

    orders.push({
        id: invoiceNum,
        customerId: customer.id,
        customerName: customer.name,
        salespersonId: user ? user.id : 'unknown',
        salespersonName: salesperson,
        date: date,
        totalItems: totalItemsCount,
        totalAmount: totalAmount,
        status: 'delivered',
        items: items,
        remarks: null
    });
}

const output = {
    companies: Object.values(COMPANY_MAP).map(c => ({
        ...c,
        createdAt: '2023-01-01'
    })),
    users: Array.from(userMap.values()),
    customers: Array.from(customerMap.values()),
    products: Array.from(productMap.values()),
    orders: orders,
    stats: {
        totalOrders: orders.length,
        totalCustomers: customerMap.size,
        totalProducts: productMap.size,
        totalCompanies: Object.keys(COMPANY_MAP).length,
        totalUsers: userMap.size,
        dateRange: {
            earliest: orders.reduce((min, o) => o.date < min ? o.date : min, orders[0]?.date || ''),
            latest: orders.reduce((max, o) => o.date > max ? o.date : max, orders[0]?.date || '')
        }
    }
};

const libDir = path.join(__dirname, '../lib');
if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir);
}

fs.writeFileSync(path.join(libDir, 'migrationData.json'), JSON.stringify(output, null, 2));

console.log('\n=== Migration Data Summary ===');
console.log(`Companies: ${output.companies.length} (7 actual companies)`);
console.log(`Users: ${output.users.length} (salespeople)`);
console.log(`Customers: ${output.customers.length} (deduplicated)`);
console.log(`Products: ${output.products.length} (unique from orders)`);
console.log(`Orders: ${output.orders.length}`);
console.log(`Date Range: ${output.stats.dateRange.earliest} to ${output.stats.dateRange.latest}`);
console.log('\nCompanies:', output.companies.map(c => `${c.name} (${c.code})`).join(', '));
console.log('\nSalespeople:', output.users.map(u => u.name).join(', '));
console.log('\nData saved to: lib/migrationData.json');
