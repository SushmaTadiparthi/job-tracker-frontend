Job Tracker - Frontend


A modern, responsive web application built with React and TypeScript for tracking job applications.

Live Demo: https://job-tracker-frontend-six-pi.vercel.app


Features
✅ User Authentication

Register new account
Login with email & password
Secure JWT token management
Protected routes (only logged-in users can access dashboard)

✅ Job Application Management

Add new job applications
View all applications in a list
Edit job notes
Update application status (Applied → Interview → Offer → Rejected)
Delete applications
Search and filter applications

✅ User Experience

Clean, professional UI
Responsive design (works on mobile, tablet, desktop)
Real-time search
Toast notifications for actions (success/error)
Profile dropdown menu

✅ Data Persistence

Applications stored securely on backend
Automatic token refresh
Login persists across page reloads


Tech Stack
React 18 - UI library
TypeScript - Type-safe JavaScript
Vite - Fast build tool
React Router - Page navigation
Axios - API requests
CSS - Styling (no external UI library)


Project Structure
src/

├── pages/

│   ├── Login.tsx          # Login page

│   ├── Register.tsx       # Registration page

│   ├── Dashboard.tsx      # Main dashboard with job list

│   └── Settings.tsx       # User settings & account management

├── components/

│   ├── JobCard.tsx        # Individual job card component

│   └── Toast.tsx          # Toast notification component

├── context/

│   └── AuthContext.tsx    # Global authentication state

├── api/

│   └── axios.ts           # API client with JWT interceptor

├── types/

│   └── index.ts           # TypeScript type definitions

└── App.tsx                # Main app component with routing


Setup & Installation
Prerequisites
Node.js (v16 or higher)
npm or yarn
Steps
Clone the repository

git clone https://github.com/SushmaTadiparthi/job-tracker-frontend.git

cd job-tracker-frontend

Install dependencies

npm install

Create environment file Create .env.local in the root directory:

VITE_API_URL=http://localhost:8080

For production (Vercel), set environment variable:

VITE_API_URL=https://job-tracker-backend-q1yc.onrender.com

Run development server

npm run dev

Open http://localhost:5173 in your browser

Build for production

npm run build


How to Use
1. Create Account
Click "Don't have an account? Register"
Enter name, email, and password
Click "Sign Up"
You'll be redirected to dashboard
2. Add Job Application
Click "+ Add Application"
Fill in:
Company Name (required) - e.g., "Google"
Job Role (required) - e.g., "Software Engineer"
Job URL (optional) - link to job posting
Notes (optional) - any notes about the role
Click "Add Application"
3. Track Progress
View all applications on dashboard
Each card shows company, role, status, and notes
Stats at top show breakdown by status
4. Update Status
Click the dropdown on any job card
Select new status: Applied → Interview → Offer → Rejected
Changes save automatically
5. Edit Notes
Click "Edit Notes" on any job card
Modify the notes
Click "Save"
6. Delete Application
Click "Delete" button on job card
Confirm deletion
Application is removed
7. Search
Use search bar at top of dashboard
Filter by company name or job role
Search updates in real-time
8. Manage Account
Click profile icon (top right)
Click "Settings"
Change password or delete account


Authentication
The app uses JWT (JSON Web Token) authentication:

When you log in, backend returns a token
Token is stored in browser's localStorage
Every API request includes this token in header: Authorization: Bearer {token}
Backend validates the token
If valid, request succeeds. If invalid/expired, you're logged out

How axios interceptor works:

// Automatically adds token to every request

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token")

    if (token && !config.url?.includes("/api/auth/")) {

        config.headers.Authorization = `Bearer ${token}`

    }

    return config

})


API Integration
The frontend communicates with the backend REST API:

POST   /api/auth/register    - Create new account

POST   /api/auth/login       - Login user

GET    /api/jobs             - Get all applications

POST   /api/jobs             - Add new application

PUT    /api/jobs/{id}        - Update application (notes)

PUT    /api/jobs/{id}/status - Update status

DELETE /api/jobs/{id}        - Delete application

PUT    /api/user/password    - Change password

DELETE /api/user/account     - Delete account

All requests require authentication token (except register/login).


Key Components
AuthContext
Global state management for user authentication

const { user, token, login, logout, isLoggedIn } = useAuth()
ProtectedRoute
Ensures only logged-in users can access dashboard

<ProtectedRoute>

  <Dashboard />

</ProtectedRoute>

If user isn't logged in, redirects to login page.
JobCard
Displays individual job application with options to:

Edit notes
Change status
Delete
Toast
Notification for user actions (success/error messages)


Deployment
The app is deployed on Vercel and automatically deploys when you push to GitHub.
Steps to Deploy Your Own Version
Push code to your GitHub repository
Go to https://vercel.com
Click "New Project"
Select your GitHub repository
Add environment variable:
Key: VITE_API_URL
Value: Your backend URL (e.g., https://job-tracker-backend-q1yc.onrender.com)
Click "Deploy"
Your app will be live at https://your-project-name.vercel.app

Every time you push to main branch, Vercel automatically redeploys.


File Routing
For Vercel to handle React Router, a vercel.json file is included:

{

    "rewrites": [

        {

            "source": "/(.*)",

            "destination": "/index.html"

        }

    ]

}

This ensures all routes redirect to index.html (required for React Router).


Environment Variables
Create .env.local file:

# Development

VITE_API_URL=http://localhost:8080

# Production (set in Vercel dashboard)

VITE_API_URL=https://job-tracker-backend-q1yc.onrender.com

Note: Frontend environment variables must start with VITE_ to be exposed to browser.


Common Issues
Issue: "Cannot reach backend API"
Solution: Check environment variable VITE_API_URL is correct and backend is running
Issue: "Login not working"
Solution:

Check backend is deployed
Verify email/password are correct
Check browser console for errors (F12)
Issue: "Jobs not loading"
Solution:

Verify you're logged in (token in localStorage)
Check browser Network tab to see API response
Verify backend is running
Issue: "TypeError: Cannot read property 'email' of null"
Solution: Token might be expired. Log out and log in again


Development Notes
Type Safety
All components use TypeScript types to catch errors early:

interface Job {

    id: number

    companyName: string

    role: string

    jobUrl: string

    notes: string

    status: "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED"

    appliedDate: string

    updatedAt: string

}
State Management
Uses React Context API for global authentication state. For complex apps, consider Redux or Zustand.
Styling
CSS-in-JS approach using inline styles (styles object). For larger projects, consider CSS modules or Tailwind.
Error Handling
All API calls wrapped in try-catch blocks. Errors shown via toast notifications.


Browser Support
Chrome (latest)
Firefox (latest)
Safari (latest)
Edge (latest)
Mobile browsers


Future Improvements
Add email verification
Add password reset
Add data export (CSV)
Add statistics dashboard
Add dark mode
Add offline support (PWA)


Contributing
This is a personal project, but feel free to fork and modify for your own use.


Author
Sushma Tadiparthi

LinkedIn: [Your LinkedIn Profile]
GitHub: https://github.com/SushmaTadiparthi


License
MIT License - feel free to use this project


Need Help?
Check backend README for API documentation
Review code comments for implementation details
Open an issue on GitHub



Built with ❤️ during Infosys Foundation Training | May 2026

