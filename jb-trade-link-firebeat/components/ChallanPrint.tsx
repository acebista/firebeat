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

  // Generate QR code URL for Google Maps location
  const getQRCodeUrl = (location: string) => {
    const parts = location.split(',').map(p => p.trim());
    const lat = parts[0];
    const lng = parts[1];
    if (!lat || !lng) return undefined;
    const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(mapsUrl)}`;
  };

  const subtotal = order.items?.reduce((sum, item) => {
    const total = Number(item.total || item.amount) || 0;
    return sum + total;
  }, 0) || 0;
  const discountAmount = order.discount || 0;
  const discountPct = subtotal > 0 ? ((discountAmount / subtotal) * 100).toFixed(2) : '0';
  const grandTotal = order.totalAmount || 0;
  const qrCodeUrl = customerLocation ? getQRCodeUrl(customerLocation) : undefined;

  // Dimension styles based on orientation
  const pageStyle = currentOrientation === 'portrait' ? {
    width: '210mm',
    minHeight: '297mm',
  } : {
    width: '297mm',
    minHeight: '210mm',
  };

  const containerStyle = {
    ...pageStyle,
    padding: '15mm',
    fontFamily: 'Arial, sans-serif',
    fontSize: '11pt',
    backgroundColor: 'white',
    position: 'relative' as const,
    border: '3px solid black'
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
    top: '15mm',
    right: '15mm',
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
            style={{ width: '120px', height: '120px', border: '1px solid #ccc' }}
          />
          <small style={{ fontSize: '8pt', textAlign: 'center' }}>Customer Location</small>
        </div>
      )}

      {/* Header */}
      <div style={headerStyle}>
        <h1 style={{ margin: '0 0 5px 0', fontSize: '18pt', fontWeight: 'bold' }}>J.B Trade Link Pvt. Ltd.</h1>
        <h2 style={{ margin: '0 0 5px 0', fontSize: '14pt', fontWeight: 'normal' }}>Delivery Challan</h2>
        <p style={{ margin: '5px 0', fontSize: '10pt' }}>Phone: 9802379658</p>
        <p style={{ margin: '5px 0', fontSize: '10pt', fontWeight: 'bold' }}>Customer Copy</p>
      </div>

      {/* Invoice Details */}
      <div style={{ marginBottom: '15px', fontSize: '11pt' }}>
        <div style={{ marginBottom: '5px' }}>
          <strong>Invoice No:</strong> {order.id}
        </div>
        <div style={{ marginBottom: '5px' }}>
          <strong>Salesman:</strong> {order.salespersonName} &nbsp;&nbsp;&nbsp;
          <strong>Phone:</strong> {order.salespersonPhone || 'N/A'}
        </div>
        <div style={{ marginBottom: '5px' }}>
          <strong>Customer Name:</strong> {order.customerName} &nbsp;&nbsp;&nbsp;
          <strong>Phone:</strong> {order.customerPhone || 'N/A'}
        </div>
        <div style={{ marginBottom: '5px' }}>
          <strong>PAN Number:</strong> {order.customerPAN || 'N/A'}
        </div>
        <div style={{ marginBottom: '5px' }}>
          <strong>Payment Mode:</strong> {order.paymentMode || 'Cash'}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>Products Sold:</strong>
        </div>
      </div>

      {/* Products Table */}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px',
        fontSize: '10pt'
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
          {order.items?.map((item, index) => {
            // Handle both database field formats
            const qty = Number(item.qty || item.quantity) || 0;
            const rate = Number(item.rate || item.price) || 0;
            const total = Number(item.total || item.amount) || (qty * rate);
            const productName = item.productName || item.tempProductName || 'undefined';

            const itemDiscount = (item.discountPct || 0) > 0
              ? total * ((item.discountPct || 0) / 100)
              : 0;
            return (
              <tr key={index}>
                <td style={{ border: '1px solid black', padding: '6px', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ border: '1px solid black', padding: '6px' }}>{productName}</td>
                <td style={{ border: '1px solid black', padding: '6px', textAlign: 'center' }}>{qty}</td>
                <td style={{ border: '1px solid black', padding: '6px', textAlign: 'right' }}>{rate.toFixed(2)}</td>
                <td style={{ border: '1px solid black', padding: '6px', textAlign: 'right' }}>{total.toFixed(2)}</td>
                <td style={{ border: '1px solid black', padding: '6px', textAlign: 'right' }}>{itemDiscount.toFixed(2)}</td>
                <td style={{ border: '1px solid black', padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>
                  {(total - itemDiscount).toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ marginBottom: '30px', fontSize: '11pt' }}>
        <div style={{ marginBottom: '8px' }}>
          <strong>Sub Total: Rs. {subtotal.toFixed(2)}</strong>
        </div>
        {discountAmount > 0 && (
          <div style={{ marginBottom: '8px' }}>
            <strong>Discount ({discountPct}%): Rs. {discountAmount.toFixed(2)}</strong>
          </div>
        )}
        <div style={{ fontSize: '14pt', fontWeight: 'bold', marginTop: '10px' }}>
          Grand Total: Rs. {grandTotal.toFixed(2)}
        </div>
      </div>

      {/* Signatures */}
      <div style={{ marginTop: '50px', fontSize: '11pt' }}>
        <div style={{ marginBottom: '50px' }}>
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

  const subtotal = order.items?.reduce((sum, item) => {
    const total = Number(item.total || item.amount) || 0;
    return sum + total;
  }, 0) || 0;
  const discountAmount = order.discount || 0;
  const discountPct = subtotal > 0 ? ((discountAmount / subtotal) * 100).toFixed(2) : '0';
  const grandTotal = order.totalAmount || 0;

  const pageSize = orientation === 'portrait'
    ? { width: '210mm', height: '297mm' }
    : { width: '297mm', height: '210mm' };

  printWindow.document.write(`
    <html>
      <head>
        <title>Delivery Challan - ${order.id}</title>
        <style>
          @media print {
            @page { 
              size: ${orientation === 'portrait' ? 'A4 portrait' : 'A4 landscape'};
              margin: 0;
            }
            body { margin: 0; padding: 0; }
          }
          body { 
            font-family: Arial, sans-serif; 
            font-size: 12pt;
            margin: 0;
            padding: 0;
          }
          .container {
            width: ${pageSize.width};
            height: ${pageSize.height};
            padding: 15mm;
            border: 3px solid black;
            box-sizing: border-box;
            position: relative;
            page-break-after: always;
          }
          .header { text-align: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid black; }
          .header h1 { margin: 0; font-size: 18pt; font-weight: bold; }
          .header h2 { margin: 5px 0; font-size: 14pt; font-weight: normal; }
          .header p { margin: 5px 0; font-size: 10pt; }
          .qr-container { 
            position: absolute; 
            top: 15mm; 
            right: 15mm; 
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
          }
          .qr-container img { border: 1px solid #ccc; }
          .qr-label { font-size: 8pt; text-align: center; }
          .details { margin-bottom: 15px; font-size: 11pt; }
          .details div { margin-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 10pt; }
          th { border: 2px solid black; padding: 8px; background-color: #f0f0f0; text-align: left; }
          td { border: 1px solid black; padding: 6px; }
          th:nth-child(1) { width: 40px; text-align: center; }
          th:nth-child(3) { width: 80px; text-align: center; }
          th:nth-child(4) { width: 80px; text-align: right; }
          th:nth-child(5) { width: 100px; text-align: right; }
          th:nth-child(6) { width: 80px; text-align: right; }
          th:nth-child(7) { width: 100px; text-align: right; }
          .totals { margin-bottom: 20px; font-size: 11pt; }
          .totals div { margin-bottom: 8px; }
          .grand-total { font-size: 14pt; font-weight: bold; margin-top: 10px; }
          .signatures { margin-top: 30px; font-size: 11pt; }
          .signatures div { margin-bottom: 40px; }
        </style>
      </head>
      <body>
        <div class="container">
          ${qrUrl ? `
            <div class="qr-container">
              <img src="${qrUrl}" alt="Location QR Code" style="width: 120px; height: 120px;" />
              <span class="qr-label">Customer Location</span>
            </div>
          ` : ''}

          <div class="header">
            <h1>J.B Trade Link Pvt. Ltd.</h1>
            <h2>Delivery Challan</h2>
            <p>Phone: 9802379658</p>
            <p style="font-weight: bold;">Customer Copy</p>
          </div>

          <div class="details">
            <div><strong>Invoice No:</strong> ${order.id}</div>
            <div><strong>Salesman:</strong> ${order.salespersonName} &nbsp;&nbsp;&nbsp; <strong>Phone:</strong> ${order.salespersonPhone || 'N/A'}</div>
            <div><strong>Customer Name:</strong> ${order.customerName} &nbsp;&nbsp;&nbsp; <strong>Phone:</strong> ${order.customerPhone || 'N/A'}</div>
            <div><strong>PAN Number:</strong> ${order.customerPAN || 'N/A'}</div>
            <div><strong>Payment Mode:</strong> ${order.paymentMode || 'Cash'}</div>
            <div><strong>Products Sold:</strong></div>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>SubTotal</th>
                <th>Disc</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items?.map((item, index) => {
    const qty = Number(item.qty || item.quantity) || 0;
    const rate = Number(item.rate || item.price) || 0;
    const total = Number(item.total || item.amount) || (qty * rate);
    const productName = item.productName || item.tempProductName || 'undefined';
    const itemDiscount = (item.discountPct || 0) > 0
      ? total * ((item.discountPct || 0) / 100)
      : 0;
    return `
                    <tr>
                      <td style="text-align: center;">${index + 1}</td>
                      <td>${productName}</td>
                      <td style="text-align: center;">${qty}</td>
                      <td style="text-align: right;">${rate.toFixed(2)}</td>
                      <td style="text-align: right;">${total.toFixed(2)}</td>
                      <td style="text-align: right;">${itemDiscount.toFixed(2)}</td>
                      <td style="text-align: right; font-weight: bold;">${(total - itemDiscount).toFixed(2)}</td>
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
            <div>For J.B. Trade Link: _______________________</div>
            <div>Customer Signature: _______________________</div>
          </div>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();

  // Wait for images (QR code) to load before printing
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 500);
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
    ? { width: '210mm', height: '297mm' }
    : { width: '297mm', height: '210mm' };

  const challanHtml = orders.map(order => {
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

    const subtotal = order.items?.reduce((sum, item) => {
      const total = Number(item.total || item.amount) || 0;
      return sum + total;
    }, 0) || 0;
    const discountAmount = order.discount || 0;
    const discountPct = subtotal > 0 ? ((discountAmount / subtotal) * 100).toFixed(2) : '0';
    const grandTotal = order.totalAmount || 0;

    return `
          <div class="challan-page">
            <div class="container">
              ${qrUrl ? `
                <div class="qr-container">
                  <img src="${qrUrl}" alt="Location QR Code" />
                  <span class="qr-label">Customer Location</span>
                </div>
              ` : ''}

              <div class="header">
                <h1>J.B Trade Link Pvt. Ltd.</h1>
                <h2>Delivery Challan</h2>
                <p>Phone: 9802379658</p>
                <p style="font-weight: bold;">Customer Copy</p>
              </div>

              <div class="details">
                <div><strong>Invoice No:</strong> ${order.id}</div>
                <div><strong>Salesman:</strong> ${order.salespersonName} &nbsp;&nbsp;&nbsp; <strong>Phone:</strong> ${order.salespersonPhone || 'N/A'}</div>
                <div><strong>Customer Name:</strong> ${order.customerName} &nbsp;&nbsp;&nbsp; <strong>Phone:</strong> ${order.customerPhone || 'N/A'}</div>
                <div><strong>PAN Number:</strong> ${order.customerPAN || 'N/A'}</div>
                <div><strong>Payment Mode:</strong> ${order.paymentMode || 'Cash'}</div>
                <div><strong>Products Sold:</strong></div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>SubTotal</th>
                    <th>Disc</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items?.map((item, index) => {
      const qty = Number(item.qty || item.quantity) || 0;
      const rate = Number(item.rate || item.price) || 0;
      const total = Number(item.total || item.amount) || (qty * rate);
      const productName = item.productName || item.tempProductName || 'undefined';
      const itemDiscount = (item.discountPct || 0) > 0
        ? total * ((item.discountPct || 0) / 100)
        : 0;
      return `
                    <tr>
                      <td style="text-align: center;">${index + 1}</td>
                      <td>${productName}</td>
                      <td style="text-align: center;">${qty}</td>
                      <td style="text-align: right;">${rate.toFixed(2)}</td>
                      <td style="text-align: right;">${total.toFixed(2)}</td>
                      <td style="text-align: right;">${itemDiscount.toFixed(2)}</td>
                      <td style="text-align: right; font-weight: bold;">${(total - itemDiscount).toFixed(2)}</td>
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
                <div>For J.B. Trade Link: _______________________</div>
                <div>Customer Signature: _______________________</div>
              </div>
            </div>
          </div>
        `;
  }).join('');

  printWindow.document.write(`
    <html>
      <head>
        <title>Delivery Challans - Batch Print</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          @media print {
            @page { 
              size: ${orientation === 'portrait' ? 'A4 portrait' : 'A4 landscape'};
              margin: 0;
            }
            body { 
              margin: 0;
              padding: 0;
            }
            .challan-page {
              page-break-after: always;
              page-break-inside: avoid;
            }
            .challan-page:last-child {
              page-break-after: auto;
            }
          }
          
          @media screen {
            body {
              background: #f0f0f0;
              padding: 20px;
            }
            .challan-page {
              margin-bottom: 20px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
          }
          
          body {
            font-family: Arial, sans-serif;
            font-size: 12pt;
          }
          
          .challan-page {
            background: white;
          }
          
          .container {
            width: ${pageSize.width};
            height: ${pageSize.height};
            padding: 15mm;
            border: 3px solid black;
            position: relative;
          }
          
          .header { 
            text-align: center; 
            margin-bottom: 15px; 
            padding-bottom: 10px; 
            border-bottom: 2px solid black; 
          }
          .header h1 { margin: 0; font-size: 18pt; font-weight: bold; }
          .header h2 { margin: 5px 0; font-size: 14pt; font-weight: normal; }
          .header p { margin: 5px 0; font-size: 10pt; }
          
          .qr-container { 
            position: absolute; 
            top: 15mm; 
            right: 15mm; 
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
          }
          .qr-container img { 
            width: 120px; 
            height: 120px; 
            border: 1px solid #ccc; 
          }
          .qr-label { font-size: 8pt; text-align: center; }
          
          .details { margin-bottom: 15px; font-size: 11pt; }
          .details div { margin-bottom: 5px; }
          
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 10pt; }
          th { border: 2px solid black; padding: 8px; background-color: #f0f0f0; text-align: left; }
          td { border: 1px solid black; padding: 6px; }
          
          th:nth-child(1) { width: 40px; text-align: center; }
          th:nth-child(3) { width: 80px; text-align: center; }
          th:nth-child(4) { width: 80px; text-align: right; }
          th:nth-child(5) { width: 100px; text-align: right; }
          th:nth-child(6) { width: 80px; text-align: right; }
          th:nth-child(7) { width: 100px; text-align: right; }
          
          .totals { margin-bottom: 20px; font-size: 11pt; }
          .totals div { margin-bottom: 8px; }
          .grand-total { font-size: 14pt; font-weight: bold; margin-top: 10px; }
          
          .signatures { margin-top: 30px; font-size: 11pt; }
          .signatures div { margin-bottom: 40px; }
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
