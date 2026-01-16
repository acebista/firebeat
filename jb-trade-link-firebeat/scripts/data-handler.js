/**
 * Data Extractor Script
 * Saves MCP results to JSON for comparison
 */
import fs from 'fs';
import path from 'path';

// This is where I'll put the data I got from MCP
const companiesRaw = [
    { "id": "c2", "name": "Parle", "code": "PAR", "isActive": true },
    { "id": "c3", "name": "Godrej", "code": "GDR", "isActive": true },
    { "id": "c5", "name": "Himgiri", "code": "HMG", "isActive": true },
    { "id": "c1", "name": "Jasmine Masala", "code": "JSMN", "isActive": true },
    { "id": "c4", "name": "Bimal Trade", "code": "BMTR", "isActive": true },
    { "id": "c6", "name": "Amrapali", "code": "AMRP", "isActive": true },
    { "id": "c7", "name": "Manakamana", "code": "MNKM", "isActive": false },
    { "id": "default-company", "name": "Main Company", "code": null, "isActive": false }
];

// I'll write another script to fetch products and save them
// But for now, I'll just write the comparison script that takes the CSV and DB state
