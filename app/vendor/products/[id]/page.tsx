import { Suspense } from 'react';
import { ProductDetail } from '@/components/products/product-detail';

export const metadata = {
    title: 'Product Details - Catalog',
    description: 'View and manage product details, plans, and addons.',
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <Suspense fallback={<div className="p-8 text-center animate-pulse text-muted-foreground font-black tracking-widest uppercase text-xs">Loading Details...</div>}>
                <ProductDetail id={params.id} />
            </Suspense>
        </div>
    );
}