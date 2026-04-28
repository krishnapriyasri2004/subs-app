import { ProductList } from '@/components/products/product-list';

export const metadata = {
    title: 'Catalog - Products',
    description: 'Manage your product catalog, plans, and addons.',
};

export default function VendorProductsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <ProductList />
        </div>
    );
}