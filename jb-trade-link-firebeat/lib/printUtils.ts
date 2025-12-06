export const printContent = (title: string, contentId: string) => {
    const content = document.getElementById(contentId);
    if (!content) {
        console.error(`Element with id ${contentId} not found`);
        return;
    }

    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) {
        alert('Please allow popups to print');
        return;
    }

    printWindow.document.write('<html><head><title>' + title + '</title>');

    // Add styles
    printWindow.document.write(`
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
      h1 { text-align: center; margin-bottom: 20px; font-size: 24px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
      th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
      th { background-color: #f9fafb; font-weight: 600; text-transform: uppercase; font-size: 11px; color: #374151; }
      tr:nth-child(even) { background-color: #f9fafb; }
      
      /* Utility classes mapping */
      .text-right { text-align: right; }
      .text-center { text-align: center; }
      .font-bold { font-weight: bold; }
      .text-red-600, .text-red-700 { color: #dc2626; }
      .text-green-600, .text-green-400 { color: #16a34a; }
      .text-indigo-600, .text-indigo-900 { color: #4f46e5; }
      .bg-gray-50, .bg-gray-100 { background-color: #f9fafb; }
      .bg-indigo-50, .bg-indigo-100 { background-color: #eef2ff; }
      .uppercase { text-transform: uppercase; }
      .text-xs { font-size: 11px; }
      
      /* Hide elements that shouldn't print if any */
      .no-print { display: none; }
      
      /* Footer styles */
      tfoot { font-weight: bold; background-color: #f3f4f6; }
      tfoot td { border-top: 2px solid #d1d5db; }
    </style>
  `);

    printWindow.document.write('</head><body>');

    // Add Header with Date
    printWindow.document.write(`
    <div style="margin-bottom: 20px; text-align: center;">
      <h1>${title}</h1>
      <p style="font-size: 12px; color: #666;">Generated on: ${new Date().toLocaleString()}</p>
    </div>
  `);

    printWindow.document.write(content.innerHTML);
    printWindow.document.write('</body></html>');

    printWindow.document.close();

    // Wait for content to load before printing
    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        // printWindow.close(); // Optional: close after print
    }, 250);
};
