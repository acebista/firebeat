/**
 * Smart Sync SQL Generator
 * Uses existing DB state to generate perfect UPDATE/INSERT statements
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '..', 'Shop list - ProductSheet (2).csv');
// I'll provide the DB state here (we fetched it via MCP)
// I'll assume the user will pipe the JSON output of the SELECT * query into a file
// Or I'll just write the script to take the raw SQL result I saw.

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

// Note: I'm going to use the exact output I saw from the MCP to build a name-to-id map
// (This is a simplified version, ideally we'd load a file)
const DB_STATE = [
    // Real mapping from what I saw earlier
    { "id": "370c731b-24ee-4c88-8a30-c532cee426f3", "name": "Amrapali Recharge 330 ML (1*24)", "companyName": "Amrapali" },
    { "id": "74f547ec-b9af-483e-b86c-58ecf3793b3d", "name": "Amrapali Kool Badam Drink 180 ML (1*48)", "companyName": "Amrapali" },
    // ... I'll fetch the rest or use a generic matching logic in the script
];

async function generateSmartSQL() {
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

    let sql = `-- SMART PRODUCT SYNC\n`;
    sql += `UPDATE companies SET "isActive" = true WHERE id IN ('c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7');\n\n`;

    // Strategy: Since there's no unique constraint on name+company, 
    // we'll use a CASE statement to update existing ones by name+company matching

    csvProducts.forEach((p, idx) => {
        const mapping = COMPANY_MAP[p.Company];
        if (!mapping) return;

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

        const metadata = JSON.stringify({
            productDiscountPct: p['Product Discount'] || null,
            margin: p.Margin || null,
            syncedAt: new Date().toISOString()
        }).replace(/'/g, "''");

        // Use a CTE/Subquery approach to update if exists or insert if not
        // This is safe without a unique constraint
        sql += `DO $$\nBEGIN\n`;
        sql += `  IF EXISTS (SELECT 1 FROM products WHERE name = '${name}' AND "companyName" = '${companyName}') THEN\n`;
        sql += `    UPDATE products SET \n`;
        sql += `      "baseRate" = ${baseRate}, "discountedRate" = ${discountedRate}, \n`;
        sql += `      "orderMultiple" = ${orderMultiple}, "packetsPerCarton" = ${packetsPerCarton}, \n`;
        sql += `      "piecesPerPacket" = ${piecesPerPacket}, "stockOut" = ${stockOut}, \n`;
        sql += `      "isActive" = true, "discountEditable" = ${discountEditable}, \n`;
        sql += `      "secondaryAvailable" = ${secondaryAvailable}, "secondaryDiscountPct" = ${secondaryDiscountPct}, \n`;
        sql += `      "secondaryQualifyingQty" = ${secondaryQualifyingQty}, \n`;
        sql += `      "additionalSecondaryDiscountPct" = ${additionalSecondaryDiscountPct}, \n`;
        sql += `      "additionalQualifyingQty" = ${additionalQualifyingQty}, metadata = '${metadata}'\n`;
        sql += `    WHERE name = '${name}' AND "companyName" = '${companyName}';\n`;
        sql += `  ELSE\n`;
        sql += `    INSERT INTO products (id, name, "companyId", "companyName", "baseRate", "discountedRate", "orderMultiple", "packetsPerCarton", "piecesPerPacket", "stockOut", "isActive", "discountEditable", "secondaryAvailable", "secondaryDiscountPct", "secondaryQualifyingQty", "additionalSecondaryDiscountPct", "additionalQualifyingQty", metadata)\n`;
        sql += `    VALUES ('prod_sync_${idx}_' || gen_random_uuid(), '${name}', '${companyId}', '${companyName}', ${baseRate}, ${discountedRate}, ${orderMultiple}, ${packetsPerCarton}, ${piecesPerPacket}, ${stockOut}, true, ${discountEditable}, ${secondaryAvailable}, ${secondaryDiscountPct}, ${secondaryQualifyingQty}, ${additionalSecondaryDiscountPct}, ${additionalQualifyingQty}, '${metadata}');\n`;
        sql += `  END IF;\n`;
        sql += `END $$;\n\n`;
    });

    fs.writeFileSync(path.join(__dirname, '..', 'smart_sync.sql'), sql);
    console.log(`✅ Generated smart_sync.sql`);
}

generateSmartSQL();
