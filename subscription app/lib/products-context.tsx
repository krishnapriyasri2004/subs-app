'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';
import { mockProducts } from '@/lib/mock-data';
import { useVendorAuth } from '@/lib/vendor-auth';

interface ProductsContextType {
    products: Product[];
    addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'plans' | 'addons' | 'orgId'>) => void;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    archiveProduct: (id: string) => void;
    unarchiveProduct: (id: string) => void;
    getProductById: (id: string) => Product | undefined;
    addPlan: (productId: string, plan: any) => void;
    addAddon: (productId: string, addon: any) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
    // Start with empty array to avoid hydration mismatches, then load from localStorage
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const { user } = useVendorAuth();

    // Initial load from localStorage
    useEffect(() => {
        if (!user) return; // Wait until auth state is known

        const storageKey = `vendor_products_${user.tenantId || 'anonymous'}`;
        try {
            const savedProducts = localStorage.getItem(storageKey);
            if (savedProducts) {
                // Parse and deeply restore Date objects
                const parsed = JSON.parse(savedProducts);
                const restoredProducts = parsed.map((p: any) => ({
                    ...p,
                    createdAt: new Date(p.createdAt)
                }));
                setProducts(restoredProducts);
            } else {
                // Filter mock data down to only this tenant's products
                const tenantMockData = mockProducts.filter(p => p.orgId === user.tenantId);
                setProducts(tenantMockData);
            }
        } catch (error) {
            console.error('Failed to load products from localStorage:', error);
            const tenantMockData = mockProducts.filter(p => p.orgId === user.tenantId);
            setProducts(tenantMockData);
        } finally {
            setIsLoaded(true);
        }
    }, [user]);

    // Save to localStorage whenever products change
    useEffect(() => {
        if (isLoaded && user) {
            const storageKey = `vendor_products_${user.tenantId || 'anonymous'}`;
            localStorage.setItem(storageKey, JSON.stringify(products));
        }
    }, [products, isLoaded, user]);

    const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'plans' | 'addons' | 'orgId'>) => {
        const newProduct: Product = {
            ...productData,
            id: `prod-${Date.now()}`,
            orgId: user?.tenantId || 'anonymous',
            createdAt: new Date(),
            plans: [],
            addons: []
        };
        setProducts(prev => [...prev, newProduct]);
    };

    const updateProduct = (id: string, updates: Partial<Product>) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deleteProduct = (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const archiveProduct = (id: string) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'archived' } : p));
    };

    const unarchiveProduct = (id: string) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'active' } : p));
    };

    const getProductById = (id: string) => {
        return products.find(p => p.id === id);
    };

    const addPlan = (productId: string, plan: any) => {
        setProducts(prev => prev.map(p => {
            if (p.id === productId) {
                return {
                    ...p,
                    plans: [...(p.plans || []), { ...plan, id: `plan-${Date.now()}` }]
                };
            }
            return p;
        }));
    };

    const addAddon = (productId: string, addon: any) => {
        setProducts(prev => prev.map(p => {
            if (p.id === productId) {
                return {
                    ...p,
                    addons: [...(p.addons || []), { ...addon, id: `addon-${Date.now()}` }]
                };
            }
            return p;
        }));
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
            addAddon
        }}>
            {isLoaded ? children : null}
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