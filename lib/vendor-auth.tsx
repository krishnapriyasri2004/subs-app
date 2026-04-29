'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect, useMemo } from 'react';
import { auth, db } from './firebase';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
export type UserRole = 'super_admin' | 'tenant_owner' | 'admin' | 'customer';

export interface VendorUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  businessName: string;
  businessType: string;
  role: UserRole;
  tenantId?: string; // Added for platform compatibility
  createdAt: Date;
  updatedAt: Date;
  twoFactorEnabled?: boolean;
  address?: string;
  walletBalance?: number;
  billingAddress?: {
    companyName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface VendorAuthContextType {
  user: VendorUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, businessName: string, businessType: string, role?: UserRole, phone?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  updateUser: (data: Partial<VendorUser>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  loginWithOTP: (phone: string, otp: string) => Promise<void>;
}

const VendorAuthContext = createContext<VendorAuthContextType | undefined>(undefined);
const googleProvider = new GoogleAuthProvider();

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
      createdAt: new Date('2026-03-04'),
      updatedAt: new Date('2026-03-04'),
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
      createdAt: new Date('2026-03-03'),
      updatedAt: new Date('2026-03-04'),
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
      createdAt: new Date('2026-03-03'),
      updatedAt: new Date('2026-03-04'),
    },
    password: 'password123',
  }],
  ['admin@vendor.com', {
    user: {
      id: 'admin-1',
      email: 'admin@vendor.com',
      name: 'admin@vendor.com',
      businessName: 'Pure Dairy Milk',
      businessType: 'milk',
      role: 'admin',
      tenantId: 'tenant-1',
      createdAt: new Date('2026-03-04'),
      updatedAt: new Date('2026-03-03'),
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
      walletBalance: 450,
      createdAt: new Date('2026-03-03'),
      updatedAt: new Date('2026-03-04'),
    },
    password: 'password123',
  }],
]);

export function VendorAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<VendorUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in via Firebase
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const authenticatedUser = { ...userDoc.data() as VendorUser, id: firebaseUser.uid };

          // Handle serialization of dates if needed
          if (typeof authenticatedUser.createdAt === 'string') {
            authenticatedUser.createdAt = new Date(authenticatedUser.createdAt);
          }
          if (typeof authenticatedUser.updatedAt === 'string') {
            authenticatedUser.updatedAt = new Date(authenticatedUser.updatedAt);
          }

          setUser(authenticatedUser);
          if (typeof window !== 'undefined') {
            localStorage.setItem('vendorUser', JSON.stringify(authenticatedUser));
          }
        } else {
          // Firebase Auth user exists but no Firestore doc yet
          // Only use local fallback if it exists as a bridge
          const stored = localStorage.getItem('vendorUser');
          if (stored) {
            try {
              setUser(JSON.parse(stored));
            } catch (err) { }
          }
        }
      } else {
        // Logged out
        setUser(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('vendorUser');
        }
      }
      setIsLoading(false);
    });

    return () => unsub();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    console.log("AuthProvider: login starting for", email);
    setIsLoading(true);
    console.log("AuthProvider: Loading state set to true");
    try {
      // Authenticate with Firebase
      console.log("AuthProvider: Attempting Firebase sign-in...");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("AuthProvider: Firebase sign-in success, fetching Firestore doc...");

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

      let authenticatedUser: VendorUser | null = null;
      if (userDoc.exists()) {
        authenticatedUser = { ...userDoc.data() as VendorUser, id: userCredential.user.uid };
      } else {
        // Fallback for demo vendors (if they haven't been migrated to Firebase)
        if (demoVendors.has(email)) {
          const stored = demoVendors.get(email);
          if (stored && stored.password === password) {
            authenticatedUser = stored.user;
          }
        } else {
          loadVendorStore();
          if (vendorStore.has(email)) {
            const stored = vendorStore.get(email);
            if (stored && stored.password === password) {
              authenticatedUser = stored.user;
            }
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
    } catch (err: any) {
      console.error("Login Error:", err);
      // Fallback for mocked local data if Firebase auth fails but it's a demo vendor
      if (demoVendors.has(email) || vendorStore.has(email)) {
        let authenticatedUser: VendorUser | null = null;
        if (demoVendors.has(email)) {
          const stored = demoVendors.get(email);
          if (stored && stored.password === password) {
            authenticatedUser = stored.user;
          }
        } else {
          loadVendorStore();
          if (vendorStore.has(email)) {
            const stored = vendorStore.get(email);
            if (stored && stored.password === password) {
              authenticatedUser = stored.user;
            }
          }
        }
        if (authenticatedUser) {
          // Attempt to migrate to Firebase
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;
            const updatedAuthUser = { ...authenticatedUser, id: uid };

            await setDoc(doc(db, "users", uid), {
              ...updatedAuthUser,
              createdAt: updatedAuthUser.createdAt instanceof Date ? updatedAuthUser.createdAt.toISOString() : updatedAuthUser.createdAt,
              updatedAt: new Date().toISOString(),
            });

            authenticatedUser = updatedAuthUser;
            console.log("Migrated local user to Firebase successfully.");
          } catch (migrateErr) {
            console.log("Failed to migrate or user already exists in Auth but not Firestore", migrateErr);
            // If already exists in auth but not Firestore, try to save to Firestore with their email as ID or existing ID
            try {
              await setDoc(doc(db, "users", authenticatedUser.id), {
                ...authenticatedUser,
                createdAt: authenticatedUser.createdAt instanceof Date ? authenticatedUser.createdAt.toISOString() : authenticatedUser.createdAt,
                updatedAt: new Date().toISOString(),
              }, { merge: true });
            } catch (e) {
              console.error("Failed to sync to firestore", e);
            }
          }

          setUser(authenticatedUser);
          if (typeof window !== 'undefined') {
            localStorage.setItem('vendorUser', JSON.stringify(authenticatedUser));
          }
        } else {
          throw err;
        }
      } else {
        throw new Error('Invalid email or password. Please try again or sign up for a new account.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string, businessName: string, businessType: string, role: UserRole = 'tenant_owner', phone?: string) => {
    setIsLoading(true);
    try {
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // 1. Create User in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // 2. Prepare user object
      const newUser: VendorUser = {
        id: uid,
        email,
        name,
        businessName,
        businessType,
        role,
        phone,
        tenantId: `tenant-${uid}`, // Generated tenant ID for new vendors
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // 3. Save User profile into Firestore
      await setDoc(doc(db, "users", uid), {
        ...newUser,
        createdAt: newUser.createdAt.toISOString(),
        updatedAt: newUser.updatedAt.toISOString(),
      });

      // 4. Create Tenant document (Matching your console structure)
      await setDoc(doc(db, "tenants", newUser.tenantId!), {
        id: newUser.tenantId,
        orgId: newUser.tenantId,
        name: businessName,
        email: email,
        industryType: businessType,
        planTier: 'Starter',
        maxUsers: 5,
        currentUsersCount: 1,
        status: 'active',
        createdAt: newUser.createdAt.toISOString(),
        updatedAt: newUser.updatedAt.toISOString(),
      });
      console.log("Tenant document created successfully:", newUser.tenantId);

      // 5. Send Welcome WhatsApp if phone is available
      if (phone) {
        try {
          await fetch('/api/send-whatsapp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phoneNumber: phone,
              name: name,
              message: `Hello ${name}, welcome to Subtrack! We're excited to have you on board.`
            }),
          });
        } catch (waErr) {
          console.error("WhatsApp Welcome failed:", waErr);
        }
      }
 
       // Still update local store for backward compatibility in this session
      vendorStore.set(email, { user: newUser, password });
      persistVendorStore();

      setUser(newUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('vendorUser', JSON.stringify(newUser));
      }
    } catch (err: any) {
      console.error("Firebase Signup failed:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      let authenticatedUser: VendorUser;

      if (userDoc.exists()) {
        authenticatedUser = { ...userDoc.data() as VendorUser, id: user.uid };
      } else {
        // Create new user in Firestore
        authenticatedUser = {
          id: user.uid,
          email: user.email || '',
          name: user.displayName || 'Google User',
          businessName: 'My Business',
          businessType: 'both',
          role: 'customer', // Default role; they can build their profile later
          tenantId: `tenant-${user.uid}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await setDoc(doc(db, "users", user.uid), {
          ...authenticatedUser,
          createdAt: authenticatedUser.createdAt.toISOString(),
          updatedAt: authenticatedUser.updatedAt.toISOString(),
        });

        // 4. Create Tenant document for the new user
        await setDoc(doc(db, "tenants", authenticatedUser.tenantId!), {
          id: authenticatedUser.tenantId,
          orgId: authenticatedUser.tenantId,
          name: authenticatedUser.businessName,
          email: authenticatedUser.email,
          industryType: authenticatedUser.businessType,
          planTier: 'Starter',
          maxUsers: 5,
          currentUsersCount: 1,
          status: 'active',
          createdAt: authenticatedUser.createdAt.toISOString(),
          updatedAt: authenticatedUser.updatedAt.toISOString(),
        });
        console.log("Tenant document created for Google user:", authenticatedUser.tenantId);
      }

      setUser(authenticatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('vendorUser', JSON.stringify(authenticatedUser));
      }
    } catch (err: any) {
      console.warn("Real Google Auth failed (likely missing Firebase config). Falling back to mock login.", err);
      const mockUser: VendorUser = {
        id: `google-mock-${Date.now()}`,
        email: 'google-demo@gmail.com',
        name: 'Google Demo User',
        businessName: 'My Business',
        businessType: 'both',
        role: 'customer',
        tenantId: `tenant-mock-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setUser(mockUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('vendorUser', JSON.stringify(mockUser));
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

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Firebase signout error", error);
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vendorUser');
    }
  }, []);

  const updateUser = useCallback(async (data: Partial<VendorUser>) => {
    if (!user) return;

    // 1. Update local state immediately for snappy UI
    const updatedUser = { ...user, ...data, updatedAt: new Date() };
    setUser(updatedUser);

    if (typeof window !== 'undefined') {
      localStorage.setItem('vendorUser', JSON.stringify(updatedUser));
    }

    // 2. Update memory stores
    loadVendorStore();
    if (vendorStore.has(updatedUser.email)) {
      const stored = vendorStore.get(updatedUser.email);
      if (stored) {
        vendorStore.set(updatedUser.email, { ...stored, user: updatedUser });
        persistVendorStore();
      }
    }

    // 3. Update Firestore in the background
    try {
      const userRef = doc(db, "users", updatedUser.id);
      const serializableData: any = {
        ...data,
        updatedAt: new Date().toISOString()
      };

      // Also sync to tenants collection if relevant fields changed
      if (updatedUser.tenantId && (data.businessName || data.businessType)) {
        const tenantRef = doc(db, "tenants", updatedUser.tenantId);
        const tenantData: any = { updatedAt: new Date().toISOString() };
        if (data.businessName) tenantData.name = data.businessName;
        if (data.businessType) tenantData.industryType = data.businessType;
        
        await setDoc(tenantRef, tenantData, { merge: true });
        console.log("Synced tenant data:", updatedUser.tenantId);
      }

      // Safety timeout for Firestore write
      await Promise.race([
        setDoc(userRef, serializableData, { merge: true }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
      ]);
    } catch (e) {
      console.warn("Background Firestore sync failed or timed out:", e);
    }
  }, [user]);

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

  const loginWithOTP = useCallback(async (phone: string, otp: string) => {
    setIsLoading(true);
    try {
      // 1. Verify OTP with our backend API
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Invalid OTP');
      }

      // 2. Look up user in Firestore by phone
      const { collection, query, where, getDocs, setDoc, doc } = await import('firebase/firestore');

      const q = query(collection(db, "users"), where("phone", "==", phone));
      const querySnapshot = await getDocs(q);

      let authenticatedUser: VendorUser | null = null;

      if (!querySnapshot.empty) {
        authenticatedUser = { ...querySnapshot.docs[0].data(), id: querySnapshot.docs[0].id } as VendorUser;
        if (typeof authenticatedUser.createdAt === 'string') {
          authenticatedUser.createdAt = new Date(authenticatedUser.createdAt);
        }
        if (typeof authenticatedUser.updatedAt === 'string') {
          authenticatedUser.updatedAt = new Date(authenticatedUser.updatedAt);
        }
      } else {
        // Create a new user if one doesn't exist
        const uid = `phone-${Date.now()}`;
        authenticatedUser = {
          id: uid,
          email: `${phone.replace('+', '')}@phone-auth.com`,
          name: `User ${phone.slice(-4)}`,
          phone: phone,
          businessName: 'My Business',
          businessType: 'both',
          role: 'customer',
          tenantId: `tenant-${uid}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await setDoc(doc(db, "users", uid), {
          ...authenticatedUser,
          createdAt: authenticatedUser.createdAt.toISOString(),
          updatedAt: authenticatedUser.updatedAt.toISOString(),
        });

        // Send Welcome WhatsApp for new OTP users
        try {
          await fetch('/api/send-whatsapp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phoneNumber: phone,
              name: authenticatedUser.name,
              message: `Hello ${authenticatedUser.name}, welcome to Subtrack! We're excited to have you on board.`
            }),
          });
        } catch (waErr) {
          console.error("WhatsApp Welcome failed:", waErr);
        }
      }

      setUser(authenticatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('vendorUser', JSON.stringify(authenticatedUser));
      }

    } catch (err: any) {
      console.error("OTP Login Error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const hasRole = useCallback((roles: UserRole[]) => {
    return user !== null && roles.includes(user.role);
  }, [user]);

  const value = useMemo(() => ({
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
    changePassword,
    loginWithOTP
  }), [
    user,
    isLoading,
    login,
    signup,
    loginWithGoogle,
    loginWithMicrosoft,
    logout,
    hasRole,
    updateUser,
    changePassword,
    loginWithOTP
  ]);

  return (
    <VendorAuthContext.Provider value={value}>
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