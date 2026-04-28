import React from 'react';
import { Invoice } from '@/types';
import { calculateGST } from '@/lib/gst-calculator';
import { numberToIndianWords } from '@/lib/number-to-words';
import { format } from 'date-fns';

interface GSTInvoiceTemplateProps {
    invoice: Invoice;
    sellerDetails: {
        companyName: string;
        ownerName?: string;
        address: string;
        gstin: string;
        phone: string;
        email: string;
        state: string;
    };
    buyerDetails: {
        customerName: string;
        address: string;
        gstin?: string;
        state: string;
    };
    isReverseCharge?: boolean;
}

export const GSTInvoiceTemplate = React.forwardRef<HTMLDivElement, GSTInvoiceTemplateProps>(
    ({ invoice, sellerDetails, buyerDetails, isReverseCharge = false }, ref) => {

        // Setup constants for tax sums
        let totalCGST = 0;
        let totalSGST = 0;
        let totalIGST = 0;
        let totalTaxable = 0;

        return (
            <div ref={ref} className="bg-white text-black p-8 max-w-[900px] mx-auto min-h-[1056px] text-sm" style={{ fontFamily: 'Arial, sans-serif' }}>
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold tracking-wider">TAX INVOICE</h1>
                </div>

                {/* Header Section */}
                <div className="flex justify-between border-b pb-4 mb-4">
                    <div className="w-1/2 pr-4">
                        <p className="text-xs font-semibold text-gray-500 mb-1">Details of Supplier (Seller)</p>
                        <h2 className="font-bold text-lg">{sellerDetails.companyName}</h2>
                        {sellerDetails.ownerName && <p><strong>Owner:</strong> {sellerDetails.ownerName}</p>}
                        <p>{sellerDetails.address}</p>
                        <p><strong>GSTIN:</strong> {sellerDetails.gstin}</p>
                        <p><strong>State:</strong> {sellerDetails.state}</p>
                        <p><strong>Email:</strong> {sellerDetails.email}</p>
                        <p><strong>Phone:</strong> {sellerDetails.phone}</p>
                    </div>
                    <div className="w-1/2 pl-4 border-l">
                        <p className="text-xs font-semibold text-gray-500 mb-1">Details of Receiver (Buyer)</p>
                        <h2 className="font-bold text-lg">{buyerDetails.customerName}</h2>
                        <p>{buyerDetails.address}</p>
                        {buyerDetails.gstin && <p><strong>GSTIN:</strong> {buyerDetails.gstin}</p>}
                        <p><strong>State:</strong> {buyerDetails.state}</p>
                    </div>
                </div>

                {/* Invoice Meta */}
                <div className="grid grid-cols-2 gap-4 border-b pb-4 mb-4">
                    <div>
                        <p><strong>Invoice No:</strong> {invoice.invoiceNumber}</p>
                        <p><strong>Invoice Date:</strong> {format(new Date(invoice.issueDate), 'dd-MMM-yyyy')}</p>
                        <p><strong>Due Date:</strong> {format(new Date(invoice.dueDate), 'dd-MMM-yyyy')}</p>
                    </div>
                    <div>
                        <p><strong>Place of Supply:</strong> {buyerDetails.state}</p>
                        <p><strong>Reverse Charge:</strong> {isReverseCharge ? 'Yes' : 'No'}</p>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-6">
                    <table className="w-full border-collapse border border-gray-300 text-xs">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">#</th>
                                <th className="border p-2">Description</th>
                                <th className="border p-2">HSN/SAC</th>
                                <th className="border p-2">Qty</th>
                                <th className="border p-2">Rate</th>
                                <th className="border p-2">Taxable Value</th>
                                <th className="border p-2">CGST Amount</th>
                                <th className="border p-2">SGST Amount</th>
                                <th className="border p-2">IGST Amount</th>
                                <th className="border p-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, index) => {
                                // Assume standard 18% GST if not provided for generic demo items
                                const gstRate = 18;
                                const amount = item.amount;
                                const gst = calculateGST(amount, gstRate, sellerDetails.state, buyerDetails.state);

                                totalTaxable += amount;
                                totalCGST += gst.cgst;
                                totalSGST += gst.sgst;
                                totalIGST += gst.igst;

                                const lineTotal = amount + gst.cgst + gst.sgst + gst.igst;

                                return (
                                    <tr key={item.id}>
                                        <td className="border p-2 text-center">{index + 1}</td>
                                        <td className="border p-2">{item.description}</td>
                                        <td className="border p-2 text-center">{item.hsnSac || '9983'}</td>
                                        <td className="border p-2 text-center">{item.quantity}</td>
                                        <td className="border p-2 text-right">₹{item.unitPrice.toFixed(2)}</td>
                                        <td className="border p-2 text-right">₹{amount.toFixed(2)}</td>
                                        <td className="border p-2 text-right">{gst.cgst > 0 ? `₹${gst.cgst.toFixed(2)}` : '-'}</td>
                                        <td className="border p-2 text-right">{gst.sgst > 0 ? `₹${gst.sgst.toFixed(2)}` : '-'}</td>
                                        <td className="border p-2 text-right">{gst.igst > 0 ? `₹${gst.igst.toFixed(2)}` : '-'}</td>
                                        <td className="border p-2 text-right">₹{lineTotal.toFixed(2)}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                        <tfoot>
                            <tr className="font-bold bg-gray-50">
                                <td colSpan={5} className="border p-2 text-right">Total</td>
                                <td className="border p-2 text-right">₹{totalTaxable.toFixed(2)}</td>
                                <td className="border p-2 text-right">₹{totalCGST.toFixed(2)}</td>
                                <td className="border p-2 text-right">₹{totalSGST.toFixed(2)}</td>
                                <td className="border p-2 text-right">₹{totalIGST.toFixed(2)}</td>
                                <td className="border p-2 text-right">₹{(totalTaxable + totalCGST + totalSGST + totalIGST).toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Amount in Words */}
                <div className="border border-gray-300 p-3 mb-6 bg-gray-50">
                    <p><strong>Total Invoice Amount in Words:</strong> {numberToIndianWords(Math.round(totalTaxable + totalCGST + totalSGST + totalIGST))}</p>
                </div>

                {/* Footer terms */}
                <div className="flex justify-between mt-[100px] border-t pt-4">
                    <div className="w-1/2 text-xs text-gray-600">
                        <p className="font-bold mb-1">Bank Details:</p>
                        <p>Account Name: {sellerDetails.companyName}</p>
                        <p>Account No: 1234567890123</p>
                        <p>IFSC: HDFC0001234</p>
                    </div>
                    <div className="w-1/2 text-right">
                        <div className="mb-12">
                            <p className="font-bold">For {sellerDetails.companyName}</p>
                        </div>
                        <p className="text-xs text-gray-500">Authorized Signatory</p>
                    </div>
                </div>
            </div>
        );
    }
);

GSTInvoiceTemplate.displayName = 'GSTInvoiceTemplate';
