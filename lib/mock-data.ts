import {
  User,
  Tenant,
  SubscriptionPlan,
  Subscription,
  Invoice,
  InvoiceItem,
  UsageEvent,
  DunningEvent,
  SubscriptionLifecycleEvent,
  RevenueMetrics,
  ChurnAnalysis,
  Customer,
  CustomerSubscription,
  CustomerInvoice,
  DemoRequest,
  Coupon
} from '@/types';

// Mock Subscription Plans
export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plan-basic',
    name: 'Basic',
    description: 'For small businesses',
    price: 2999,
    currency: 'INR',
    frequency: 'monthly',
    features: ['Up to 5 users', 'Basic invoicing', 'Email support'],
    maxUsers: 5,
    maxInvoices: 100,
    isActive: true,
    createdAt: new Date('2026-03-03'),
    updatedAt: new Date('2026-03-04'),
  },
  {
    id: 'plan-pro',
    name: 'Professional',
    description: 'For growing businesses',
    price: 7999,
    currency: 'INR',
    frequency: 'monthly',
    features: [
      'Up to 25 users',
      'Advanced invoicing',
      'Payment gateway integration',
      'Email & phone support',
    ],
    maxUsers: 25,
    maxInvoices: 1000,
    isActive: true,
    createdAt: new Date('2026-03-03'),
    updatedAt: new Date('2026-03-03'),
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    price: 19999,
    currency: 'INR',
    frequency: 'monthly',
    features: [
      'Unlimited users',
      'Custom integrations',
      'Dedicated account manager',
      '24/7 priority support',
    ],
    maxUsers: 9999,
    maxInvoices: 9999,
    isActive: true,
    createdAt: new Date('2026-03-04'),
    updatedAt: new Date('2026-03-04'),
  },
];


// Mock Users
export const mockAdminUser: User = {
  id: 'admin-1',
  email: 'admin@subflow.com',
  name: 'Admin User',
  role: 'admin',
  status: 'active',
  createdAt: new Date('2026-03-03'),
  updatedAt: new Date('2026-03-03'),
};


export const mockTenantUsers: User[] = [
  {
    id: 'user-1',
    email: 'owner@pureflowdairy.com',
    name: 'Raj Kumar',
    phone: '+91 9876543210',
    role: 'tenant-owner',
    tenantId: 'tenant-1',
    status: 'active',
    createdAt: new Date('2026-03-03'),
    updatedAt: new Date('2026-03-04'),
  },
  {
    id: 'user-2',
    email: 'billing@pureflowdairy.com',
    name: 'Priya Singh',
    phone: '+91 9876543211',
    role: 'tenant-user',
    tenantId: 'tenant-1',
    status: 'active',
    createdAt: new Date('2026-03-04'),
    updatedAt: new Date('2026-03-03'),
  },
  {
    id: 'user-3',
    email: 'sales@goldenfieldsgrains.com',
    name: 'Amit Patel',
    phone: '+91 9876543212',
    role: 'tenant-owner',
    tenantId: 'tenant-2',
    status: 'active',
    createdAt: new Date('2026-03-04'),
    updatedAt: new Date('2026-03-04'),
  },
];

// Mock Tenants
export const mockTenants: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'PureFlow Dairy',
    email: 'contact@pureflowdairy.com',
    phone: '+91 9876543210',
    gstNumber: '18AABCT1234F1Z0',
    panNumber: 'AAACT1234F',
    address: '123 Tech Park, MG Road',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    pinCode: '641001',
    status: 'active',
    subscriptionPlanId: 'plan-pro',
    industryType: 'Dairy',
    planTier: 'Growth',
    users: [mockTenantUsers[0], mockTenantUsers[1]],
    createdAt: new Date('2026-03-04'),
    updatedAt: new Date('2026-03-04'),
    maxUsers: 25,
    currentUsersCount: 2,
  },
  {
    id: 'tenant-2',
    name: 'Golden Fields Grains',
    email: 'sales@goldenfieldsgrains.com',
    phone: '+91 9876543212',
    gstNumber: '18AABCT5678F1Z0',
    panNumber: 'AABCT5678F',
    address: '456 Innovation Hub, Whitefield',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    pinCode: '641001',
    status: 'active',
    subscriptionPlanId: 'plan-basic',
    industryType: 'Agriculture',
    planTier: 'Starter',
    users: [mockTenantUsers[2]],
    createdAt: new Date('2026-03-03'),
    updatedAt: new Date('2026-03-04'),
    maxUsers: 5,
    currentUsersCount: 1,
  },
];

// Mock Subscriptions with Advanced Features
export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub-1',
    tenantId: 'tenant-1',
    planId: 'plan-pro',
    status: 'active',
    startDate: new Date('2026-03-03'),
    endDate: new Date('2026-03-04'),
    autoRenew: true,
    totalAmount: 95988,
    paidAmount: 95988,
    createdAt: new Date('2026-03-04'),
    updatedAt: new Date('2026-03-04'),
    isUsageBased: true,
    currentUsageAmount: 1500,
    usageLimit: 5000,
    failureCount: 0,
  },
  {
    id: 'sub-2',
    tenantId: 'tenant-2',
    planId: 'plan-basic',
    status: 'dunning',
    startDate: new Date('2026-03-03'),
    endDate: new Date('2026-03-04'),
    autoRenew: true,
    totalAmount: 35988,
    paidAmount: 0,
    createdAt: new Date('2026-03-04'),
    updatedAt: new Date('2026-03-04'),
    failureCount: 2,
    lastFailureDate: new Date('2026-03-04'),
    nextRetryDate: new Date('2026-03-03'),
    dungingStatus: 'active',
  },
];

// Mock Invoice Items
const mockInvoiceItems: InvoiceItem[] = [
  {
    id: 'item-1',
    description: 'Professional Plan - Monthly Subscription',
    quantity: 1,
    unitPrice: 7999,
    amount: 7999,
  },
  {
    id: 'item-2',
    description: 'Additional User Licenses (3)',
    quantity: 3,
    unitPrice: 500,
    amount: 1500,
  },
];

// Mock Invoices
export const mockInvoices: Invoice[] = [
  {
    id: 'inv-001',
    tenantId: 'tenant-1',
    invoiceNumber: 'INV-2026-001',
    amount: 9499,
    currency: 'INR',
    tax: 1710,
    totalAmount: 11209,
    status: 'paid',
    issueDate: new Date('2026-03-03'),
    dueDate: new Date('2026-03-03'),
    paidDate: new Date('2026-03-03'),
    items: mockInvoiceItems,
    paymentMethod: 'Razorpay',
    razorpayOrderId: 'order_123456789',
    razorpayPaymentId: 'pay_123456789',
    createdAt: new Date('2026-03-03'),
    updatedAt: new Date('2026-03-04'),
  },
  {
    id: 'inv-002',
    tenantId: 'tenant-1',
    invoiceNumber: 'INV-2026-002',
    amount: 9499,
    currency: 'INR',
    tax: 1710,
    totalAmount: 11209,
    status: 'sent',
    issueDate: new Date('2026-03-04'),
    dueDate: new Date('2026-03-03'),
    items: mockInvoiceItems,
    createdAt: new Date('2026-03-04'),
    updatedAt: new Date('2026-03-04'),
  },
  {
    id: 'inv-003',
    tenantId: 'tenant-2',
    invoiceNumber: 'INV-2026-003',
    customerId: 'cust-2',
    planName: 'Basic Monthly',
    amount: 2999,
    currency: 'INR',
    tax: 539,
    totalAmount: 3538,
    status: 'overdue',
    issueDate: new Date('2026-03-03'),
    dueDate: new Date('2026-03-03'),
    items: [
      {
        id: 'item-3',
        description: 'Basic Plan - Monthly Subscription',
        quantity: 1,
        unitPrice: 2999,
        amount: 2999,
      },
    ],
    createdAt: new Date('2026-03-03'),
    updatedAt: new Date('2026-03-04'),
  },
  {
    id: 'inv-004',
    tenantId: 'tenant-1',
    invoiceNumber: 'INV-2026-004',
    customerId: 'cust-1',
    planName: 'Professional Monthly',
    amount: 7999,
    currency: 'INR',
    tax: 1438,
    totalAmount: 9437,
    status: 'sent',
    issueDate: new Date('2026-03-03'),
    dueDate: new Date('2026-03-04'),
    items: [
      {
        id: 'item-4',
        description: 'Professional Plan - Monthly Subscription',
        quantity: 1,
        unitPrice: 7999,
        amount: 7999,
      },
    ],
    createdAt: new Date('2026-03-04'),
    updatedAt: new Date('2026-03-04'),
  },
  {
    id: 'inv-005',
    tenantId: 'tenant-1',
    invoiceNumber: 'INV-2026-005',
    customerId: 'cust-3',
    planName: 'Basic Monthly',
    amount: 2999,
    currency: 'INR',
    tax: 539,
    totalAmount: 3538,
    status: 'cancelled',
    issueDate: new Date('2026-03-03'),
    dueDate: new Date('2026-03-04'),
    items: [
      {
        id: 'item-5',
        description: 'Basic Plan - Monthly Subscription',
        quantity: 1,
        unitPrice: 2999,
        amount: 2999,
      },
    ],
    createdAt: new Date('2026-03-04'),
    updatedAt: new Date('2026-03-04'),
  },
];

// Mock Usage Events (Metered Billing)
export const mockUsageEvents: UsageEvent[] = [
  {
    id: 'usage-1',
    subscriptionId: 'sub-1',
    metricName: 'API Calls',
    quantity: 250,
    timestamp: new Date('2026-03-04T10:00:00'),
    createdAt: new Date('2026-03-04T10:00:00'),
  },
  {
    id: 'usage-2',
    subscriptionId: 'sub-1',
    metricName: 'API Calls',
    quantity: 180,
    timestamp: new Date('2026-03-04T10:00:00'),
    createdAt: new Date('2026-03-04T10:00:00'),
  },
  {
    id: 'usage-3',
    subscriptionId: 'sub-1',
    metricName: 'Storage (GB)',
    quantity: 50,
    timestamp: new Date('2026-03-04T10:00:00'),
    createdAt: new Date('2026-03-04T10:00:00'),
  },
  {
    id: 'usage-4',
    subscriptionId: 'sub-1',
    metricName: 'API Calls',
    quantity: 320,
    timestamp: new Date('2026-03-04T10:00:00'),
    createdAt: new Date('2026-03-04T10:00:00'),
  },
];

// Mock Dunning Events (Failed Payment Recovery)
export const mockDunningEvents: DunningEvent[] = [
  {
    id: 'dunning-1',
    subscriptionId: 'sub-2',
    invoiceId: 'inv-003',
    attemptNumber: 1,
    status: 'active',
    lastAttemptDate: new Date('2026-03-04T10:00:00'),
    nextRetryDate: new Date('2026-03-04T10:00:00'),
    failureReason: 'Insufficient funds',
    createdAt: new Date('2026-03-04T10:00:00'),
    updatedAt: new Date('2026-03-04T10:00:00'),
  },
  {
    id: 'dunning-2',
    subscriptionId: 'sub-2',
    invoiceId: 'inv-003',
    attemptNumber: 2,
    status: 'active',
    lastAttemptDate: new Date('2026-03-04T10:00:00'),
    nextRetryDate: new Date('2026-03-04T10:00:00'),
    failureReason: 'Card declined',
    createdAt: new Date('2026-03-04T10:00:00'),
    updatedAt: new Date('2026-03-04T10:00:00'),
  },
];

// Mock Subscription Lifecycle Events
export const mockLifecycleEvents: SubscriptionLifecycleEvent[] = [
  {
    id: 'lifecycle-1',
    subscriptionId: 'sub-1',
    eventType: 'upgrade',
    oldPlanId: 'plan-basic',
    newPlanId: 'plan-pro',
    prorationAmount: 2500,
    effectiveDate: new Date('2026-03-04'),
    createdAt: new Date('2026-03-04'),
  },
  {
    id: 'lifecycle-2',
    subscriptionId: 'sub-1',
    eventType: 'renew',
    newPlanId: 'plan-pro',
    effectiveDate: new Date('2026-03-03'),
    createdAt: new Date('2026-03-03'),
  },
];

// Mock Revenue Metrics
export const mockRevenueMetrics: RevenueMetrics = {
  mrr: 119987,
  arr: 1439844,
  nrr: 0.95,
  churnRate: 0.05,
  netChurnRate: 0.03,
  usageRevenue: 5000,
  dungingRevenue: 3538,
  totalRevenue: 128525,
  timestamp: new Date('2026-03-04'),
};

// Mock Churn Analysis
export const mockChurnAnalysis: ChurnAnalysis = {
  totalCancelledSubscriptions: 8,
  totalCancelledRevenue: 89976,
  churnRate: 0.08,
  topCancellationReasons: [
    { reason: 'Switching to competitor', count: 3 },
    { reason: 'Cost reduction', count: 2 },
    { reason: 'No longer needed', count: 2 },
    { reason: 'Poor customer service', count: 1 },
  ],
  downgradeRate: 0.12,
  pauseRate: 0.06,
};
// Mock Business Plans (e.g., for Milk/Rice Vendors)
export const mockBusinessPlans: any[] = [
  {
    id: 'bp-milk-daily',
    name: 'Daily Milk Delivery',
    description: 'Fresh milk delivered every morning',
    price: 1500,
    currency: 'INR',
    interval: 'monthly',
    features: ['1L Daily', 'Fresh Quality', 'Doorstep Delivery'],
    maxUsers: 1,
    maxInvoices: 30,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    orgId: 'tenant-1',
  },
  {
    id: 'bp-rice-monthly',
    name: 'Premium Rice Pack',
    description: '25kg Basmati Rice per month',
    price: 3500,
    currency: 'INR',
    interval: 'monthly',
    features: ['25kg Pack', 'Premium Grain', 'Free Delivery'],
    maxUsers: 1,
    maxInvoices: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    orgId: 'tenant-2',
  }
];

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: 'cust-1-dairy',
    tenantId: 'tenant-1',
    name: 'Premium Subscriber',
    email: 'subscriber@customer.com',
    status: 'active',
    walletBalance: 1450.50,
    ltv: 12500,
    createdAt: new Date('2026-03-04'),
    updatedAt: new Date('2026-03-04'),
  },
  {
    id: 'cust-1-grains',
    tenantId: 'tenant-2',
    name: 'Premium Subscriber',
    email: 'subscriber@customer.com',
    status: 'active',
    walletBalance: 850.00,
    ltv: 9800,
    createdAt: new Date('2026-03-04'),
    updatedAt: new Date('2026-03-04'),
  }
];

// Mock Customer Subscriptions
export const mockCustomerSubscriptions: CustomerSubscription[] = [
  {
    id: 'cs-1',
    customerId: 'cust-1-dairy',
    tenantId: 'tenant-1',
    planId: 'bp-milk-daily',
    status: 'active',
    startDate: new Date('2026-03-04'),
    endDate: new Date('2026-03-03'),
    autoRenew: true,
    totalAmount: 1500,
    paidAmount: 1500,
    createdAt: new Date('2026-03-03'),
    updatedAt: new Date('2026-03-03'),
  },
  {
    id: 'cs-2',
    customerId: 'cust-1-grains',
    tenantId: 'tenant-2',
    planId: 'bp-rice-monthly',
    status: 'active',
    startDate: new Date('2026-03-03'),
    endDate: new Date('2026-03-04'),
    autoRenew: true,
    totalAmount: 3500,
    paidAmount: 3500,
    createdAt: new Date('2026-03-03'),
    updatedAt: new Date('2026-03-04'),
  }
];

// Mock Customer Invoices
export const mockCustomerInvoices: CustomerInvoice[] = [
  {
    id: 'ci-1',
    customerId: 'cust-1',
    tenantId: 'tenant-1',
    invoiceNumber: 'INV-CUST-001',
    amount: 1500,
    currency: 'INR',
    tax: 0,
    totalAmount: 1500,
    status: 'paid',
    issueDate: new Date('2026-03-04'),
    dueDate: new Date('2026-03-03'),
    paidDate: new Date('2026-03-03'),
    items: [
      { id: 'cii-1', description: 'Daily Milk Delivery', quantity: 1, unitPrice: 1500, amount: 1500 }
    ],
    createdAt: new Date('2026-03-04'),
    updatedAt: new Date('2026-03-03'),
  },
  {
    id: 'ci-2',
    customerId: 'cust-2',
    tenantId: 'tenant-1',
    invoiceNumber: 'INV-CUST-002',
    amount: 2000,
    currency: 'INR',
    tax: 360,
    totalAmount: 2360,
    status: 'pending',
    issueDate: new Date('2026-03-04'),
    dueDate: new Date('2026-03-03'),
    items: [
      { id: 'cii-2', description: 'Monthly Rice Supply', quantity: 1, unitPrice: 2000, amount: 2000 }
    ],
    createdAt: new Date('2026-03-04'),
    updatedAt: new Date('2026-03-03'),
  }
];

export const mockDemoRequests: DemoRequest[] = [];

// Mock Coupons
export const mockCoupons: Coupon[] = [
  {
    id: 'cpn-1',
    code: 'PANNA',
    type: 'percentage',
    value: 15,
    minAmount: 999,
    status: 'active',
    usageCount: 0,
    createdAt: new Date(),
  },
  {
    id: 'cpn-2',
    code: 'AGANUM',
    type: 'fixed',
    value: 500,
    minAmount: 2500,
    status: 'active',
    usageCount: 0,
    createdAt: new Date(),
  }
];

// Mock Audit Logs
export const mockAuditLogs = [
  { id: 'al-1', user_id: 'admin-1', action: 'tenant.created', entity: 'TechCorp Solutions', timestamp: new Date('2026-03-04T10:00:00'), ip_address: '192.168.1.1' },
  { id: 'al-2', user_id: 'admin-1', action: 'plan.updated', entity: 'Professional Tier', timestamp: new Date('2026-03-04T10:00:00'), ip_address: '192.168.1.1' },
  { id: 'al-3', user_id: 'user-1', action: 'invoice.paid', entity: 'INV-2026-001', timestamp: new Date('2026-03-04T10:00:00'), ip_address: '203.0.113.42' },
  { id: 'al-4', user_id: 'admin-1', action: 'tenant.suspended', entity: 'Globex Corp', timestamp: new Date('2026-03-04T10:00:00'), ip_address: '192.168.1.1' },
  { id: 'al-5', user_id: 'user-3', action: 'subscription.upgraded', entity: 'Innovate Business', timestamp: new Date('2026-03-04T10:00:00'), ip_address: '198.51.100.7' },
];

// Mock Tenant Approval History
export const mockApprovalHistory = [
  {
    id: 'ah-1',
    tenantId: 'tenant-1',
    tenantName: 'TechCorp Solutions',
    action: 'approved',
    actedBy: 'admin-1',
    timestamp: new Date('2026-03-04T10:00:00'),
    notes: 'Verified GSTIN and PAN.',
  },
  {
    id: 'ah-2',
    tenantId: 'tenant-4',
    tenantName: 'Global Logistics Hub',
    action: 'info_requested',
    actedBy: 'admin-1',
    timestamp: new Date('2026-03-04T10:00:00'),
    notes: 'Please provide corporate incorporation certificate to proceed with Enterprise tier.',
  },
  {
    id: 'ah-3',
    tenantId: 'tenant-5',
    tenantName: 'Scammy Ventures',
    action: 'rejected',
    actedBy: 'admin-1',
    timestamp: new Date('2026-03-04T10:00:00'),
    notes: 'GSTIN invalid, failed KYC checks.',
  }
];

// Mock Products for Vendor
export const mockProducts: any[] = [
  {
    id: "prod-milk-1",
    name: "A2 Buffalo Milk",
    description: "A2 Natural Buffalo Milk.",
    size: "500 ML",
    compareAtPrice: "65",
    notificationEmail: "milk-orders@localhubs.com",
    redirectUrl: "https://localhubs.com/payment-success",
    autoGenerateNumbers: true,
    category: "Dairy",
    status: "active",
    orgId: "tenant-1",
    createdAt: new Date("2026-03-04T10:00:00"),
    plans: [
      { id: "plan-milk-1", name: "Daily Subscription", price: 60, interval: "daily", status: "active" }
    ],
    addons: []
  },
  {
    id: "prod-milk-2",
    name: "Cow Milk",
    description: "Fresh Farm Cow Milk.",
    size: "500 ML",
    compareAtPrice: "45",
    notificationEmail: "milk-orders@localhubs.com",
    redirectUrl: "https://localhubs.com/payment-success",
    autoGenerateNumbers: true,
    category: "Dairy",
    status: "active",
    orgId: "tenant-1",
    createdAt: new Date("2026-03-04T10:00:00"),
    plans: [
      { id: "plan-milk-2", name: "Daily Subscription", price: 42, interval: "daily", status: "active" }
    ],
    addons: []
  },
  {
    id: "prod-milk-3",
    name: "Toned Milk",
    description: "Low-fat Toned Milk.",
    size: "500 ML",
    compareAtPrice: "36",
    notificationEmail: "milk-orders@localhubs.com",
    redirectUrl: "https://localhubs.com/payment-success",
    autoGenerateNumbers: true,
    category: "Dairy",
    status: "active",
    orgId: "tenant-1",
    createdAt: new Date("2026-03-04T10:00:00"),
    plans: [
      { id: "plan-milk-3", name: "Daily Subscription", price: 34, interval: "daily", status: "active" }
    ],
    addons: []
  },
  {
    id: "prod-milk-4",
    name: "A2 Desi Cow Milk",
    description: "Premium A2 Desi Cow Milk.",
    size: "500 ML",
    compareAtPrice: "68",
    notificationEmail: "milk-orders@localhubs.com",
    redirectUrl: "https://localhubs.com/payment-success",
    autoGenerateNumbers: true,
    category: "Dairy",
    status: "active",
    orgId: "tenant-1",
    createdAt: new Date("2026-03-04T10:00:00"),
    plans: [
      { id: "plan-milk-4", name: "Daily Subscription", price: 62, interval: "daily", status: "active" }
    ],
    addons: []
  },
  {
    id: "prod-2",
    name: "Premium Sona Masoori Rice (25kg)",
    description: "Aged premium quality rice for daily consumption.",
    notificationEmail: "sales@localhubs.com",
    redirectUrl: "https://localhubs.com/payment-success",
    autoGenerateNumbers: false,
    category: "Grains",
    status: "active",
    orgId: "tenant-2",
    createdAt: new Date("2026-03-04T10:00:00"),
    plans: [
      { id: "plan-3", name: "Quarterly Supply", price: 3200, interval: "quarterly", status: "active" },
      { id: "plan-4", name: "One-Time Purchase", price: 1200, interval: "one-time", status: "active" }
    ],
    addons: []
  }
];