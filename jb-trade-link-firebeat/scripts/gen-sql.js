/**
 * SQL Generator Script
 * Generates SQL for Supabase Sync
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '..', 'Shop list - ProductSheet (2).csv');

const COMPANY_MAP = {
    'Parle': { id: 'c2', name: 'Parle' },
    'Manakamana': { id: 'c7', name: 'Manakamana' },
    'Jasmine': { id: 'c1', name: 'Jasmine Masala' },
    'Bimal Trade': { id: 'c4', name: 'Bimal Trade' },
    'Amrapali': { id: 'c6', name: 'Amrapali' },
    'Godrej': { id: 'c3', name: 'Godrej' },
    'Himgiri': { id: 'c5', name: 'Himgiri' }
};

function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') inQuotes = !inQuotes;
        else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else current += char;
    }
    values.push(current);
    return values;
}

function generateSQL() {
    const content = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());
    const headers = lines[0].split(',').map(h => h.trim());

    const csvProducts = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (!values[0] && !values[1]) continue;
        const prod = {};
        headers.forEach((h, idx) => { prod[h] = values[idx]?.trim() || ''; });
        csvProducts.push(prod);
    }

    let sql = `-- PRODUCT SYNC SQL\n\n`;

    // 1. Ensure companies are active
    sql += `-- Activate Companies\n`;
    sql += `UPDATE companies SET "isActive" = true WHERE id IN ('c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7');\n\n`;

    // 2. Prepare UPSERT
    sql += `-- Upsert Products\n`;

    const statements = csvProducts.map(p => {
        const mapping = COMPANY_MAP[p.Company];
        if (!mapping) return `-- ERROR: No mapping for ${p.Company}`;

        const name = p.Product.replace(/'/g, "''");
        const companyId = mapping.id;
        const companyName = mapping.name.replace(/'/g, "''");
        const baseRate = parseFloat(p.Rate) || 0;
        const discountedRate = parseFloat(p['Discounted Rate']) || baseRate;
        const orderMultiple = parseInt(p.Multiple) || 1;
        const packetsPerCarton = parseInt(p['Packets/Carton']) || 1;
        const piecesPerPacket = parseInt(p['Pieces/Packet']) || 1;
        const stockOut = p['Stock Out'].toUpperCase() === 'TRUE';
        const discountEditable = p['Discount Editable'].toUpperCase() === 'YES';
        const secondaryAvailable = p.secondary_Available.toUpperCase() === 'TRUE';
        const secondaryDiscountPct = p.secondary_Discount ? parseFloat(p.secondary_Discount) : 0;
        const secondaryQualifyingQty = p.qualifying_Qty ? parseInt(p.qualifying_Qty) : 0;
        const additionalSecondaryDiscountPct = p.additional_Secondary_Discount ? parseFloat(p.additional_Secondary_Discount) : 0;
        const additionalQualifyingQty = p.additional_Qualifying_Qty ? parseInt(p.additional_Qualifying_Qty) : 0;

        // Metadata as JSON
        const metadata = JSON.stringify({
            productDiscountPct: p['Product Discount'] || null,
            margin: p.Margin || null,
            syncedAt: new Date().toISOString()
        }).replace(/'/g, "''");

        // Use name + companyId as a business key
        // Note: We'll use a unique ID generation for new ones or find existing
        // For Supabase execute_sql, we can use INSERT ... ON CONFLICT (name, "companyId") DO UPDATE
        // But first we need to make sure there is a unique constraint on (name, "companyId")

        return `INSERT INTO products (
            id, name, "companyId", "companyName", "baseRate", "discountedRate", 
            "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", 
            "isActive", "discountEditable", "secondaryAvailable", 
            "secondaryDiscountPct", "secondaryQualifyingQty",
            "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata
        ) VALUES (
            'prod_sync_' || encode(digest('${name}${companyId}', 'sha1'), 'hex'), 
            '${name}', '${companyId}', '${companyName}', ${baseRate}, ${discountedRate}, 
            ${orderMultiple}, ${packetsPerCarton}, ${piecesPerPacket}, ${stockOut}, 
            true, ${discountEditable}, ${secondaryAvailable}, 
            ${secondaryDiscountPct}, ${secondaryQualifyingQty}, 
            ${additionalSecondaryDiscountPct}, ${additionalQualifyingQty}, '${metadata}'
        ) ON CONFLICT (name, "companyId") DO UPDATE SET
            "baseRate" = EXCLUDED."baseRate",
            "discountedRate" = EXCLUDED."discountedRate",
            "orderMultiple" = EXCLUDED."orderMultiple",
            "packetsPerCarton" = EXCLUDED."packetsPerCarton",
            "piecesPerPacket" = EXCLUDED."piecesPerPacket",
            "stockOut" = EXCLUDED."stockOut",
            "isActive" = true,
            "discountEditable" = EXCLUDED."discountEditable",
            "secondaryAvailable" = EXCLUDED."secondaryAvailable",
            "secondaryDiscountPct" = EXCLUDED."secondaryDiscountPct",
            "secondaryQualifyingQty" = EXCLUDED."secondaryQualifyingQty",
            "additionalSecondaryDiscountPct" = EXCLUDED."additionalSecondaryDiscountPct",
            "additionalQualifyingQty" = EXCLUDED."additionalQualifyingQty",
            metadata = EXCLUDED.metadata;`;
    });

    fs.writeFileSync(path.join(__dirname, '..', 'sync_products.sql'), sql + statements.join('\n'));
    console.log(`✅ Generated sync_products.sql with ${statements.length} statements.`);
}

generateSQL();
