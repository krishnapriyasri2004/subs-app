# Implementation Report: Payment & SMS Automation System

This report outlines the strategy and technical roadmap for implementing the client's recent requests regarding **Advance Payments**, **Automated SMS notifications**, and **Payment Gateway integration**.

## 1. Requirement Overview

Based on the client input, the system must support:
- **Advance Payment**: Support for 50% upfront payments to confirm orders. It reduces risk for vendors and confirms buyer commitment.
- **Automated SMS**: Triggering SMS notifications with secure payment links upon order/service confirmation and recurring monthly billing (1st of every month).
- **Payment Gateway**: Integration of a secure gateway (Razorpay) supporting UPI, Cards, and Net Banking with full encryption and fraud protection.
- **Vendor Controls**: Ability for vendors to manually select unpaid customers and send payment links.

---

## 2. Technical Roadmap

### Phase 1: Payment Gateway Integration (Foundation)
We will leverage **Razorpay** (as indicated by existing project utilities) for its robust support of the Indian market and simplified tokenization.

- **Tasks**:
  1. Initialize Razorpay API on the backend (`lib/razorpay.ts`).
  2. Create secure API routes for `create-order` and `verify-payment`.
  3. Implement webhook handling for real-time payment status updates in Firestore.

### Phase 2: Advance Payment Logic
Modify the core order processing flow to handle split payments.

- **Functional Changes**:
  - Add `isAdvancePayment` flag to order objects.
  - Calculate `advanceAmount` (50% of total) and `balanceAmount`.
  - Update UI to allow customers to pay only the advance amount to "Confirm" the order.
  - Track payment progress (e.g., `PAYMENT_PARTIAL`, `PAYMENT_COMPLETED`).

### Phase 3: Automated SMS & Payment Links
Integration with an SMS provider (e.g., Twilio, Msg91, or Razorpay's native Link API).

- **Implementation**:
  - **Hooks**: Trigger SMS on Firestore `onCreate` for orders and service requests.
  - **Payment Links**: Use Razorpay Payment Links API to generate unique, trackable URLs.
  - **Cron Jobs**: Scheduled cloud function to identify unpaid monthly subscriptions (1st of the month) and blast SMS links.

### Phase 4: Vendor Management Dashboard
Enhanced interface for vendors to manage receivables.

- **Features**:
  - "Unpaid Customers" filter in the vendor dashboard.
  - manual "Select & Send" trigger for payment links to unpaid segments.
  - Visual status indicators for "Advance Paid" vs "Fully Paid".

---

## 3. Database Schema Updates (Firestore)

To support these features, we will extend the current data models:

| Collection | Field | Type | Description |
| :--- | :--- | :--- | :--- |
| **Orders** | `totalAmount` | Number | Total cost of order |
| | `amountPaid` | Number | Tracks total received so far |
| | `paymentStatus` | String | `pending`, `partial`, `paid` |
| | `advancePaid` | Boolean | True if 50% advance is cleared |
| | `paymentLinkId` | String | Razorpay specific link reference |
| **Customers** | `lastSmsSent` | Timestamp | Anti-spam/tracking for reminders |
| | `registeredMobile` | String | Target for SMS notifications |

---

## 4. Proposed UI/UX Enhancements

1.  **Checkout Page**: Toggle for "Pay Full Amount" vs "Pay 50% Advance".
2.  **Vendor Dashboard**: A new "Payments" tab with a list of active payment links and their status (Sent, Opened, Paid).
3.  **Customer Portal**: "My Payments" section showing invoice history and quick-pay buttons for balances.

---

## 5. Security & Compliance
- **Encryption**: All transactions handled via HTTPS and Razorpay's PCI-DSS compliant infrastructure.
- **Data Privacy**: SMS will contain tokens, not raw customer details.
- **Fraud Protection**: Implementing checksum verification on all payment webhooks.

---

## Next Steps
1. **Approve SMS Provider**: Select between Twilio, Msg91, or utilizing Razorpay's SMS.
2. **Schema Migration**: Update Firestore types and existing mock data.
3. **API Key Setup**: Secure environment variables for Razorpay and SMS service.
