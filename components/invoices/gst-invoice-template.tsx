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
        // Pre-calculate formatted date to ensure visibility during PDF capture
        let formattedDate = 'N/A';
        try {
            const d = invoice.issueDate;
            if (d) {
                const dateObj = (d && typeof d.toDate === 'function') ? d.toDate() : new Date(d);
                formattedDate = format(dateObj, 'dd / MM / yyyy');
            }
        } catch (e) {
            formattedDate = 'N/A';
        }

        // Setup constants for tax sums
        let totalTaxable = 0;

        return (
            <div ref={ref} className="bg-white text-slate-600 min-h-[1056px] text-[11px] relative print:p-0 p-10 font-sans mx-auto" style={{ maxWidth: '800px' }}>
                {/* Header */}
                <div className="flex justify-between items-start mb-10 w-full">
                    <div className="flex-1">
                        <div className="mb-4">
                            <img 
                                src="/invoice-logo.png" 
                                alt="Company Logo" 
                                className="w-[80px] h-auto"
                            />
                        </div>
                        <h1 className="text-[16px] font-bold m-0 text-slate-800 leading-tight">CREATIVE <span className="font-normal">MEDIA</span></h1>
                        <p className="text-[8px] font-bold tracking-[1px] text-slate-400 mt-0.5 mb-4">YOUR COMPANY TAGLINE HERE</p>
                        <p className="text-[12px] m-0 font-bold text-slate-500">123, Anna Salai,</p>
                        <p className="text-[12px] m-0 font-bold text-slate-500">Chennai, Tamil Nadu,</p>
                        <p className="text-[12px] m-0 font-bold text-slate-500">600002</p>
                    </div>
                    <div className="flex-1 text-right pt-2">
                        <h2 className="text-[42px] font-bold m-0 mb-2 text-slate-700 tracking-[4px] leading-none uppercase">INVOICE</h2>
                        <div className="text-right space-y-1">
                            <div style={{ fontSize: '13px', fontWeight: '900', color: '#000000', textTransform: 'uppercase' }}>
                                INVOICE #: {invoice.invoiceNumber.replace('INV-', '')}
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: '900', color: '#000000', textTransform: 'uppercase' }}>
                                DATE: {formattedDate}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bill To */}
                <div className="mb-8">
                    <p className="text-[12px] font-bold text-slate-500 m-0 mb-1">Bill to:</p>
                    <p className="text-[14px] font-bold text-slate-600 m-0 mb-1 ml-4">{buyerDetails.customerName}</p>
                    <p className="text-[11px] font-bold text-slate-500 m-0 ml-4">45, MG Road,</p>
                    <p className="text-[11px] font-bold text-slate-500 m-0 ml-4">Bangalore, Karnataka,</p>
                    <p className="text-[11px] font-bold text-slate-500 m-0 ml-4">560001</p>
                </div>

                {/* Main Table */}
                <table className="w-full border-collapse text-[11px] border border-slate-300 text-slate-600">
                    <thead>
                        <tr className="bg-[#eaf0f4]">
                            <th className="p-2.5 px-4 text-left font-bold text-slate-500 border-b border-r border-slate-300">PRODUCT DESCRIPTION</th>
                            <th className="p-2.5 w-[80px] text-center font-bold text-slate-500 border-b border-r border-slate-300">PRICE</th>
                            <th className="p-2.5 w-[60px] text-center font-bold text-slate-500 border-b border-r border-slate-300">QTY</th>
                            <th className="p-2.5 w-[100px] text-left font-bold text-slate-500 border-b border-slate-300">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item: any, index: number) => {
                            const amount = item.amount;
                            totalTaxable += amount;
                            return (
                                <tr key={item.id}>
                                    <td className="p-4 font-bold border-r border-b border-slate-300">{item.description}</td>
                                    <td className="p-4 text-center font-bold border-r border-b border-slate-300">₹{item.unitPrice.toFixed(2)}</td>
                                    <td className="p-4 text-center font-bold border-r border-b border-slate-300">{item.quantity}</td>
                                    <td className="p-4 text-left font-bold border-b border-slate-300">₹{amount.toFixed(2)}</td>
                                </tr>
                            )
                        })}
                        {/* Empty rows filler */}
                        <tr>
                            <td className="p-4 border-r border-b border-slate-300 h-[38px]"></td>
                            <td className="p-4 border-r border-b border-slate-300"></td>
                            <td className="p-4 border-r border-b border-slate-300"></td>
                            <td className="p-4 border-b border-slate-300"></td>
                        </tr>
                        <tr>
                            <td className="p-4 border-r border-b border-slate-300 h-[38px]"></td>
                            <td className="p-4 border-r border-b border-slate-300"></td>
                            <td className="p-4 border-r border-b border-slate-300"></td>
                            <td className="p-4 border-b border-slate-300"></td>
                        </tr>
                        <tr>
                            <td className="p-4 border-r border-b border-slate-300 h-[38px]"></td>
                            <td className="p-4 border-r border-b border-slate-300"></td>
                            <td className="p-4 border-r border-b border-slate-300"></td>
                            <td className="p-4 border-b border-slate-300"></td>
                        </tr>
                    </tbody>
                </table>

                <table className="w-full border-collapse text-[11px] border border-t-0 border-slate-300 text-slate-600">
                    <tbody>
                        <tr>
                            <td colSpan={2} className="bg-[#eaf0f4] p-2.5 px-4 font-bold text-slate-500 border-b border-slate-300">Comments</td>
                        </tr>
                        <tr>
                            <td className="p-4 w-[60%] align-top">
                                <p className="m-0 mb-0.5 font-bold text-slate-500">Payment is due max 7 days after</p>
                                <p className="m-0 mb-0.5 font-bold text-slate-500">invoice without deduction.</p>
                                <p className="m-0 font-bold text-slate-500">Your bank and other details space here.</p>
                            </td>
                            <td className="p-4 align-top">
                                <table className="w-full text-[11px] font-bold text-slate-600 border-0">
                                    <tbody>
                                        <tr>
                                            <td className="py-1">Subtotal</td>
                                            <td className="py-1 text-left">₹{totalTaxable.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1">Discount</td>
                                            <td className="py-1 text-left">₹0.00</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1">Tax Rate</td>
                                            <td className="py-1 text-left">0.00%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr className="bg-[#eaf0f4]">
                            <td className="p-4 font-bold text-slate-500 uppercase">THANK YOU FOR YOUR BUSINESS</td>
                            <td className="p-4">
                                <table className="w-full text-[14px] font-bold text-slate-600">
                                    <tbody>
                                        <tr>
                                            <td className="text-left py-2 pr-5">TOTAL</td>
                                            <td className="text-left py-2">₹{totalTaxable.toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Signature */}
                <div className="absolute bottom-[50px] right-[50px] text-right">
                    <div className="w-[150px] border-b border-slate-600 inline-block mb-2"></div>
                    <p className="m-0 text-[10px] font-bold text-slate-600 pr-12">Signature</p>
                </div>
            </div>
        );
    }
);

GSTInvoiceTemplate.displayName = 'GSTInvoiceTemplate';
