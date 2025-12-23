
import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Badge } from '../../components/ui/Elements';
import { Modal } from '../../components/ui/Modal';
import { Edit2, Eye, Plus, Building2, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Product, Company } from '../../types';
import { useNavigate } from 'react-router-dom';
import { ProductService, CompanyService } from '../../services/db';
import { productSchema } from '../../utils/validation/schemas';
import { z } from 'zod';
import toast from 'react-hot-toast';

export const ProductManagement: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompany, setFilterCompany] = useState('all');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // Sorting State
  const [sortField, setSortField] = useState<'name' | 'companyName' | 'baseRate' | 'discountedRate' | 'discount'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Selection State
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // Clear selections when filters change
  useEffect(() => {
    setSelectedProductIds(new Set());
  }, [searchTerm, filterCompany]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodData, compData] = await Promise.all([
        ProductService.getAll(),
        CompanyService.getAll()
      ]);
      setProducts(prodData);
      setCompanies(compData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);

    // Ensure all required fields have valid values for editing
    // Handle legacy products that might be missing required fields
    const editData = {
      ...product,
      // Ensure companyId is set
      companyId: product.companyId || (companies.length > 0 ? companies[0].id : ''),
      // Ensure numeric fields have valid values
      baseRate: product.baseRate ?? 0,
      discountedRate: product.discountedRate ?? product.baseRate ?? 0,
      orderMultiple: product.orderMultiple || 1,
      packetsPerCarton: product.packetsPerCarton || 1,
      piecesPerPacket: product.piecesPerPacket || 1,
      secondaryDiscountPct: product.secondaryDiscountPct ?? 0,
      secondaryQualifyingQty: product.secondaryQualifyingQty ?? 0,
      additionalSecondaryDiscountPct: product.additionalSecondaryDiscountPct ?? 0,
      additionalQualifyingQty: product.additionalQualifyingQty ?? 0,
      // Booleans with defaults
      isActive: product.isActive ?? true,
      stockOut: product.stockOut ?? false,
      secondaryAvailable: product.secondaryAvailable ?? false,
      discountEditable: product.discountEditable ?? false,
      // Calculate productDiscountPct for UI
      productDiscountPct: product.baseRate > 0
        ? ((product.baseRate - (product.discountedRate ?? product.baseRate)) / product.baseRate) * 100
        : 0,
      commission_rate: product.commission_rate
    };

    setFormData(editData);
    setValidationErrors({});

    // Warn if companyId was missing
    if (!product.companyId && companies.length > 0) {
      toast.error(
        `Warning: This product had no company assigned. Defaulted to "${companies[0].name}". Please verify and save.`,
        { duration: 6000 }
      );
    }

    setModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentProduct(null);
    setFormData({
      name: '',
      companyId: '',
      baseRate: 0,
      discountedRate: 0,
      orderMultiple: 1,
      isActive: true,
      stockOut: false,
      secondaryAvailable: false,
      discountEditable: false,
      productDiscountPct: 0,
      packetsPerCarton: 0,
      piecesPerPacket: 0,
      secondaryDiscountPct: 0,
      secondaryQualifyingQty: 0,
      additionalSecondaryDiscountPct: 0,
      additionalQualifyingQty: 0,
      commission_rate: undefined
    });
    setValidationErrors({});
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setValidationErrors({});

      // Pre-validation: Check critical required fields
      if (!formData.name || formData.name.trim() === '') {
        setValidationErrors({ name: 'Product name is required' });
        toast.error('Product name is required');
        setIsSaving(false);
        return;
      }

      if (!formData.companyId || formData.companyId.trim() === '') {
        setValidationErrors({ companyId: 'Company is required' });
        toast.error('Please select a company');
        setIsSaving(false);
        return;
      }

      // Coerce and validate all fields with proper defaults
      const dataToValidate = {
        name: formData.name.trim(),
        companyId: formData.companyId,
        // Numeric fields with defaults
        baseRate: Math.max(0, Number(formData.baseRate) || 0),
        discountedRate: Math.max(0, Number(formData.discountedRate) || Number(formData.baseRate) || 0),
        orderMultiple: Math.max(1, Number(formData.orderMultiple) || 1),
        packetsPerCarton: Math.max(1, Number(formData.packetsPerCarton) || 1),
        piecesPerPacket: Math.max(1, Number(formData.piecesPerPacket) || 1),
        // Boolean fields
        stockOut: formData.stockOut ?? false,
        isActive: formData.isActive ?? true,
        discountEditable: formData.discountEditable ?? false,
        secondaryAvailable: formData.secondaryAvailable ?? false,
        // Secondary discount fields
        secondaryDiscountPct: Math.max(0, Number(formData.secondaryDiscountPct) || 0),
        secondaryQualifyingQty: Math.max(0, Number(formData.secondaryQualifyingQty) || 0),
        additionalSecondaryDiscountPct: Math.max(0, Number(formData.additionalSecondaryDiscountPct) || 0),
        additionalQualifyingQty: Math.max(0, Number(formData.additionalQualifyingQty) || 0),
        // Optional fields
        companyName: formData.companyName,
        category: formData.category,
        commission_rate: formData.commission_rate === undefined || formData.commission_rate === null
          ? null
          : Number(formData.commission_rate)
      };

      // Validate with Zod schema
      const validatedData = productSchema.parse(dataToValidate);

      // Enrich with company name
      const companyName = companies.find(c => c.id === validatedData.companyId)?.name || 'Unknown';
      const productData = { ...validatedData, companyName } as Product;

      // Save to database
      if (currentProduct) {
        await ProductService.update(currentProduct.id, productData);
        setProducts(prev => prev.map(p => p.id === currentProduct.id ? { ...p, ...productData } : p));
        toast.success('Product updated successfully');
      } else {
        const newProd = await ProductService.add(productData);
        setProducts([...products, newProd as Product]);
        toast.success('Product added successfully');
      }
      setModalOpen(false);
    } catch (e: any) {
      if (e instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        const errorMessages: string[] = [];

        e.issues.forEach((issue: any) => {
          const field = issue.path[0] as string;
          const message = issue.message;
          if (field) {
            errors[field] = message;
            errorMessages.push(`${field}: ${message}`);
          }
        });

        setValidationErrors(errors);

        // Show specific error messages
        if (errorMessages.length > 0) {
          const firstError = errorMessages[0];
          toast.error(`Validation Error: ${firstError}`, { duration: 5000 });
          console.error('All validation errors:', errorMessages);
        } else {
          toast.error('Please fix validation errors');
        }
      } else {
        const errorMsg = e?.message || 'Failed to save product';
        toast.error(errorMsg);
        console.error('Save error:', e);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const openDetails = (product: Product) => {
    setCurrentProduct(product);
    setDetailsOpen(true);
  };

  // Selection Handlers
  const handleSelectAll = () => {
    if (selectedProductIds.size === filteredProducts.length && filteredProducts.length > 0) {
      setSelectedProductIds(new Set());
    } else {
      setSelectedProductIds(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const handleSelectRow = (id: string) => {
    const newSet = new Set(selectedProductIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedProductIds(newSet);
  };

  // Bulk Actions
  const handleBulkStatusChange = async (isActive: boolean) => {
    if (!window.confirm(`Are you sure you want to ${isActive ? 'activate' : 'deactivate'} ${selectedProductIds.size} products?`)) return;

    try {
      const ids = Array.from(selectedProductIds);
      await Promise.all(ids.map(id => ProductService.update(id, { isActive })));

      setProducts(prev => prev.map(p => selectedProductIds.has(p.id) ? { ...p, isActive } : p));
      setSelectedProductIds(new Set());
      toast.success(`${ids.length} products ${isActive ? 'activated' : 'deactivated'}`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to update status for some items.");
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to DELETE ${selectedProductIds.size} products? This cannot be undone.`)) return;

    try {
      const ids = Array.from(selectedProductIds);
      await Promise.all(ids.map(id => ProductService.delete(id)));

      setProducts(prev => prev.filter(p => !selectedProductIds.has(p.id)));
      setSelectedProductIds(new Set());
      toast.success(`${ids.length} products deleted`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete some items.");
    }
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredProducts = products.filter(p => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchLower) ||
      (p.companyName || '').toLowerCase().includes(searchLower);
    const matchesCompany = filterCompany === 'all' || p.companyId === filterCompany;
    return matchesSearch && matchesCompany;
  });

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aVal: any, bVal: any;

    switch (sortField) {
      case 'name':
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case 'companyName':
        aVal = (a.companyName || '').toLowerCase();
        bVal = (b.companyName || '').toLowerCase();
        break;
      case 'baseRate':
        aVal = a.baseRate || 0;
        bVal = b.baseRate || 0;
        break;
      case 'discountedRate':
        aVal = a.discountedRate || 0;
        bVal = b.discountedRate || 0;
        break;
      case 'discount':
        // Calculate discount percentage
        aVal = a.baseRate > 0 ? ((a.baseRate - a.discountedRate) / a.baseRate) * 100 : 0;
        bVal = b.baseRate > 0 ? ((b.baseRate - b.discountedRate) / b.baseRate) * 100 : 0;
        break;
      default:
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Products</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/admin/companies')}>
            <Building2 className="mr-2 h-4 w-4" /> Manage Companies
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search product or company name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={[{ label: 'All Companies', value: 'all' }, ...companies.map(c => ({ label: c.name, value: c.id }))]}
              value={filterCompany}
              onChange={(value) => setFilterCompany(value)}
            />
          </div>
        </div>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedProductIds.size > 0 && (
        <div className="bg-indigo-600 text-white px-4 py-3 rounded-lg shadow-md flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-indigo-200" />
            <span className="font-medium">{selectedProductIds.size} products selected</span>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleBulkStatusChange(true)}
              className="bg-white text-indigo-700 hover:bg-indigo-50 border-transparent"
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Activate
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleBulkStatusChange(false)}
              className="bg-white text-indigo-700 hover:bg-indigo-50 border-transparent"
            >
              <XCircle className="mr-2 h-4 w-4" /> Deactivate
            </Button>
            <div className="w-px bg-indigo-400 mx-1"></div>
            <Button
              variant="danger"
              size="sm"
              onClick={handleBulkDelete}
              className="bg-red-500 text-white hover:bg-red-600 border-transparent"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedProductIds(new Set())}
              className="bg-transparent text-white border-white hover:bg-indigo-700"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase w-10">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    checked={sortedProducts.length > 0 && selectedProductIds.size === sortedProducts.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
                  Product {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('companyName')}>
                  Company {sortField === 'companyName' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  <div className="flex flex-col gap-1">
                    <span className="cursor-pointer hover:text-indigo-600" onClick={() => handleSort('baseRate')}>Base Rate {sortField === 'baseRate' && (sortDirection === 'asc' ? '↑' : '↓')}</span>
                    <span className="cursor-pointer hover:text-indigo-600" onClick={() => handleSort('discount')}>Discount {sortField === 'discount' && (sortDirection === 'asc' ? '↑' : '↓')}</span>
                    <span className="cursor-pointer hover:text-indigo-600" onClick={() => handleSort('discountedRate')}>Final Rate {sortField === 'discountedRate' && (sortDirection === 'asc' ? '↑' : '↓')}</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Stock Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Active</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={7} className="text-center p-4">Loading products...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={7} className="text-center p-4">No products found.</td></tr>
              ) : (
                sortedProducts.map((product) => (
                  <tr key={product.id} className={`hover:bg-gray-50 ${selectedProductIds.has(product.id) ? 'bg-indigo-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        checked={selectedProductIds.has(product.id)}
                        onChange={() => handleSelectRow(product.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500">Multiple: {product.orderMultiple}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.companyName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="line-through text-gray-500">₹{product.baseRate}</div>
                      <div className="font-bold text-indigo-600">₹{product.discountedRate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1 items-start">
                        <Badge color={product.stockOut ? 'red' : (product.currentStock || 0) > 0 ? 'emerald' : 'amber'}>
                          {product.stockOut ? 'Stock Out' : (product.currentStock || 0) > 0 ? 'In Stock' : 'Low Stock'}
                        </Badge>
                        {!product.stockOut && <span className="text-xs text-gray-500 font-medium ml-1">Qty: {product.currentStock || 0}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge color={product.isActive ? 'emerald' : 'red'}>
                        {product.isActive ? 'Yes' : 'No'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button onClick={() => openDetails(product)} className="text-gray-600 hover:text-gray-900 p-1">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900 p-1">
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Product Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={currentProduct ? "Edit Product" : "Add Product"} size="xl">
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Basic Info */}
          <div className="md:col-span-3 bg-gray-50 p-3 rounded border border-gray-200">
            <h4 className="text-sm font-bold text-gray-700 mb-3">Basic Info</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Input label="Product Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} error={validationErrors.name} />
              </div>
              <div className="w-full">
                <Select
                  label="Company"
                  options={[{ label: 'Select Company', value: '' }, ...companies.map(c => ({ label: c.name, value: c.id }))]}
                  value={formData.companyId || ''}
                  onChange={value => setFormData({ ...formData, companyId: value })}
                  error={validationErrors.companyId}
                />
              </div>
              <Input label="Order Multiple" type="number" value={formData.orderMultiple ?? 1} onChange={e => setFormData({ ...formData, orderMultiple: Number(e.target.value) })} error={validationErrors.orderMultiple} />

              <div className="col-span-2 flex items-center gap-2 mt-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={formData.isActive ?? true} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="rounded text-green-600" />
                  Product is Active
                </label>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="md:col-span-3 bg-indigo-50 p-3 rounded border border-indigo-100">
            <h4 className="text-sm font-bold text-indigo-800 mb-3">Pricing & Packaging</h4>
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Base Rate (₹)"
                type="number"
                min={0}
                step={0.01}
                value={formData.baseRate ?? 0}
                onChange={e => {
                  const newBase = Math.max(0, Number(e.target.value) || 0);
                  const pct = Math.min(100, Math.max(0, Number(formData.productDiscountPct) || 0));
                  const newDiscounted = Number((newBase * (1 - pct / 100)).toFixed(2));
                  setFormData({ ...formData, baseRate: newBase, discountedRate: newDiscounted });
                }}
                error={validationErrors.baseRate}
              />

              <Input
                label="Product Discount %"
                type="number"
                min={0}
                max={100}
                step={0.01}
                value={formData.productDiscountPct ?? 0}
                onChange={e => {
                  const pctRaw = Number(e.target.value);
                  const pct = Number.isFinite(pctRaw) ? Math.min(100, Math.max(0, pctRaw)) : 0;
                  const base = Number(formData.baseRate) || 0;
                  const newDiscounted = Number((base * (1 - pct / 100)).toFixed(2));
                  setFormData({ ...formData, productDiscountPct: pct, discountedRate: newDiscounted });
                }}
                error={validationErrors.productDiscountPct}
              />

              <Input
                label="Discounted Rate (₹)"
                type="number"
                min={0}
                step={0.01}
                value={formData.discountedRate ?? 0}
                onChange={e => setFormData({ ...formData, discountedRate: Number(e.target.value) })}
                error={validationErrors.discountedRate}
                readOnly={!formData.discountEditable}
              />

              <Input label="Packets / Carton" type="number" min={1} value={formData.packetsPerCarton ?? 1} onChange={e => setFormData({ ...formData, packetsPerCarton: Number(e.target.value) })} error={validationErrors.packetsPerCarton} />
              <Input label="Pieces / Packet" type="number" min={1} value={formData.piecesPerPacket ?? 1} onChange={e => setFormData({ ...formData, piecesPerPacket: Number(e.target.value) })} error={validationErrors.piecesPerPacket} />

              <div className="col-span-1">
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    id="enableCommissionOverride"
                    checked={formData.commission_rate !== undefined && formData.commission_rate !== null}
                    onChange={e => {
                      if (e.target.checked) {
                        // Enable override - set to 0 as starting value
                        setFormData({ ...formData, commission_rate: 0 });
                      } else {
                        // Disable override - clear the value
                        setFormData({ ...formData, commission_rate: undefined });
                      }
                    }}
                    className="rounded text-indigo-600 h-4 w-4"
                  />
                  <label htmlFor="enableCommissionOverride" className="text-xs font-medium text-gray-700 cursor-pointer">
                    Enable Commission Override
                  </label>
                </div>
                <Input
                  label="Comm. Override (%)"
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  placeholder="Default"
                  value={formData.commission_rate ?? ''}
                  onChange={e => setFormData({ ...formData, commission_rate: e.target.value ? Number(e.target.value) : undefined })}
                  error={validationErrors.commission_rate}
                  disabled={formData.commission_rate === undefined || formData.commission_rate === null}
                />
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {formData.commission_rate !== undefined && formData.commission_rate !== null
                    ? 'Overrides company default'
                    : 'Using company default rate'}
                </p>
              </div>

              <div className="col-span-3 mt-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.discountEditable}
                    onChange={e => {
                      const editable = e.target.checked;
                      // if disabling editable mode, recompute discountedRate from current base & pct
                      if (!editable) {
                        const base = Number(formData.baseRate) || 0;
                        const pct = Number(formData.productDiscountPct) || 0;
                        const newDiscounted = Number((base * (1 - pct / 100)).toFixed(2));
                        setFormData({ ...formData, discountEditable: editable, discountedRate: newDiscounted });
                      } else {
                        setFormData({ ...formData, discountEditable: editable });
                      }
                    }}
                    className="rounded"
                  />
                  Rate is editable by Salesperson
                </label>
              </div>
            </div>
          </div>

          {/* Schemes */}
          <div className="md:col-span-3 bg-yellow-50 p-3 rounded border border-yellow-200">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-bold text-yellow-800">Schemes (Secondary)</h4>
              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer text-yellow-900">
                <input type="checkbox" checked={formData.secondaryAvailable} onChange={e => setFormData({ ...formData, secondaryAvailable: e.target.checked })} className="rounded" />
                Enable Scheme
              </label>
            </div>
            {formData.secondaryAvailable && (
              <div className="grid grid-cols-2 gap-4">
                <Input label="Secondary Disc %" type="number" value={formData.secondaryDiscountPct ?? 0} onChange={e => setFormData({ ...formData, secondaryDiscountPct: Number(e.target.value) })} />
                <Input label="Qualifying Qty" type="number" value={formData.secondaryQualifyingQty ?? 0} onChange={e => setFormData({ ...formData, secondaryQualifyingQty: Number(e.target.value) })} />
                <Input label="Add. Secondary Disc %" type="number" value={formData.additionalSecondaryDiscountPct ?? 0} onChange={e => setFormData({ ...formData, additionalSecondaryDiscountPct: Number(e.target.value) })} />
                <Input label="Add. Qualifying Qty" type="number" value={formData.additionalQualifyingQty ?? 0} onChange={e => setFormData({ ...formData, additionalQualifyingQty: Number(e.target.value) })} />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t col-span-1 md:col-span-3">
            <Button variant="outline" onClick={() => setModalOpen(false)} type="button" disabled={isSaving}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Product'}</Button>
          </div>
        </form>
      </Modal>

      {/* Detail View */}
      <Modal isOpen={isDetailsOpen} onClose={() => setDetailsOpen(false)} title="Product Details">
        {currentProduct && (
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="text-xl font-bold text-gray-800">{currentProduct.name}</h3>
              <p className="text-gray-500">{currentProduct.companyName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded">
                <span className="block text-gray-500">Price</span>
                <span className="text-lg font-bold">₹{currentProduct.discountedRate}</span>
                <span className="text-xs text-gray-400 line-through ml-2">₹{currentProduct.baseRate}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <span className="block text-gray-500">Ordering</span>
                <span className="block">Multiple: {currentProduct.orderMultiple}</span>
                <span className="block">Pack Size: {currentProduct.packetsPerCarton}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <span className="block text-gray-500">Stock Status</span>
                <Badge color={currentProduct.stockOut ? 'red' : (currentProduct.currentStock || 0) > 0 ? 'emerald' : 'amber'}>
                  {currentProduct.stockOut ? 'Out of Stock' : (currentProduct.currentStock || 0) > 0 ? `In Stock (${currentProduct.currentStock})` : 'Low Stock'}
                </Badge>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <span className="block text-gray-500">Active Status</span>
                <Badge color={currentProduct.isActive ? 'emerald' : 'red'}>
                  {currentProduct.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>

            {currentProduct.secondaryAvailable && (
              <div className="bg-yellow-50 p-3 rounded border border-yellow-100">
                <h4 className="font-bold text-yellow-900 mb-2 text-sm">Active Schemes</h4>
                <ul className="text-sm space-y-1 text-yellow-800">
                  <li>• {currentProduct.secondaryDiscountPct}% off on {currentProduct.secondaryQualifyingQty} qty</li>
                  {currentProduct.additionalSecondaryDiscountPct && (
                    <li>• +{currentProduct.additionalSecondaryDiscountPct}% off on {currentProduct.additionalQualifyingQty} qty</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div >
  );
};
