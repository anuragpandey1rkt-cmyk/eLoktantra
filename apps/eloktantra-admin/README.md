# eLoktantra Admin Portal

A secure, high-integrity administrative interface for managing the eLoktantra digital voting platform. This portal serves as the central command for election administrators to manage content, monitor voting activity, and oversee system health.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Auth:** NextAuth (Credentials Provider)
- **Backend Sync:** Axios (with JWT Interceptors)
- **Database:** MongoDB Atlas (Mongoose)
- **Components:** Lucide React, Recharts, React Hot Toast

## 📂 Project Structure

- `app/(auth)`: Authentication flows (Login)
- `app/(dashboard)`: Protected administrative interfaces
- `components/layout`: Sidebar, Topbar, and Dashboard shell
- `components/shared`: Reusable UI elements (DataTable, Modals, Spinners)
- `lib/`: Core utilities for API, MongoDB, and Auth
- `models/`: Mongoose schemas for public content
- `types/`: Universal TypeScript interfaces

## 🛠️ Key Workflows

### 1. Content Management (MongoDB)
- **Parties:** Register national and regional parties with logos and branding.
- **Constituencies:** Manage electoral boundaries and voter demographics.
- **Candidates:** Multi-section nomination forms with legal/financial disclosure tracking.

### 2. Voting Operations (NestJS API)
- **Election Lifecycle:** Create, activate, and monitor digital elections on the blockchain.
- **Voter Registry:** Secure bulk-enrollment of citizens using cryptographic hashes.
- **Real-time Monitoring:** Live telemetry of voting transactions and system health.

### 3. System Integrity
- **Audit Logs:** Non-repudiable logs of all critical administrative actions.
- **Booth Officers:** Management of on-ground staff and kiosk authentication.

## 🚦 Getting Started

1. **Environment Setup:**
   Copy `.env.local.example` to `.env.local` and provide the following:
   - `MONGODB_URI`
   - `NESTJS_API_URL`
   - `NEXTAUTH_SECRET`
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD`

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```
   The portal will be available at `http://localhost:3001`.

## 🛡️ Security Note
All personal voter data is handled via SHA-256 hashes to ensure citizen privacy. The portal never stores or displays raw Aadhaar or biometric data.
