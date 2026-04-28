'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

export type UserRole = 'super_admin' | 'tenant_owner' | 'admin' | 'customer';

export interface VendorUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  businessName: string;
  businessType: 'milk' | 'rice' | 'both';
  role: UserRole;
  tenantId?: string; // Added for platform compatibility
  createdAt: Date;
  updatedAt: Date;
}

interface VendorAuthContextType {
  user: VendorUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, businessName: string, businessType: 'milk' | 'rice' | 'both') => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  updateUser: (data: Partial<VendorUser>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const VendorAuthContext = createContext<VendorAuthContextType | undefined>(undefined);

// In-memory store for registered vendors, initialized from localStorage
let vendorStore = new Map<string, { user: VendorUser; password: string }>();

// Helper to persist vendor store
const persistVendorStore = () => {
  if (typeof window !== 'undefined') {
    const data = Array.from(vendorStore.entries());
    localStorage.setItem('registeredVendors', JSON.stringify(data));
  }
};

// Helper to load vendor store
const loadVendorStore = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('registeredVendors');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        vendorStore = new Map(data);
      } catch (err) {
        console.error('Failed to load vendor store', err);
      }
    }
  }
};

// Demo vendors
const demoVendors = new Map<string, { user: VendorUser; password: string }>([
  ['milk@vendor.com', {
    user: {
      id: 'vendor-1',
      email: 'milk@vendor.com',
      name: 'Raj Kumar',
      businessName: 'Pure Dairy Milk',
      businessType: 'milk',
      role: 'tenant_owner',
      tenantId: 'tenant-1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    password: 'password123',
  }],
  ['rice@vendor.com', {
    user: {
      id: 'vendor-2',
      email: 'rice@vendor.com',
      name: 'Priya Rice',
      businessName: 'Priya Rice Depot',
      businessType: 'rice',
      role: 'tenant_owner',
      tenantId: 'tenant-2',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    password: 'password123',
  }],
  ['super@admin.com', {
    user: {
      id: 'super-admin-1',
      email: 'super@admin.com',
      name: 'Super Admin',
      businessName: 'Platform HQ',
      businessType: 'both',
      role: 'super_admin',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    password: 'password123',
  }],
  ['admin@vendor.com', {
    user: {
      id: 'admin-1',
      email: 'admin@vendor.com',
      name: 'Admin User',
      businessName: 'Pure Dairy Milk',
      businessType: 'milk',
      role: 'admin',
      tenantId: 'tenant-1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    password: 'password123',
  }],

  ['customer@user.com', {
    user: {
      id: 'customer-1',
      email: 'customer@user.com',
      name: 'Customer User',
      businessName: 'N/A',
      businessType: 'both',
      role: 'customer',
      tenantId: 'tenant-1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    password: 'password123',
  }],
]);

export function VendorAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<VendorUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVendorStore();
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('vendorUser');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          localStorage.removeItem('vendorUser');
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      let authenticatedUser: VendorUser | null = null;

      if (demoVendors.has(email)) {
        const stored = demoVendors.get(email);
        if (stored && stored.password === password) {
          authenticatedUser = stored.user;
        }
      } else {
        // Refresh from storage just in case another tab updated it
        loadVendorStore();
        if (vendorStore.has(email)) {
          const stored = vendorStore.get(email);
          if (stored && stored.password === password) {
            authenticatedUser = stored.user;
          }
        }
      }

      if (!authenticatedUser) {
        throw new Error('Invalid email or password');
      }

      setUser(authenticatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('vendorUser', JSON.stringify(authenticatedUser));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string, businessName: string, businessType: 'milk' | 'rice' | 'both') => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      loadVendorStore();
      if (vendorStore.has(email) || demoVendors.has(email)) {
        throw new Error('Email already registered');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const newUser: VendorUser = {
        id: `vendor-${Date.now()}`,
        email,
        name,
        businessName,
        businessType,
        role: 'tenant_owner', // Default role for new signups
        tenantId: `tenant-${Date.now()}`, // Generated tenant ID for new vendors
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vendorStore.set(email, { user: newUser, password });
      persistVendorStore();

      setUser(newUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('vendorUser', JSON.stringify(newUser));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate Google OAuth popup/delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const googleUser: VendorUser = {
        id: `google-${Date.now()}`,
        email: 'google-demo@gmail.com',
        name: 'Google Demo User',
        businessName: 'Google Integrated Biz',
        businessType: 'both',
        role: 'tenant_owner',
        tenantId: `tenant-google-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(googleUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('vendorUser', JSON.stringify(googleUser));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithMicrosoft = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate Microsoft OAuth popup/delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const microsoftUser: VendorUser = {
        id: `ms-${Date.now()}`,
        email: 'ms-demo@outlook.com',
        name: 'Microsoft Demo User',
        businessName: 'MS Integrated Biz',
        businessType: 'both',
        role: 'tenant_owner',
        tenantId: `tenant-ms-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(microsoftUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('vendorUser', JSON.stringify(microsoftUser));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vendorUser');
    }
  }, []);

  const updateUser = useCallback(async (data: Partial<VendorUser>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...data, updatedAt: new Date() };
      if (typeof window !== 'undefined') {
        localStorage.setItem('vendorUser', JSON.stringify(updatedUser));
      }

      // Update in store if present
      loadVendorStore();
      if (vendorStore.has(updatedUser.email)) {
        const stored = vendorStore.get(updatedUser.email);
        if (stored) {
          vendorStore.set(updatedUser.email, { ...stored, user: updatedUser });
          persistVendorStore();
        }
      } else if (demoVendors.has(updatedUser.email)) {
        const stored = demoVendors.get(updatedUser.email);
        if (stored) {
          demoVendors.set(updatedUser.email, { ...stored, user: updatedUser });
        }
      }

      return updatedUser;
    });
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (!user) return false;

      let success = false;
      loadVendorStore();

      if (vendorStore.has(user.email)) {
        const stored = vendorStore.get(user.email);
        if (stored && stored.password === currentPassword) {
          vendorStore.set(user.email, { ...stored, password: newPassword });
          persistVendorStore();
          success = true;
        }
      } else if (demoVendors.has(user.email)) {
        const stored = demoVendors.get(user.email);
        if (stored && stored.password === currentPassword) {
          demoVendors.set(user.email, { ...stored, password: newPassword });
          success = true;
        }
      }

      return success;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const hasRole = useCallback((roles: UserRole[]) => {
    return user !== null && roles.includes(user.role);
  }, [user]);

  return (
    <VendorAuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        signup,
        loginWithGoogle,
        loginWithMicrosoft,
        logout,
        hasRole,
        updateUser,
        changePassword
      }}
    >
      {children}
    </VendorAuthContext.Provider>
  );
}

export function useVendorAuth() {
  const context = useContext(VendorAuthContext);
  if (context === undefined) {
    throw new Error('useVendorAuth must be used within VendorAuthProvider');
  }
  return context;
}
