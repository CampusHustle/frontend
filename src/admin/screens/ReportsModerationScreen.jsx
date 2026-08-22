import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  IconFlag,
  IconSearch,
  IconAlertTriangle,
  IconCircleCheck,
  IconStack2,
  IconChevronRight,
} from '@tabler/icons-react'
import { INITIAL_REPORTS } from '../mockData'
import { useAdminTheme } from '../context/AdminThemeContext'

export default function ReportsModerationScreen() {
  const { isDark } = useAdminTheme()
  const navigate = useNavigate()
  const [reports, setReports] = useState(INITIAL_REPORTS)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedSeverity, setSelectedSeverity] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState([])

  // Bulk actions
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredReports.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredReports.map((r) => r.id))
    }
  }

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleBulkStatusChange = (newStatus) => {
    setReports((prev) =>
      prev.map((r) => (selectedIds.includes(r.id) ? { ...r, status: newStatus } : r))
    )
    setSelectedIds([])
  }

  const handleBulkAssign = (assigneeName) => {
    setReports((prev) =>
      prev.map((r) => (selectedIds.includes(r.id) ? { ...r, assignee: assigneeName } : r))
    )
    setSelectedIds([])
  }

  // Filtering
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reportedUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reporter.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory
    const matchesSeverity = selectedSeverity === 'All' || r.severity === selectedSeverity
    const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus

    return matchesSearch && matchesCategory && matchesSeverity && matchesStatus
  })

  return (
    <div data-screen-id="3001f2859c3047abaaf9fff63a797bf4" className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div
        className={`border p-6 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg">
              <IconFlag className="w-5 h-5" />
            </div>
            <h1 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Reports & Marketplace Moderation Queue
            </h1>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Manage academic dishonesty flags, scam reports, spam violations, and student disputes.
          </p>
        </div>

        {/* Severity Badges */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-1.5">
            <IconAlertTriangle className="w-3.5 h-3.5" /> High Severity (4)
          </span>
          <span className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl">
            Medium (8)
          </span>
        </div>
      </div>

      {/* Filter & Toolbar */}
      <div className="space-y-3">
        <div
          className={`IconLayoutGrid IconLayoutGrid-cols-1 sm:IconLayoutGrid-cols-5 gap-3 border p-4 rounded-2xl ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="relative sm:col-span-2">
            <IconSearch className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="IconSearch by ticket #, IconUser name, or title..."
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs outline-none border transition-all ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-indigo-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white'
              }`}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`border rounded-xl px-3 py-2 text-xs outline-none font-semibold ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <option value="All">All Categories</option>
            <option value="Academic Dishonesty">Academic Dishonesty</option>
            <option value="Scam / Non-Delivery">Scam / Non-Delivery</option>
            <option value="Spam / Harassment">Spam / Harassment</option>
            <option value="Copyright / Counterfeit">Copyright / Counterfeit</option>
          </select>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className={`border rounded-xl px-3 py-2 text-xs outline-none font-semibold ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <option value="All">All Severities</option>
            <option value="High">High Severity</option>
            <option value="Medium">Medium Severity</option>
            <option value="Low">Low Severity</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`border rounded-xl px-3 py-2 text-xs outline-none font-semibold ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Review">In Review</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div
            className={`border p-3 rounded-xl flex items-center justify-between text-xs animate-in fade-in duration-150 ${
              isDark ? 'bg-indigo-950/70 border-indigo-500/40 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-900'
            }`}
          >
            <span className="font-bold flex items-center gap-2">
              <IconStack2 className="w-4 h-4 text-indigo-600" /> {selectedIds.length} tickets selected for bulk update:
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkStatusChange('Resolved')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-1 shadow-xs transition-all"
              >
                <IconCircleCheck className="w-3.5 h-3.5" /> Mark Resolved
              </button>
              <button
                onClick={() => handleBulkStatusChange('In Review')}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold transition-all shadow-xs"
              >
                Set In Review
              </button>
              <button
                onClick={() => handleBulkAssign('Sarah Admin')}
                className={`px-3 py-1.5 rounded-lg font-bold border transition-all ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                Assign to Sarah
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Moderation Queue Table */}
      <div className={`border rounded-2xl overflow-hidden shadow-xs ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b font-bold uppercase tracking-wider ${isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredReports.length && filteredReports.length > 0}
                    onChange={toggleSelectAll}
                    className="accent-indigo-600 rounded"
                  />
                </th>
                <th className="py-3.5 px-4">Ticket & Category</th>
                <th className="py-3.5 px-4">Reported Listing / IconUser</th>
                <th className="py-3.5 px-4">Reporter</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Assignee</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {filteredReports.map((report) => (
                <tr key={report.id} className={`transition-colors group cursor-pointer ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                  <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(report.id)}
                      onChange={() => toggleSelectOne(report.id)}
                      className="accent-indigo-600 rounded"
                    />
                  </td>
                  <td className="py-3.5 px-4" onClick={() => navigate(`/admin/reports/${report.id}`)}>
                    <span className="font-mono font-bold text-indigo-600 block">{report.ticketNumber}</span>
                    <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{report.category}</span>
                  </td>
                  <td className="py-3.5 px-4" onClick={() => navigate(`/admin/reports/${report.id}`)}>
                    <span className={`font-bold block truncate max-w-xs ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{report.title}</span>
                    <span className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-0.5">
                      Subject: {report.reportedUser.name} ({report.reportedUser.campus})
                    </span>
                  </td>
                  <td className="py-3.5 px-4" onClick={() => navigate(`/admin/reports/${report.id}`)}>
                    <span className={`font-semibold block ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{report.reporter.name}</span>
                    <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{report.reporter.role}</span>
                  </td>
                  <td className="py-3.5 px-4" onClick={() => navigate(`/admin/reports/${report.id}`)}>
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] border ${
                        report.severity === 'High'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : report.severity === 'Medium'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {report.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4" onClick={() => navigate(`/admin/reports/${report.id}`)}>
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] border ${
                        report.status === 'Open'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : report.status === 'In Review'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className={`py-3.5 px-4 font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`} onClick={() => navigate(`/admin/reports/${report.id}`)}>
                    {report.assignee}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/admin/reports/${report.id}`}
                      className={`px-3 py-1.5 rounded-lg font-bold inline-flex items-center gap-1 border transition-colors ${
                        isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                    >
                      Investigate <IconChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
