/**
 * Product Database Sync Script
 * 
 * This script:
 * 1. Fetches existing products and companies from Supabase
 * 2. Parses the CSV file with new product data
 * 3. Compares and generates:
 *    - Products to ADD (new products in CSV)
 *    - Products to UPDATE (existing products with changes)
 *    - Products to REVIEW (potential issues)
 * 4. Executes the sync with confirmation
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envLines = envContent.split('\n');
const env = {};
envLines.forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
        env[match[1].trim()] = match[2].trim();
    }
});

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to parse CSV
function parseCSV(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());

    if (lines.length === 0) return [];

    const headers = lines[0].split(',');
    const products = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];

        // Skip empty lines (lines with just commas and FALSE)
        if (!line.trim() || line.match(/^,+FALSE,?$/)) continue;

        const values = parseCSVLine(line);

        // Skip if all key fields are empty
        if (!values[0] && !values[1]) continue;

        const product = {};
        headers.forEach((header, idx) => {
            product[header.trim()] = values[idx]?.trim() || '';
        });

        products.push(product);
    }

    return products;
}

// Parse CSV line respecting quoted values
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current);

    return values;
}

// Convert CSV product to database product format
function convertCSVProduct(csvProduct, companies) {
    const companyName = csvProduct.Company;
    const company = companies.find(c => c.name === companyName);

    if (!company) {
        console.warn(`⚠️  Company not found: ${companyName} for product: ${csvProduct.Product}`);
    }

    // Parse numeric values
    const rate = parseFloat(csvProduct.Rate) || 0;
    const productDiscount = parseFloat(csvProduct['Product Discount']) || 0;
    const discountedRate = csvProduct['Discounted Rate']
        ? parseFloat(csvProduct['Discounted Rate'])
        : (rate - (rate * productDiscount / 100));

    return {
        name: csvProduct.Product,
        companyId: company?.id || null,
        companyName: companyName,
        category: '', // Not in CSV
        baseRate: rate,
        productDiscountPct: productDiscount,
        discountedRate: discountedRate,
        packetsPerCarton: parseInt(csvProduct['Packets/Carton']) || 1,
        piecesPerPacket: parseInt(csvProduct['Pieces/Packet']) || 1,
        stockOut: csvProduct['Stock Out']?.toUpperCase() === 'TRUE',
        minOrderQty: parseFloat(csvProduct.Multiple) || 1,
        orderMultiple: parseFloat(csvProduct.Multiple) || 1,
        discountEditable: csvProduct['Discount Editable']?.toUpperCase() === 'YES',
        secondaryDiscountPct: parseFloat(csvProduct.secondary_Discount) || 0,
        qualifyingQty: parseFloat(csvProduct.qualifying_Qty) || 0,
        additionalSecondaryDiscountPct: parseFloat(csvProduct.additional_Secondary_Discount) || 0,
        additionalQualifyingQty: parseFloat(csvProduct.additional_Qualifying_Qty) || 0,
        secondaryDiscountAvailable: csvProduct.secondary_Available?.toUpperCase() === 'TRUE',
        margin: csvProduct.Margin || ''
    };
}

// Compare two products
function productsAreDifferent(dbProduct, csvProduct) {
    const fieldsToCompare = [
        'name', 'companyId', 'baseRate', 'productDiscountPct', 'discountedRate',
        'packetsPerCarton', 'piecesPerPacket', 'stockOut', 'minOrderQty', 'orderMultiple',
        'discountEditable', 'secondaryDiscountPct', 'qualifyingQty',
        'additionalSecondaryDiscountPct', 'additionalQualifyingQty', 'secondaryDiscountAvailable'
    ];

    const differences = [];

    for (const field of fieldsToCompare) {
        const dbVal = dbProduct[field];
        const csvVal = csvProduct[field];

        // Handle null/undefined/0/false comparisons
        const dbNormalized = dbVal ?? (typeof csvVal === 'number' ? 0 : (typeof csvVal === 'boolean' ? false : ''));
        const csvNormalized = csvVal ?? (typeof dbVal === 'number' ? 0 : (typeof dbVal === 'boolean' ? false : ''));

        if (JSON.stringify(dbNormalized) !== JSON.stringify(csvNormalized)) {
            differences.push({
                field,
                old: dbVal,
                new: csvVal
            });
        }
    }

    return differences;
}

// Main sync function
async function syncProducts() {
    console.log('🔄 Product Database Sync Starting...\n');

    // 1. Fetch existing data
    console.log('📥 Fetching existing data from Supabase...');
    const [companiesResult, productsResult] = await Promise.all([
        supabase.from('companies').select('*'),
        supabase.from('products').select('*')
    ]);

    if (companiesResult.error) {
        console.error('❌ Error fetching companies:', companiesResult.error);
        process.exit(1);
    }

    if (productsResult.error) {
        console.error('❌ Error fetching products:', productsResult.error);
        process.exit(1);
    }

    const companies = companiesResult.data;
    const dbProducts = productsResult.data;

    console.log(`   ✓ Found ${companies.length} companies`);
    console.log(`   ✓ Found ${dbProducts.length} products in database\n`);

    // 2. Parse CSV
    console.log('📄 Parsing CSV file...');
    const csvPath = path.join(__dirname, '..', 'Shop list - ProductSheet (2).csv');
    const csvProducts = parseCSV(csvPath);
    console.log(`   ✓ Found ${csvProducts.length} products in CSV\n`);

    // 3. Convert CSV products
    const convertedProducts = csvProducts.map(csv => convertCSVProduct(csv, companies));

    // 4. Compare and categorize
    console.log('🔍 Analyzing differences...\n');

    const toAdd = [];
    const toUpdate = [];
    const toReview = [];
    const unchanged = [];

    // Check each CSV product
    for (const csvProd of convertedProducts) {
        const dbProd = dbProducts.find(p =>
            p.name === csvProd.name && p.companyName === csvProd.companyName
        );

        if (!dbProd) {
            // New product
            if (!csvProd.companyId) {
                toReview.push({
                    product: csvProd,
                    reason: 'Company not found in database'
                });
            } else {
                toAdd.push(csvProd);
            }
        } else {
            // Existing product - check for differences
            const diffs = productsAreDifferent(dbProd, csvProd);
            if (diffs.length > 0) {
                toUpdate.push({
                    id: dbProd.id,
                    product: csvProd,
                    differences: diffs
                });
            } else {
                unchanged.push(csvProd.name);
            }
        }
    }

    // 5. Display summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 SYNC SUMMARY');
    console.log('═══════════════════════════════════════════════════════\n');

    console.log(`✅ Unchanged:        ${unchanged.length} products`);
    console.log(`➕ To ADD:           ${toAdd.length} new products`);
    console.log(`📝 To UPDATE:        ${toUpdate.length} products`);
    console.log(`⚠️  To REVIEW:        ${toReview.length} products (issues)\n`);

    // Show details
    if (toAdd.length > 0) {
        console.log('\n➕ PRODUCTS TO ADD:');
        console.log('─'.repeat(80));
        toAdd.slice(0, 10).forEach(p => {
            console.log(`   • ${p.companyName} - ${p.name} (₹${p.discountedRate})`);
        });
        if (toAdd.length > 10) {
            console.log(`   ... and ${toAdd.length - 10} more`);
        }
    }

    if (toUpdate.length > 0) {
        console.log('\n📝 PRODUCTS TO UPDATE:');
        console.log('─'.repeat(80));
        toUpdate.slice(0, 5).forEach(u => {
            console.log(`   • ${u.product.companyName} - ${u.product.name}`);
            u.differences.forEach(d => {
                console.log(`      ${d.field}: ${JSON.stringify(d.old)} → ${JSON.stringify(d.new)}`);
            });
        });
        if (toUpdate.length > 5) {
            console.log(`   ... and ${toUpdate.length - 5} more`);
        }
    }

    if (toReview.length > 0) {
        console.log('\n⚠️  PRODUCTS TO REVIEW (Issues):');
        console.log('─'.repeat(80));
        toReview.forEach(r => {
            console.log(`   • ${r.product.companyName} - ${r.product.name}`);
            console.log(`      Issue: ${r.reason}`);
        });
    }

    console.log('\n═══════════════════════════════════════════════════════\n');

    // 6. Ask for confirmation
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('Do you want to proceed with the sync? (yes/no): ', async (answer) => {
            rl.close();

            if (answer.toLowerCase() !== 'yes') {
                console.log('\n❌ Sync cancelled by user.\n');
                resolve();
                return;
            }

            console.log('\n🚀 Starting sync...\n');

            // Execute ADD operations
            if (toAdd.length > 0) {
                console.log(`➕ Adding ${toAdd.length} new products...`);

                for (const product of toAdd) {
                    const id = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    const { error } = await supabase.from('products').insert({
                        id,
                        ...product
                    });

                    if (error) {
                        console.error(`   ❌ Failed to add: ${product.name}`, error.message);
                    } else {
                        console.log(`   ✓ Added: ${product.name}`);
                    }
                }
            }

            // Execute UPDATE operations
            if (toUpdate.length > 0) {
                console.log(`\n📝 Updating ${toUpdate.length} products...`);

                for (const update of toUpdate) {
                    const { error } = await supabase.from('products')
                        .update(update.product)
                        .eq('id', update.id);

                    if (error) {
                        console.error(`   ❌ Failed to update: ${update.product.name}`, error.message);
                    } else {
                        console.log(`   ✓ Updated: ${update.product.name}`);
                    }
                }
            }

            console.log('\n✅ Sync complete!\n');
            resolve();
        });
    });
}

// Run the sync
syncProducts().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
