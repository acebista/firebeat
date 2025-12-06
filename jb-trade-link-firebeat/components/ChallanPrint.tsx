import React from 'react';
import { Order } from '../types';
import toast from 'react-hot-toast';

interface ChallanPrintProps {
    order: Order;
    customerLocation?: string; // lat,long format
}

export const ChallanPrint: React.FC<ChallanPrintProps> = ({ order, customerLocation }) => {
    // Generate QR code URL for Google Maps location
    const getQRCodeUrl = (location: string) => {
        const [lat, lng] = location.split(',');
        const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
        // Using QR code API
        return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(mapsUrl)}`;
    };

    const subtotal = order.items?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;
    const discountAmount = order.discount || 0;
    const discountPct = subtotal > 0 ? ((discountAmount / subtotal) * 100).toFixed(2) : '0';
    const grandTotal = order.totalAmount || 0;

    return (
        <div style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '15mm',
            fontFamily: 'Arial, sans-serif',
            fontSize: '12pt',
            backgroundColor: 'white',
            position: 'relative',
            border: '3px solid black'
        }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '20px', position: 'relative' }}>
                <h1 style={{ margin: 0, fontSize: '24pt', fontWeight: 'bold' }}>J.B Trade Link Pvt. Ltd.</h1>
                <h2 style={{ margin: '5px 0', fontSize: '16pt', fontWeight: 'normal' }}>Delivery Challan</h2>
                <p style={{ margin: '5px 0', fontSize: '11pt' }}>Phone: 9802379658</p>
                <p style={{ margin: '5px 0', fontSize: '12pt', fontWeight: 'bold' }}>Customer Copy</p>

                {/* QR Code - Top Right */}
                {customerLocation && (
                    <div style={{ position: 'absolute', top: 0, right: 0 }}>
                        <img
                            src={getQRCodeUrl(customerLocation)}
                            alt="Location QR"
                            style={{ width: '120px', height: '120px' }}
                        />
                    </div>
                )}
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
                        const itemDiscount = (item.discountPct || 0) > 0
                            ? (item.total || 0) * ((item.discountPct || 0) / 100)
                            : 0;
                        return (
                            <tr key={index}>
                                <td style={{ border: '1px solid black', padding: '6px', textAlign: 'center' }}>{index + 1}</td>
                                <td style={{ border: '1px solid black', padding: '6px' }}>{item.productName}</td>
                                <td style={{ border: '1px solid black', padding: '6px', textAlign: 'center' }}>{item.qty}</td>
                                <td style={{ border: '1px solid black', padding: '6px', textAlign: 'right' }}>{(item.rate || 0).toFixed(2)}</td>
                                <td style={{ border: '1px solid black', padding: '6px', textAlign: 'right' }}>{(item.total || 0).toFixed(2)}</td>
                                <td style={{ border: '1px solid black', padding: '6px', textAlign: 'right' }}>{itemDiscount.toFixed(2)}</td>
                                <td style={{ border: '1px solid black', padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>
                                    {((item.total || 0) - itemDiscount).toFixed(2)}
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
export const printChallan = (order: Order, customerLocation?: string) => {
    const printWindow = window.open('', '', 'height=800,width=600');
    if (!printWindow) {
        toast.error('Please allow popups to print');
        return;
    }

    const qrUrl = customerLocation
        ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://www.google.com/maps?q=${customerLocation}`)}`
        : '';

    const subtotal = order.items?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;
    const discountAmount = order.discount || 0;
    const discountPct = subtotal > 0 ? ((discountAmount / subtotal) * 100).toFixed(2) : '0';
    const grandTotal = order.totalAmount || 0;

    printWindow.document.write(`
    <html>
      <head>
        <title>Delivery Challan - ${order.id}</title>
        <style>
          @media print {
            @page { margin: 0; }
            body { margin: 15mm; }
          }
          body { 
            font-family: Arial, sans-serif; 
            font-size: 12pt;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 210mm;
            min-height: 297mm;
            padding: 15mm;
            border: 3px solid black;
            box-sizing: border-box;
          }
          .header { text-align: center; margin-bottom: 20px; position: relative; }
          .header h1 { margin: 0; font-size: 24pt; font-weight: bold; }
          .header h2 { margin: 5px 0; font-size: 16pt; font-weight: normal; }
          .header p { margin: 5px 0; font-size: 11pt; }
          .qr-code { position: absolute; top: 0; right: 0; }
          .details { margin-bottom: 15px; font-size: 11pt; }
          .details div { margin-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 10pt; }
          th { border: 2px solid black; padding: 8px; background-color: #f0f0f0; }
          td { border: 1px solid black; padding: 6px; }
          .totals { margin-bottom: 30px; font-size: 11pt; }
          .totals div { margin-bottom: 8px; }
          .grand-total { font-size: 14pt; font-weight: bold; margin-top: 10px; }
          .signatures { margin-top: 50px; font-size: 11pt; }
          .signatures div { margin-bottom: 50px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>J.B Trade Link Pvt. Ltd.</h1>
            <h2>Delivery Challan</h2>
            <p>Phone: 9802379658</p>
            <p style="font-weight: bold;">Customer Copy</p>
            ${qrUrl ? `<div class="qr-code"><img src="${qrUrl}" alt="Location QR" width="120" height="120" /></div>` : ''}
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
                <th style="width: 40px; text-align: center;">#</th>
                <th style="text-align: left;">Product</th>
                <th style="width: 80px; text-align: center;">Qty</th>
                <th style="width: 80px; text-align: right;">Rate</th>
                <th style="width: 100px; text-align: right;">SubTotal</th>
                <th style="width: 80px; text-align: right;">Disc</th>
                <th style="width: 100px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items?.map((item, index) => {
        const itemDiscount = (item.discountPct || 0) > 0
            ? (item.total || 0) * ((item.discountPct || 0) / 100)
            : 0;
        return `
                  <tr>
                    <td style="text-align: center;">${index + 1}</td>
                    <td>${item.productName}</td>
                    <td style="text-align: center;">${item.qty}</td>
                    <td style="text-align: right;">${(item.rate || 0).toFixed(2)}</td>
                    <td style="text-align: right;">${(item.total || 0).toFixed(2)}</td>
                    <td style="text-align: right;">${itemDiscount.toFixed(2)}</td>
                    <td style="text-align: right; font-weight: bold;">${((item.total || 0) - itemDiscount).toFixed(2)}</td>
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
