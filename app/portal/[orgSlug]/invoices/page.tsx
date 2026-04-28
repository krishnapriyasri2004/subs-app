import React from 'react';
import { PortalLayout } from '@/components/portal/portal-layout';
import { MyInvoices } from '@/components/portal/my-invoices';

export default function InvoicesPage({ params }: { params: { orgSlug: string } }) {
    return (
        <PortalLayout orgSlug={params.orgSlug}>
            <MyInvoices orgSlug={params.orgSlug} />
        </PortalLayout>
    );
}
