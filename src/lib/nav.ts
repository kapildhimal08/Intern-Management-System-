import { P } from '../components/ui/icons'
import type { NavLeaf, NavGroup } from '../types/index'


export const MAIN_NAV: NavLeaf[] = [
  { label: 'Dashboard', to: '/dashboard', d: P.dashboard, end: true },
  { label: 'Interns', to: '/dashboard/interns', d: P.users },
  { label: 'Attendance', to: '/dashboard/attendance', d: P.calendar },
  { label: 'Tasks', to: '/dashboard/tasks', d: P.tasks },
  { label: 'Supervisors', to: '/dashboard/supervisors', d: P.shield },
  { label: 'Reports', to: '/dashboard/reports', d: P.chart },
  { label: 'Settings', to: '/dashboard/settings', d: P.settings },
]

export const WORK_NAV: (NavLeaf | NavGroup)[] = [
  { label: 'Projects', to: '/dashboard/projects', d: P.folder },
  {
    label: 'Teams', d: P.users,
    children: [
      { label: 'Leave', to: '/dashboard/teams/leave' },
      { label: 'Announcements', to: '/dashboard/teams/announcements' },
    ],
  },
  { label: 'Clients', to: '/dashboard/clients', d: P.briefcase },
  { label: 'Events', to: '/dashboard/events', d: P.calendar },
  { label: 'Messages', to: '/dashboard/messages', d: P.chat },
  { label: 'Help & Support', to: '/dashboard/help', d: P.help },
]

export const RECRUIT_NAV: NavLeaf[] = [
  { label: 'Applications', to: '/dashboard/applications', d: P.file },
  { label: 'Upload Interns', to: '/dashboard/upload-interns', d: P.upload },
  { label: 'Manage Internships', to: '/dashboard/positions', d: P.briefcase },
  { label: 'Manage Users', to: '/dashboard/users', d: P.users },
]

export const USER_RECRUIT_NAV: NavLeaf[] = [
  { label: 'Apply for Internship', to: '/dashboard/apply', d: P.send },
  { label: 'My Applications', to: '/dashboard/my-applications', d: P.file },
  { label: 'My Profile', to: '/dashboard/profile', d: P.users },
]

export const USER_NAV: NavLeaf[] = [
  { label: 'Internships', to: '/dashboard', d: P.home, end: true },
  { label: 'Apply for Internship', to: '/dashboard/apply', d: P.send },
  { label: 'My Applications', to: '/dashboard/my-applications', d: P.file },
  { label: 'My Profile', to: '/dashboard/profile', d: P.users },
  { label: 'Help & Support', to: '/dashboard/help', d: P.help },
]

export const TITLES: Record<string, [string, string]> = {
  '/dashboard/apply': ['Apply for Internship', 'Fill in the form to submit your application.'],
  '/dashboard/my-applications': ['My Applications', 'Track the status of your applications.'],
  '/dashboard/applications': ['Applications', 'Review and decide on internship applications.'],
  '/dashboard/upload-interns': ['Upload Interns', 'Add intern details manually or import a CSV file.'],
  '/dashboard/positions': ['Manage Internships', 'Add, edit and delete internships, and mark them available or not available.'],
  '/dashboard/users': ['Manage Users', 'Everyone who has registered.'],
  '/dashboard/profile': ['My Profile', 'Complete your profile to speed up applications.'],
  '/dashboard/interns': ['Interns', 'Everyone in the program.'],
  '/dashboard/attendance': ['Attendance', 'Daily attendance overview.'],
  '/dashboard/tasks': ['Tasks', 'Assigned and ongoing work.'],
  '/dashboard/supervisors': ['Supervisors', 'People guiding the interns.'],
  '/dashboard/reports': ['Reports', 'Performance and summaries.'],
  '/dashboard/settings': ['Settings', 'Manage your account.'],
  '/dashboard/projects': ['Projects', 'Track every project and who leads it.'],
  '/dashboard/teams/leave': ['Leave', 'Apply for time off and follow your requests.'],
  '/dashboard/teams/announcements': ['Announcements', 'News and updates from the admin.'],
  '/dashboard/clients': ['Clients', 'Organisations you are working with.'],
  '/dashboard/events': ['Events', 'Upcoming company and team events.'],
  '/dashboard/messages': ['Messages', 'Chat with your team.'],
  '/dashboard/help': ['Help & Support', 'Find answers or contact the admin.'],
}
