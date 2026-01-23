
import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, SearchableSelect } from '../../components/ui/Elements';
import { Modal } from '../../components/ui/Modal';
import { Search, Trash2, ShoppingBag, ShoppingCart, Building2, X, UserPlus, Phone, CreditCard, MapPin, Navigation, Save, Plus, Minus, ChevronUp, ZoomIn, ZoomOut, RotateCcw, FileText } from 'lucide-react';
import { Product, OrderItem, Customer, Order, Company, Salesperson } from '../../types';
import { useAuth } from '../../services/auth';
import { ProductService, CustomerService, CompanyService, OrderService, UserService } from '../../services/db';
import { supabase } from '../../lib/supabase';
import { customerSchema } from '../../utils/validation/schemas';
import { z } from 'zod';
import toast from 'react-hot-toast';

export const CreateOrder: React.FC = () => {
    const { user } = useAuth();

    // Data State
    const [products, setProducts] = useState<Product[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [salespersons, setSalespersons] = useState<Salesperson[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    // UI State
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState<OrderItem[]>([]);
    const [orderDiscountPct, setOrderDiscountPct] = useState(0);
    const [isCartOpen, setIsCartOpen] = useState(false); // Mobile cart sheet
    const [paymentMode, setPaymentMode] = useState<'Cash' | 'Cheque' | 'Credit' | 'QR'>('Cash');
    const [vatRequired, setVatRequired] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false); // Prevents double-submit
    const orderPlacementRef = useRef(false); // Ref-based guard for race conditions

    // Filters / Selections
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedSalesperson, setSelectedSalesperson] = useState('');

    // PHASE 1: New filter states
    const [hideOutOfStock, setHideOutOfStock] = useState(false);
    const [lastOrder, setLastOrder] = useState<Order | null>(null);
    const [showLastOrderItems, setShowLastOrderItems] = useState(false);

    // Editable Customer Details State
    const [editableCustomer, setEditableCustomer] = useState({
        phone: '',
        panNumber: '',
        routeName: ''
    });

    // Add Customer Modal State
    const [isAddCustomerOpen, setAddCustomerOpen] = useState(false);
    const [newCustomerName, setNewCustomerName] = useState('');
    const [newCustomerPhone, setNewCustomerPhone] = useState('');
    const [newCustomerPan, setNewCustomerPan] = useState('');
    const [newCustomerRoute, setNewCustomerRoute] = useState('');
    const [newCustomerLocation, setNewCustomerLocation] = useState('');
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied' | 'prompt'>('unknown');
    const [preCaughtGps, setPreCaughtGps] = useState<string | null>(null);
    const [gpsStatus, setGpsStatus] = useState<'idle' | 'capturing' | 'ready' | 'error'>('idle');
    const [newCustomerLocationPermissionState, setNewCustomerLocationPermissionState] = useState<'idle' | 'prompting' | 'granted' | 'denied'>('idle');

    // Data Fix Modal
    const [isFixDataOpen, setFixDataOpen] = useState(false);
    const [fixRoute, setFixRoute] = useState('');
    const [fixLocation, setFixLocation] = useState('');
    const [isFixingLocation, setIsFixingLocation] = useState(false);
    const [fixLocationPermissionState, setFixLocationPermissionState] = useState<'checking' | 'prompting' | 'granted' | 'denied' | 'idle'>('idle');

    // Zoom state - persisted to localStorage
    const [zoomLevel, setZoomLevel] = useState(() => {
        const saved = localStorage.getItem('createorder_zoom');
        return saved ? parseFloat(saved) : 100;
    });

    // Zoom control functions
    const zoomIn = () => {
        const newZoom = Math.min(zoomLevel + 10, 150);
        setZoomLevel(newZoom);
        localStorage.setItem('createorder_zoom', String(newZoom));
    };

    const zoomOut = () => {
        const newZoom = Math.max(zoomLevel - 10, 70);
        setZoomLevel(newZoom);
        localStorage.setItem('createorder_zoom', String(newZoom));
    };

    const resetZoom = () => {
        setZoomLevel(100);
        localStorage.setItem('createorder_zoom', '100');
    };

    // Apply zoom to root HTML element for consistent scaling of all rem-based elements
    useEffect(() => {
        const root = document.documentElement;
        const originalSize = root.style.fontSize;

        // Only apply zoom on mobile screens for better readability
        if (window.innerWidth < 768) {
            root.style.fontSize = `${zoomLevel}%`;
        }

        return () => {
            root.style.fontSize = originalSize;
        };
    }, [zoomLevel]);

    // Check permissions on load
    useEffect(() => {
        const checkPermission = async () => {
            if ('permissions' in navigator) {
                try {
                    const result = await navigator.permissions.query({ name: 'geolocation' as any });
                    setPermissionStatus(result.state as any);

                    result.onchange = () => {
                        setPermissionStatus(result.state as any);
                    };
                } catch (e) {
                    console.log('[CreateOrder] Permissions query not fully supported');
                }
            }
        };
        checkPermission();
    }, []);

    // Manual location check
    const checkLocationManually = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported on this device");
            return;
        }

        setIsGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPermissionStatus('granted');
                setIsGettingLocation(false);
                toast.success("Location access granted");
            },
            (err) => {
                setIsGettingLocation(false);
                if (err.code === err.PERMISSION_DENIED) {
                    setPermissionStatus('denied');
                    toast.error("Location access denied. Please enable in settings.");
                } else {
                    toast.error("Could not get location. Try again if you are outside.");
                }
            },
            { enableHighAccuracy: true, timeout: 5000 }
        );
    };

    // Load Data
    useEffect(() => {
        const loadAll = async () => {
            setLoadingData(true);
            try {
                console.log('[CreateOrder] Loading data...');
                const [prods, comps, custs, users] = await Promise.all([
                    ProductService.getAll(),
                    CompanyService.getAll(),
                    CustomerService.getAll(),
                    UserService.getAll()
                ]);
                console.log('[CreateOrder] Data loaded: products=%d, companies=%d, customers=%d, users=%d',
                    prods.length, comps.length, custs.length, users.length);
                setProducts(prods);
                setCompanies(comps);
                setCustomers(custs);
                setSalespersons(users.filter(u => u.role === 'sales').map(u => ({ id: u.id, name: u.name })));
            } catch (e: any) {
                console.error('[CreateOrder] Failed to load data:', e);
                toast.error(
                    <div>
                        <p className="font-bold">Failed to Load Data</p>
                        <p className="text-sm">{e?.message || 'Please check your connection and refresh.'}</p>
                    </div>,
                    { duration: 8000 }
                );
            } finally {
                setLoadingData(false);
            }
        };
        loadAll();
    }, []);

    // PHASE 1: Auto-restore draft order on mount
    useEffect(() => {
        const draftKey = `draft_order_${user?.id}`;
        const draftStr = localStorage.getItem(draftKey);

        if (draftStr && products.length > 0) {
            try {
                const draft = JSON.parse(draftStr);
                const savedTime = new Date(draft.savedAt);
                const hoursSince = (Date.now() - savedTime.getTime()) / (1000 * 60 * 60);

                // Only restore if less than 24 hours old and cart is empty
                if (hoursSince < 24 && cart.length === 0) {
                    toast(
                        (t) => (
                            <div>
                                <p className="font-bold">Resume draft order?</p>
                                <p className="text-sm text-gray-600">
                                    {draft.cart?.length || 0} items from {new Date(draft.savedAt).toLocaleString()}
                                </p>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => {
                                            if (draft.cart) setCart(draft.cart);
                                            if (draft.selectedCustomer) setSelectedCustomer(draft.selectedCustomer);
                                            if (draft.selectedCompany) setSelectedCompany(draft.selectedCompany);
                                            if (draft.selectedSalesperson) setSelectedSalesperson(draft.selectedSalesperson);
                                            if (draft.orderDiscountPct) setOrderDiscountPct(draft.orderDiscountPct);
                                            if (draft.paymentMode) setPaymentMode(draft.paymentMode);
                                            if (draft.vatRequired !== undefined) setVatRequired(draft.vatRequired);
                                            toast.success('Draft restored!');
                                            toast.dismiss(t.id);
                                        }}
                                        className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
                                    >
                                        Resume
                                    </button>
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem(draftKey);
                                            toast.dismiss(t.id);
                                        }}
                                        className="px-3 py-1 bg-gray-300 rounded text-sm"
                                    >
                                        Discard
                                    </button>
                                </div>
                            </div>
                        ),
                        { duration: 10000 }
                    );
                }
            } catch (error) {
                console.error('Failed to parse draft order:', error);
                localStorage.removeItem(draftKey);
            }
        }
    }, [user?.id, products]);

    // PHASE 1: Auto-save cart to localStorage
    useEffect(() => {
        if (cart.length > 0 || selectedCustomer) {
            const draftData = {
                cart,
                selectedCustomer,
                selectedCompany,
                selectedSalesperson,
                orderDiscountPct,
                paymentMode,
                vatRequired,
                savedAt: new Date().toISOString()
            };
            localStorage.setItem(`draft_order_${user?.id}`, JSON.stringify(draftData));
        } else {
            // Clear draft if cart is empty and no customer selected
            localStorage.removeItem(`draft_order_${user?.id}`);
        }
    }, [cart, selectedCustomer, selectedCompany, orderDiscountPct, selectedSalesperson, user?.id, paymentMode, vatRequired]);

    // PHASE 1: Load last order when customer is selected
    useEffect(() => {
        if (selectedCustomer) {
            OrderService.getLastOrder(selectedCustomer).then(order => {
                setLastOrder(order);
                setShowLastOrderItems(false); // Reset collapse state
            }).catch(() => {
                setLastOrder(null);
            });
        } else {
            setLastOrder(null);
            setShowLastOrderItems(false);
        }
    }, [selectedCustomer]);

    // --- 1 Bill Per Company Logic ---
    const cartLockedCompanyId = cart.length > 0 ? products.find(p => p.id === cart[0].productId)?.companyId : null;

    // Effect: Auto-set company filter if cart becomes locked
    useEffect(() => {
        if (cartLockedCompanyId) {
            setSelectedCompany(cartLockedCompanyId);
        }
    }, [cartLockedCompanyId]);

    // Effect: Role-based Salesperson Default
    useEffect(() => {
        if (user?.role === 'sales') {
            setSelectedSalesperson(user.id);
        } else if (user?.role === 'admin' && !selectedSalesperson) {
            setSelectedSalesperson('office');
        }
    }, [user, selectedSalesperson]);

    // Effect: Populate editable fields when customer is selected
    useEffect(() => {
        if (selectedCustomer) {
            const cust = customers.find(c => c.id === selectedCustomer);
            if (cust) {
                setEditableCustomer({
                    phone: cust.phone || '',
                    panNumber: cust.panNumber || '',
                    routeName: cust.routeName || ''
                });
            }
        } else {
            setEditableCustomer({ phone: '', panNumber: '', routeName: '' });
        }
    }, [selectedCustomer, customers]);

    // --- PRICING ENGINE ---
    const calculateItemPricing = (product: Product, qty: number) => {
        const baseRate = product.baseRate;
        let netRate = product.discountedRate;
        let schemeText = '';

        if (product.secondaryAvailable && product.secondaryQualifyingQty && qty >= product.secondaryQualifyingQty) {
            if (product.secondaryDiscountPct) {
                netRate = netRate * (1 - product.secondaryDiscountPct / 100);
                schemeText = `${product.secondaryDiscountPct}% Qty Scheme`;
            }

            if (product.additionalQualifyingQty && qty >= product.additionalQualifyingQty && product.additionalSecondaryDiscountPct) {
                netRate = netRate * (1 - product.additionalSecondaryDiscountPct / 100);
                schemeText += ` + ${product.additionalSecondaryDiscountPct}% Add.`;
            }
        }

        netRate = Math.round(netRate * 100) / 100;
        const totalDiscountPct = baseRate > 0 ? ((baseRate - netRate) / baseRate) * 100 : 0;

        return {
            baseRate,
            netRate,
            discountPct: parseFloat(totalDiscountPct.toFixed(2)),
            total: netRate * qty,
            schemeAppliedText: schemeText
        };
    };

    const addToCart = (product: Product) => {
        if (cartLockedCompanyId && product.companyId !== cartLockedCompanyId) {
            toast.error(`Policy: This order is for ${products.find(p => p.companyId === cartLockedCompanyId)?.companyName}.`);
            return;
        }

        setCart(prev => {
            const existing = prev.find(item => item.productId === product.id);
            const qtyToAdd = product.minOrderQty || 1;
            let newQty = qtyToAdd;

            if (existing) {
                newQty = existing.qty + qtyToAdd;
            }

            const pricing = calculateItemPricing(product, newQty);

            if (existing) {
                return prev.map(item =>
                    item.productId === product.id
                        ? {
                            ...item,
                            qty: newQty,
                            rate: pricing.netRate,
                            baseRate: pricing.baseRate,
                            discountPct: pricing.discountPct,
                            total: pricing.total,
                            schemeAppliedText: pricing.schemeAppliedText,
                            packetsPerCarton: product.packetsPerCarton || 1,
                            piecesPerPacket: product.piecesPerPacket || 1
                        }
                        : item
                );
            }
            return [...prev, {
                productId: product.id,
                productName: product.name,
                qty: newQty,
                rate: pricing.netRate,
                baseRate: pricing.baseRate,
                discountPct: pricing.discountPct,
                total: pricing.total,
                schemeAppliedText: pricing.schemeAppliedText,
                companyId: product.companyId,
                companyName: product.companyName,
                packetsPerCarton: product.packetsPerCarton || 1,
                piecesPerPacket: product.piecesPerPacket || 1
            }];
        });

        // Haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        toast.success(`${product.name} added!`);
    };

    const updateQty = (productId: string, newQty: number) => {
        if (newQty < 0) return;

        const product = products.find(p => p.id === productId);
        if (!product) return;

        const pricing = calculateItemPricing(product, newQty);

        setCart(prev => prev.map(item =>
            item.productId === productId ? {
                ...item,
                qty: newQty,
                rate: pricing.netRate,
                baseRate: pricing.baseRate,
                discountPct: pricing.discountPct,
                total: pricing.total,
                schemeAppliedText: pricing.schemeAppliedText
            } : item
        ));
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.productId !== productId));
        if (navigator.vibrate) {
            navigator.vibrate([50, 50]);
        }
    };

    const clearCart = () => {
        if (window.confirm("Clear entire cart?")) {
            setCart([]);
            setSelectedCompany('');
            setOrderDiscountPct(0);
        }
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported by this browser");
            setNewCustomerLocationPermissionState('denied');
            return;
        }
        setIsGettingLocation(true);
        setNewCustomerLocationPermissionState('prompting');
        const toastId = toast.loading("📍 Requesting GPS permission...");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setNewCustomerLocation(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
                setIsGettingLocation(false);
                setNewCustomerLocationPermissionState('granted');
                toast.success("✅ Location captured!", { id: toastId });
            },
            (err) => {
                setIsGettingLocation(false);
                if (err.code === 1) {
                    // Permission denied
                    setNewCustomerLocationPermissionState('denied');
                    toast.error(
                        <div>
                            <p className="font-bold">📍 GPS Access Denied</p>
                            <p className="text-sm">Please enable location in browser settings.</p>
                        </div>,
                        { id: toastId, duration: 6000 }
                    );
                } else if (err.code === 3) {
                    setNewCustomerLocationPermissionState('idle');
                    toast.error("GPS Timeout. Please try again outside.", { id: toastId });
                } else {
                    setNewCustomerLocationPermissionState('idle');
                    toast.error("Unable to get location. Try again.", { id: toastId });
                }
            },
            { timeout: 15000, enableHighAccuracy: true, maximumAge: 0 }
        );
    };

    // Reset Add Customer modal states when closed
    useEffect(() => {
        if (!isAddCustomerOpen) {
            setNewCustomerLocationPermissionState('idle');
        }
    }, [isAddCustomerOpen]);

    const handleAddCustomer = async () => {
        try {
            const dataToValidate = {
                name: newCustomerName,
                phone: newCustomerPhone,
                panNumber: newCustomerPan,
                routeName: newCustomerRoute,
                isActive: true,
            };

            const validatedData = customerSchema.parse(dataToValidate);
            setValidationErrors({});

            const newCust: Omit<Customer, 'id'> = {
                ...validatedData,
                locationText: newCustomerLocation,
                status: 'active',
                createdAt: new Date().toISOString(),
                currentOutstanding: 0
            };

            const saved = await CustomerService.add(newCust);
            // Use functional update to avoid stale closures
            setCustomers(prev => [...prev, saved]);
            setSelectedCustomer(saved.id);
            setAddCustomerOpen(false);

            // Reset
            setNewCustomerName('');
            setNewCustomerPhone('');
            setNewCustomerPan('');
            setNewCustomerRoute('');
            setNewCustomerLocation('');
            toast.success(`${saved.name} added!`);
        } catch (e: any) {
            if (e instanceof z.ZodError) {
                const errors: Record<string, string> = {};
                (e as any).errors.forEach((err: any) => {
                    if (err.path[0]) {
                        errors[err.path[0] as string] = err.message;
                    }
                });
                setValidationErrors(errors);
                toast.error("Please fix the validation errors");
            } else {
                console.error('[CreateOrder] Customer save error:', e);
                const errorMessage = e?.message || e?.error?.message || "Failed to create customer";
                toast.error(errorMessage);
            }
        }
    };

    const handleGetFixLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported on this device");
            setFixLocationPermissionState('denied');
            return;
        }
        setIsFixingLocation(true);
        setFixLocationPermissionState('prompting');

        // Show loading toast
        const toastId = toast.loading("📍 Requesting GPS access...");

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setFixLocation(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
                setIsFixingLocation(false);
                setFixLocationPermissionState('granted');
                toast.success("✅ Location captured successfully!", { id: toastId });
            },
            (err) => {
                setIsFixingLocation(false);
                if (err.code === 1) {
                    // Permission denied
                    setFixLocationPermissionState('denied');
                    toast.error(
                        <div>
                            <p className="font-bold">📍 GPS Access Denied</p>
                            <p className="text-sm">Please enable location in your browser settings and try again.</p>
                        </div>,
                        { id: toastId, duration: 6000 }
                    );
                } else if (err.code === 2) {
                    // Position unavailable
                    setFixLocationPermissionState('idle');
                    toast.error("GPS signal unavailable. Try moving outdoors.", { id: toastId });
                } else if (err.code === 3) {
                    // Timeout
                    setFixLocationPermissionState('idle');
                    toast.error("GPS timeout. Please try again.", { id: toastId });
                } else {
                    setFixLocationPermissionState('idle');
                    toast.error("Failed to capture location. Try again.", { id: toastId });
                }
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    };

    // Auto-trigger GPS prompt when Fix Data Modal opens and location is empty
    useEffect(() => {
        if (isFixDataOpen && !fixLocation.trim()) {
            // Small delay to let the modal render first
            const timer = setTimeout(() => {
                handleGetFixLocation();
            }, 500);
            return () => clearTimeout(timer);
        }
        // Reset permission state when modal closes
        if (!isFixDataOpen) {
            setFixLocationPermissionState('idle');
        }
    }, [isFixDataOpen]);

    const handleFixDataSave = async () => {
        if (!selectedCustomer) return;
        if (!fixRoute.trim()) {
            toast.error("Route name is required");
            return;
        }
        if (!fixLocation.trim()) {
            toast.error("Location is required");
            return;
        }

        try {
            await CustomerService.update(selectedCustomer, {
                routeName: fixRoute,
                locationText: fixLocation
            });

            // Update local state
            setCustomers(prev => prev.map(c => c.id === selectedCustomer ? { ...c, routeName: fixRoute, locationText: fixLocation } : c));
            setFixDataOpen(false);
            toast.success("Customer details updated. Please place order now.");
        } catch (e: any) {
            console.error(e);
            toast.error("Failed to update customer");
        }
    };

    // ============================================================
    // GAPLESS INVOICE ID GENERATION (Server-Side)
    // Uses Postgres pessimistic locking - no retries, no gaps, no races
    // ============================================================
    const generateInvoiceId = async (): Promise<{ success: boolean; invoiceId?: string; error?: string }> => {
        try {
            // Call the database function that uses FOR UPDATE locking
            const { data, error } = await supabase.rpc('generate_invoice_id');

            if (error) {
                console.error('[CreateOrder] Server ID generation failed:', error);
                return { success: false, error: error.message };
            }

            if (!data) {
                return { success: false, error: 'No invoice ID returned from server' };
            }

            return { success: true, invoiceId: data as string };
        } catch (err: any) {
            console.error('[CreateOrder] generateInvoiceId exception:', err);
            return { success: false, error: err?.message || 'Failed to generate invoice ID' };
        }
    };

    // Insert order with server-generated ID (no retry needed - DB handles locking)
    const insertOrderWithId = async (orderData: any): Promise<{ success: boolean; orderId?: string; error?: string }> => {
        // Step 1: Get the guaranteed-unique ID from the server
        const idResult = await generateInvoiceId();
        if (!idResult.success || !idResult.invoiceId) {
            return { success: false, error: idResult.error || 'Failed to get invoice number' };
        }

        const invoiceId = idResult.invoiceId;
        const orderWithId = {
            ...orderData,
            id: invoiceId
        };

        // Step 2: Insert the order with the server-assigned ID
        try {
            const result = await OrderService.add(orderWithId);
            if (result) {
                return { success: true, orderId: invoiceId };
            }
            return { success: false, error: 'Order insert returned null' };
        } catch (err: any) {
            console.error('[CreateOrder] Order insert failed:', err);
            return { success: false, error: err?.message || 'Failed to save order' };
        }
    };

    const validateCart = (): string[] => {
        const errors: string[] = [];
        cart.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return;

            if (item.qty < (product.minOrderQty || 1)) {
                errors.push(`${item.productName}: Qty ${item.qty} below min ${product.minOrderQty}`);
            }

            if (item.qty % (product.orderMultiple || 1) !== 0) {
                errors.push(`${item.productName}: Must be multiple of ${product.orderMultiple}`);
            }
        });
        return errors;
    };

    const handleCaptureGpsPreemptively = () => {
        if (!navigator.geolocation) {
            toast.error("GPS not supported");
            return;
        }
        setGpsStatus('capturing');
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords = `${pos.coords.latitude},${pos.coords.longitude}`;
                setPreCaughtGps(coords);
                setGpsStatus('ready');
                toast.success("Location locked for order");
            },
            (err) => {
                setGpsStatus('error');
                console.error("GPS error", err);
                if (err.code === 1) toast.error("Location permission denied");
                else toast.error("Could not get location. Try again?");
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    };

    const handlePlaceOrder = async () => {
        // ========== DOUBLE-SUBMIT PROTECTION ==========
        // Guard 1: State-based (for UI/button disable)
        if (isPlacingOrder) {
            console.warn('[CreateOrder] Order already in progress, blocking duplicate click');
            return;
        }

        // Guard 2: Ref-based (for race conditions where state hasn't updated yet)
        if (orderPlacementRef.current) {
            console.warn('[CreateOrder] Order placement ref locked, blocking duplicate click');
            return;
        }

        // Lock immediately using ref (synchronous, before any async operation)
        orderPlacementRef.current = true;
        setIsPlacingOrder(true);

        try {
            // PHASE 1: Validate customer selection with proper UX
            if (!selectedCustomer) {
                toast.error("Please select a customer before placing order");
                setIsCartOpen(true); // Keep cart open so user can see items
                return;
            }

            // MANDATORY DATA VALIDATION
            const selectedCustObj = customers.find(c => c.id === selectedCustomer);
            if (selectedCustObj) {
                const missingRoute = !selectedCustObj.routeName || selectedCustObj.routeName.trim() === '';
                // Check if locationText exists OR specific lat/long fields are set
                const missingLoc = (!selectedCustObj.locationText || selectedCustObj.locationText.trim() === '') &&
                    (!selectedCustObj.latitude || !selectedCustObj.longitude);

                if (missingRoute || missingLoc) {
                    const canOverride = user?.allow_override_customer_validation;

                    if (canOverride) {
                        if (!window.confirm("⚠️ Customer Data Missing (Route/GPS).\n\nAs an Admin/Authorized User, do you want to proceed anyway?")) {
                            return;
                        }
                        // Proceed if they click OK
                    } else {
                        toast.error("Mandatory: Customer Route and GPS Location required.", { duration: 5000 });
                        // Pre-fill and open modal
                        setFixRoute(selectedCustObj.routeName || '');
                        setFixLocation(selectedCustObj.locationText || '');
                        setFixDataOpen(true);
                        return;
                    }
                }
            }

            if (cart.length === 0) {
                toast.error("Cart is empty");
                return;
            }

            const errors = validateCart();
            if (errors.length > 0) {
                toast.error(`Fix these:\n${errors.map(e => "• " + e).join("\n")}`, { duration: 6000 });
                return;
            }

            const spName = selectedSalesperson === 'office' ? 'Office' : salespersons.find(s => s.id === selectedSalesperson)?.name || 'Unknown';
            const custName = customers.find(c => c.id === selectedCustomer)?.name || 'Unknown';

            // Capture GPS with user feedback
            const captureGPS = (): Promise<string | null> => {
                return new Promise((resolve) => {
                    // Use pre-captured if available
                    if (preCaughtGps) {
                        resolve(preCaughtGps);
                        return;
                    }

                    if (!navigator.geolocation) {
                        resolve(null);
                        return;
                    }

                    // Only show toast if it takes a moment
                    const timer = setTimeout(() => {
                        toast.loading("Capturing sale location...", { id: 'gps-load' });
                    }, 500);

                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            clearTimeout(timer);
                            toast.success("Location recorded", { id: 'gps-load' });
                            resolve(`${position.coords.latitude},${position.coords.longitude}`);
                        },
                        () => {
                            clearTimeout(timer);
                            toast.dismiss('gps-load');
                            resolve(null);
                        },
                        { timeout: 4000, enableHighAccuracy: true }
                    );
                });
            };

            const gpsCoords = await captureGPS();

            // Prepare order data WITHOUT id - id will be generated in retry loop
            const orderData = {
                customerId: selectedCustomer,
                customerName: custName,
                salespersonId: selectedSalesperson,
                salespersonName: spName,
                customerPhone: customers.find(c => c.id === selectedCustomer)?.phone || '',
                customerPAN: customers.find(c => c.id === selectedCustomer)?.panNumber || '',
                salespersonPhone: salespersons.find(s => s.id === selectedSalesperson)?.phone || '',
                date: new Date().toISOString().split('T')[0],
                totalItems: cart.reduce((a, b) => a + b.qty, 0),
                totalAmount: finalTotal,
                discount: discountAmount,
                status: 'approved' as const,
                items: cart,
                remarks: '',
                GPS: gpsCoords || undefined,
                time: new Date().toISOString(),
                paymentMethod: paymentMode,
                vat_required: vatRequired
            };

            // Use server-side atomic ID generation (no collisions possible)
            const result = await insertOrderWithId(orderData);

            if (result.success && result.orderId) {
                // PHASE 1: Clear draft after successful order
                localStorage.removeItem(`draft_order_${user?.id}`);

                toast.success(`✓ Order #${result.orderId} - ₹${finalTotal.toFixed(0)}`);
                setCart([]);
                setSelectedCompany('');
                setOrderDiscountPct(0);
                setIsCartOpen(false);
            } else {
                // Handle error
                const errorMessage = result.error || 'Failed to place order. Please try again.';

                toast.error(
                    <div className="space-y-1">
                        <p className="font-bold">Order Failed</p>
                        <p className="text-sm opacity-90">{errorMessage}</p>
                    </div>,
                    { duration: 6000 }
                );
            }
        } finally {
            // Always unlock, whether success or failure
            orderPlacementRef.current = false;
            setIsPlacingOrder(false);
        }
    };


    // PHASE 1: Duplicate last order for quick reorder
    const duplicateOrder = (order: Order) => {
        // Clear existing cart
        setCart([]);

        // Populate cart with order items, recalculating with current pricing
        const newCart: OrderItem[] = [];

        order.items.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return;

            // Handle legacy field names (quantity vs qty)
            const itemQty = item.qty || item.quantity || 0;
            if (itemQty === 0) return;

            // Recalculate pricing with current rates
            const pricing = calculateItemPricing(product, itemQty);

            newCart.push({
                productId: item.productId,
                productName: product.name,
                qty: itemQty,
                rate: pricing.netRate,
                baseRate: pricing.baseRate,
                discountPct: pricing.discountPct,
                total: pricing.total,
                schemeAppliedText: pricing.schemeAppliedText,
                companyId: product.companyId,
                companyName: product.companyName,
                packetsPerCarton: product.packetsPerCarton || 1,
                piecesPerPacket: product.piecesPerPacket || 1
            } as OrderItem);
        });

        setCart(newCart);

        // Set company filter
        if (newCart.length > 0) {
            setSelectedCompany(newCart[0].companyId || '');
        }

        toast.success(`Loaded ${newCart.length} items from last order`);
        setIsCartOpen(true);
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCompany = selectedCompany ? p.companyId === selectedCompany : true;
        // PHASE 1: Add hide out of stock filter
        const matchesStock = hideOutOfStock ? !p.stockOut : true;
        return matchesSearch && matchesCompany && matchesStock;
    });

    const subtotalAmount = cart.reduce((acc, item) => acc + item.total, 0);
    const discountAmount = (subtotalAmount * orderDiscountPct) / 100;
    const finalTotal = subtotalAmount - discountAmount;

    const customerOptions = [
        ...customers.map(c => ({ label: `${c.name} (${c.routeName || 'No Route'})`, value: c.id }))
    ];

    const salespersonOptions = [
        { label: 'Office / Direct', value: 'office' },
        ...salespersons.map(s => ({ label: s.name, value: s.id }))
    ];

    if (loadingData) return <div className="p-10 text-center">Loading...</div>;

    return (
        <>
            {/* MOBILE-FIRST LAYOUT */}
            <div className="pb-24 min-h-screen bg-gray-50">

                {/* Sticky Header Filters */}
                <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
                    <div className="p-3 space-y-3">
                        {/* Top Bar with Zoom & GPS Controls */}
                        <div className="flex justify-between items-center bg-indigo-50 -m-3 mb-3 p-3 border-b border-indigo-100 min-h-[50px]">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Order Entry Filters</span>
                                {/* GPS Status Indicator */}
                                <button
                                    onClick={checkLocationManually}
                                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold border transition-all active:scale-95 ${permissionStatus === 'granted'
                                        ? 'bg-green-50 border-green-200 text-green-700'
                                        : permissionStatus === 'denied'
                                            ? 'bg-red-50 border-red-200 text-red-700'
                                            : 'bg-white border-gray-200 text-gray-500'
                                        }`}
                                >
                                    <MapPin className={`h-3 w-3 ${isGettingLocation ? 'animate-pulse' : ''}`} />
                                    {permissionStatus === 'granted' ? 'GPS Active' : permissionStatus === 'denied' ? 'GPS Blocked' : 'Check GPS'}
                                </button>
                            </div>
                            <div className="flex items-center gap-1 bg-white rounded-lg border border-indigo-200 p-0.5 shadow-sm">
                                <button
                                    onClick={zoomOut}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-indigo-50 rounded active:scale-90 transition-all"
                                    title="Decrease Text Size"
                                >
                                    <Minus className="h-4 w-4 text-indigo-600" />
                                </button>
                                <button
                                    onClick={resetZoom}
                                    className="px-2 h-8 flex items-center justify-center text-[10px] font-bold text-indigo-700 hover:bg-indigo-50 rounded min-w-[40px]"
                                    title="Reset to 100%"
                                >
                                    {zoomLevel}%
                                </button>
                                <button
                                    onClick={zoomIn}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-indigo-50 rounded active:scale-90 transition-all"
                                    title="Increase Text Size"
                                >
                                    <Plus className="h-4 w-4 text-indigo-600" />
                                </button>
                            </div>
                        </div>

                        {/* Customer Selection - Priority 1 */}
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <SearchableSelect
                                    label=""
                                    placeholder="Select Customer"
                                    options={customerOptions}
                                    value={selectedCustomer}
                                    onChange={(val) => setSelectedCustomer(val)}
                                />
                            </div>
                            <button
                                onClick={() => {
                                    setAddCustomerOpen(true);
                                    setValidationErrors({});
                                }}
                                className="shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 active:scale-95 transition-all"
                                aria-label="Add customer"
                            >
                                <UserPlus className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Admin: Salesperson Selector */}
                        {user?.role === 'admin' && (
                            <SearchableSelect
                                label=""
                                placeholder="Order Taken By"
                                options={salespersonOptions}
                                value={selectedSalesperson}
                                onChange={(val) => setSelectedSalesperson(val)}
                            />
                        )}

                        {/* Product Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Company Filter */}
                        <select
                            className="w-full rounded-lg border border-gray-300 px-3 py-3 text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={selectedCompany}
                            onChange={(e) => {
                                if (cart.length > 0 && cartLockedCompanyId && e.target.value !== cartLockedCompanyId && e.target.value !== '') {
                                    if (!window.confirm("Changing company will clear cart. Continue?")) return;
                                    setCart([]);
                                }
                                setSelectedCompany(e.target.value);
                            }}
                        >
                            <option value="">All Companies</option>
                            {companies.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>

                        {/* PHASE 1: Hide Out of Stock Toggle */}
                        <div className="flex items-center gap-2 px-1">
                            <input
                                type="checkbox"
                                id="hide-out-of-stock"
                                checked={hideOutOfStock}
                                onChange={(e) => setHideOutOfStock(e.target.checked)}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                            />
                            <label htmlFor="hide-out-of-stock" className="text-sm text-gray-700 select-none">
                                Hide out of stock items
                            </label>
                        </div>
                    </div>
                </div>

                {/* PHASE 1: Last Order Widget - Show when customer selected */}
                {selectedCustomer && lastOrder && (
                    <div className="mx-3 mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-xs text-blue-600 font-medium">📦 Last Order</p>
                                <p className="text-sm text-gray-700">
                                    {new Date(lastOrder.date).toLocaleDateString()} •
                                    {lastOrder.items.length} items •
                                    ₹{lastOrder.totalAmount.toLocaleString()}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowLastOrderItems(!showLastOrderItems)}
                                className="px-3 py-1 bg-white border border-blue-200 text-blue-600 text-xs font-bold rounded-full shadow-sm active:scale-95 transition-all"
                            >
                                {showLastOrderItems ? 'Hide' : 'View Items'}
                            </button>
                        </div>

                        {showLastOrderItems && (
                            <div className="mb-3 mt-2 space-y-1 bg-white/60 p-2 rounded-lg border border-blue-100 divide-y divide-blue-50">
                                {lastOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-1.5 px-1 first:pt-0 last:pb-0">
                                        <span className="text-xs text-gray-800 font-medium line-clamp-1 flex-1 pr-2">
                                            {item.productName || item.tempProductName || 'Unknown Product'}
                                        </span>
                                        <span className="text-xs font-bold text-blue-700 whitespace-nowrap">
                                            x{item.qty || item.quantity || 0}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => duplicateOrder(lastOrder)}
                            className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-200"
                        >
                            <ShoppingCart className="h-4 w-4" />
                            🔄 Reorder Same Items
                        </button>
                    </div>
                )}

                {/* Product Grid */}
                <div className="p-3 grid grid-cols-2 gap-3">
                    {filteredProducts.map((product) => (
                        <button
                            key={product.id}
                            onClick={() => addToCart(product)}
                            disabled={product.stockOut}
                            className={`bg-white rounded-xl p-3 text-left border-2 active:scale-95 transition-all ${product.stockOut
                                ? 'opacity-50 border-gray-200'
                                : 'border-gray-200 hover:border-indigo-300 active:border-indigo-500'
                                }`}
                        >
                            <div>
                                <h4 className="font-bold text-sm line-clamp-2 text-gray-900 mb-1">{product.name}</h4>
                                <p className="text-xs text-gray-500 mb-2">{product.companyName}</p>

                                <div className="flex items-baseline gap-1.5 mb-2">
                                    <span className="text-lg font-bold text-indigo-700">₹{product.discountedRate}</span>
                                    {product.baseRate > product.discountedRate && (
                                        <span className="text-xs text-gray-400 line-through">₹{product.baseRate}</span>
                                    )}
                                </div>

                                {product.secondaryAvailable && (
                                    <div className="bg-yellow-50 text-yellow-800 text-[10px] font-medium px-2 py-1 rounded mb-2 inline-block border border-yellow-200">
                                        {product.secondaryDiscountPct}% on {product.secondaryQualifyingQty}+
                                    </div>
                                )}

                                <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
                                    Min: {product.minOrderQty || 1}
                                </div>

                                {product.stockOut && (
                                    <div className="mt-2 text-xs font-bold text-red-600 text-center py-1 bg-red-50 rounded">
                                        Out of Stock
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                    {filteredProducts.length === 0 && (
                        <div className="col-span-2 py-12 text-center text-gray-500">
                            No products found
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Cart Button (Mobile) */}
            {cart.length > 0 && (
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white rounded-full p-4 shadow-2xl active:scale-95 transition-all hover:bg-indigo-700 flex items-center gap-3"
                >
                    <ShoppingCart className="h-6 w-6" />
                    <div className="flex flex-col items-start">
                        <span className="text-xs opacity-90">Cart</span>
                        <span className="font-bold">{cart.length} items</span>
                    </div>
                    <div className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                        {cart.length}
                    </div>
                </button>
            )}

            {/* Bottom Sheet Cart (Mobile) - COMPACT REDESIGN */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 flex flex-col bg-black/50" onClick={() => setIsCartOpen(false)}>
                    <div
                        className="mt-auto bg-white rounded-t-3xl max-h-[55vh] flex flex-col animate-in slide-in-from-bottom duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Compact Cart Header with Total */}
                        <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-indigo-50 rounded-t-3xl">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5 text-indigo-600" />
                                <div>
                                    <span className="font-bold text-indigo-900 text-sm">{cart.length} items</span>
                                    <span className="text-indigo-600 text-sm ml-2">₹{finalTotal.toFixed(0)}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-1.5 hover:bg-indigo-100 rounded-full transition-colors"
                            >
                                <ChevronUp className="h-5 w-5 text-indigo-600" />
                            </button>
                        </div>

                        {/* Cart Items - Two-row layout for full product name visibility */}
                        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
                            {cart.map((item) => {
                                const product = products.find(p => p.id === item.productId);
                                const minQty = product?.minOrderQty || 1;
                                const multiple = product?.orderMultiple || 1;
                                const hasError = item.qty < minQty || item.qty % multiple !== 0;

                                return (
                                    <div
                                        key={item.productId}
                                        className={`p-2.5 rounded-lg ${hasError ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}
                                    >
                                        {/* Row 1: Full Product Name + Delete */}
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <p className="text-sm font-medium text-gray-900 leading-tight flex-1">{item.productName}</p>
                                            <button
                                                onClick={() => removeFromCart(item.productId)}
                                                className="p-1 text-red-400 hover:text-red-600 shrink-0"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        {/* Row 2: Rate + Qty Controls + Total */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] text-gray-500">₹{item.rate.toFixed(0)}/ea</span>

                                            {/* Qty Controls */}
                                            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg">
                                                <button
                                                    onClick={() => updateQty(item.productId, item.qty - 1)}
                                                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-l-lg"
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    value={item.qty}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (val === '') {
                                                            updateQty(item.productId, 0);
                                                        } else {
                                                            const num = parseInt(val, 10);
                                                            if (!isNaN(num)) {
                                                                updateQty(item.productId, num);
                                                            }
                                                        }
                                                    }}
                                                    onFocus={(e) => e.target.select()}
                                                    className="w-12 text-center text-sm font-bold bg-transparent border-none outline-none focus:bg-indigo-50 focus:ring-1 focus:ring-indigo-300 rounded"
                                                />
                                                <button
                                                    onClick={() => updateQty(item.productId, item.qty + 1)}
                                                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-r-lg"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>

                                            {/* Total */}
                                            <span className="text-sm font-bold text-gray-900 w-16 text-right">₹{item.total.toFixed(0)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Compact Footer - Collapsible Options */}
                        <div className="border-t border-gray-200 bg-white">
                            {/* Quick Options Row */}
                            <div className="px-3 py-2 flex items-center justify-between gap-2 border-b border-gray-100">
                                {/* Payment Mode - Compact Pills */}
                                <div className="flex gap-1">
                                    {(['Cash', 'Cheque', 'Credit', 'QR'] as const).map((mode) => (
                                        <button
                                            key={mode}
                                            type="button"
                                            onClick={() => setPaymentMode(mode)}
                                            className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-all ${paymentMode === mode
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-100 text-gray-500'
                                                }`}
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>

                                {/* Discount Input - Compact */}
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] text-gray-500">Disc:</span>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={orderDiscountPct}
                                        onChange={(e) => setOrderDiscountPct(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                                        className="w-12 px-1.5 py-1 text-xs border border-gray-200 rounded text-center"
                                        placeholder="0"
                                    />
                                    <span className="text-[10px] text-gray-500">%</span>
                                </div>
                            </div>

                            {/* Secondary Options - Inline */}
                            <div className="px-3 py-2 flex items-center justify-between gap-3 border-b border-gray-100">
                                {/* VAT Toggle - Compact */}
                                <button
                                    type="button"
                                    onClick={() => setVatRequired(!vatRequired)}
                                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold border transition-all ${vatRequired
                                        ? 'bg-purple-100 border-purple-300 text-purple-700'
                                        : 'bg-gray-50 border-gray-200 text-gray-500'
                                        }`}
                                >
                                    <FileText className="h-3 w-3" />
                                    VAT Bill
                                </button>

                                {/* GPS Status - Compact */}
                                <button
                                    type="button"
                                    onClick={handleCaptureGpsPreemptively}
                                    disabled={gpsStatus === 'capturing'}
                                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold border transition-all ${gpsStatus === 'ready'
                                        ? 'bg-green-100 border-green-300 text-green-700'
                                        : gpsStatus === 'error'
                                            ? 'bg-red-100 border-red-300 text-red-600'
                                            : 'bg-gray-50 border-gray-200 text-gray-500'
                                        }`}
                                >
                                    <MapPin className={`h-3 w-3 ${gpsStatus === 'capturing' ? 'animate-pulse' : ''}`} />
                                    {gpsStatus === 'ready' ? 'Location ✓' : gpsStatus === 'error' ? 'GPS Failed' : 'Capture'}
                                </button>

                                {/* Clear Cart - Compact */}
                                <button
                                    onClick={clearCart}
                                    className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-red-50 border border-red-200 text-red-600"
                                >
                                    <Trash2 className="h-3 w-3" />
                                    Clear
                                </button>
                            </div>

                            {/* Total + Place Order - Always Visible */}
                            <div className="px-3 py-3 flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase">Total</p>
                                    <p className="text-xl font-bold text-indigo-700">₹{finalTotal.toFixed(2)}</p>
                                    {orderDiscountPct > 0 && (
                                        <p className="text-[10px] text-red-500">-₹{discountAmount.toFixed(0)} disc</p>
                                    )}
                                </div>
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={cart.length === 0 || isPlacingOrder}
                                    className="flex-1 max-w-[180px] px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                                >
                                    {isPlacingOrder ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Placing...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-5 w-5" />
                                            Place Order
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Modal isOpen={isAddCustomerOpen} onClose={() => setAddCustomerOpen(false)} title="Add Customer">
                <form onSubmit={(e) => { e.preventDefault(); handleAddCustomer(); }} className="space-y-4">
                    <Input
                        label="Shop Name"
                        value={newCustomerName}
                        onChange={e => setNewCustomerName(e.target.value)}
                        placeholder="e.g. New General Store"
                        error={validationErrors.name}
                        autoFocus
                    />

                    <div className="space-y-4">
                        <Input
                            label="Phone"
                            value={newCustomerPhone}
                            onChange={e => setNewCustomerPhone(e.target.value)}
                            placeholder="98..."
                            error={validationErrors.phone}
                            type="tel"
                        />
                        <Input
                            label="Route"
                            value={newCustomerRoute}
                            onChange={e => setNewCustomerRoute(e.target.value)}
                            placeholder="Route Name"
                            error={validationErrors.routeName}
                        />
                    </div>

                    <Input
                        label="PAN Number (Optional)"
                        value={newCustomerPan}
                        onChange={e => setNewCustomerPan(e.target.value)}
                        placeholder="PAN"
                        error={validationErrors.panNumber}
                    />

                    <div>
                        <label className="block text-sm font-bold text-indigo-900 mb-0.5">Shop Location (Recommended)</label>
                        <p className="text-[10px] text-gray-500 mb-2">Help drivers find this shop by saving current GPS</p>

                        {/* GPS Permission Prompting State */}
                        {newCustomerLocationPermissionState === 'prompting' && !newCustomerLocation && (
                            <div className="mb-2 p-3 bg-blue-50 border-2 border-blue-200 rounded-xl animate-pulse">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Navigation className="h-5 w-5 text-blue-600 animate-bounce" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-blue-800 text-sm">📍 Allow Location Access</p>
                                        <p className="text-xs text-blue-600">Tap "Allow" in the popup to capture location</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* GPS Permission Denied State */}
                        {newCustomerLocationPermissionState === 'denied' && !newCustomerLocation && (
                            <div className="mb-2 p-3 bg-red-50 border-2 border-red-200 rounded-xl">
                                <div className="flex items-start gap-2">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                                        <Navigation className="h-4 w-4 text-red-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-red-800 text-sm">⚠️ GPS Blocked</p>
                                        <p className="text-xs text-red-600">Enable location in browser settings, then try again</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleGetLocation}
                                    className="mt-2 w-full py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200"
                                >
                                    Retry GPS
                                </button>
                            </div>
                        )}

                        {/* GPS Captured Success State */}
                        {newCustomerLocation && (
                            <div className="mb-2 p-2 bg-green-50 border-2 border-green-200 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <Navigation className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-green-800 text-sm">✅ Location Saved</p>
                                        <p className="text-xs text-green-600 font-mono">{newCustomerLocation}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Normal input with capture button */}
                        {newCustomerLocationPermissionState !== 'prompting' && newCustomerLocationPermissionState !== 'denied' && (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className={`flex-1 rounded-lg border px-3 py-3 text-base text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 ${newCustomerLocation ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}
                                    value={newCustomerLocation}
                                    readOnly
                                    placeholder="Tap button to get GPS →"
                                />
                                <button
                                    type="button"
                                    onClick={handleGetLocation}
                                    disabled={isGettingLocation}
                                    className={`shrink-0 px-4 py-3 rounded-lg transition-all active:scale-95 flex items-center gap-2 ${newCustomerLocation
                                            ? 'bg-green-100 text-green-700 border-2 border-green-300 hover:bg-green-200'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                                        }`}
                                >
                                    <Navigation className={`h-5 w-5 ${isGettingLocation ? 'animate-pulse' : ''}`} />
                                    {!newCustomerLocation && <span className="text-sm font-medium">GPS</span>}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setAddCustomerOpen(false)}
                            className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 active:scale-95 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 active:scale-95 transition-all"
                        >
                            Save & Select
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Missing Data Fix Modal */}
            <Modal isOpen={isFixDataOpen} onClose={() => setFixDataOpen(false)} title="Update Required Details">
                <div className="space-y-4">
                    <div className="bg-red-50 p-3 rounded border border-red-200 text-sm text-red-800">
                        <strong>Action Required:</strong> Please update the Route and GPS Location for this customer to proceed with the order.
                    </div>

                    <Input
                        label="Route Name"
                        value={fixRoute}
                        onChange={e => setFixRoute(e.target.value)}
                        placeholder="e.g. Market Road"
                        required
                    />

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">GPS Location</label>

                        {/* GPS Permission Prompting State */}
                        {fixLocationPermissionState === 'prompting' && !fixLocation && (
                            <div className="mb-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl animate-pulse">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <MapPin className="h-6 w-6 text-blue-600 animate-bounce" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-blue-800">📍 Allow Location Access</p>
                                        <p className="text-sm text-blue-600">A popup will appear asking for GPS permission. Please tap "Allow" to capture shop location.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* GPS Permission Denied State */}
                        {fixLocationPermissionState === 'denied' && !fixLocation && (
                            <div className="mb-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                                        <MapPin className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-red-800">⚠️ GPS Access Blocked</p>
                                        <p className="text-sm text-red-600 mb-2">Location permission was denied. To enable:</p>
                                        <ol className="text-xs text-red-700 space-y-1 list-decimal list-inside">
                                            <li>Tap the <span className="font-mono bg-red-100 px-1 rounded">🔒 lock icon</span> in your browser's address bar</li>
                                            <li>Find <strong>"Location"</strong> and change to <strong>"Allow"</strong></li>
                                            <li>Refresh this page and try again</li>
                                        </ol>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleGetFixLocation}
                                    className="mt-3 w-full py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {/* GPS Captured Success State */}
                        {fixLocation && (
                            <div className="mb-3 p-3 bg-green-50 border-2 border-green-200 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <MapPin className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-green-800">✅ Location Captured</p>
                                        <p className="text-sm text-green-600 font-mono">{fixLocation}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Normal input with capture button (shown when idle or needs retry) */}
                        {fixLocationPermissionState !== 'prompting' && fixLocationPermissionState !== 'denied' && (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={fixLocation}
                                    readOnly
                                    className={`flex-1 rounded-lg border px-3 py-2 ${fixLocation ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'}`}
                                    placeholder="Tap button to capture location →"
                                />
                                <button
                                    type="button"
                                    onClick={handleGetFixLocation}
                                    disabled={isFixingLocation}
                                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all active:scale-95 ${fixLocation
                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                                        }`}
                                >
                                    <MapPin className={`h-4 w-4 ${isFixingLocation ? 'animate-pulse' : ''}`} />
                                    {isFixingLocation ? 'Getting...' : fixLocation ? 'Recapture' : '📍 Get GPS'}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setFixDataOpen(false)}>Cancel</Button>
                        <Button onClick={handleFixDataSave}>Update & Continue</Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};
