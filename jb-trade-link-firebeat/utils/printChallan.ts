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
            @page { size: A5; margin: 0; }
            body { margin: 0; padding: 0; }
            .challan-page { page-break-after: always; page-break-inside: avoid; }
            .challan-page:last-child { page-break-after: auto; }
          }
          @media screen {
            body { background: #f0f0f0; padding: 20px; }
            .challan-page { margin-bottom: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          }
          body { font-family: Arial, sans-serif; font-size: 9pt; background: white; }
          .challan-page { 
            width: 100%; 
            height: 100%; 
            background: white; 
            padding: 0; 
            box-sizing: border-box;
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
          .qr-code-box { position: absolute; top: 5mm; right: 5mm; display: flex; flex-direction: column; align-items: center; }
          .qr-label { font-size: 7pt; text-align: center; display: block; margin-top: 2px; }
          
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
          .totals div { margin-bottom: 4px; }
          .grand-total { font-size: 11pt; font-weight: bold; margin-top: 4px; border-top: 1px solid #000; padding-top: 4px; }
          
          .signatures { display: flex; justify-content: space-between; margin-top: 10px; font-size: 9pt; padding-bottom: 5px; }
          .signatures div { border-top: 1.5px solid black; padding-top: 4px; width: 45%; }
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
              <div><strong>Phone:</strong> ${order.salespersonPhone || (order as any).salesperson_phone || 'N/A'}</div>
            </div>
            <div style="display: flex; gap: 20px;">
              <div><strong>Customer Name:</strong> ${order.customerName}</div>
              <div><strong>Phone:</strong> ${order.customerPhone || (order as any).customer_phone || customer?.phone || 'N/A'}</div>
            </div>
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
            ${(discountAmount > 0 || (order as any).totalDiscount > 0) ? `<div><strong>Bill Discount: Rs. ${(discountAmount || (order as any).totalDiscount || 0).toFixed(2)}</strong></div>` : ''}
            ${Math.abs(subtotal - (discountAmount || (order as any).totalDiscount || 0) - grandTotal) > 0.01 &&
        Math.abs(subtotal - (discountAmount || (order as any).totalDiscount || 0) - grandTotal) < 2
        ? `<div style="font-size: 8pt; color: #666;">Rounding: Rs. ${(grandTotal - (subtotal - (discountAmount || (order as any).totalDiscount || 0))).toFixed(2)}</div>`
        : ''}
            <div class="grand-total">Grand Total: Rs. ${grandTotal.toFixed(2)}</div>
          </div>
          <div class="signatures">
            <div>For J.B. Trade Link</div>
            <div>Customer Signature</div>
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
