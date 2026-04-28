export const downloadInvoicePdf = async (invoice: any, sellerDetails?: any) => {
    // Dynamic import to only load in browser
    const html2pdf = (await import('html2pdf.js')).default;

    const element = document.createElement('div');
    element.innerHTML = `
        <div style="font-family: 'Open Sans', Arial, sans-serif; color: #475569; max-width: 800px; margin: auto; background: white; padding: 40px;">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;">
                <div style="flex: 1;">
                    <div style="margin-bottom: 15px;">
                        <img src="/invoice-logo.png" alt="Logo" style="width: 80px; height: auto;" />
                    </div>
                    <h1 style="font-size: 16px; font-weight: bold; margin: 0; color: #334155; line-height: 1.2; text-transform: uppercase;">${sellerDetails?.businessName || 'MY BUSINESS'}</h1>
                    <p style="font-size: 8px; font-weight: bold; letter-spacing: 1px; color: #94a3b8; margin: 2px 0 15px 0; text-transform: uppercase;">GSTIN: ${sellerDetails?.gstNumber || '33AABCT9980F1Z0'}</p>
                    <div style="font-size: 12px; margin: 0; font-weight: bold; color: #64748b;">
                        ${sellerDetails?.address ? `<p style="margin: 0;">${sellerDetails.address}</p>` : '<p style="margin: 0;">123 Business Street, Hubli</p>'}
                        ${sellerDetails?.phone ? `<p style="margin: 0;">Phone: ${sellerDetails.phone}</p>` : ''}
                    </div>
                </div>
                <div style="flex: 1; text-align: right;">
                    <h2 style="font-size: 42px; font-weight: bold; margin: 0 0 15px 0; color: #475569; letter-spacing: 4px; line-height: 1;">INVOICE</h2>
                    <div style="text-align: right; margin-top: 10px;">
                        <div style="font-size: 13px; font-weight: 900; color: #000000; text-transform: uppercase; margin-bottom: 4px;">
                            INVOICE #: ${invoice.invoiceNumber.replace('INV-', '')}
                        </div>
                        <div style="font-size: 13px; font-weight: 900; color: #000000; text-transform: uppercase;">
                            DATE: ${(() => {
                                try {
                                    const d = invoice.issueDate;
                                    if (!d) return 'N/A';
                                    const dateObj = (d && typeof d.toDate === 'function') ? d.toDate() : new Date(d);
                                    return dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, ' / ');
                                } catch (e) {
                                    return 'N/A';
                                }
                            })()}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bill To -->
            <div style="margin-bottom: 30px;">
                <p style="font-size: 12px; font-weight: bold; color: #64748b; margin: 0 0 4px 0;">Bill to:</p>
                <p style="font-size: 14px; font-weight: bold; color: #475569; margin: 0 0 4px 15px;">${invoice.customerName || 'Value Customer'}</p>
                <div style="font-size: 11px; font-weight: bold; color: #64748b; margin: 0 0 0 15px;">
                    ${invoice.customerAddress ? `<p style="margin: 0;">${invoice.customerAddress}</p>` : ''}
                    ${invoice.customerState ? `<p style="margin: 0;">${invoice.customerState}</p>` : ''}
                    ${invoice.customerGstin ? `<p style="margin: 0; margin-top: 4px;">GSTIN: ${invoice.customerGstin}</p>` : ''}
                </div>
            </div>

            <!-- Main Table -->
            <table style="width: 100%; border-collapse: collapse; font-size: 11px; border: 1px solid #cbd5e1; color: #475569;">
                <thead>
                    <tr style="background-color: #eaf0f4;">
                        <th style="padding: 10px 15px; text-align: left; font-weight: bold; color: #64748b; border-bottom: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1;">PRODUCT DESCRIPTION</th>
                        <th style="padding: 10px; width: 80px; text-align: center; font-weight: bold; color: #64748b; border-bottom: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1;">PRICE</th>
                        <th style="padding: 10px; width: 60px; text-align: center; font-weight: bold; color: #64748b; border-bottom: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1;">QTY</th>
                        <th style="padding: 10px; width: 100px; text-align: left; font-weight: bold; color: #64748b; border-bottom: 1px solid #cbd5e1;">TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    ${(invoice.items || []).map((item: any) => `
                        <tr>
                            <td style="padding: 15px; font-weight: bold; border-right: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1;">${item.description}</td>
                            <td style="padding: 15px; text-align: center; font-weight: bold; border-right: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1;">₹${Number(item.unitPrice).toFixed(2)}</td>
                            <td style="padding: 15px; text-align: center; font-weight: bold; border-right: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1;">${item.quantity}</td>
                            <td style="padding: 15px; text-align: left; font-weight: bold; border-bottom: 1px solid #cbd5e1;">₹${(Number(item.unitPrice) * Number(item.quantity)).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                    <!-- Empty rows to fill space if needed -->
                    ${Array(Math.max(0, 3 - (invoice.items?.length || 0))).fill(0).map(() => `
                        <tr>
                            <td style="padding: 15px; border-right: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1; height: 18px;"></td>
                            <td style="padding: 15px; border-right: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1;"></td>
                            <td style="padding: 15px; border-right: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1;"></td>
                            <td style="padding: 15px; border-bottom: 1px solid #cbd5e1;"></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <table style="width: 100%; border-collapse: collapse; font-size: 11px; border: 1px solid #cbd5e1; border-top: none; color: #475569;">
                <tr>
                    <td colspan="2" style="background-color: #eaf0f4; padding: 10px 15px; font-weight: bold; color: #64748b; border-bottom: 1px solid #cbd5e1;">Comments</td>
                </tr>
                <tr>
                    <td style="padding: 15px; width: 60%; vertical-align: top;">
                        <p style="margin: 0 0 2px 0; font-weight: bold; color: #64748b;">Payment is due max 15 days after</p>
                        <p style="margin: 0 0 2px 0; font-weight: bold; color: #64748b;">invoice without deduction.</p>
                        <p style="margin: 0; font-weight: bold; color: #64748b;">Thank you for your business!</p>
                    </td>
                    <td style="padding: 15px; vertical-align: top;">
                        <table style="width: 100%; font-size: 11px; font-weight: bold; color: #475569;">
                            <tr>
                                <td style="padding: 4px 0;">Subtotal</td>
                                <td style="padding: 4px 0; text-align: left;">₹${Number(invoice.subtotal).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 4px 0;">GST (${invoice.gstDetails?.rate || 18}%)</td>
                                <td style="padding: 4px 0; text-align: left;">₹${Number(invoice.taxAmount).toFixed(2)}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr style="background-color: #eaf0f4;">
                    <td style="padding: 15px; font-weight: bold; color: #64748b; text-transform: uppercase;">THANK YOU FOR YOUR BUSINESS</td>
                    <td style="padding: 15px;">
                        <table style="width: 100%; font-size: 14px; font-weight: bold; color: #475569;">
                            <tr>
                                 <td style="text-align: left; padding-right: 20px;">TOTAL</td>
                                 <td style="text-align: left;">₹${Number(invoice.totalAmount).toFixed(2)}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <!-- Signature -->
            <div style="margin-top: 50px; text-align: right; margin-right: 30px;">
                <div style="width: 150px; border-bottom: 1px solid #475569; display: inline-block; margin-bottom: 8px;"></div>
                <p style="margin: 0; font-size: 10px; font-weight: bold; color: #475569; padding-right: 48px;">Authorized Signatory</p>
            </div>
        </div>
    `;

    const opt: any = {
        margin: 10,
        filename: `${invoice.invoiceNumber || 'invoice'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            useCORS: true,
            logging: false,
            letterRendering: true
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
        console.log("Starting PDF generation for:", invoice.invoiceNumber);
        const worker = html2pdf().set(opt).from(element);
        const result = await worker.save();
        console.log("PDF generation success");
        return result;
    } catch (error) {
        console.error("PDF Generation Error:", error);
        throw error;
    }
};
