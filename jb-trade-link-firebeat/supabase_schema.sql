-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS "users" (
  "id" text PRIMARY KEY,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "role" text NOT NULL,
  "phone" text,
  "isActive" boolean DEFAULT true,
  "createdAt" text,
  "lastLoginAt" text,
  "avatarUrl" text
);

-- Customers Table
CREATE TABLE IF NOT EXISTS "customers" (
  "id" text PRIMARY KEY,
  "name" text NOT NULL,
  "phone" text,
  "panNumber" text,
  "routeName" text,
  "locationText" text,
  "latitude" double precision,
  "longitude" double precision,
  "isActive" boolean DEFAULT true,
  "submittedBy" text,
  "createdAt" text,
  "photoUrl" text,
  "creditLimit" double precision,
  "creditDays" integer,
  "currentOutstanding" double precision,
  "status" text
);

-- Companies Table
CREATE TABLE IF NOT EXISTS "companies" (
  "id" text PRIMARY KEY,
  "name" text NOT NULL,
  "code" text,
  "isActive" boolean DEFAULT true,
  "createdAt" text
);

-- Products Table
CREATE TABLE IF NOT EXISTS "products" (
  "id" text PRIMARY KEY,
  "name" text NOT NULL,
  "companyId" text,
  "companyName" text,
  "baseRate" double precision,
  "productDiscountPct" double precision,
  "discountedRate" double precision,
  "packetsPerCarton" integer,
  "piecesPerPacket" integer,
  "orderMultiple" integer,
  "stockOut" boolean DEFAULT false,
  "currentStock" double precision,
  "discountEditable" boolean DEFAULT false,
  "secondaryDiscountPct" double precision,
  "secondaryQualifyingQty" double precision,
  "additionalSecondaryDiscountPct" double precision,
  "additionalQualifyingQty" double precision,
  "secondaryAvailable" boolean DEFAULT false,
  "marginPct" double precision,
  "isActive" boolean DEFAULT true,
  "mrp" double precision,
  "sellingPrice" double precision,
  "minOrderQty" integer,
  "status" text,
  "category" text
);

-- Orders Table
create table public.orders (
  id text not null,
  "customerId" text null,
  "customerName" text null,
  "salespersonId" text null,
  "salespersonName" text null,
  date date null,
  "totalItems" integer null,
  "totalAmount" real null,
  status text null,
  items jsonb null,
  remarks text null,
  "assignedTripId" text null,
  discount real null,
  "GPS" text null,
  time timestamp with time zone null,
  "paymentMethod" text null,
  "vatRequired?" boolean null,
  status_updated_at timestamp with time zone null default now(),
  status_updated_by uuid null,
  sales_returns numeric null default 0,
  constraint orders_pkey primary key (id),
  constraint orders_status_updated_by_fkey foreign KEY (status_updated_by) references auth.users (id) on delete set null,
  constraint orders_sales_returns_check check ((sales_returns >= (0)::numeric))
) TABLESPACE pg_default;

-- Trips Table
CREATE TABLE IF NOT EXISTS "trips" (
  "id" text PRIMARY KEY,
  "deliveryDate" text,
  "deliveryPersonId" text,
  "deliveryPersonName" text,
  "vehicleId" text,
  "vehicleName" text,
  "routeIds" text[],
  "routeNames" text[],
  "orderIds" text[],
  "totalOrders" integer,
  "totalAmount" double precision,
  "totalCases" double precision,
  "status" text,
  "createdAt" text
);

-- Vehicles Table
CREATE TABLE IF NOT EXISTS "vehicles" (
  "id" text PRIMARY KEY,
  "name" text NOT NULL,
  "registrationNo" text,
  "capacityCases" double precision
);

-- Purchases Table
CREATE TABLE IF NOT EXISTS "purchases" (
  "id" text PRIMARY KEY,
  "billNumber" text,
  "supplierName" text,
  "billDate" text,
  "entryDate" text,
  "totalAmount" double precision,
  "items" jsonb
);

-- Returns Table
CREATE TABLE IF NOT EXISTS "returns" (
  "id" text PRIMARY KEY,
  "invoiceId" text,
  "invoiceNumber" text,
  "customerId" text,
  "customerName" text,
  "returnType" text,
  "reason" text,
  "notes" text,
  "createdByUserId" text,
  "createdByUserName" text,
  "createdAt" text,
  "totalReturnAmount" double precision
);

-- Return Items Table (Optional, if we want to query items separately, but for now sticking to JSONB in returns might be easier if the app expects it, but types say SalesReturnItem is separate? No, SalesReturn has no items array in interface, but there is SalesReturnItem interface. Let's check usage.
-- Usage in backendContracts suggests separate table.
-- Let's create it.
CREATE TABLE IF NOT EXISTS "return_items" (
  "id" text PRIMARY KEY,
  "salesReturnId" text,
  "invoiceItemId" text,
  "productId" text,
  "productName" text,
  "companyName" text,
  "qtyInvoiced" double precision,
  "qtyReturnedGood" double precision,
  "qtyReturnedDamaged" double precision,
  "rate" double precision,
  "lineReturnAmount" double precision
);

-- Damage Logs Table
CREATE TABLE IF NOT EXISTS "damage_logs" (
  "id" text PRIMARY KEY,
  "productId" text,
  "productName" text,
  "companyName" text,
  "qtyPieces" double precision,
  "damageReason" text,
  "sourceType" text,
  "sourceInvoiceId" text,
  "sourceInvoiceNumber" text,
  "sourceTripId" text,
  "createdByUserId" text,
  "createdByUserName" text,
  "createdAt" text,
  "notes" text
);

-- Enable Row Level Security (RLS) - Optional for now, but good practice.
-- For this demo/MVP, we might skip complex policies and just enable public access or authenticated access.
-- ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
-- ... etc.
