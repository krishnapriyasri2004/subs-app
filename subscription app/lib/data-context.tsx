'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useVendorAuth } from './vendor-auth';
import {
    mockCustomers as initialMockCustomers,
    mockBusinessPlans as initialMockBusinessPlans,
    mockCustomerSubscriptions as initialMockSubscriptions,
    mockInvoices as initialMockInvoices,
    mockUsageEvents as initialMockUsageEvents,
    mockTenants as initialMockTenants,
    mockDemoRequests as initialMockDemoRequests,
    mockDunningEvents as initialMockDunningEvents,
    mockProducts as initialMockProducts,
    mockCoupons as initialMockCoupons
} from './mock-data';

interface DataContextType {
    mockCustomers: any[];
    mockBusinessPlans: any[];
    mockCustomerSubscriptions: any[];
    mockProducts: any[];
    mockInvoices: any[];
    mockUsageEvents: any[];
    mockTenants: any[];
    mockDemoRequests: any[];
    mockDunningEvents: any[];
    mockCoupons: any[];
    addDocument: (colName: string, data: any) => Promise<string>;
    updateDocument: (colName: string, id: string, data: any) => Promise<void>;
    deleteDocument: (colName: string, id: string) => Promise<void>;
    isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
    const { user } = useVendorAuth();
    const [isLoading, setIsLoading] = useState(true);

    const [mockCustomers, setCustomers] = useState<any[]>(initialMockCustomers);
    const [mockBusinessPlans, setPlans] = useState<any[]>(initialMockBusinessPlans);
    const [mockCustomerSubscriptions, setSubscriptions] = useState<any[]>(initialMockSubscriptions);
    const [mockProducts, setProducts] = useState<any[]>(initialMockProducts);
    const [mockInvoices, setInvoices] = useState<any[]>(initialMockInvoices);
    const [mockUsageEvents, setUsageEvents] = useState<any[]>(initialMockUsageEvents);
    const [mockTenants, setTenants] = useState<any[]>(initialMockTenants);
    const [mockDemoRequests, setDemoRequests] = useState<any[]>(initialMockDemoRequests);
    const [mockDunningEvents, setDunningEvents] = useState<any[]>(initialMockDunningEvents);
    const [mockCoupons, setCoupons] = useState<any[]>(initialMockCoupons);

    useEffect(() => {
        // Simulate loading delay
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const addDocument = async (colName: string, data: any) => {
        const id = data.id || `${colName.slice(0, 4)}-${Date.now()}`;
        const newDoc = { ...data, id, createdAt: new Date() };

        if (colName === 'coupons') {
            setCoupons(prev => [...prev, newDoc]);
        } else if (colName === 'products') {
            setProducts(prev => [...prev, newDoc]);
        } else if (colName === 'customers') {
            setCustomers(prev => [...prev, newDoc]);
        }

        return id;
    };

    const updateDocument = async (colName: string, id: string, data: any) => {
        if (colName === 'coupons') {
            setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...data, updatedAt: new Date() } : c));
        }
    };

    const deleteDocument = async (colName: string, id: string) => {
        if (colName === 'coupons') {
            setCoupons(prev => prev.filter(c => c.id !== id));
        }
    };

    return (
        <DataContext.Provider value={{
            mockCustomers,
            mockBusinessPlans,
            mockCustomerSubscriptions,
            mockProducts,
            mockInvoices,
            mockUsageEvents,
            mockTenants,
            mockDemoRequests,
            mockDunningEvents,
            mockCoupons,
            addDocument,
            updateDocument,
            deleteDocument,
            isLoading
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}