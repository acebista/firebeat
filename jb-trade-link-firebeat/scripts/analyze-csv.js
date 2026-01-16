/**
 * Full Comparison and Fix Script
 * 1. Reads CSV
 * 2. Compares with DB (provided as JSON or fetched)
 * 3. Builds SQL for updates/inserts
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '..', 'Shop list - ProductSheet (2).csv');

// Company mapping (CSV name -> DB ID and DB Name)
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

function runAnalysis() {
    const content = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());
    const headers = lines[0].split(',').map(h => h.trim());

    const csvProducts = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (!values[0] && !values[1]) continue;

        const prod = {};
        headers.forEach((h, idx) => {
            prod[h] = values[idx]?.trim() || '';
        });
        csvProducts.push(prod);
    }

    console.log(`📊 Analysis: Found ${csvProducts.length} products in CSV.`);

    // Group by company for overview
    const byCompany = {};
    csvProducts.forEach(p => {
        byCompany[p.Company] = (byCompany[p.Company] || 0) + 1;
    });

    console.log('\n🏢 Companies in CSV:');
    Object.entries(byCompany).forEach(([comp, count]) => {
        const mapping = COMPANY_MAP[comp];
        console.log(`   • ${comp}: ${count} products ${mapping ? `(Maps to DB: ${mapping.name} [${mapping.id}])` : '(❓ NO MAPPING FOUND)'}`);
    });

    // We noticed "Manakamana" is Inactive in DB, let's suggest activating it
    // because CSV has products for it.
}

runAnalysis();
