# Intern Management System (React)

A React + Vite single-page app with three parts: Login, Registration, and a Main Dashboard.

## Stack

- React 18
- React Router v6 (client-side routing between `/login`, `/register`, `/dashboard`)
- Vite (dev server + build)
- Plain CSS (`src/index.css`) — no UI framework
- `localStorage` for demo authentication (no backend)

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Demo login

```
Email:    admin@internsys.com
Password: Admin123
```

Or register a new account from the Registration page — it's stored in your browser's `localStorage` and you'll be redirected back to Login to sign in.

## Project structure

```
src/
  context/
    AuthContext.jsx     # login/register/logout, session + "remember me" via localStorage
  components/
    icons.jsx           # shared inline SVG icons
    Sidebar.jsx          # dashboard sidebar nav + logout
    Topbar.jsx            # header: title, welcome message, search, notifications, profile
    StatCards.jsx         # 4 stat cards (Total/Active/Completed/Pending)
    AttendancePanel.jsx   # donut chart: present / absent / on leave
    PerformancePanel.jsx  # performance metrics + bar chart
    TasksTable.jsx        # recent tasks table with status badges
    ActivityFeed.jsx      # recent activity list
    UpcomingDeadlines.jsx # upcoming deadlines list
  pages/
    Login.jsx
    Register.jsx
    Dashboard.jsx
  App.jsx                # routes + protected/public route guards
  main.jsx                # app entry point
  index.css               # all styling / design tokens
```

## Notes

- This is a front-end demo: "authentication" is simulated with `localStorage`, not a real backend. Swap `AuthContext.jsx`'s `login`/`register` functions for real API calls when you're ready to connect a backend.
- The dashboard's stats, tasks, activity, and deadlines are static sample data living directly in their components — replace with real data/fetches as needed.
