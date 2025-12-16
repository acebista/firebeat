/**
 * Product Typeahead Component
 * 
 * Reusable typeahead search component for selecting products
 * Supports local filtering + Supabase search
 */

import React, { useState, useRef, useEffect } from 'react';
import { Search, Loader, AlertCircle } from 'lucide-react';
import type { InventoryProduct } from '../../services/inventory/inventoryUtils';
import { filterProductsBySearch, deriveProductSku } from '../../services/inventory/inventoryUtils';
import { searchProducts } from '../../services/inventory/inventoryService';

interface ProductTypeaheadProps {
  products: InventoryProduct[];
  selectedProductId?: string;
  onSelect: (product: InventoryProduct) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
}

export function ProductTypeahead({
  products,
  selectedProductId,
  onSelect,
  placeholder = 'Search products...',
  disabled = false,
  loading = false,
  error,
}: ProductTypeaheadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<InventoryProduct[]>(products);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  // Update filtered list when search term changes
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (!searchTerm.trim()) {
        setFilteredProducts(products);
        setSearchLoading(false);
        return;
      }

      // First filter locally
      const local = filterProductsBySearch(products, searchTerm);
      
      // If we have results locally, use them. Otherwise, search Supabase
      if (local.length > 0) {
        setFilteredProducts(local);
        setSearchLoading(false);
      } else {
        setSearchLoading(true);
        try {
          const remoteResults = await searchProducts(searchTerm);
          setFilteredProducts(remoteResults);
        } catch (err) {
          console.error('Product search failed:', err);
          setFilteredProducts(local); // Fall back to local results
        } finally {
          setSearchLoading(false);
        }
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, products]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (product: InventoryProduct) => {
    onSelect(product);
    setSearchTerm('');
    setFilteredProducts(products);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        
        <input
          ref={inputRef}
          type="text"
          value={selectedProduct && !isOpen ? deriveProductSku(selectedProduct) : searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled || loading}
          className={`w-full pl-10 pr-4 py-2 border rounded-lg outline-none transition-all ${
            error
              ? 'border-red-300 focus:ring-2 focus:ring-red-500'
              : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        />

        {(loading || searchLoading) && (
          <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 animate-spin" size={18} />
        )}
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm mt-1">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {searchLoading ? (
            <div className="flex items-center justify-center py-8 text-gray-500">
              <Loader className="animate-spin mr-2" size={16} />
              Searching...
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => handleSelect(product)}
                className={`w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                  selectedProductId === product.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{product.name}</div>
                    <div className="text-sm text-gray-600 flex items-center space-x-2">
                      <span>{product.companyName || 'No company'}</span>
                      {product.orderMultiple && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          Qty multiple: {product.orderMultiple}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No products found</p>
              {searchTerm && (
                <p className="text-sm mt-1">Try searching with different keywords</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
