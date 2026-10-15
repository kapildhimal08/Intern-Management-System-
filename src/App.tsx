import { Navigate, Route, Routes } from 'react-router-dom'
import Attendance from './pages/dashboard/Attendance.jsx'
import Tasks from './pages/dashboard/Tasks.jsx'
import Supervisors from './pages/dashboard/Supervisors.jsx'
import Reports from './pages/dashboard/Reports.jsx'
import Settings from './pages/dashboard/Settings.jsx'
import { Shell } from './components/layout/Shell'
import { AdminOnly } from './components/routes/AdminOnly'
import { HomeSwitch } from './components/routes/HomeSwitch'
import { ProtectedRoute } from './components/routes/ProtectedRoute'
import { PublicOnlyRoute } from './components/routes/PublicOnlyRoute'
import { UserOnly } from './components/routes/UserOnly'
import { ApplicationsAdmin } from './pages/admin/ApplicationsAdmin'
import { ManagePositions } from './pages/admin/ManagePositions'
import { UploadInterns } from './pages/admin/UploadInterns'
import { UsersAdmin } from './pages/admin/UsersAdmin'
import { AccountPage } from './pages/public/AccountPage'
import { InternshipDetails } from './pages/public/InternshipDetails'
import { LandingPage } from './pages/public/LandingPage'
import { InternsBoard } from './pages/shared/InternsBoard'
import { ApplyPage } from './pages/user/ApplyPage'
import { MyApplications } from './pages/user/MyApplications'
import { ProfilePage } from './pages/user/ProfilePage'
import { Announcements } from './pages/work/Announcements'
import { Clients } from './pages/work/Clients'
import { Events } from './pages/work/Events'
import { Help } from './pages/work/Help'
import { Leave } from './pages/work/Leave'
import { Messages } from './pages/work/Messages'
import { Projects } from './pages/work/Projects'


export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/account" element={<PublicOnlyRoute><AccountPage /></PublicOnlyRoute>} />
        <Route path="/internship/:id" element={<InternshipDetails />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/login/waiting" element={<Navigate to="/" replace />} />
        <Route path="/register" element={<Navigate to="/" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><Shell /></ProtectedRoute>}>
          <Route index element={<HomeSwitch />} />
          <Route path="help" element={<Help />} />
          {/* same pages for admin and user (Interns shows what the admin posted) */}
          <Route path="interns" element={<InternsBoard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="supervisors" element={<Supervisors />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="projects" element={<Projects />} />
          <Route path="teams/leave" element={<Leave />} />
          <Route path="teams/announcements" element={<Announcements />} />
          <Route path="clients" element={<Clients />} />
          <Route path="events" element={<Events />} />
          <Route path="messages" element={<Messages />} />
          {/* user only */}
          <Route element={<UserOnly />}>
            <Route path="apply" element={<ApplyPage />} />
            <Route path="my-applications" element={<MyApplications />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          {/* admin only */}
          <Route element={<AdminOnly />}>
            <Route path="applications" element={<ApplicationsAdmin />} />
            <Route path="upload-interns" element={<UploadInterns />} />
            <Route path="positions" element={<ManagePositions />} />
            <Route path="users" element={<UsersAdmin />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
