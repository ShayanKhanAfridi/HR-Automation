# HireAI - AI-Powered HR Automation Platform

A production-ready, enterprise-grade HR Automation SaaS application with a modern, clean UI built with React, TypeScript, and Supabase.

## Features

### Landing Page
- Premium hero section with gradient backgrounds
- Features showcase with 6 key capabilities
- Visual "How It Works" flow
- Pricing section with 3 tier plans
- Customer testimonials
- FAQ section with 8+ questions
- CTA banner and comprehensive footer

### Authentication System
- Email/password authentication with Supabase
- Google OAuth integration
- Password reset functionality
- Email verification ready
- Password strength validation
- Terms & Conditions acceptance modal
- Session persistence

### Dashboard Modules

#### 1. Dashboard Overview
- Stats cards: Total Jobs, Candidates, Interviews, Employees
- Pie chart: Candidates by stage
- Bar chart: Hiring funnel
- Recent activity feed
- Quick actions

#### 2. Job Postings
- Create and manage job postings
- Upload job banner images (ready for AI extraction)
- Post to LinkedIn and Instagram
- Track posting status

#### 3. Candidates
- View all screened candidates
- Filter by status: Applied, Keep in View, Shortlisted, Rejected
- AI screening scores
- Detailed candidate profiles
- Resume management

#### 4. AI Interviews
- View scheduled and completed interviews
- Interview status tracking
- View transcripts for completed interviews
- AI scoring and analysis

#### 5. Onboarding & Performance
- Employee onboarding status tracking
- Performance score visualization
- Bar chart analytics
- Individual performance metrics

#### 6. Attendance
- Daily attendance logs
- Calendar date selector
- Check-in/check-out times
- Status tracking (Present, Late, Absent, Half Day)
- Export functionality

#### 7. Payroll
- Monthly salary records
- Base salary, bonuses, deductions breakdown
- Payment status tracking
- Filter by month and year
- Total paid vs pending overview

#### 8. Analytics
- Comprehensive hiring metrics
- Pie chart: Hiring funnel
- Bar chart: Applications vs Hires
- Line chart: Hiring trends
- Key performance indicators

#### 9. Settings
- Company information
- AI API key configuration
- Social media integration toggles
- LinkedIn and Instagram settings

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **Charts**: Recharts
- **Routing**: React Router DOM v6
- **Backend**: Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Database setup:
   - The database schema has been created via migrations
   - All tables include Row Level Security (RLS) policies
   - No manual setup required

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   └── StatsCard.tsx
│   ├── DashboardLayout.tsx  # Dashboard wrapper with sidebar
│   └── ProtectedRoute.tsx   # Auth guard component
├── contexts/
│   └── AuthContext.tsx      # Authentication context
├── lib/
│   └── supabase.ts          # Supabase client configuration
├── pages/
│   ├── LandingPage.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── ForgotPassword.tsx
│   └── dashboard/
│       ├── DashboardOverview.tsx
│       ├── JobPostings.tsx
│       ├── Candidates.tsx
│       ├── Interviews.tsx
│       ├── Onboarding.tsx
│       ├── Attendance.tsx
│       ├── Payroll.tsx
│       ├── Analytics.tsx
│       └── Settings.tsx
├── services/
│   └── api.ts               # API service layer for AI integrations
├── types/
│   └── index.ts             # TypeScript type definitions
├── App.tsx                  # Main app with routing
└── main.tsx                 # App entry point
```

## Database Schema

### Tables

- **jobs**: Job postings with status and social media tracking
- **candidates**: Candidate information with AI screening
- **interviews**: AI interview records with transcripts
- **employees**: Employee records with performance data
- **attendance**: Daily attendance logs
- **payroll**: Monthly salary records
- **company_settings**: Company configuration and API keys

All tables include:
- Row Level Security (RLS) enabled
- User-based access policies
- Proper indexes for performance
- Timestamps for audit trails

## AI Integration Points

The application includes API service hooks for external AI systems:

- **Job Extraction**: `/api/ai/job-extraction` - Extract details from job banner images
- **Interview Transcripts**: `/api/ai/interview-transcript/:id` - Fetch AI interview transcripts
- **Candidate Screening**: `/api/ai/screen-candidate` - AI-powered candidate evaluation
- **Performance Analysis**: `/api/ai/analyze-performance/:id` - Employee performance insights

## Security Features

- Row Level Security (RLS) on all database tables
- Authentication required for all dashboard routes
- Secure password requirements
- Environment variable protection
- HTTPS-ready configuration
- Terms & Conditions acceptance

## Design Principles

- Clean, modern, enterprise-grade UI
- Professional color scheme (blue/cyan gradient primary)
- Fully responsive (mobile, tablet, desktop)
- Smooth transitions and animations
- Loading states and error handling
- Toast notifications for user feedback
- Accessible components

## Key Features

✅ Complete authentication flow with Google OAuth
✅ Protected routes with session persistence
✅ Full CRUD operations for all HR modules
✅ Real-time data updates
✅ Interactive charts and analytics
✅ Professional landing page
✅ Mobile-responsive design
✅ Production-ready code structure
✅ TypeScript for type safety
✅ Scalable architecture

## License

Proprietary - All rights reserved

## Support

For questions or issues, contact support@hireai.com
