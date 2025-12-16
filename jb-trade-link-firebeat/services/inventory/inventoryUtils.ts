/**
 * Inventory utilities and helpers
 */

export type InventoryProduct = {
  id: string;
  name: string;
  companyId?: string;
  companyName?: string;
  orderMultiple?: number;
  packetsPerCarton?: number;
  piecesPerPacket?: number;
  isActive?: boolean;
  secondaryAvailable?: boolean;
  // Derived field (not from DB)
  sku?: string;
};

/**
 * Derive a display SKU/code from product
 * Format: CompanyName / ProductName or just ProductName if no company
 */
export function deriveProductSku(product: InventoryProduct): string {
  if (product.companyName && product.companyName.trim()) {
    return `${product.companyName} / ${product.name}`;
  }
  return product.name || 'Unknown';
}

/**
 * Normalize date to YYYY-MM-DD format
 */
export function normalizeDateToISO(date: string | Date): string {
  if (typeof date === 'string') {
    // If already ISO format, return as-is
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    // Try to parse as date and convert
    try {
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split('T')[0];
      }
    } catch (e) {
      // Fall through
    }
    return date;
  }
  // Handle Date object
  return date.toISOString().split('T')[0];
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayISO(): string {
  return normalizeDateToISO(new Date());
}

/**
 * Parse CSV content into records
 * Expected columns: product_id, opening_qty, effective_date
 */
export interface CSVOpeningStockRecord {
  product_id: string;
  opening_qty?: number;
  effective_date?: string;
  error?: string;
}

export function parseOpeningStockCSV(content: string): CSVOpeningStockRecord[] {
  const lines = content.trim().split('\n');
  if (lines.length < 2) return [];

  const headerLine = lines[0];
  const headers = headerLine.split(',').map(h => h.trim().toLowerCase());

  // Find column indices
  const productIdIdx = headers.indexOf('product_id');
  const openingQtyIdx = headers.indexOf('opening_qty');
  const effectiveDateIdx = headers.indexOf('effective_date');

  if (productIdIdx === -1) {
    return [{ product_id: '', error: 'Missing product_id column' }];
  }

  const records: CSVOpeningStockRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cells = line.split(',').map(c => c.trim());
    const productId = cells[productIdIdx];

    if (!productId) continue;

    const record: CSVOpeningStockRecord = {
      product_id: productId,
    };

    if (openingQtyIdx >= 0 && cells[openingQtyIdx]) {
      const qty = parseFloat(cells[openingQtyIdx]);
      if (!isNaN(qty) && qty >= 0) {
        record.opening_qty = qty;
      }
    }

    if (effectiveDateIdx >= 0 && cells[effectiveDateIdx]) {
      const date = cells[effectiveDateIdx];
      if (date) {
        record.effective_date = normalizeDateToISO(date);
      }
    }

    records.push(record);
  }

  return records;
}

/**
 * Generate CSV template for opening stock import
 */
export function generateOpeningStockTemplate(products: InventoryProduct[]): string {
  const headers = ['product_id', 'opening_qty', 'effective_date'];
  const rows = products.map(p => [p.id, '0', getTodayISO()]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  return csv;
}

/**
 * Download text as CSV file
 */
export function downloadAsCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Filter products locally by search term
 * Searches in product name and company name
 */
export function filterProductsBySearch(
  products: InventoryProduct[],
  searchTerm: string
): InventoryProduct[] {
  if (!searchTerm.trim()) return products;

  const term = searchTerm.toLowerCase();
  return products.filter(p => {
    const name = (p.name || '').toLowerCase();
    const company = (p.companyName || '').toLowerCase();
    const sku = deriveProductSku(p).toLowerCase();
    
    return name.includes(term) || company.includes(term) || sku.includes(term);
  });
}
