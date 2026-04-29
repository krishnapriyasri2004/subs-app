'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GSTInvoiceTemplate } from '@/components/invoices/gst-invoice-template';
import { useVendorAuth } from '@/lib/vendor-auth';
import { mockCustomerInvoices, mockInvoices } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { Invoice } from '@/types';

// Use dynamic import so html2pdf doesn't crash SSR
import dynamic from 'next/dynamic';

export default function InvoiceDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const { user } = useVendorAuth();
    const printRef = useRef<HTMLDivElement>(null);

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        // Find invoice across mocked datasets and local storage
        const localInvoicesJson = localStorage.getItem('vendor_invoices');
        const localInvoices = localInvoicesJson ? JSON.parse(localInvoicesJson) : [];

        const allInvoices: any[] = [...mockInvoices, ...mockCustomerInvoices, ...localInvoices];
        const found = allInvoices.find(inv => inv.id === id);

        // Basic security check to ensure this invoice belongs to the tenant
        if (found && (found.tenantId === user?.tenantId || !found.tenantId)) {
            setInvoice(found);
        } else {
            // Un-authorized or missing
            setInvoice(null);
        }
    }, [id, user]);

    const handleDownloadPDF = async () => {
        if (!printRef.current || !invoice) return;

        try {
            setIsGenerating(true);
            const html2pdf = (await import('html2pdf.js')).default;

            const element = printRef.current;
            const opt = {
                margin: 0.5,
                filename: `${invoice.invoiceNumber}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' as const }
            };

            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error('Failed to generate PDF:', error);
            alert('Failed to generate PDF. Check console for details.');
        } finally {
            setIsGenerating(false);
        }
    };

    if (!user) return null; // Wait for auth layout wrapper
    if (!invoice) return (
        <div className="flex flex-col items-center justify-center h-64">
            <h2 className="text-xl font-bold">Invoice Not Found</h2>
            <p className="text-muted-foreground mt-2">This invoice either does not exist or you do not have permission to view it.</p>
            <Button className="mt-4" onClick={() => router.push('/vendor/invoices')}>Return to Invoices</Button>
        </div>
    );

    // Dynamic Mock Seller depending on tenant auth
    const sellerDetails = {
        companyName: user.businessName,
        ownerName: user.name,
        address: '123 Business Hub, 4th Floor',
        gstin: '33AABCT9980F1Z0',
        phone: user.phone || '+91 9999999999',
        email: user.email,
        state: 'Tamil Nadu' // Hardcoded state for math demo
    };

    // Customer
    const buyerDetails = {
        customerName: invoice.customerName || invoice.customerId || 'Cash Customer',
        address: invoice.billingAddress || '78 Buyer Street',
        gstin: invoice.companyGstin || '',
        state: 'Karnataka' // Inter-state math demo test
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto print:space-y-0 print:max-w-none">
            <div className="flex justify-between items-center pb-4 border-b print:hidden">
                <Button variant="ghost" onClick={() => router.push('/vendor/invoices')} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Invoices
                </Button>

                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => window.print()}>
                        <Printer className="h-4 w-4" />
                        Print
                    </Button>
                    <Button onClick={handleDownloadPDF} disabled={isGenerating} className="gap-2">
                        <Download className="h-4 w-4" />
                        {isGenerating ? 'Generating...' : 'Download PDF'}
                    </Button>
                </div>
            </div>

            <div className="bg-muted p-4 sm:p-8 rounded-lg overflow-auto flex justify-center shadow-inner print:p-0 print:bg-transparent print:shadow-none print:block print:overflow-visible">
                {/* The actual component we render and target for the PDF generation wrapper */}
                <div className="shadow-lg print:shadow-none">
                    <GSTInvoiceTemplate
                        ref={printRef}
                        invoice={invoice}
                        sellerDetails={sellerDetails}
                        buyerDetails={buyerDetails}
                    />
                </div>
            </div>
        </div>
    );
}