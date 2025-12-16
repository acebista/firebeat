import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

// --- Button (Polished Design) ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  className = '',
  icon,
  children, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 focus:ring-2 focus:ring-slate-300 focus:ring-offset-2",
    danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
    outline: "border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200 focus:ring-2 focus:ring-slate-300 focus:ring-offset-2"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-md",
    md: "px-4 py-2.5 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && !isLoading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// --- Input (Polished Design) ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, helpText, className = '', value, ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>}
      <input
        className={`w-full rounded-lg border-2 ${error ? 'border-red-400 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 bg-white focus:ring-blue-500 focus:border-blue-500'} px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed shadow-sm hover:border-slate-300 ${className}`}
        value={value ?? ''}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
      {helpText && !error && <p className="mt-1.5 text-xs text-slate-500">{helpText}</p>}
    </div>
  );
};

// --- Checkbox (Polished Design) ---
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ label, className = '', ...props }, ref) => {
  return (
    <label className="flex items-center space-x-3 cursor-pointer group">
      <input
        type="checkbox"
        ref={ref}
        className={`rounded-md border-2 border-slate-300 text-blue-600 bg-white shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 h-4 w-4 hover:border-blue-400 group-hover:border-slate-400 ${className}`}
        {...props}
      />
      {label && <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{label}</span>}
    </label>
  );
});
Checkbox.displayName = "Checkbox";

// --- Select (Polished Design) ---
interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: { label: string; value: string }[];
  error?: string;
  onChange?: (value: string) => void;
  helpText?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, error, helpText, className = '', value, onChange, ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>}
      <div className="relative">
        <select
          className={`w-full rounded-lg border-2 ${error ? 'border-red-400 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 bg-white focus:ring-blue-500 focus:border-blue-500'} px-4 py-2.5 pr-10 text-sm text-slate-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 appearance-none disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed shadow-sm hover:border-slate-300 ${className}`}
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-600">
           <ChevronDown className="h-5 w-5" />
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
      {helpText && !error && <p className="mt-1.5 text-xs text-slate-500">{helpText}</p>}
    </div>
  );
};

// --- Searchable Select (Polished Design) ---
interface SearchableSelectProps {
  label?: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  helpText?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder = "Select...", 
  className = "",
  disabled = false,
  error,
  helpText
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Get selected option label
  const selectedOption = options.find(o => o.value === value);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Reset search term to selected label on close if exists
        if (selectedOption) {
          setSearchTerm(selectedOption.label);
        } else {
          setSearchTerm("");
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedOption]);

  // Initial sync of value
  useEffect(() => {
    if (selectedOption) {
      setSearchTerm(selectedOption.label);
    } else {
      setSearchTerm("");
    }
  }, [value, selectedOption]);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div className={`w-full relative ${className}`} ref={containerRef}>
      {label && <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>}
      <div className="relative">
        <input
          type="text"
          className={`w-full rounded-lg border-2 ${error ? 'border-red-400 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 bg-white focus:ring-blue-500 focus:border-blue-500'} px-4 py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 shadow-sm hover:border-slate-300 ${disabled ? 'bg-slate-100 cursor-not-allowed text-slate-500' : ''}`}
          placeholder={placeholder}
          value={isOpen ? searchTerm : (selectedOption?.label || "")}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            if (!e.target.value) onChange("");
          }}
          onClick={handleInputFocus}
          readOnly={disabled}
          disabled={disabled}
        />
        
        {/* Icons */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {value && !disabled && (
             <button onClick={handleClear} className="text-slate-400 hover:text-slate-600 mr-2 transition-colors">
               <X className="h-4 w-4" />
             </button>
          )}
          <ChevronDown className={`h-5 w-5 text-slate-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-2 w-full rounded-lg bg-white shadow-lg border border-slate-200 max-h-64 overflow-auto py-1 text-sm">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`cursor-pointer px-4 py-2.5 transition-colors duration-150 ${option.value === value ? 'bg-blue-50 font-semibold text-blue-700 border-l-3 border-blue-600' : 'text-slate-900 hover:bg-slate-50'}`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-slate-500 italic text-center">No matches found</div>
          )}
        </div>
      )}
      
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
      {helpText && !error && <p className="mt-1.5 text-xs text-slate-500">{helpText}</p>}
    </div>
  );
};

// --- Card (Polished Design) ---
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, subtitle, ...props }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200 ${className}`} {...props}>
    {(title || subtitle) && (
      <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        {title && <h3 className="font-semibold text-slate-900 text-lg">{title}</h3>}
        {subtitle && <p className="text-sm text-slate-600 mt-1">{subtitle}</p>}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

// --- Badge (Polished Design) ---
export const Badge: React.FC<{ children: React.ReactNode; color?: 'emerald' | 'red' | 'amber' | 'blue' | 'slate' | 'purple' }> = ({ children, color = 'slate' }) => {
  const colors = {
    emerald: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    red: 'bg-red-100 text-red-800 border border-red-200',
    amber: 'bg-amber-100 text-amber-800 border border-amber-200',
    blue: 'bg-blue-100 text-blue-800 border border-blue-200',
    purple: 'bg-purple-100 text-purple-800 border border-purple-200',
    slate: 'bg-slate-100 text-slate-800 border border-slate-200',
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
};

// --- Tabs (Polished Design) ---
interface TabListProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export const TabList: React.FC<TabListProps> = ({ children, activeTab = '', onTabChange = () => {} }) => (
  <div className="border-b-2 border-slate-200 flex space-x-8 overflow-x-auto">
    {React.Children.map(children, (child) =>
      React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<any>, { activeTab, onTabChange }) : child
    )}
  </div>
);

interface TabProps {
  id: string;
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export const Tab: React.FC<TabProps> = ({ id, children, activeTab = '', onTabChange = () => {} }) => {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => onTabChange(id)}
      className={`py-3 px-1 font-semibold text-sm border-b-2 transition-all duration-200 whitespace-nowrap ${
        isActive
          ? 'border-blue-600 text-blue-700'
          : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
      }`}
    >
      {children}
    </button>
  );
};

interface TabPanelProps {
  id: string;
  children: React.ReactNode;
  activeTab?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({ id, children, activeTab = '' }) => {
  if (activeTab !== id) return null;
  return <div className="py-6 fade-in">{children}</div>;
};

interface TabGroupProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TabGroup: React.FC<TabGroupProps> = ({ children, activeTab, onTabChange }) => {
  const tabList = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === TabList
  );
  const tabPanels = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === TabPanel
  );

  return (
    <div className="w-full">
      {tabList && React.cloneElement(tabList as React.ReactElement<any>, { activeTab, onTabChange })}
      <div className="mt-6">
        {tabPanels.map((panel) => 
          React.isValidElement(panel) ? React.cloneElement(panel as React.ReactElement<any>, { activeTab }) : panel
        )}
      </div>
    </div>
  );
};

// --- Table (Polished Design) ---
interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  cell?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyField?: keyof T;
  className?: string;
  variant?: 'default' | 'compact';
}

export const Table = React.forwardRef<HTMLTableElement, TableProps<any>>(
  ({ data, columns, keyField = 'id', className = '', variant = 'default' }, ref) => {
    return (
      <div className={`overflow-x-auto border border-slate-200 rounded-xl shadow-sm ${className}`}>
        <table ref={ref} className="min-w-full divide-y divide-slate-200">
          <thead className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider ${col.width || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {data.length > 0 ? (
              data.map((row, rowIdx) => (
                <tr key={String(row[keyField] || rowIdx)} className="hover:bg-slate-50 transition-colors duration-150">
                  {columns.map((col, colIdx) => {
                    let cellValue: any;
                    if (typeof col.accessor === 'function') {
                      cellValue = col.accessor(row);
                    } else {
                      cellValue = row[col.accessor];
                    }
                    return (
                      <td key={colIdx} className={`px-6 py-${variant === 'compact' ? '2' : '4'} text-sm text-slate-900 ${col.width || ''}`}>
                        {col.cell ? col.cell(cellValue, row) : cellValue}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500 text-sm">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="h-12 w-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <span>No data available</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
);
Table.displayName = 'Table';
