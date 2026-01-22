# Customer Location & Route Validation

## Overview
To improve delivery efficiency, we have enforced mandatory data collection for **Route Name** and **GPS Location** for all customers during the order creation process.

## Feature Logic
1.  **Validation**: When placing an order in `CreateOrder.tsx`, the system checks if the selected customer has:
    -   A non-empty `Route Name`.
    -   A valid `Location` (either `locationText` or `latitude`/`longitude`).

2.  **Blocking**: If either is missing, the order placement is blocked.
    -   A modal appears prompting the user to enter the Route Name and Capture GPS Location immediately.
    -   The user can save this data, which updates the Customer record permanently.
    -   After updating, the user can proceed to place the order.

3.  **Admin Override**:
    -   Admins can grant specific users the permission to bypass this validation.
    -   **Setting**: Go to **User Management** -> Edit User -> Check **"Allow Override: Customer data validation"**.
    -   **Usage**: If a user with this permission attempts to place an order for a customer with missing data, they will see a confirmation dialog instead of a hard block.

## Technical Implementation
-   **Database**: Added `allow_override_customer_validation` (Boolean) to `users` table.
-   **Types**: Updated `User` interface in `types.ts`.
-   **State**: Updated `userStore.ts` to persist the new permission flag.
-   **UI**:
    -   `pages/admin/Users.tsx`: Added checkbox for the permission.
    -   `pages/sales/CreateOrder.tsx`: Added validation logic, "Update Required Details" modal, and override check.

## Usage Guide
1.  **For Sales Reps**: If you see the "Action Required" modal, please ask the customer for their Route Name and stand at the shop location to click "Capture" for GPS. This only needs to be done once per customer.
2.  **For Admins**: If a sales rep cannot capture GPS (e.g. device issue), you can grant them temporary override permission in the User Management panel.
