# CampusFlex - Smart Jobs. Flexible Future.

![CampusFlex Banner](https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80)

CampusFlex is a commercial-grade SaaS marketplace designed specifically for university students and verified local employers. It features an automated **Smart Job Hiring Engine** that closes filled positions, an **AI Match Recommendation System**, a **Digital Student Work ID with QR Code**, **Real-Time Direct Messaging**, and **Multi-Role Dashboards** for Students, Employers, and Admins.

---

## 🚀 Key Features

### 🎓 Student Portal
- **AI Recommendation Engine**: 95%+ precision job scoring based on skills, availability, department, and location.
- **Smart Application Timeline**: Visual progress tracking (Applied → Under Review → Interview → Hired).
- **Digital Work ID Card**: Generated QR code badge for physical/digital campus job clock-in.
- **Earnings & Payout Tracker**: Clear hourly log and CSV export for part-time income.
- **Saved Jobs & Search History**: Filter by remote, weekend, evening, or department.

### 🏢 Employer Portal
- **Smart Job Auto-Close**: Post jobs with required slot count (e.g. 5 needed). When 5 applicants are accepted, job status updates to `FILLED`, hides from search, and auto-rejects pending candidates.
- **Applicant Review Center**: Compare AI match percentages, inspect student profiles, and trigger instant interview scheduling.
- **Live Student Chat**: Direct messaging interface with real-time updates.
- **Company Verification**: Instant verification application to earn the official "Verified Employer" badge.

### 🛡️ Admin Suite
- **Verification Management**: Review employer credentials and approve/reject listings.
- **User Governance**: Suspend/activate student or employer accounts.
- **Platform Analytics**: Total jobs, fill rate ratio, application volume graphs, and CSV data downloads.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Glassmorphism design tokens
- **Icons**: Lucide React Icons
- **Animations**: Framer Motion & Canvas Confetti
- **State Management**: Zustand with LocalStorage state persistence
- **Deployment**: Vercel ready

---

## 💻 Local Development Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
http://localhost:3000
```

---

## 🌐 Deploy to Vercel

1. Push this repository to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import your `campusflex` repository.
4. Click **Deploy**. Vercel will automatically build and assign a `.vercel.app` URL!

---

## 👑 Quick Demo Roles

Use the top navigation bar **Role Switcher** on the live deployment to instantly test all three roles:
- **Student Mode**: Demo as Alex Rivera (Computer Science senior)
- **Employer Mode**: Demo as TechCorp Inc. (Verified employer)
- **Admin Mode**: Demo as Campus Operations Admin
