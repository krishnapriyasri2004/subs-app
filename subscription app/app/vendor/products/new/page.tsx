import { ProductForm } from '@/components/products/product-form';

export const metadata = {
    title: 'New Product - Catalog',
    description: 'Create a new product in your catalog.',
};

export default function NewProductPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <ProductForm />
        </div>
    );
}
