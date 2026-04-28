'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query, where, DocumentReference, CollectionReference, Query } from 'firebase/firestore';
import { useVendorAuth } from '@/lib/vendor-auth';
import {
    mockSubscriptionPlans as initialPlans,
    mockAdminUser,
    mockTenantUsers,
    mockProducts as initialProducts,
    mockSubscriptions as initialSubs,
    mockInvoices as initialInvoices,
    mockUsageEvents as initialUsage,
    mockDemoRequests as initialDemos,
    mockCustomers as initialCustomers,
    mockCoupons as initialCoupons
} from './mock-data';

const DataContext = createContext<any>(undefined);

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}

export function DataProvider({ children }: { children: ReactNode }) {
    const { user } = useVendorAuth();

    // Distinguishing between imported initial data and local state
    const [mockBusinessPlans, setPlans] = useState<any[]>(initialPlans);
    const [mockProducts, setProducts] = useState<any[]>(initialProducts);
    const [mockSubscriptions, setSubscriptions] = useState<any[]>(initialSubs);
    const [mockCustomerSubscriptions, setCustomerSubscriptions] = useState<any[]>(initialSubs);
    const [mockInvoices, setInvoices] = useState<any[]>(initialInvoices);
    const [mockCustomers, setCustomers] = useState<any[]>(initialCustomers);
    const [mockCoupons, setCoupons] = useState<any[]>(initialCoupons);
    const [demoRequests, setDemoRequests] = useState<any[]>(initialDemos);
    const [usageEvents, setUsageEvents] = useState<any[]>(initialUsage);
    const [globalSettings, setGlobalSettings] = useState<any>({ maintenanceMode: false });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        /**
         * Safely handles both Query snapshots (Collection) and Document snapshots.
         */
        const createSafeSnapshot = (
            ref: any,
            setter: (data: any) => void,
            label: string,
            isDoc: boolean = false
        ) => {
            try {
                return onSnapshot(ref,
                    (snapshot: any) => {
                        if (isDoc) {
                            // Single Document Handling
                            if (snapshot.exists()) {
                                setter(snapshot.data());
                            }
                        } else {
                            // Collection/Query Handling
                            if (snapshot.docs) {
                                const data = snapshot.docs.map((d: any) => ({ ...d.data() as any, id: d.id }));
                                setter(data);
                            } else {
                                console.warn(`Snapshot for ${label} is not a collection snapshot.`);
                            }
                        }
                    },
                    (error) => console.warn(`Snapshot error [${label}]:`, error)
                );
            } catch (err) {
                console.error(`Failed to setup snapshot [${label}]:`, err);
                return () => { };
            }
        };

        const unsubs: (() => void)[] = [];

        // 1. GLOBAL COLLECTIONS
        unsubs.push(createSafeSnapshot(collection(db, 'plans'), setPlans, 'Global Plans'));
        unsubs.push(createSafeSnapshot(collection(db, 'products'), setProducts, 'Global Products'));
        unsubs.push(createSafeSnapshot(collection(db, 'coupons'), setCoupons, 'Global Coupons'));

        // Settings is a single DOCUMENT, so we pass isDoc=true
        unsubs.push(createSafeSnapshot(doc(db, 'settings', 'global'), setGlobalSettings, 'Settings', true));

        // 2. TENANT-SPECIFIC COLLECTIONS
        if (user?.tenantId) {
            const tenantId = user.tenantId;
            unsubs.push(createSafeSnapshot(query(collection(db, 'subscriptions'), where('tenantId', '==', tenantId)), (data) => {
                setSubscriptions(data);
                setCustomerSubscriptions(data);
            }, 'Subscriptions'));
            unsubs.push(createSafeSnapshot(query(collection(db, 'invoices'), where('tenantId', '==', tenantId)), setInvoices, 'Invoices'));
            unsubs.push(createSafeSnapshot(query(collection(db, 'customers'), where('tenantId', '==', tenantId)), setCustomers, 'Customers'));
            unsubs.push(createSafeSnapshot(query(collection(db, 'usageEvents'), where('tenantId', '==', tenantId)), setUsageEvents, 'UsageEvents'));
            unsubs.push(createSafeSnapshot(query(collection(db, 'demoRequests'), where('tenantId', '==', tenantId)), setDemoRequests, 'DemoRequests'));
        }

        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => {
            unsubs.forEach(unsub => unsub());
            clearTimeout(timer);
        };
    }, [user?.tenantId]);

    const addDocument = useCallback(async (colName: string, data: any) => {
        const id = data.id || `${colName.slice(0, 4)}-${Date.now()}`;
        const docData = { ...data, id, createdAt: new Date().toISOString(), tenantId: user?.tenantId || 'global' };
        await setDoc(doc(db, colName, id), docData);
        return docData;
    }, [user?.tenantId]);

    const updateDocument = useCallback(async (colName: string, id: string, data: any) => {
        await updateDoc(doc(db, colName, id), { ...data, updatedAt: new Date().toISOString() });
    }, []);

    const deleteDocument = useCallback(async (colName: string, id: string) => {
        await deleteDoc(doc(db, colName, id));
    }, []);

    const contextValue = useMemo(() => ({
        mockBusinessPlans,
        mockProducts,
        mockSubscriptions,
        mockCustomerSubscriptions,
        mockInvoices,
        mockCustomers,
        mockCoupons,
        demoRequests,
        usageEvents,
        addDocument,
        updateDocument,
        deleteDocument,
        isLoading,
        globalSettings
    }), [
        mockBusinessPlans, mockProducts, mockSubscriptions, mockCustomerSubscriptions,
        mockInvoices, mockCustomers, mockCoupons, demoRequests, usageEvents, isLoading,
        globalSettings, addDocument, updateDocument, deleteDocument
    ]);

    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>
    );
}