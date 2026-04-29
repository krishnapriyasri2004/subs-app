export interface Plan {
    id: string;
    name?: string;
    description?: string;
    price?: number;
    interval?: string;
    unitName?: string;
    setupFee?: number;
    features?: string[];
    status?: string;
    [key: string]: any;
}

export interface Product {
    id: string;
    name?: string;
    exclusive?: boolean;
    [key: string]: any;
}

export type TenantStatus = "active" | "inactive" | "suspended" | "pending" | string;

export interface Tenant {
    id: string;
    name?: string;
    status?: TenantStatus;
    [key: string]: any;
}

export interface Coupon {
    id: string;
    code?: string;
    [key: string]: any;
}

export interface Invoice {
    id: string;
    number?: string;
    [key: string]: any;
}

export interface ChurnAnalysis {
    [key: string]: any;
}

export interface DashboardStats {
    [key: string]: any;
}

export interface Subscription {
    id: string;
    [key: string]: any;
}

export interface DemoRequest {
    id: string;
    [key: string]: any;
}

export interface User {
    id: string;
    role?: string;
    email?: string;
    [key: string]: any;
}

export interface SubscriptionPlan {
    id: string;
    [key: string]: any;
}

export interface InvoiceItem { [key: string]: any; }
export interface UsageEvent { [key: string]: any; }
export interface DunningEvent { [key: string]: any; }
export interface SubscriptionLifecycleEvent { [key: string]: any; }
export interface RevenueMetrics { [key: string]: any; }
export interface Customer { [key: string]: any; }
export interface CustomerSubscription { [key: string]: any; }
export interface CustomerInvoice { [key: string]: any; }