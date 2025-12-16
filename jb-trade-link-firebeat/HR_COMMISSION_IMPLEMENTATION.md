# HR & Commission Implementation Update

## Overview
Enhanced the commission system to support **two commission modes**:
1.  **Fixed Flat Rate**: A simple percentage applied to all sales (as implemented previously).
2.  **Slab / Target Based**: A tiered structure where commission rates depend on total sales volume reaching specific levels.

## Changes Implemented

### 1. Database Schema
- **Companies Table**: Added `commission_type` column (ENUM: 'flat', 'slab') to persist the selected mode.

### 2. UI - Company Management (`pages/admin/Companies.tsx`)
- **Dual Mode Selection**:
    - "Default Flat Rate": Standard percentage input.
    - "Slab / Target Based": Activates the advanced specific rules.
- **Improved UX**:
    - The "Manage Slab Rules" button is now Context-aware (only shown/active when Slab mode is selected).
    - The main list now shows a "Slab Based" badge for companies using that mode, instead of a static number.

### 3. Reporting Logic (`pages/admin/reports/HRCommissionRepo.tsx`)
- **Advanced Calculation Engine**:
    - Refactored calculation to first **Aggregate Sales Volume** per (Salesperson, Company).
    - Checks `commission_type` for each company.
    - **Flat Mode**: Applies the fixed `commission_rate`.
    - **Slab Mode**: Lookups the `commission_rates` table to find the **SINGLE** matching tier based on Total Volume (Target). It then applies that tier's rate to the **ENTIRE** volume (Bracket/Retroactive calculation, not Progressive).
    - **Logic Refinement**: Lookup gives priority to higher tiers on boundary values (e.g. at exactly 10,000, receives the 10k+ rate).
    - **Product Overrides**: Specific product rates still take precedence over both Flat and Slab base rates (e.g. specialized high-margin items).

### 4. Data Fetching (`pages/admin/Reports.tsx`)
- Fetches all `CommissionRates` alongside Orders, Products, and Companies to enable the client-side calculation engine.

## Verification Checklist
- [x] Can select "Slab / Target Based" in Company Edit Modal.
- [x] Can define slab rules (e.g., 0-10,000 @ 1%, 10,000+ @ 2%) via the "Manage Slab Rules" modal.
- [x] Report correctly calculates using Slab logic (Aggregate Volume -> Lookup Rate -> Apply).
- [x] Report correctly calculates using Flat logic (Simple Multiplication).
- [x] Product Overrides still function correctly in both modes.

## Usage
1.  **Set Mode**: Edit a Company, choose "Slab / Target Based".
2.  **Define Rules**: Click "Manage Slab Rules" and add tiers (e.g. Min: 0, Max: 100000, Rate: 5%).
3.  **View Report**: Go to Reports -> HR & Commission to see the calculated payouts.
