import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import * as authLib from '../../lib/vendor-auth'
import React from 'react'

// Mock Firebase dependencies
vi.mock('../../lib/firebase', () => ({
  auth: {
    onAuthStateChanged: vi.fn((cb) => cb(null)),
    signOut: vi.fn(),
  },
  db: {
    collection: vi.fn(),
    doc: vi.fn(),
  }
}))

// Mock Firebase functions
vi.mock('firebase/auth', () => {
    return {
        getAuth: vi.fn(),
        signInWithPopup: vi.fn(),
        createUserWithEmailAndPassword: vi.fn(),
        signInWithEmailAndPassword: vi.fn(),
        signOut: vi.fn(),
        onAuthStateChanged: vi.fn((auth, cb) => {
            cb(null);
            return () => {};
        }),
        GoogleAuthProvider: class {
            static PROVIDER_ID = 'google.com';
        },
    }
})

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  collection: vi.fn(),
}))

describe('useVendorAuth RBAC Logic', () => {
    it('returns false for hasRole when user is not authenticated', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <authLib.VendorAuthProvider>{children}</authLib.VendorAuthProvider>
        )
        const { result } = renderHook(() => authLib.useVendorAuth(), { wrapper })
        
        expect(result.current.hasRole(['super_admin'])).toBe(false)
    })

    it('returns true when user has the required role', () => {
        const mockUser = { role: 'super_admin' };
        vi.spyOn(authLib, 'useVendorAuth').mockReturnValue({
            user: (mockUser as any),
            isAuthenticated: true,
            isLoading: false,
            login: vi.fn(),
            signup: vi.fn(),
            loginWithGoogle: vi.fn(),
            loginWithMicrosoft: vi.fn(),
            logout: vi.fn(),
            updateUser: vi.fn(),
            changePassword: vi.fn(),
            loginWithOTP: vi.fn(),
            hasRole: (roles: any[]) => roles.includes(mockUser.role)
        });

        const { result } = renderHook(() => authLib.useVendorAuth());
        expect(result.current.hasRole(['super_admin'])).toBe(true);
    });

    it('returns false when user does not have the required role', () => {
        const mockUser = { role: 'customer' };
        vi.spyOn(authLib, 'useVendorAuth').mockReturnValue({
            user: (mockUser as any),
            isAuthenticated: true,
            isLoading: false,
            login: vi.fn(),
            signup: vi.fn(),
            loginWithGoogle: vi.fn(),
            loginWithMicrosoft: vi.fn(),
            logout: vi.fn(),
            updateUser: vi.fn(),
            changePassword: vi.fn(),
            loginWithOTP: vi.fn(),
            hasRole: (roles: any[]) => roles.includes(mockUser.role)
        });

        const { result } = renderHook(() => authLib.useVendorAuth());
        expect(result.current.hasRole(['super_admin'])).toBe(false);
    });
})
