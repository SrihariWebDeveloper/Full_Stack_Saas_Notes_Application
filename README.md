
---

# 📝 Multi-Tenant SaaS Notes Application

## 🚀 Objective
This project is a multi-tenant SaaS Notes Application deployed on **Vercel**, designed to allow multiple companies (tenants) to securely manage their users and notes. It enforces strict data isolation, role-based access control, and subscription-based feature gating.

---

## 🧩 Features

### 1. Multi-Tenancy
- Supports two tenants: **Acme** and **Globex**
- Ensures complete data isolation between tenants
- **Chosen Approach**: _Shared schema with a `tenantId` column_  
  This approach simplifies deployment while maintaining strict access boundaries via scoped queries and middleware enforcement.

### 2. Authentication & Authorization
- JWT-based login system
- Two roles:
  - **Admin**: Can invite users and upgrade subscriptions
  - **Member**: Can create, view, edit, and delete notes
- Predefined test accounts (password: `password`):
  | Email               | Role   | Tenant  |
  |--------------------|--------|---------|
  | admin@acme.test     | Admin  | Acme    |
  | user@acme.test      | Member | Acme    |
  | admin@globex.test   | Admin  | Globex  |
  | user@globex.test    | Member | Globex  |

### 3. Subscription Feature Gating
- **Free Plan**: Max 3 notes per tenant
- **Pro Plan**: Unlimited notes
- Upgrade endpoint:  
  `POST /tenants/:slug/upgrade` (Admin only)  
  → Instantly lifts note limit upon upgrade

### 4. Notes API (CRUD)
All endpoints enforce tenant isolation and role-based access:
- `POST /notes` – Create a note
- `GET /notes` – List all notes for current tenant
- `GET /notes/:id` – Retrieve a specific note
- `PUT /notes/:id` – Update a note
- `DELETE /notes/:id` – Delete a note

### 5. Deployment
- Hosted on **Vercel** (frontend and backend)
- CORS enabled for external access
- Health check endpoint:  
  `GET /health` → `{ "status": "ok" }`

### 6. Frontend
- Minimal UI hosted on Vercel
- Supports:
  - Login with test accounts
  - Listing, creating, and deleting notes
  - “Upgrade to Pro” prompt when Free plan limit is reached

---

## ✅ Evaluation Criteria

Automated test scripts will validate:
- Health endpoint availability
- Login functionality for all test accounts
- Tenant data isolation
- Role-based access enforcement
- Subscription limit enforcement and upgrade behavior
- CRUD operations
- Frontend accessibility and functionality

---
## 🚀 Deployment Steps

### 1. Prerequisites
- Node.js ≥ 18.x
- Vercel account (https://vercel.com)
- GitHub repository (connected to Vercel)
- Environment variables configured (see below)

---

### 2. Backend Deployment
- **Framework**: Next.js API routes or Express (wrapped in Next.js if needed)
- **Steps**:
  1. Push backend code to a GitHub repo.
  2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
  3. Select your backend repo and configure:
     - **Root directory**: `/api` or project root depending on structure
     - **Build command**: `npm run build`
     - **Output directory**: `.vercel/output` or default
  4. Set environment variables:
     - `JWT_SECRET`
     - `DATABASE_URL`
     - `CORS_ORIGIN`
  5. Deploy and verify:
     - Visit `/health` → should return `{ "status": "ok" }`

---

### 3. Frontend Deployment
- **Framework**: Next.js or React
- **Steps**:
  1. Push frontend code to a GitHub repo.
  2. Add it as a new project in Vercel.
  3. Configure:
     - **Build command**: `npm run build`
     - **Output directory**: `.next` or default
  4. Set environment variables:
     - `API_BASE_URL` 
  5. Deploy and verify:
     - Login page loads
     - Notes list and CRUD actions work
     - “Upgrade to Pro” appears when note limit is reached

---

### 4. Post-Deployment Checklist
- ✅ CORS enabled for API
- ✅ Health endpoint returns OK
- ✅ All test accounts work
- ✅ Role-based access enforced
- ✅ Note limits and upgrade flow functional
- ✅ Frontend accessible via public URL

---

# Live Link 
(https://full-stack-saas-notes-application.vercel.app)
