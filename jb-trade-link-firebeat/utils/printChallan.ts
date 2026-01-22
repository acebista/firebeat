import { Order, Product, Customer } from '../types';

export const printChallanV2 = (order: Order, products: Product[], customer?: Customer) => {
  const printWindow = window.open('', '', 'height=800,width=600');
  if (!printWindow) {
    alert('Please allow popups to print');
    return;
  }

  const customerLocation = customer?.locationText;
  const qrUrl = customerLocation
    ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://www.google.com/maps?q=${customerLocation}`)}`
    : '';

  const orderItems = Array.isArray(order.items) ? order.items : (typeof order.items === 'string' ? JSON.parse(order.items) : []);

  const subtotal = orderItems?.reduce((sum: number, item: any) => sum + (item.total || 0), 0) || 0;
  const discountAmount = order.discount || 0;
  const discountPct = subtotal > 0 ? ((discountAmount / subtotal) * 100).toFixed(2) : '0';
  const grandTotal = order.totalAmount || 0;
  const paymentMethod = (order as any).paymentMethod || (order as any).paymentMode || 'Cash';

  const copies = (paymentMethod.toLowerCase() === 'cash' || paymentMethod.toLowerCase() === 'qr') ? ['Customer Copy'] : ['Original Copy', 'Duplicate Copy'];

  printWindow.document.write(`
    <html>
      <head>
        <title>Delivery Challan - ${order.id}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          @media print {
            @page { size: A4 portrait; margin: 0; }
            body { margin: 0; padding: 0; }
            .challan-page { page-break-after: always; page-break-inside: avoid; }
            .challan-page:last-child { page-break-after: auto; }
          }
          @media screen {
            body { background: #f0f0f0; padding: 20px; }
            .challan-page { margin-bottom: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          }
          body { font-family: Arial, sans-serif; font-size: 11pt; background: white; }
          .challan-page { 
            width: 210mm; 
            min-height: 297mm; 
            background: white; 
            padding: 10mm; 
          }
          .container {
            width: 100%;
            height: 100%;
            min-height: 257mm; /* 297mm - 40mm buffer */
            padding: 10mm;
            border: 3px solid black;
            position: relative;
            display: flex;
            flex-direction: column;
          }
          .header { text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid black; }
          .header h1 { margin: 0; font-size: 20pt; font-weight: bold; }
          .header h2 { margin: 5px 0; font-size: 14pt; font-weight: normal; }
          .header p { margin: 5px 0; font-size: 10pt; }
          .qr-code-box { position: absolute; top: 10mm; right: 10mm; display: flex; flex-direction: column; align-items: center; }
          .qr-label { font-size: 8pt; text-align: center; display: block; margin-top: 4px; }
          
          .details { margin-bottom: 20px; font-size: 11pt; }
          .details div { margin-bottom: 6px; }
          
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 10pt; table-layout: auto; }
          th, td { border: 1px solid black; padding: 8px 6px; line-height: 1.2; vertical-align: top; }
          th { border-width: 2px; background-color: #f2f2f2; font-weight: bold; text-transform: uppercase; font-size: 9pt; }
          
          /* Smart Column Distribution */
          .col-hash { width: 1%; white-space: nowrap; text-align: center; }
          .col-product { width: auto; text-align: left; }
          .col-qty { width: 1%; white-space: nowrap; text-align: center; }
          .col-rate { width: 1%; white-space: nowrap; text-align: right; }
          .col-subtotal { width: 1%; white-space: nowrap; text-align: right; }
          .col-disc { width: 1%; white-space: nowrap; text-align: right; }
          .col-total { width: 1%; white-space: nowrap; text-align: right; font-weight: bold; }
          
          .totals { margin-top: auto; margin-bottom: 30px; font-size: 11pt; }
          .totals div { margin-bottom: 8px; }
          .grand-total { font-size: 16pt; font-weight: bold; margin-top: 10px; border-top: 1px solid #ddd; padding-top: 10px; }
          
          .signatures { display: flex; justify-content: space-between; margin-top: 20px; font-size: 11pt; padding-bottom: 20px; }
          .signatures div { border-top: 1px solid black; padding-top: 10px; width: 45%; }
        </style>
      </head>
      <body>
  `);

  copies.forEach((copyType) => {
    printWindow.document.write(`
      <div class="challan-page">
        <div class="container">
          <div class="header">
            <h1>J.B Trade Link Pvt. Ltd.</h1>
            <h2>Delivery Challan</h2>
            <p>Phone: 9802379658</p>
            <p style="font-weight: bold;">${copyType}</p>
            ${qrUrl ? `<div class="qr-code-box"><img src="${qrUrl}" alt="Location QR" width="120" height="120" /><span class="qr-label">Customer Location</span></div>` : ''}
          </div>
          <div class="details">
            <div><strong>Invoice No:</strong> ${order.id}</div>
            <div style="display: flex; gap: 20px;">
              <div><strong>Salesman:</strong> ${order.salespersonName}</div>
            </div>
            <div><strong>Customer Name:</strong> ${order.customerName}</div>
            <div><strong>Payment Mode:</strong> ${paymentMethod}</div>
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
              ${(orderItems || []).map((item: any, idx: number) => {
      const qty = item.qty || item.quantity || 0;
      const netRate = item.rate || item.price || 0;
      const baseRate = item.baseRate || netRate;

      const subtotalAtBase = baseRate * qty;
      const finalTotal = item.total || item.amount || (qty * netRate);
      const itemDiscountAmount = Math.max(0, subtotalAtBase - finalTotal);

      return `
                  <tr>
                    <td class="col-hash">${idx + 1}</td>
                    <td class="col-product">${item.productName || item.tempProductName || 'Unknown Product'}</td>
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
            <div>For J.B. Trade Link: _______________________</div>
            <div>Customer Signature: _______________________</div>
          </div>
        </div>
      </div>
    `);
  });

  printWindow.document.write(`</body></html>`);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 1000);
};
