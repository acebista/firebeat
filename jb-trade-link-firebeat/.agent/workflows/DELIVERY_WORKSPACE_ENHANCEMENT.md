---
description: Enhance the Delivery Workspace with real data and features
---

# Delivery Workspace Enhancement Plan

## Objective
Transform the Delivery Workspace from a static placeholder to a functional tool for delivery personnel.

## Features to Implement

1.  **Real-Time Dashboard (`/delivery/dashboard`)**
    *   Fetch assigned trips/orders for the logged-in user.
    *   Display key metrics: Assigned, Delivered, Pending, Cash Collected.
    *   List current route stops in sequence.

2.  **Route Map View (`/delivery/route-map`)**
    *   Visualize delivery stops on a map (using Leaflet or similar).
    *   Show current location vs. destination.
    *   (Optional) Optimize route button.

3.  **Order Details & Actions (`/delivery/invoice/:id`)**
    *   View order items and total.
    *   **Mark as Delivered**: Button to update status.
    *   **Payment Collection**: Input for cash/UPI collected.
    *   **Signature/Photo**: (Future) Proof of delivery.

## Step-by-Step Implementation

1.  **Database Services**:
    *   Ensure `TripService` or `OrderService` can fetch data by `deliveryPersonId`.
    *   Add methods to update order status to 'delivered' and record payment.

2.  **Dashboard Logic**:
    *   Replace hardcoded data in `DeliveryDashboard.tsx` with `useEffect` fetching.
    *   Calculate totals dynamically.

3.  **Order Details Page**:
    *   Create `pages/delivery/DeliveryOrderDetails.tsx`.
    *   Implement status update logic.

4.  **Route Map**:
    *   Create `pages/delivery/RouteMap.tsx`.
    *   Integrate a map library (e.g., `react-leaflet`).

## Dependencies
*   `leaflet`, `react-leaflet` (for maps)
*   Existing `lucide-react` icons.
