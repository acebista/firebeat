import React, { useState } from 'react';
import { Order } from '../types';
import toast from 'react-hot-toast';
import { Layout as LayoutIcon } from 'lucide-react';

interface ChallanPrintProps {
  order: Order;
  customerLocation?: string; // lat,long format
  orientation?: 'portrait' | 'landscape';
  showOrientationToggle?: boolean;
}

export const ChallanPrint: React.FC<ChallanPrintProps> = ({
  order,
  customerLocation,
  orientation = 'portrait',
  showOrientationToggle = false
}) => {
  const [currentOrientation, setCurrentOrientation] = useState<'portrait' | 'landscape'>(orientation);

  // DEBUG: Log order structure
  console.log('[ChallanPrint] Order data:', order);
  console.log('[ChallanPrint] Order.items:', order.items);
  console.log('[ChallanPrint] Order.items type:', typeof order.items);
  console.log('[ChallanPrint] Order.items isArray:', Array.isArray(order.items));

  // Generate QR code URL for Google Maps location
  const getQRCodeUrl = (location: string) => {
    const parts = location.split(',').map(p => p.trim());
    const lat = parts[0];
    const lng = parts[1];
    if (!lat || !lng) return undefined;
    const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(mapsUrl)}`;
  };

  // Handle items - check if it's a string that needs parsing
  let orderItems = order.items;
  if (typeof orderItems === 'string') {
    try {
      orderItems = JSON.parse(orderItems);
      console.log('[ChallanPrint] Parsed items from string:', orderItems);
    } catch (e) {
      console.error('[ChallanPrint] Failed to parse items string:', e);
      orderItems = [];
    }
  }

  if (!Array.isArray(orderItems)) {
    console.error('[ChallanPrint] Items is not an array:', orderItems);
    orderItems = [];
  }

  console.log('[ChallanPrint] Final orderItems:', orderItems);

  const subtotal = orderItems?.reduce((sum, item) => {
    const total = Number(item.total || item.amount) || 0;
    console.log(`[ChallanPrint] Item subtotal: ${item.productName || item.tempProductName}, total: ${total}`);
    return sum + total;
  }, 0) || 0;
  const discountAmount = order.discount || 0;
  const discountPct = subtotal > 0 ? ((discountAmount / subtotal) * 100).toFixed(2) : '0';
  const grandTotal = order.totalAmount || 0;
  const qrCodeUrl = customerLocation ? getQRCodeUrl(customerLocation) : undefined;

  console.log('[ChallanPrint] Calculated subtotal:', subtotal, 'grandTotal:', grandTotal);

  // Dimension styles based on orientation - FIXED for A5 (148mm x 210mm)
  // Using slightly smaller height (200mm) to ensure containment within physical A5 page
  const pageStyle = currentOrientation === 'portrait' ? {
    width: '148mm',
    height: '210mm',
  } : {
    width: '210mm',
    height: '148mm',
  };

  const containerStyle = {
    ...pageStyle,
    padding: '10mm', // Increased padding for hardware safety
    fontFamily: 'Arial, sans-serif',
    fontSize: '9pt',
    backgroundColor: 'white',
    position: 'relative' as const,
    border: '2px solid black',
    boxSizing: 'border-box' as const
  };

  const headerStyle = {
    textAlign: 'center' as const,
    marginBottom: '15px',
    position: 'relative' as const,
    paddingBottom: '10px',
    borderBottom: '2px solid black',
  };

  const qrContainerStyle = {
    position: 'absolute' as const,
    top: '8mm',
    right: '8mm',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '4px'
  };

  return (
    <div style={containerStyle}>
      {/* QR Code in top-right corner */}
      {qrCodeUrl && (
        <div style={qrContainerStyle}>
          <img
            src={qrCodeUrl}
            alt="Location QR Code"
            style={{ width: '80px', height: '80px', border: '1px solid #ccc' }}
          />
          <small style={{ fontSize: '7pt', textAlign: 'center' }}>Customer Location</small>
        </div>
      )}

      {/* Header */}
      <div style={headerStyle}>
        <h1 style={{ margin: '0 0 3px 0', fontSize: '14pt', fontWeight: 'bold' }}>J.B Trade Link Pvt. Ltd.</h1>
        <h2 style={{ margin: '0 0 3px 0', fontSize: '11pt', fontWeight: 'normal' }}>Delivery Challan</h2>
        <p style={{ margin: '3px 0', fontSize: '9pt' }}>Phone: 9802379658</p>
        <p style={{ margin: '3px 0', fontSize: '9pt', fontWeight: 'bold' }}>Customer Copy</p>
      </div>

      {/* Invoice Details */}
      <div style={{ marginBottom: '10px', fontSize: '9pt' }}>
        <div style={{ marginBottom: '3px' }}>
          <strong>Invoice No:</strong> {order.id}
        </div>
        <div style={{ marginBottom: '3px' }}>
          <strong>Salesman:</strong> {order.salespersonName} &nbsp;&nbsp;&nbsp;
          <strong>Phone:</strong> {order.salespersonPhone || 'N/A'}
        </div>
        <div style={{ marginBottom: '3px' }}>
          <strong>Customer Name:</strong> {order.customerName} &nbsp;&nbsp;&nbsp;
          <strong>Phone:</strong> {order.customerPhone || 'N/A'}
        </div>
        <div style={{ marginBottom: '3px' }}>
          <strong>PAN Number:</strong> {order.customerPAN || 'N/A'}
        </div>
        <div style={{ marginBottom: '3px' }}>
          <strong>Payment Mode:</strong> {(order as any).paymentMethod || order.paymentMode || 'Cash'}
        </div>
        <div style={{ marginBottom: '8px' }}>
          <strong>Products Sold:</strong>
        </div>
      </div>

      {/* Products Table */}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '10px',
        fontSize: '8pt'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ border: '2px solid black', padding: '8px', textAlign: 'center', width: '40px' }}>#</th>
            <th style={{ border: '2px solid black', padding: '8px', textAlign: 'left' }}>Product</th>
            <th style={{ border: '2px solid black', padding: '8px', textAlign: 'center', width: '80px' }}>Qty</th>
            <th style={{ border: '2px solid black', padding: '8px', textAlign: 'right', width: '80px' }}>Rate</th>
            <th style={{ border: '2px solid black', padding: '8px', textAlign: 'right', width: '100px' }}>SubTotal</th>
            <th style={{ border: '2px solid black', padding: '8px', textAlign: 'right', width: '80px' }}>Disc</th>
            <th style={{ border: '2px solid black', padding: '8px', textAlign: 'right', width: '100px' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {orderItems?.map((item, index) => {
            // Handle both database field formats
            const qty = Number(item.qty || item.quantity) || 0;
            const netRate = Number(item.rate || item.price) || 0;
            // Only use baseRate if it's explicitly set AND different from netRate
            const hasExplicitBaseRate = item.baseRate !== undefined && item.baseRate !== null && Number(item.baseRate) !== netRate;
            const baseRate = hasExplicitBaseRate ? Number(item.baseRate) : netRate;

            const subtotalAtBase = baseRate * qty;
            const finalTotal = Number(item.total || item.amount) || (qty * netRate);
            // Only show discount if it's meaningful (> Rs. 1) to avoid floating-point noise
            const rawDiscount = subtotalAtBase - finalTotal;
            const itemDiscountAmount = rawDiscount > 1 ? rawDiscount : 0;

            const productName = item.productName || item.tempProductName || 'undefined';

            console.log(`[ChallanPrint] Rendering item ${index}: ${productName}, qty: ${qty}, baseRate: ${baseRate}, netRate: ${netRate}, total: ${finalTotal}`);

            return (
              <tr key={index}>
                <td style={{ border: '1px solid black', padding: '6px', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ border: '1px solid black', padding: '6px' }}>{productName}</td>
                <td style={{ border: '1px solid black', padding: '6px', textAlign: 'center' }}>{qty}</td>
                <td style={{ border: '1px solid black', padding: '6px', textAlign: 'right' }}>{baseRate.toFixed(2)}</td>
                <td style={{ border: '1px solid black', padding: '6px', textAlign: 'right' }}>{subtotalAtBase.toFixed(2)}</td>
                <td style={{ border: '1px solid black', padding: '6px', textAlign: 'right' }}>{itemDiscountAmount.toFixed(2)}</td>
                <td style={{ border: '1px solid black', padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>
                  {finalTotal.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ marginBottom: '20px', fontSize: '9pt' }}>
        <div style={{ marginBottom: '5px' }}>
          <strong>Sub Total: Rs. {subtotal.toFixed(2)}</strong>
        </div>
        {discountAmount > 0 && (
          <div style={{ marginBottom: '5px' }}>
            <strong>Discount ({discountPct}%): Rs. {discountAmount.toFixed(2)}</strong>
          </div>
        )}
        <div style={{ fontSize: '12pt', fontWeight: 'bold', marginTop: '8px' }}>
          Grand Total: Rs. {grandTotal.toFixed(2)}
        </div>
      </div>

      {/* Signatures */}
      <div style={{ marginTop: '30px', fontSize: '9pt' }}>
        <div style={{ marginBottom: '40px' }}>
          For J.B. Trade Link: _______________________
        </div>
        <div>
          Customer Signature: _______________________
        </div>
      </div>
    </div>
  );
};

// Print function for individual challan
export const printChallan = (order: Order, customerLocation?: string, orientation: 'portrait' | 'landscape' = 'portrait') => {
  const printWindow = window.open('', '', 'height=800,width=600');
  if (!printWindow) {
    toast.error('Please allow popups to print');
    return;
  }

  // Parse GPS coordinates and generate QR code
  const getQRUrl = (location: string) => {
    const parts = location.split(',').map(p => p.trim());
    const lat = parts[0];
    const lng = parts[1];
    if (!lat || !lng) return '';
    const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(mapsUrl)}`;
  };

  const qrUrl = customerLocation ? getQRUrl(customerLocation) : '';

  const orderItems = Array.isArray(order.items) ? order.items : (typeof order.items === 'string' ? JSON.parse(order.items) : []);

  const subtotal = orderItems?.reduce((sum: number, item: any) => {
    const total = Number(item.total || item.amount) || 0;
    return sum + total;
  }, 0) || 0;
  const discountAmount = order.discount || 0;
  const discountPct = subtotal > 0 ? ((discountAmount / subtotal) * 100).toFixed(2) : '0';
  const grandTotal = order.totalAmount || 0;

  const paymentMode = ((order as any).paymentMethod || order.paymentMode || 'Cash').toLowerCase();
  const copiesCount = (paymentMode === 'cheque' || paymentMode === 'credit') ? 2 : 1;

  const pageSize = orientation === 'portrait'
    ? { width: '148mm', height: '210mm' }
    : { width: '210mm', height: '148mm' };

  // Generate the challan HTML for each copy
  const challansHtml = Array.from({ length: copiesCount }).map((_, i) => {
    const label = copiesCount > 1 ? (i === 0 ? 'Original Copy' : 'Duplicate Copy') : 'Customer Copy';
    return `
        <div class="challan-wrapper">
          <div class="container">
            ${qrUrl ? `
              <div class="qr-container">
                <img src="${qrUrl}" alt="Location QR Code" style="width: 80px; height: 80px;" />
                <span class="qr-label">Customer Location</span>
              </div>
            ` : ''}

            <div class="header">
              <h1>J.B Trade Link Pvt. Ltd.</h1>
              <h2>Delivery Challan</h2>
              <p>Phone: 9802379658</p>
              <p style="font-weight: bold;">${label}</p>
            </div>

            <div class="details">
              <div><strong>Invoice No:</strong> ${order.id}</div>
              <div style="display: flex; gap: 20px;">
                <div><strong>Salesman:</strong> ${order.salespersonName}</div>
                <div><strong>Phone:</strong> ${order.salespersonPhone || 'N/A'}</div>
              </div>
              <div style="display: flex; gap: 20px;">
                <div><strong>Customer Name:</strong> ${order.customerName}</div>
                <div><strong>Phone:</strong> ${order.customerPhone || 'N/A'}</div>
              </div>
              <div><strong>PAN Number:</strong> ${order.customerPAN || 'N/A'}</div>
              <div><strong>Payment Mode:</strong> ${(order as any).paymentMethod || order.paymentMode || 'Cash'}</div>
              <div style="margin-top: 10px;"><strong>Products Sold:</strong></div>
            </div>

            <table>
              <thead>
                <tr>
                  <th class="col-hash">#</th>
                  <th class="col-product">Product</th>
                  <th class="col-qty">Qty</th>
                  <th class="col-rate">Rate</th>
                  <th class="col-subtotal">SubTotal</th>
                  <th class="col-disc">Disc</th>
                  <th class="col-total">Total</th>
                </tr>
              </thead>
              <tbody>
                ${(orderItems || []).map((item: any, index: number) => {
      const qty = Number(item.qty || item.quantity) || 0;
      const netRate = Number(item.rate || item.price) || 0;
      // Only use baseRate if it's explicitly set AND different from netRate
      const hasExplicitBaseRate = item.baseRate !== undefined && item.baseRate !== null && Number(item.baseRate) !== netRate;
      const baseRate = hasExplicitBaseRate ? Number(item.baseRate) : netRate;

      const subtotalAtBase = baseRate * qty;
      const finalTotal = Number(item.total || item.amount) || (qty * netRate);
      // Only show discount if it's meaningful (> Rs. 1) to avoid floating-point noise
      const rawDiscount = subtotalAtBase - finalTotal;
      const itemDiscountAmount = rawDiscount > 1 ? rawDiscount : 0;

      const productName = item.productName || item.tempProductName || 'undefined';
      return `
                      <tr>
                        <td class="col-hash">${index + 1}</td>
                        <td class="col-product">${productName}</td>
                        <td class="col-qty">${qty}</td>
                        <td class="col-rate">${baseRate.toFixed(2)}</td>
                        <td class="col-subtotal">${subtotalAtBase.toFixed(2)}</td>
                        <td class="col-disc">${itemDiscountAmount.toFixed(2)}</td>
                        <td class="col-total">${finalTotal.toFixed(2)}</td>
                      </tr>
                    `;
    }).join('')}
              </tbody>
            </table>

            <div class="totals">
              <div><strong>Sub Total: Rs. ${subtotal.toFixed(2)}</strong></div>
              ${discountAmount > 0 ? `<div><strong>Discount (${discountPct}%): Rs. ${discountAmount.toFixed(2)}</strong></div>` : ''}
              <div class="grand-total">Grand Total: Rs. ${grandTotal.toFixed(2)}</div>
            </div>

            <div class="signatures">
              <div>For J.B. Trade Link: <br/>_______________________</div>
              <div>Customer Signature: <br/>_______________________</div>
            </div>
          </div>
        </div>
    `;
  }).join('');

  printWindow.document.write(`
    <html>
      <head>
        <title>Delivery Challan - ${order.id}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          @media print {
            @page {
              size: ${orientation === 'portrait' ? 'A5 portrait' : 'A5 landscape'};
              margin: 0;
            }
            body { margin: 0; padding: 0; }
            .challan-wrapper { page-break-after: always; page-break-inside: avoid; }
            .challan-wrapper:last-child { page-break-after: auto; }
          }
          body { 
            font-family: Arial, sans-serif; 
            font-size: 9pt;
            background: white;
          }
          .challan-wrapper {
            width: ${pageSize.width};
            height: ${pageSize.height};
            background: white;
            padding: 10mm; /* Mandatory safety buffer for physical printers */
            display: block;
            position: relative;
          }
          .container {
            width: 100%;
            height: 100%;
            padding: 5mm;
            border: 2px solid black;
            position: relative;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-sizing: border-box;
          }
          .header { text-align: center; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 2px solid black; }
          .header h1 { margin: 0; font-size: 14pt; font-weight: bold; }
          .header h2 { margin: 3px 0; font-size: 11pt; font-weight: normal; }
          .header p { margin: 3px 0; font-size: 8pt; }
          .qr-container { 
            position: absolute; 
            top: 5mm; 
            right: 5mm; 
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
          }
          .qr-label { font-size: 7pt; text-align: center; }
          .details { margin-bottom: 12px; font-size: 9pt; }
          .details div { margin-bottom: 3px; }
          
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 8pt; table-layout: auto; }
          th, td { border: 1px solid black; padding: 4px 3px; line-height: 1.1; vertical-align: top; }
          th { border-width: 1.5px; background-color: #f2f2f2; font-weight: bold; text-transform: uppercase; font-size: 8pt; }
          
          /* Smart Column Distribution */
          .col-hash { width: 1%; white-space: nowrap; text-align: center; }
          .col-product { width: auto; text-align: left; }
          .col-qty { width: 1%; white-space: nowrap; text-align: center; }
          .col-rate { width: 1%; white-space: nowrap; text-align: right; }
          .col-subtotal { width: 1%; white-space: nowrap; text-align: right; }
          .col-disc { width: 1%; white-space: nowrap; text-align: right; }
          .col-total { width: 1%; white-space: nowrap; text-align: right; font-weight: bold; }
          
          .totals { margin-top: auto; margin-bottom: 10px; font-size: 9pt; }
          .totals div { margin-bottom: 2px; }
          .grand-total { font-size: 11pt; font-weight: bold; margin-top: 4px; border-top: 1px solid #000; padding-top: 4px; }
          .signatures { display: flex; justify-content: space-between; margin-top: 10px; font-size: 9pt; padding-bottom: 5px; }
          .signatures div { border-top: 1.5px solid black; padding-top: 4px; width: 45%; }
        </style>
      </head>
      <body>
        ${challansHtml}
      </body>
    </html>
  `);

  printWindow.document.close();

  // Wait for images (QR code) to load before printing
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 700);
};

// Batch print function for multiple challans with orientation support
export const printChallans = (
  orders: Order[],
  orientation: 'portrait' | 'landscape' = 'portrait',
  getCustomerLocation?: (order: Order) => string | undefined
) => {
  const printWindow = window.open('', '', 'height=800,width=600');
  if (!printWindow) {
    toast.error('Please allow popups to print');
    return;
  }

  const pageSize = orientation === 'portrait'
    ? { width: '148mm', height: '210mm' }
    : { width: '210mm', height: '148mm' };

  const challanHtml = (orders || []).flatMap(order => {
    const paymentMode = ((order as any).paymentMethod || order.paymentMode || 'Cash').toLowerCase();
    const copiesCount = (paymentMode === 'cheque' || paymentMode === 'credit') ? 2 : 1;

    const customerLocation = getCustomerLocation?.(order);

    // Parse GPS coordinates for QR code
    let qrUrl = '';
    if (customerLocation) {
      const parts = customerLocation.split(',').map(p => p.trim());
      const lat = parts[0];
      const lng = parts[1];
      if (lat && lng) {
        const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
        qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(mapsUrl)}`;
      }
    }

    const orderItems = Array.isArray(order.items) ? order.items : (typeof order.items === 'string' ? JSON.parse(order.items) : []);

    const subtotal = orderItems?.reduce((sum: number, item: any) => {
      const total = Number(item.total || item.amount) || 0;
      return sum + total;
    }, 0) || 0;
    const discountAmount = order.discount || 0;
    const discountPct = subtotal > 0 ? ((discountAmount / subtotal) * 100).toFixed(2) : '0';
    const grandTotal = order.totalAmount || 0;

    return Array.from({ length: copiesCount }).map((_, i) => {
      const label = copiesCount > 1 ? (i === 0 ? 'Original Copy' : 'Duplicate Copy') : 'Customer Copy';
      return `
          <div class="challan-page">
            <div class="container">
              ${qrUrl ? `
                <div class="qr-container">
                  <img src="${qrUrl}" alt="Location QR Code" style="width: 80px; height: 80px;" />
                  <span class="qr-label">Customer Location</span>
                </div>
              ` : ''}

              <div class="header">
                <h1>J.B Trade Link Pvt. Ltd.</h1>
                <h2>Delivery Challan</h2>
                <p>Phone: 9802379658</p>
                <p style="font-weight: bold;">${label}</p>
              </div>

              <div class="details">
                <div><strong>Invoice No:</strong> ${order.id}</div>
                <div style="display: flex; gap: 20px;">
                  <div><strong>Salesman:</strong> ${order.salespersonName}</div>
                  <div><strong>Phone:</strong> ${order.salespersonPhone || 'N/A'}</div>
                </div>
                <div style="display: flex; gap: 20px;">
                  <div><strong>Customer Name:</strong> ${order.customerName}</div>
                  <div><strong>Phone:</strong> ${order.customerPhone || 'N/A'}</div>
                </div>
                <div><strong>PAN Number:</strong> ${order.customerPAN || 'N/A'}</div>
                <div><strong>Payment Mode:</strong> ${(order as any).paymentMethod || order.paymentMode || 'Cash'}</div>
                <div style="margin-top: 10px;"><strong>Products Sold:</strong></div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th class="col-hash">#</th>
                    <th class="col-product">Product</th>
                    <th class="col-qty">Qty</th>
                    <th class="col-rate">Rate</th>
                    <th class="col-subtotal">SubTotal</th>
                    <th class="col-disc">Disc</th>
                    <th class="col-total">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${(orderItems || []).map((item: any, index: number) => {
        const qty = Number(item.qty || item.quantity) || 0;
        const netRate = Number(item.rate || item.price) || 0;
        // Only use baseRate if it's explicitly set AND different from netRate
        const hasExplicitBaseRate = item.baseRate !== undefined && item.baseRate !== null && Number(item.baseRate) !== netRate;
        const baseRate = hasExplicitBaseRate ? Number(item.baseRate) : netRate;

        const subtotalAtBase = baseRate * qty;
        const finalTotal = Number(item.total || item.amount) || (qty * netRate);
        // Only show discount if it's meaningful (> Rs. 1) to avoid floating-point noise
        const rawDiscount = subtotalAtBase - finalTotal;
        const itemDiscountAmount = rawDiscount > 1 ? rawDiscount : 0;

        const productName = item.productName || item.tempProductName || 'undefined';
        return `
                        <tr>
                          <td class="col-hash">${index + 1}</td>
                          <td class="col-product">${productName}</td>
                          <td class="col-qty">${qty}</td>
                          <td class="col-rate">${baseRate.toFixed(2)}</td>
                          <td class="col-subtotal">${subtotalAtBase.toFixed(2)}</td>
                          <td class="col-disc">${itemDiscountAmount.toFixed(2)}</td>
                          <td class="col-total">${finalTotal.toFixed(2)}</td>
                        </tr>
                      `;
      }).join('')}
                </tbody>
              </table>

              <div class="totals">
                <div><strong>Sub Total: Rs. ${subtotal.toFixed(2)}</strong></div>
                ${discountAmount > 0 ? `<div><strong>Discount (${discountPct}%): Rs. ${discountAmount.toFixed(2)}</strong></div>` : ''}
                <div class="grand-total">Grand Total: Rs. ${grandTotal.toFixed(2)}</div>
              </div>

              <div class="signatures">
                <div>For J.B. Trade Link: <br/>_______________________</div>
                <div>Customer Signature: <br/>_______________________</div>
              </div>
            </div>
          </div>
        `;
    });
  }).join('');

  printWindow.document.write(`
    <html>
      <head>
        <title>Delivery Challans - Batch Print</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          @media print {
            @page { 
              size: ${orientation === 'portrait' ? 'A5 portrait' : 'A5 landscape'};
              margin: 0;
            }
            body { margin: 0; padding: 0; }
            .challan-page {
              page-break-after: always;
              page-break-inside: avoid;
            }
            .challan-page:last-child {
              page-break-after: auto;
            }
          }
          
          @media screen {
            body { background: #f0f0f0; padding: 20px; }
            .challan-page { margin-bottom: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          }
          
          body { font-family: Arial, sans-serif; font-size: 9pt; background: white; }
          .challan-page { 
            width: ${pageSize.width}; 
            height: ${pageSize.height}; 
            background: white; 
            padding: 10mm; /* Mandatory safety buffer for physical printers */
            display: block;
          }
          .container {
            width: 100%;
            height: 100%;
            padding: 5mm;
            border: 2px solid black;
            position: relative;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-sizing: border-box;
          }
          
          .header { text-align: center; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 2px solid black; }
          .header h1 { margin: 0; font-size: 14pt; font-weight: bold; }
          .header h2 { margin: 3px 0; font-size: 11pt; font-weight: normal; }
          .header p { margin: 3px 0; font-size: 8pt; }
          
          .qr-container { 
            position: absolute; 
            top: 5mm; 
            right: 5mm; 
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
          }
          .qr-container img { width: 80px; height: 80px; border: 1px solid #ccc; }
          .qr-label { font-size: 7pt; text-align: center; }
          
          .details { margin-bottom: 12px; font-size: 9pt; }
          .details div { margin-bottom: 3px; }
          
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 8pt; table-layout: auto; }
          th, td { border: 1px solid black; padding: 4px 3px; line-height: 1.1; vertical-align: top; }
          th { border-width: 1.5px; background-color: #f2f2f2; font-weight: bold; text-transform: uppercase; font-size: 8pt; }
          
          /* Smart Column Distribution */
          .col-hash { width: 1%; white-space: nowrap; text-align: center; }
          .col-product { width: auto; text-align: left; }
          .col-qty { width: 1%; white-space: nowrap; text-align: center; }
          .col-rate { width: 1%; white-space: nowrap; text-align: right; }
          .col-subtotal { width: 1%; white-space: nowrap; text-align: right; }
          .col-disc { width: 1%; white-space: nowrap; text-align: right; }
          .col-total { width: 1%; white-space: nowrap; text-align: right; font-weight: bold; }
          
          .totals { margin-top: auto; margin-bottom: 10px; font-size: 9pt; }
          .totals div { margin-bottom: 2px; }
          .grand-total { font-size: 11pt; font-weight: bold; margin-top: 4px; border-top: 1px solid #000; padding-top: 4px; }
          
          .signatures { display: flex; justify-content: space-between; margin-top: 10px; font-size: 9pt; padding-bottom: 5px; }
          .signatures div { border-top: 1.5px solid black; padding-top: 4px; width: 45%; }
        </style>
      </head>
      <body>
        ${challanHtml}
      </body>
    </html>
  `);

  printWindow.document.close();

  // Wait for images (QR codes) to load before printing
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 1000);
};
