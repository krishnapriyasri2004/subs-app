# Project Documentation - Users & Limitations

## 1.1.3 USERS
The system caters to four primary user roles, each with a distinct set of responsibilities and access levels:

### 1. **Superadmin (Platform Owner)**
The ultimate authority of the platform, responsible for global configuration and ecosystem management.
- **Key Responsibilities:** Managing platform-wide settings, overseeing all vendors, defining overarching subscription models for the platform, and accessing global financial analytics.
- **Capabilities:** User role assignment, vendor account approval, system health monitoring, and managing global support tickets.

### 2. **Admin (Platform Manager)**
The day-to-day operational managers who ensure the smooth running of the platform.
- **Key Responsibilities:** Operational overhead, vendor support, and system moderation.
- **Capabilities:** Auditing logs, managing support tickets, reviewing vendor activities, and assisting vendors with configuration issues.

### 3. **Vendor (Business Operator)**
Individual business owners who use the infrastructure to sell products and manage their subscribers.
- **Key Responsibilities:** Catalog management, customer relationship management (CRM), inventory tracking, and subscription fulfillment.
- **Capabilities:** Defining product pricing (e.g., Grains, Dairy), managing their own storefront within the platform, setting up coupons/discounts, and tracking their business revenue.

### 4. **Customer (End User / Subscriber)**
The primary consumers who interact with vendor stores to subscribe to services.
- **Key Responsibilities:** Managing personal profiles, maintaining a wallet balance for recurring subscriptions, and setting delivery preferences.
- **Capabilities:** Discovering vendors, subscribing to products through a personalized onboarding flow, tracking orders, and viewing invoices/billing history.

---

## 1.1.4 LIMITATIONS
While the system is robust and scalable, certain constraints are defined for the current iteration:

### 1. **Payment Gateway Integration**
- **Current Support:** The platform is optimized for specific payment gateways (Razorpay/Stripe) or manual wallet recharges.
- **Limitation:** Third-party global gateways outside the predefined list may require additional custom integration effort.

### 2. **Multi-Currency & Regionalization**
- **Current Support:** The system default is set to a single base currency (e.g., INR) with standard regional settings.
- **Limitation:** Native multi-currency support and localized taxation rules for international regions are not fully automated in the current version.

### 3. **Native Mobile Experience**
- **Current Support:** The platform is built as a fully responsive Web Application (PWA ready).
- **Limitation:** There are no native iOS or Android apps currently available; all interactions must happen via a mobile or desktop browser.

### 4. **Advanced Customization**
- **Current Support:** Vendors have access to pre-defined layout templates for their storefronts.
- **Limitation:** Full CSS/HTML level customization for each individual vendor storefront is restricted to maintain platform performance and visual consistency.

### 5. **Offline Capabilities**
- **Current Support:** Some data is cached locally via the browser state.
- **Limitation:** An active internet connection is required for critical functions like payment processing, real-time stock updates, and subscription renewals.

### 6. **Reporting Depth**
- **Current Support:** Standard dashboards provide overview analytics for revenue, orders, and customer growth.
- **Limitation:** Ad-hoc report generation using complex custom filters or high-level BI (Business Intelligence) modeling is outside the current scope.
