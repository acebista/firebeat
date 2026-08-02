import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, ChevronDown, X, Loader2 } from 'lucide-react';

export interface AsyncOption {
  label: string;
  value: string;
  sublabel?: string;
  raw?: any;
}

interface AsyncSearchableSelectProps {
  label?: string;
  value: string;
  onChange: (value: string, option?: AsyncOption) => void;
  onSearch: (query: string) => Promise<AsyncOption[]>;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  initialLabel?: string;
}

export const AsyncSearchableSelect: React.FC<AsyncSearchableSelectProps> = ({
  label,
  value,
  onChange,
  onSearch,
  placeholder = "Search and select...",
  className = "",
  disabled = false,
  error,
  helpText,
  initialLabel = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<AsyncOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<AsyncOption | null>(
    value ? { label: initialLabel || value, value } : null
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search handler
  const fetchOptions = useCallback(
    async (query: string) => {
      setLoading(true);
      try {
        const results = await onSearch(query);
        setOptions(results);
      } catch (err) {
        console.error('[AsyncSearchableSelect] Search error:', err);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    },
    [onSearch]
  );

  // Handle input change with 250ms debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (!isOpen) setIsOpen(true);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchOptions(val);
    }, 250);
  };

  // Initial fetch when opened or value changed
  useEffect(() => {
    if (isOpen && options.length === 0) {
      fetchOptions(searchTerm);
    }
  }, [isOpen, options.length, searchTerm, fetchOptions]);

  // Keep selected option label in sync if initialLabel updates
  useEffect(() => {
    if (value) {
      if (initialLabel && (!selectedOption || selectedOption.value !== value || selectedOption.label !== initialLabel)) {
        setSelectedOption({ label: initialLabel, value });
      }
    } else {
      setSelectedOption(null);
    }
  }, [value, initialLabel]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const handleSelect = (option: AsyncOption) => {
    setSelectedOption(option);
    onChange(option.value, option);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOption(null);
    setSearchTerm("");
    onChange("");
    setOptions([]);
  };

  return (
    <div className={`w-full relative ${className}`} ref={containerRef}>
      {label && <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>}
      
      <div className="relative">
        <div
          onClick={() => {
            if (!disabled) {
              setIsOpen(!isOpen);
              if (!isOpen && options.length === 0) fetchOptions("");
            }
          }}
          className={`w-full h-11 px-3.5 flex items-center justify-between rounded-xl border bg-white text-left text-sm transition-all cursor-pointer ${
            disabled ? 'bg-slate-100 opacity-60 cursor-not-allowed border-slate-200' : 
            error ? 'border-red-300 ring-2 ring-red-100' : 
            isOpen ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className={`truncate flex-1 mr-2 ${selectedOption ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <div className="flex items-center gap-1 shrink-0">
            {selectedOption && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden text-sm animate-in fade-in-50 zoom-in-95 duration-100">
            <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
              <Search className="h-4 w-4 text-slate-400 shrink-0 ml-1" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Type to search..."
                className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 text-sm focus:ring-0"
                autoFocus
              />
              {loading && <Loader2 className="h-4 w-4 text-indigo-600 animate-spin shrink-0 mr-1" />}
            </div>

            <div className="max-h-60 overflow-y-auto p-1">
              {loading && options.length === 0 ? (
                <div className="py-6 text-center text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                  <span>Searching...</span>
                </div>
              ) : options.length > 0 ? (
                options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex flex-col gap-0.5 ${
                      value === option.value
                        ? 'bg-indigo-50 text-indigo-900 font-semibold'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="truncate">{option.label}</span>
                    {option.sublabel && (
                      <span className="text-xs text-slate-400 font-normal truncate">{option.sublabel}</span>
                    )}
                  </button>
                ))
              ) : (
                <div className="py-6 text-center text-slate-400 text-sm">
                  No matches found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
      {helpText && !error && <p className="mt-1 text-xs text-slate-500">{helpText}</p>}
    </div>
  );
};
