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
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
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
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
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
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];


// Mock Users
export const mockAdminUser: User = {
  id: 'admin-1',
  email: 'admin@subflow.com',
  name: 'Admin User',
  role: 'admin',
  status: 'active',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockTenantUsers: User[] = [
  {
    id: 'user-1',
    email: 'owner@techcorp.com',
    name: 'Raj Kumar',
    phone: '+91 9876543210',
    role: 'tenant-owner',
    tenantId: 'tenant-1',
    status: 'active',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'user-2',
    email: 'billing@techcorp.com',
    name: 'Priya Singh',
    phone: '+91 9876543211',
    role: 'tenant-user',
    tenantId: 'tenant-1',
    status: 'active',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: 'user-3',
    email: 'owner@innovate.com',
    name: 'Amit Patel',
    phone: '+91 9876543212',
    role: 'tenant-owner',
    tenantId: 'tenant-2',
    status: 'active',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
];

// Mock Tenants
export const mockTenants: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'TechCorp Solutions',
    email: 'contact@techcorp.com',
    phone: '+91 9876543210',
    gstNumber: '18AABCT1234F1Z0',
    panNumber: 'AAACT1234F',
    address: '123 Tech Park, MG Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pinCode: '560001',
    status: 'active',
    subscriptionPlanId: 'plan-pro',
    industryType: 'Technology',
    planTier: 'Growth',
    users: [mockTenantUsers[0], mockTenantUsers[1]],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    maxUsers: 25,
    currentUsersCount: 2,
  },
  {
    id: 'tenant-2',
    name: 'Innovate Business Services',
    email: 'hello@innovate.com',
    phone: '+91 9876543212',
    gstNumber: '18AABCT5678F1Z0',
    panNumber: 'AABCT5678F',
    address: '456 Innovation Hub, Whitefield',
    city: 'Bangalore',
    state: 'Karnataka',
    pinCode: '560066',
    status: 'active',
    subscriptionPlanId: 'plan-basic',
    industryType: 'Consulting',
    planTier: 'Starter',
    users: [mockTenantUsers[2]],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
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
    startDate: new Date('2024-02-01'),
    endDate: new Date('2025-02-01'),
    autoRenew: true,
    totalAmount: 95988,
    paidAmount: 95988,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
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
    startDate: new Date('2024-03-01'),
    endDate: new Date('2025-03-01'),
    autoRenew: true,
    totalAmount: 35988,
    paidAmount: 0,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
    failureCount: 2,
    lastFailureDate: new Date('2024-12-10'),
    nextRetryDate: new Date('2024-12-17'),
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
    invoiceNumber: 'INV-2024-001',
    amount: 9499,
    currency: 'INR',
    tax: 1710,
    totalAmount: 11209,
    status: 'paid',
    issueDate: new Date('2024-02-01'),
    dueDate: new Date('2024-02-15'),
    paidDate: new Date('2024-02-10'),
    items: mockInvoiceItems,
    paymentMethod: 'Razorpay',
    razorpayOrderId: 'order_123456789',
    razorpayPaymentId: 'pay_123456789',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: 'inv-002',
    tenantId: 'tenant-1',
    invoiceNumber: 'INV-2024-002',
    amount: 9499,
    currency: 'INR',
    tax: 1710,
    totalAmount: 11209,
    status: 'sent',
    issueDate: new Date('2024-03-01'),
    dueDate: new Date('2024-03-15'),
    items: mockInvoiceItems,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: 'inv-003',
    tenantId: 'tenant-2',
    invoiceNumber: 'INV-2024-003',
    customerId: 'cust-2',
    planName: 'Basic Monthly',
    amount: 2999,
    currency: 'INR',
    tax: 539,
    totalAmount: 3538,
    status: 'overdue',
    issueDate: new Date('2024-02-15'),
    dueDate: new Date('2024-03-01'),
    items: [
      {
        id: 'item-3',
        description: 'Basic Plan - Monthly Subscription',
        quantity: 1,
        unitPrice: 2999,
        amount: 2999,
      },
    ],
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: 'inv-004',
    tenantId: 'tenant-1',
    invoiceNumber: 'INV-2024-004',
    customerId: 'cust-1',
    planName: 'Professional Monthly',
    amount: 7999,
    currency: 'INR',
    tax: 1438,
    totalAmount: 9437,
    status: 'sent',
    issueDate: new Date('2024-04-01'),
    dueDate: new Date('2024-04-15'),
    items: [
      {
        id: 'item-4',
        description: 'Professional Plan - Monthly Subscription',
        quantity: 1,
        unitPrice: 7999,
        amount: 7999,
      },
    ],
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-01'),
  },
  {
    id: 'inv-005',
    tenantId: 'tenant-1',
    invoiceNumber: 'INV-2024-005',
    customerId: 'cust-3',
    planName: 'Basic Monthly',
    amount: 2999,
    currency: 'INR',
    tax: 539,
    totalAmount: 3538,
    status: 'cancelled',
    issueDate: new Date('2024-05-01'),
    dueDate: new Date('2024-05-15'),
    items: [
      {
        id: 'item-5',
        description: 'Basic Plan - Monthly Subscription',
        quantity: 1,
        unitPrice: 2999,
        amount: 2999,
      },
    ],
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-05-05'),
  },
];

// Mock Usage Events (Metered Billing)
export const mockUsageEvents: UsageEvent[] = [
  {
    id: 'usage-1',
    subscriptionId: 'sub-1',
    metricName: 'API Calls',
    quantity: 250,
    timestamp: new Date('2024-12-10T08:00:00'),
    createdAt: new Date('2024-12-10T08:00:00'),
  },
  {
    id: 'usage-2',
    subscriptionId: 'sub-1',
    metricName: 'API Calls',
    quantity: 180,
    timestamp: new Date('2024-12-11T10:30:00'),
    createdAt: new Date('2024-12-11T10:30:00'),
  },
  {
    id: 'usage-3',
    subscriptionId: 'sub-1',
    metricName: 'Storage (GB)',
    quantity: 50,
    timestamp: new Date('2024-12-12T14:15:00'),
    createdAt: new Date('2024-12-12T14:15:00'),
  },
  {
    id: 'usage-4',
    subscriptionId: 'sub-1',
    metricName: 'API Calls',
    quantity: 320,
    timestamp: new Date('2024-12-13T09:45:00'),
    createdAt: new Date('2024-12-13T09:45:00'),
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
    lastAttemptDate: new Date('2024-12-10T10:00:00'),
    nextRetryDate: new Date('2024-12-17T10:00:00'),
    failureReason: 'Insufficient funds',
    createdAt: new Date('2024-12-10T10:00:00'),
    updatedAt: new Date('2024-12-10T10:00:00'),
  },
  {
    id: 'dunning-2',
    subscriptionId: 'sub-2',
    invoiceId: 'inv-003',
    attemptNumber: 2,
    status: 'active',
    lastAttemptDate: new Date('2024-12-12T10:00:00'),
    nextRetryDate: new Date('2024-12-19T10:00:00'),
    failureReason: 'Card declined',
    createdAt: new Date('2024-12-12T10:00:00'),
    updatedAt: new Date('2024-12-12T10:00:00'),
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
    effectiveDate: new Date('2024-06-01'),
    createdAt: new Date('2024-06-01'),
  },
  {
    id: 'lifecycle-2',
    subscriptionId: 'sub-1',
    eventType: 'renew',
    newPlanId: 'plan-pro',
    effectiveDate: new Date('2025-02-01'),
    createdAt: new Date('2025-02-01'),
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
  timestamp: new Date('2024-12-13'),
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
  }
];

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: 'cust-1',
    tenantId: 'tenant-1',
    name: 'Anjali Sharma',
    email: 'anjali@example.com',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: 'cust-2',
    tenantId: 'tenant-1',
    name: 'Vikram Singh',
    email: 'vikram@example.com',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'cust-3',
    tenantId: 'tenant-1',
    name: 'Suresh Raina',
    email: 'suresh@example.com',
    status: 'inactive',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  }
];

// Mock Customer Subscriptions
export const mockCustomerSubscriptions: CustomerSubscription[] = [
  {
    id: 'cs-1',
    customerId: 'cust-1',
    tenantId: 'tenant-1',
    planId: 'bp-milk-daily',
    status: 'active',
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-02-10'),
    autoRenew: true,
    totalAmount: 1500,
    paidAmount: 1500,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: 'cs-2',
    customerId: 'cust-2',
    tenantId: 'tenant-1',
    planId: 'bp-rice-monthly',
    status: 'active',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-02-15'),
    autoRenew: true,
    totalAmount: 3500,
    paidAmount: 3500,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
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
    issueDate: new Date('2024-01-10'),
    dueDate: new Date('2024-01-20'),
    paidDate: new Date('2024-01-12'),
    items: [
      { id: 'cii-1', description: 'Daily Milk Delivery', quantity: 1, unitPrice: 1500, amount: 1500 }
    ],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
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
    issueDate: new Date('2024-02-01'),
    dueDate: new Date('2024-02-15'),
    items: [
      { id: 'cii-2', description: 'Monthly Rice Supply', quantity: 1, unitPrice: 2000, amount: 2000 }
    ],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  }
];

export const mockDemoRequests: DemoRequest[] = [
  {
    id: 'demo-1',
    fullName: 'Arjun Mehta',
    workEmail: 'arjun@fintech-leads.in',
    companyName: 'FinLeads India',
    companySize: '11-50',
    industry: 'fintech',
    phone: '9876543210',
    expectedRevenue: '10-50-lakh',
    preferredDate: '2024-12-20',
    preferredTimeSlot: 'morning',
    status: 'pending',
    createdAt: new Date('2024-12-12T10:30:00'),
  },
  {
    id: 'demo-2',
    fullName: 'Sanya Gupta',
    workEmail: 'sanya@edu-tech.com',
    companyName: 'EduBoost',
    companySize: '51-200',
    industry: 'education',
    phone: '9823456781',
    expectedRevenue: '5-10-lakh',
    preferredDate: '2024-12-22',
    preferredTimeSlot: 'afternoon',
    status: 'scheduled',
    createdAt: new Date('2024-12-11T15:45:00'),
  }
];

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
  { id: 'al-1', user_id: 'admin-1', action: 'tenant.created', entity: 'TechCorp Solutions', timestamp: new Date('2024-02-01T10:00:00'), ip_address: '192.168.1.1' },
  { id: 'al-2', user_id: 'admin-1', action: 'plan.updated', entity: 'Professional Tier', timestamp: new Date('2024-02-15T14:30:00'), ip_address: '192.168.1.1' },
  { id: 'al-3', user_id: 'user-1', action: 'invoice.paid', entity: 'INV-2024-001', timestamp: new Date('2024-02-10T09:15:00'), ip_address: '203.0.113.42' },
  { id: 'al-4', user_id: 'admin-1', action: 'tenant.suspended', entity: 'Globex Corp', timestamp: new Date('2024-03-05T16:45:00'), ip_address: '192.168.1.1' },
  { id: 'al-5', user_id: 'user-3', action: 'subscription.upgraded', entity: 'Innovate Business', timestamp: new Date('2024-04-12T11:20:00'), ip_address: '198.51.100.7' },
];

// Mock Tenant Approval History
export const mockApprovalHistory = [
  {
    id: 'ah-1',
    tenantId: 'tenant-1',
    tenantName: 'TechCorp Solutions',
    action: 'approved',
    actedBy: 'admin-1',
    timestamp: new Date('2024-02-01T10:05:00'),
    notes: 'Verified GSTIN and PAN.',
  },
  {
    id: 'ah-2',
    tenantId: 'tenant-4',
    tenantName: 'Global Logistics Hub',
    action: 'info_requested',
    actedBy: 'admin-1',
    timestamp: new Date('2024-12-12T10:00:00'),
    notes: 'Please provide corporate incorporation certificate to proceed with Enterprise tier.',
  },
  {
    id: 'ah-3',
    tenantId: 'tenant-5',
    tenantName: 'Scammy Ventures',
    action: 'rejected',
    actedBy: 'admin-1',
    timestamp: new Date('2024-11-20T16:20:00'),
    notes: 'GSTIN invalid, failed KYC checks.',
  }
];

// Mock Products for Vendor
export const mockProducts: any[] = [
  {
    id: "prod-1",
    name: "Daily Fresh Milk (1L)",
    description: "Pure cow milk delivered fresh to your doorstep every morning.",
    notificationEmail: "milk-orders@localhubs.com",
    redirectUrl: "https://localhubs.com/payment-success?invoice=%InvoiceNumber%",
    autoGenerateNumbers: true,
    category: "Dairy",
    status: "active",
    orgId: "tenant-1",
    createdAt: new Date("2024-01-15T08:00:00"),
    plans: [
      { id: "plan-1", name: "Monthly Subscription", price: 1800, interval: "monthly", status: "active" },
      { id: "plan-2", name: "Weekly Trial", price: 450, interval: "weekly", status: "active" }
    ],
    addons: [
      { id: "addon-1", name: "Extra Cream Packet", price: 20 },
      { id: "addon-2", name: "Weekend Special Paneer", price: 150 }
    ]
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
    createdAt: new Date("2024-02-10T10:30:00"),
    plans: [
      { id: "plan-3", name: "Quarterly Supply", price: 3200, interval: "quarterly", status: "active" },
      { id: "plan-4", name: "One-Time Purchase", price: 1200, interval: "one-time", status: "active" }
    ],
    addons: []
  },
  {
    id: "prod-3",
    name: "Filtered Drinking Water (20L Cans)",
    description: "RO purified drinking water delivery.",
    notificationEmail: "water@localhubs.com",
    redirectUrl: "",
    autoGenerateNumbers: true,
    category: "Water",
    status: "archived",
    orgId: "tenant-1",
    createdAt: new Date("2023-11-05T09:00:00"),
    plans: [
      { id: "plan-5", name: "Monthly Config - 10 Cans", price: 600, interval: "monthly", status: "archived" }
    ],
    addons: []
  }
];