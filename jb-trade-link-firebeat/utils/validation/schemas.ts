import { z } from 'zod';

export const userSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits').optional().or(z.literal('')),
    role: z.enum(['admin', 'sales', 'delivery']),
    isActive: z.boolean(),
});

export const companySchema = z.object({
    name: z.string().min(2, 'Company name must be at least 2 characters'),
    code: z.string().min(2, 'Code must be at least 2 characters').max(10, 'Code too long'),
    isActive: z.boolean(),
});

export const tripSchema = z.object({
    deliveryPersonId: z.string().min(1, 'Delivery person is required'),
    vehicleId: z.string().optional(),
});

export const customerSchema = z.object({
    name: z.string().min(2, 'Shop name must be at least 2 characters'),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits').optional().or(z.literal('')),
    panNumber: z.string().optional(),
    routeName: z.string().optional(),
    creditLimit: z.number().min(0).optional(),
    creditDays: z.number().min(0).optional(),
    isActive: z.boolean(),
});

export const productSchema = z.object({
    name: z.string().min(2, 'Product name must be at least 2 characters'),
    companyId: z.string().min(1, 'Company is required'),
    baseRate: z.number().min(0, 'Base rate must be non-negative'),
    discountedRate: z.number().min(0, 'Discounted rate must be non-negative'),
    orderMultiple: z.number().int().min(1, 'Order multiple must be at least 1'),
    packetsPerCarton: z.number().int().min(1).default(1),
    piecesPerPacket: z.number().int().min(1).default(1),
    stockOut: z.boolean().default(false),
    isActive: z.boolean().default(true),
    discountEditable: z.boolean().default(false),
    secondaryAvailable: z.boolean().default(false),
    secondaryDiscountPct: z.number().min(0).default(0),
    secondaryQualifyingQty: z.number().int().min(0).default(0),
    additionalSecondaryDiscountPct: z.number().min(0).default(0),
    additionalQualifyingQty: z.number().int().min(0).default(0),
    companyName: z.string().optional(),
    category: z.string().optional(),
    metadata: z.unknown().optional(),
});

export const orderItemSchema = z.object({
    productId: z.string().min(1, 'Product is required'),
    qty: z.number().int().min(1, 'Quantity must be at least 1'),
    rate: z.number().min(0),
});

export const orderSchema = z.object({
    customerId: z.string().min(1, 'Customer is required'),
    items: z.array(orderItemSchema).min(1, 'At least one item is required'),
    remarks: z.string().optional(),
});

export const vehicleSchema = z.object({
    name: z.string().min(2, 'Vehicle name must be at least 2 characters').max(50, 'Vehicle name too long'),
    registrationNo: z.string().min(2, 'Registration number required').max(20, 'Registration number too long').optional().or(z.literal('')),
    capacityCases: z.number().min(0, 'Capacity must be non-negative').optional(),
    isActive: z.boolean().default(true),
});
