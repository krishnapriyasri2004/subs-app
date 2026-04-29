'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { Product } from '@/types';
import { useVendorAuth } from '@/lib/vendor-auth';
import { useData } from '@/lib/data-context';

interface ProductsContextType {
    products: Product[];
    addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'plans' | 'addons' | 'orgId'>) => Promise<void>;
    updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    archiveProduct: (id: string) => Promise<void>;
    unarchiveProduct: (id: string) => Promise<void>;
    getProductById: (id: string) => Product | undefined;
    addPlan: (productId: string, plan: any) => Promise<void>;
    addAddon: (productId: string, addon: any) => Promise<void>;
    cart: Record<string, number>;
    updateCart: (productId: string, qty: number) => void;
    clearCart: () => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
    const { user } = useVendorAuth();
    const { mockProducts, addDocument, updateDocument, deleteDocument, isLoading } = useData();

    // Robust cart initialization using state initializer
    const [cart, setCart] = React.useState<Record<string, number>>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('customer_cart');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    return parsed;
                } catch (e) {
                    console.error("Failed to parse cart:", e);
                }
            }
        }
        return {};
    });

    // Sync cart to local storage on every change
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('customer_cart', JSON.stringify(cart));
            // Trigger a custom event for local sync
            window.dispatchEvent(new Event('cart-updated'));
        }
    }, [cart]);

    // Listen for storage changes (tabs/navigation)
    React.useEffect(() => {
        const handleSync = () => {
            const saved = localStorage.getItem('customer_cart');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    // Only update if practical to avoid loops
                    setCart(current => {
                        if (JSON.stringify(current) !== saved) return parsed;
                        return current;
                    });
                } catch (e) { }
            }
        };

        window.addEventListener('storage', handleSync);
        window.addEventListener('cart-updated', handleSync);
        return () => {
            window.removeEventListener('storage', handleSync);
            window.removeEventListener('cart-updated', handleSync);
        };
    }, []);

    const updateCart = (productId: string, qty: number) => {
        setCart(prev => {
            const next = { ...prev };
            if (qty <= 0) {
                delete next[productId];
            } else {
                next[productId] = qty;
            }
            return next;
        });
    };

    const clearCart = () => {
        setCart({});
    };

    // Filter products: show relevant ones but don't hide items that are already in the cart
    const products = mockProducts
        .filter(p => {
            // If it's in the cart, always include it so the cart doesn't show up empty
            if (cart[p.id]) return true;

            // Standard filtering
            if (!user) return true;
            if (user.role === 'customer') return true;
            if (user.role === 'super_admin') return true;

            return p.orgId === user.tenantId || p.tenantId === user.tenantId;
        })
        .map(p => ({
            ...p,
            createdAt: new Date(p.createdAt || Date.now())
        })) as Product[];

    const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'plans' | 'addons' | 'orgId'>) => {
        if (!user) return;
        const newProduct = {
            ...productData,
            orgId: user.tenantId || 'anonymous',
            plans: [],
            addons: [],
            status: 'active',
            createdAt: new Date().toISOString()
        };
        await addDocument('products', newProduct);

        // 2. Broadcast notification to all customers of this vendor
        await addDocument('notifications', {
            title: '🎉 New Product Added',
            description: `We just added "${productData.name}" to our catalog! Subscribe now to get it delivered daily.`,
            type: 'info',
            orgId: user.tenantId || 'anonymous',
            createdAt: new Date().toISOString(),
            read: false
        });
    };

    const updateProduct = async (id: string, updates: Partial<Product>) => {
        await updateDocument('products', id, updates);
    };

    const deleteProduct = async (id: string) => {
        await deleteDocument('products', id);
    };

    const archiveProduct = async (id: string) => {
        await updateDocument('products', id, { status: 'archived' });
    };

    const unarchiveProduct = async (id: string) => {
        await updateDocument('products', id, { status: 'active' });
    };

    const getProductById = (id: string) => {
        return products.find(p => p.id === id);
    };

    const addPlan = async (productId: string, plan: any) => {
        const product = getProductById(productId);
        if (!product) return;

        const newPlans = [...(product.plans || []), { ...plan, id: `plan-${Date.now()}` }];
        await updateDocument('products', productId, { plans: newPlans });
    };

    const addAddon = async (productId: string, addon: any) => {
        const product = getProductById(productId);
        if (!product) return;

        const newAddons = [...(product.addons || []), { ...addon, id: `addon-${Date.now()}` }];
        await updateDocument('products', productId, { addons: newAddons });
    };

    return (
        <ProductsContext.Provider value={{
            products,
            addProduct,
            updateProduct,
            deleteProduct,
            archiveProduct,
            unarchiveProduct,
            getProductById,
            addPlan,
            addAddon,
            cart,
            updateCart,
            clearCart
        }}>
            {children}
        </ProductsContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductsContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductsProvider');
    }
    return context;
}