import { Order, Product, Customer } from '../types';

export const printChallanV2 = (order: Order, products: Product[], customer?: Customer) => {
    const printWindow = window.open('', '', 'height=800,width=600');
    if (!printWindow) {
        alert('Please allow popups to print');
        return;
    }

    const customerLocation = customer?.locationText;
    const qrUrl = customerLocation
        ? `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`https://www.google.com/maps?q=${customerLocation}`)}`
        : '';

    const subtotal = order.items?.reduce((sum: number, item: any) => sum + (item.total || 0), 0) || 0;
    const discountAmount = order.discount || 0;
    const discountPct = subtotal > 0 ? ((discountAmount / subtotal) * 100).toFixed(2) : '0';
    const grandTotal = order.totalAmount || 0;
    const paymentMethod = (order as any).paymentMethod || 'Cash';

    const copies = paymentMethod.toLowerCase() === 'cash' ? ['Customer Copy'] : ['Customer Copy', 'Vendor Copy'];

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
          body { font-family: Arial, sans-serif; font-size: 11pt; }
          .challan-page { width: 210mm; min-height: 297mm; max-height: 297mm; padding: 10mm; border: 2px solid black; background: white; position: relative; overflow: hidden; }
          .header { text-align: center; margin-bottom: 15px; position: relative; border-bottom: 2px solid black; padding-bottom: 10px; }
          .header h1 { margin: 0; font-size: 20pt; font-weight: bold; }
          .header h2 { margin: 3px 0; font-size: 14pt; font-weight: normal; }
          .header p { margin: 2px 0; font-size: 10pt; }
          .qr-code { position: absolute; top: 0; right: 0; }
          .details { margin-bottom: 12px; font-size: 10pt; }
          .details div { margin-bottom: 3px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 9pt; }
          th { border: 1.5px solid black; padding: 6px 4px; background-color: #e0e0e0; font-weight: bold; }
          td { border: 1px solid black; padding: 4px; }
          .totals { margin-bottom: 20px; font-size: 10pt; }
          .totals div { margin-bottom: 5px; }
          .grand-total { font-size: 13pt; font-weight: bold; margin-top: 8px; }
          .signatures { margin-top: 30px; font-size: 10pt; }
          .signatures div { margin-bottom: 40px; }
        </style>
      </head>
      <body>
  `);

    copies.forEach((copyType) => {
        printWindow.document.write(`
      <div class="challan-page">
        <div class="header">
          <h1>J.B Trade Link Pvt. Ltd.</h1>
          <h2>Delivery Challan</h2>
          <p>Phone: 9802379658</p>
          <p style="font-weight: bold;">${copyType}</p>
          ${qrUrl ? `<div class="qr-code"><img src="${qrUrl}" alt="Location QR" width="100" height="100" /></div>` : ''}
        </div>
        <div class="details">
          <div><strong>Invoice No:</strong> ${order.id}</div>
          <div><strong>Salesman:</strong> ${order.salespersonName}</div>
          <div><strong>Customer Name:</strong> ${order.customerName}</div>
          <div><strong>Payment Mode:</strong> ${paymentMethod}</div>
          <div><strong>Products Sold:</strong></div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 30px; text-align: center;">#</th>
              <th style="text-align: left;">Product</th>
              <th style="width: 50px; text-align: center;">Qty</th>
              <th style="width: 65px; text-align: right;">Rate</th>
              <th style="width: 75px; text-align: right;">SubTotal</th>
              <th style="width: 60px; text-align: right;">Disc</th>
              <th style="width: 75px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items?.map((item: any, idx: number) => {
            // Find product to get baseRate and discountedRate
            const product = products.find(p => p.id === item.productId);
            const baseRate = product?.baseRate || item.rate || 0;
            const actualRate = item.rate || 0;

            // Calculate values
            const qty = item.qty || 0;
            const subtotalAtBase = baseRate * qty;
            const actualTotal = item.total || 0;
            const discountPct = baseRate > 0 ? (((baseRate - actualRate) / baseRate) * 100) : 0;

            return `
                <tr>
                  <td style="text-align: center;">${idx + 1}</td>
                  <td>${item.productName}</td>
                  <td style="text-align: center;">${qty}</td>
                  <td style="text-align: right;">${baseRate.toFixed(2)}</td>
                  <td style="text-align: right;">${subtotalAtBase.toFixed(2)}</td>
                  <td style="text-align: right;">${discountPct.toFixed(2)}%</td>
                  <td style="text-align: right; font-weight: bold;">${actualTotal.toFixed(2)}</td>
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
    `);
    });

    printWindow.document.write(`</body></html>`);
    printWindow.document.close();

    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
    }, 1000);
};
