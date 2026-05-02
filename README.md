# Job Tracker - Frontend

A modern web application for tracking job applications. Built with React and TypeScript.

**Live Demo:** https://job-tracker-frontend-six-pi.vercel.app

---

## Features

- User registration and login (JWT authentication)
- Add, edit, delete job applications
- Update job status (Applied → Interview → Offer → Rejected)
- Edit notes for each application
- Search and filter jobs
- Responsive design (mobile, tablet, desktop)

---

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Axios
- CSS (inline styling)

---

## Quick Start

### Prerequisites
- Node.js v16+
- npm

### Installation

```bash
# Clone repo
git clone https://github.com/SushmaTadiparthi/job-tracker-frontend.git
cd job-tracker-frontend

# Install dependencies
npm install

# Create .env.local
echo "VITE_API_URL=http://localhost:8080" > .env.local

# Run development server
npm run dev
```

Open http://localhost:5173 in your browser.

---

## How to Use

1. **Sign up** - Create a new account with email and password
2. **Login** - Use your credentials to login
3. **Add job** - Click "+ Add Application" and fill in job details
4. **Track** - View all applications on dashboard
5. **Update** - Change status using the dropdown on each job card
6. **Edit notes** - Click "Edit Notes" to add/update notes
7. **Delete** - Remove applications with delete button
8. **Search** - Use search bar to find jobs by company or role

---

## Project Structure

src/
├── pages/
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   └── Settings.tsx
├── components/
│   ├── JobCard.tsx
│   └── Toast.tsx
├── context/
│   └── AuthContext.tsx
├── api/
│   └── axios.ts
├── types/
│   └── index.ts
└── App.tsx

---

## Authentication

Uses JWT (JSON Web Token):
- Login returns a token
- Token stored in localStorage
- Every API request includes token in Authorization header
- Axios interceptor automatically adds token to requests

---

## API Integration

Backend API endpoints:
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Add job
- `PUT /api/jobs/{id}` - Update job
- `PUT /api/jobs/{id}/status` - Change status
- `DELETE /api/jobs/{id}` - Delete job

---

## Deployment

Deployed on **Vercel**. Auto-deploys when you push to GitHub.

### Environment Variables

Create `.env.local`:

VITE_API_URL=http://localhost:8080

For production (set in Vercel):
VITE_API_URL=https://job-tracker-backend-q1yc.onrender.com

---

## Common Issues

**Q: Cannot reach backend API**
- Check backend is running
- Verify VITE_API_URL is correct

**Q: Login not working**
- Check email/password are correct
- Open browser console (F12) to see errors

**Q: Jobs not loading**
- Try logging out and logging in again
- Check browser Network tab for API errors

---

## Backend Repository

https://github.com/SushmaTadiparthi/job-tracker-backend

---

**Built by Sushma Tadiparthi | May 2026**
