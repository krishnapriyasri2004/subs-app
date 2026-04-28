import { render, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DataProvider } from '../../lib/data-context'
import * as authLib from '../../lib/vendor-auth'
import React from 'react'
import { setDoc, getDocs } from 'firebase/firestore'

// Mock dependencies
vi.mock('../../lib/firebase', () => ({
  db: {}
}))

vi.mock('../../lib/vendor-auth', () => ({
    useVendorAuth: vi.fn(),
}))

vi.mock('firebase/firestore', () => ({
    getFirestore: vi.fn(),
    doc: vi.fn().mockImplementation((db, path, id) => ({ id, path: `${path}/${id}` })),
    collection: vi.fn().mockImplementation((db, path) => ({ path })),
    collectionGroup: vi.fn().mockImplementation((db, path) => ({ path })),
    onSnapshot: vi.fn(() => () => {}),
    getDocs: vi.fn().mockResolvedValue({ empty: true, docs: [] }),
    setDoc: vi.fn().mockResolvedValue({}),
    query: vi.fn(),
    where: vi.fn(),
}))

describe('DataProvider Data Seeding Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('seeds milk products when a new milk vendor logs in', async () => {
        // Mock a milk vendor
        vi.spyOn(authLib, 'useVendorAuth').mockReturnValue({
            user: { id: 'v123', businessType: 'milk', role: 'tenant_owner', tenantId: 't123' },
            isAuthenticated: true,
            isLoading: false,
        } as any);

        // Ensure current products list is empty to trigger seeding
        (getDocs as any).mockResolvedValueOnce({ empty: true, docs: [] });

        render(
            <DataProvider>
                <div />
            </DataProvider>
        )

        // Wait for Firestore setDoc to be called (seeding logic is inside useEffect)
        await waitFor(() => {
            expect(setDoc).toHaveBeenCalledWith(
                expect.anything(), 
                expect.objectContaining({ name: "A2 Buffalo Milk" })
            )
        }, { timeout: 5000 })
    })

    it('seeds rice products when a new rice vendor logs in', async () => {
        // Mock a rice vendor
        vi.spyOn(authLib, 'useVendorAuth').mockReturnValue({
            user: { id: 'v456', businessType: 'rice', role: 'tenant_owner', tenantId: 't456' },
            isAuthenticated: true,
            isLoading: false,
        } as any);

        // Ensure current products list is empty
        (getDocs as any).mockResolvedValueOnce({ empty: true, docs: [] });

        render(
            <DataProvider>
                <div />
            </DataProvider>
        )

        // Wait for rice products to be seeded
        await waitFor(() => {
            expect(setDoc).toHaveBeenCalledWith(
                expect.anything(), 
                expect.objectContaining({ name: "Premium Basmati Rice" })
            )
        })
    })

    it('does NOT seed if the vendor already has products', async () => {
        vi.spyOn(authLib, 'useVendorAuth').mockReturnValue({
            user: { id: 'v789', businessType: 'milk', role: 'tenant_owner', tenantId: 't789' },
            isAuthenticated: true,
        } as any);

        // Mock existing products
        (getDocs as any).mockResolvedValueOnce({ 
            empty: false, 
            docs: [{ data: () => ({ name: 'A2 Buffalo Milk' }) }] 
        });

        render(
            <DataProvider>
                <div />
            </DataProvider>
        )

        // Check that setDoc was NOT called for products
        // (Wait a bit to be sure it's not called asynchronously later)
        await new Promise(r => setTimeout(r, 500));
        expect(setDoc).not.toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ name: "A2 Buffalo Milk" }));
    })
})
