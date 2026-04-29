import React from 'react';
import { PortalLayout } from '@/components/portal/portal-layout';
import { MySubscriptions } from '@/components/portal/my-subscriptions';

export default function SubscriptionsPage({ params }: { params: { orgSlug: string } }) {
    return (
        <PortalLayout orgSlug={params.orgSlug}>
            <MySubscriptions />
        </PortalLayout>
    );
}
