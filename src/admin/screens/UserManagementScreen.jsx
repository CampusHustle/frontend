import { useState } from 'react'
import {
  IconUsers,
  IconSearch,
  IconAdjustmentsHorizontal,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react'
import { INITIAL_USERS } from '../mockData'
import { UserActionDrawer } from '../components/ModalsAndDrawers'
import { useAdminTheme } from '../context/AdminThemeContext'

export default function UserManagementScreen() {
  const { isDark } = useAdminTheme()
  const [users, setUsers] = useState(INITIAL_USERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('All')
  const [selectedCampus, setSelectedCampus] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

  // Drawer state
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Actions
  const handleUpdateRole = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    )
    if (selectedUser?.id === userId) {
      setSelectedUser((prev) => ({ ...prev, role: newRole }))
    }
  }

  const handleResetPassword = (userId) => {
    console.log('Reset password sent to IconUser:', userId)
  }

  const handleToggleUserStatus = (userId, newStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    )
    if (selectedUser?.id === userId) {
      setSelectedUser((prev) => ({ ...prev, status: newStatus }))
    }
  }

  // Filtering
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.university.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = selectedRole === 'All' || u.role === selectedRole
    const matchesCampus = selectedCampus === 'All' || u.university === selectedCampus
    const matchesStatus = selectedStatus === 'All' || u.status === selectedStatus

    return matchesSearch && matchesRole && matchesCampus && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <div data-screen-id="2f0a1b44a09a49fb948804e7d780c32a" className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div
        className={`border p-6 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
          }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600 border border-indigo-200'}`}>
              <IconUsers className="w-5 h-5" />
            </div>
            <h1 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Platform IconUser & Permission Management
            </h1>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Searchable datatable of all campus students, tutors, sellers, and platform administrators.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <span className={`px-3 py-1.5 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
            Total IconUsers: <strong className={isDark ? 'text-white' : 'text-slate-900'}>4,892</strong>
          </span>
          <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl">
            Verified Tutors: <strong className="text-emerald-900">384</strong>
          </span>
        </div>
      </div>

      {/* Filter & IconSearch Bar */}
      <div className={`IconLayoutGrid IconLayoutGrid-cols-1 sm:IconLayoutGrid-cols-4 gap-3 border p-4 rounded-2xl ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
        <div className="relative sm:col-span-1">
          <IconSearch className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="IconSearch by student name or email..."
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs outline-none border transition-all ${isDark
              ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-indigo-500'
              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white'
              }`}
          />
        </div>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className={`border rounded-xl px-3 py-2 text-xs outline-none font-semibold ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
        >
          <option value="All">All Roles (Student, Tutor, Seller, Admin)</option>
          <option value="Student">Students Only</option>
          <option value="Tutor">Verified Tutors</option>
          <option value="Seller">Market Sellers</option>
          <option value="Admin">Administrators</option>
        </select>

        <select
          value={selectedCampus}
          onChange={(e) => setSelectedCampus(e.target.value)}
          className={`border rounded-xl px-3 py-2 text-xs outline-none font-semibold ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
        >
          <option value="All">All Campuses</option>
          <option value="AAU 4k Main">AAU 4k Main</option>
          <option value="ASTU Adama">ASTU Adama</option>
          <option value="Hawassa Univ">Hawassa Univ</option>
          <option value="Jimma Univ">Jimma Univ</option>
          <option value="CampusHustle HQ">CampusHustle HQ</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className={`border rounded-xl px-3 py-2 text-xs outline-none font-semibold ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
        >
          <option value="All">All Account Statuses</option>
          <option value="Active">Active Accounts</option>
          <option value="Suspended">Suspended</option>
          <option value="Flagged">Flagged</option>
        </select>
      </div>

      {/* Datatable */}
      <div className={`border rounded-2xl overflow-hidden shadow-xs ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b font-bold uppercase tracking-wider ${isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                <th className="py-3.5 px-4">IconUser Avatar / Name</th>
                <th className="py-3.5 px-4">University / Campus</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Trust Score</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {paginatedUsers.map((IconUser) => (
                <tr key={IconUser.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={IconUser.avatar}
                        alt={IconUser.name}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-300"
                      />
                      <div>
                        <span className={`font-bold block ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{IconUser.name}</span>
                        <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{IconUser.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className={`py-3.5 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{IconUser.university}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[10px] border ${IconUser.role === 'Admin'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : IconUser.role === 'Tutor'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}
                    >
                      {IconUser.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-16 h-2 rounded-full overflow-hidden p-0.5 border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                        <div
                          className={`h-full rounded-full ${IconUser.trustScore > 80
                            ? 'bg-emerald-500'
                            : IconUser.trustScore > 50
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                            }`}
                          style={{ width: `${IconUser.trustScore}%` }}
                        />
                      </div>
                      <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{IconUser.trustScore}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${IconUser.verificationStatus === 'Verified'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : IconUser.verificationStatus === 'Pending'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                        }`}
                    >
                      {IconUser.verificationStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] border ${IconUser.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : IconUser.status === 'Suspended'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                    >
                      {IconUser.status}
                    </span>
                  </td>
                  <td className={`py-3.5 px-4 font-mono font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{IconUser.joinedDate}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedUser(IconUser)
                        setIsDrawerOpen(true)
                      }}
                      className={`px-3 py-1.5 rounded-lg font-bold inline-flex items-center gap-1 border transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                        }`}
                    >
                      <IconAdjustmentsHorizontal className="w-3.5 h-3.5" /> Quick Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`p-4 border-t flex items-center justify-between text-xs ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Showing Page <strong className={isDark ? 'text-white' : 'text-slate-900'}>{currentPage}</strong> of <strong className={isDark ? 'text-white' : 'text-slate-900'}>{totalPages}</strong> ({filteredUsers.length} total IconUsers)
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={`p-2 border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs'
                }`}
            >
              <IconChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={`p-2 border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs'
                }`}
            >
              <IconChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Drawer */}
      <UserActionDrawer
        IconUser={selectedUser}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdateRole={handleUpdateRole}
        onResetPassword={handleResetPassword}
        onToggleUserStatus={handleToggleUserStatus}
      />
    </div>
  )
}
