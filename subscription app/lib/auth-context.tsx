'use client';

import { useVendorAuth } from './vendor-auth';

// This is a shim to bridge useAuth calls to useVendorAuth
export const useAuth = () => {
    const auth = useVendorAuth();

    // Map roles if necessary, but it seems admin and tenant_owner exist in VendorUser
    // However, the dashboard uses 'admin' (singular) whereas vendor-auth has 'admin' as well.
    // Wait, looking at admin-dashboard.tsx: isAdmin = user?.role === 'admin';
    // So 'admin' matches.

    return auth;
};
