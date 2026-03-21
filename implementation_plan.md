# Insurance Policy Management System — MERN + MVC

A college-level full-stack MERN application with three user panels (Customer, Agent, Admin) covering policy management, premium payments, and claim processing.

## Proposed Changes

### Project Structure

```
InsuraceWeb/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Policy.js
│   │   ├── Purchase.js
│   │   ├── Premium.js
│   │   └── Claim.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── policyController.js
│   │   ├── purchaseController.js
│   │   ├── premiumController.js
│   │   ├── claimController.js
│   │   └── adminController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── policyRoutes.js
│   │   ├── purchaseRoutes.js
│   │   ├── premiumRoutes.js
│   │   ├── claimRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
└── frontend/
    └── (React + Vite app)
        ├── src/
        │   ├── components/  (Navbar, ProtectedRoute)
        │   ├── pages/
        │   │   ├── auth/        (Login, Register)
        │   │   ├── customer/    (Dashboard, Policies, PurchasePolicy, Premiums, Claims)
        │   │   ├── agent/       (Dashboard, ManagePolicies, ReviewApplications, ProcessClaims)
        │   │   └── admin/       (Dashboard, ManageUsers, MonitorPolicies, Reports)
        │   ├── context/  (AuthContext.jsx)
        │   ├── App.jsx
        │   ├── main.jsx
        │   └── index.css
        └── package.json
```

---

### Backend — Models (Mongoose)

#### [NEW] `User.js` — name, email, password (hashed), phone, role (`customer`|`agent`|`admin`)
#### [NEW] `Policy.js` — title, description, type (Health/Life/Vehicle/Home/Travel), premiumAmount, coverageAmount, duration, status, createdBy (agent ref)
#### [NEW] `Purchase.js` — customer ref, policy ref, startDate, endDate, status (`active`|`expired`|`cancelled`)
#### [NEW] `Premium.js` — purchase ref, customer ref, amount, dueDate, paidDate, status (`pending`|`paid`|`overdue`)
#### [NEW] `Claim.js` — purchase ref, customer ref, description, claimAmount, status (`pending`|`approved`|`rejected`), processedBy (agent ref), remarks

---

### Backend — Controllers & Routes

| Controller | Key Endpoints |
|---|---|
| **authController** | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| **policyController** | CRUD for policies (agent creates, customers view available) |
| **purchaseController** | Customer purchases a policy, view purchases |
| **premiumController** | Pay premium, view premium history |
| **claimController** | Submit claim, track status, agent processes claim |
| **adminController** | Manage users, approve/deactivate policies, dashboard stats |

---

### Backend — Middleware

#### [NEW] `auth.js` — JWT verification + role-based access (`authorize('admin', 'agent')`)

---

### Frontend — Pages by Panel

| Panel | Pages |
|---|---|
| **Auth** | Login, Register |
| **Customer** | Dashboard, ViewPolicies, PurchasePolicy, MyPolicies, PayPremium, SubmitClaim, TrackClaims |
| **Agent** | Dashboard, CreatePolicy, ManagePolicies, ReviewApplications, ProcessClaims |
| **Admin** | Dashboard, ManageUsers, MonitorPolicies, Reports |

---

### Design Approach

- **Dark theme** with vibrant gradients (blue-purple accent palette)
- Google Font **Inter** for typography
- Smooth hover animations and card-based layouts
- Responsive sidebar navigation per panel
- Status badges with color-coded chips (green=active, red=rejected, orange=pending)

---

## Verification Plan

### Automated (API Testing)
1. Start backend: `cd backend && npm run dev`
2. Use browser subagent to verify the frontend loads and pages render
3. Test API endpoints with `curl` or similar

### Manual Verification
1. **Register** a customer, agent, and admin account
2. **Agent** creates a policy → verify it appears in customer's "Available Policies"
3. **Customer** purchases a policy → verify purchase record created
4. **Customer** pays a premium → verify premium status updates
5. **Customer** submits a claim → verify claim appears in agent's panel
6. **Agent** approves/rejects claim → verify customer sees updated status
7. **Admin** views dashboard stats, manages users, approves/deactivates policies

> [!NOTE]
> MongoDB must be running locally on the default port (27017). The project will use `mongoose` to connect.
