/**
 * Product Search Filter Component
 * 
 * A reusable typeahead component for filtering inventory tabs by product.
 * Provides debounced search with autosuggest from Supabase.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Loader, X, Package } from 'lucide-react';
import { searchProducts } from '../../services/inventory/inventoryService';
import type { InventoryProduct } from '../../services/inventory/inventoryUtils';

interface ProductSearchFilterProps {
    /** Currently selected product ID (if any) */
    selectedProductId?: string;
    /** Callback when product is selected */
    onSelect: (product: InventoryProduct | null) => void;
    /** Placeholder text */
    placeholder?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Additional CSS classes */
    className?: string;
}

export function ProductSearchFilter({
    selectedProductId,
    onSelect,
    placeholder = 'Search products...',
    disabled = false,
    className = '',
}: ProductSearchFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<InventoryProduct[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<InventoryProduct | null>(null);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Load selected product name if selectedProductId is provided
    useEffect(() => {
        async function loadSelectedProduct() {
            if (selectedProductId && !selectedProduct) {
                try {
                    const results = await searchProducts();
                    const found = results.find(p => p.id === selectedProductId);
                    if (found) {
                        setSelectedProduct(found);
                    }
                } catch (e) {
                    console.error('[ProductSearchFilter] Failed to load selected product:', e);
                }
            }
        }
        loadSelectedProduct();
    }, [selectedProductId]);

    // Debounced search
    const performSearch = useCallback(async (term: string) => {
        if (term.trim().length < 2) {
            setSuggestions([]);
            setSearchLoading(false);
            return;
        }

        setSearchLoading(true);
        try {
            const results = await searchProducts(term);
            setSuggestions(results.slice(0, 10)); // Limit to 10 suggestions
            setHighlightedIndex(-1);
        } catch (err) {
            console.error('[ProductSearchFilter] Search failed:', err);
            setSuggestions([]);
        } finally {
            setSearchLoading(false);
        }
    }, []);

    // Handle search term changes with debounce
    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        if (!searchTerm.trim()) {
            setSuggestions([]);
            setSearchLoading(false);
            return;
        }

        setSearchLoading(true);
        debounceTimerRef.current = setTimeout(() => {
            performSearch(searchTerm);
        }, 300);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchTerm, performSearch]);

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

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || suggestions.length === 0) {
            if (e.key === 'ArrowDown' && searchTerm.trim().length >= 2) {
                setIsOpen(true);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev =>
                    prev > 0 ? prev - 1 : suggestions.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
                    handleSelectProduct(suggestions[highlightedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                inputRef.current?.blur();
                break;
        }
    };

    const handleSelectProduct = (product: InventoryProduct) => {
        setSelectedProduct(product);
        setSearchTerm('');
        setSuggestions([]);
        setIsOpen(false);
        onSelect(product);
        inputRef.current?.blur();
    };

    const handleClear = () => {
        setSelectedProduct(null);
        setSearchTerm('');
        setSuggestions([]);
        onSelect(null);
        inputRef.current?.focus();
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
                <Search size={16} className="text-gray-400 flex-shrink-0" />

                {selectedProduct ? (
                    <div className="flex-1 flex items-center justify-between">
                        <div className="flex items-center space-x-2 min-w-0">
                            <Package size={14} className="text-blue-500 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-900 truncate">
                                {selectedProduct.name}
                            </span>
                            <span className="text-xs text-gray-500 truncate hidden sm:inline">
                                ({selectedProduct.companyName || 'No company'})
                            </span>
                        </div>
                        <button
                            onClick={handleClear}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            disabled={disabled}
                            type="button"
                        >
                            <X size={14} className="text-gray-500" />
                        </button>
                    </div>
                ) : (
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        onChange={e => {
                            setSearchTerm(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={disabled}
                        className="flex-1 outline-none text-sm bg-transparent"
                    />
                )}

                {searchLoading && (
                    <Loader size={14} className="text-blue-500 animate-spin flex-shrink-0" />
                )}
            </div>

            {/* Suggestions Dropdown */}
            {isOpen && !selectedProduct && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {searchLoading ? (
                        <div className="flex items-center justify-center py-4 text-gray-500">
                            <Loader size={16} className="animate-spin mr-2" />
                            <span className="text-sm">Searching...</span>
                        </div>
                    ) : suggestions.length > 0 ? (
                        suggestions.map((product, index) => (
                            <button
                                key={product.id}
                                type="button"
                                onClick={() => handleSelectProduct(product)}
                                className={`w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors ${highlightedIndex === index ? 'bg-blue-50' : ''
                                    }`}
                            >
                                <div className="font-medium text-sm text-gray-900 truncate">
                                    {product.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {product.companyName || 'No company'}
                                </div>
                            </button>
                        ))
                    ) : searchTerm.trim().length >= 2 ? (
                        <div className="text-center py-4 text-gray-500 text-sm">
                            No products found for "{searchTerm}"
                        </div>
                    ) : searchTerm.trim().length > 0 ? (
                        <div className="text-center py-4 text-gray-500 text-sm">
                            Type at least 2 characters to search
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
