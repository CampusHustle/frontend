import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  IconArrowLeft,
  IconAlertTriangle,
  IconShieldExclamation,
  IconUser,
  IconFileText,
  IconClock,
  IconTrash,
  IconBan,
  IconSlash,
  IconMessage,
  IconEye,
  IconPlus,
} from '@tabler/icons-react'
import { INITIAL_REPORTS } from '../mockData'
import { ResolutionActionModal } from '../components/ModalsAndDrawers'
import { useAdminTheme } from '../context/AdminThemeContext'

export default function ReportDetailScreen() {
  const { isDark } = useAdminTheme()
  const params = useParams()
  const navigate = useNavigate()
  const reportId = params.id || 'rep-301'

  const [reports, setReports] = useState(INITIAL_REPORTS)
  const report = reports.find((r) => r.id === reportId) || reports[0]

  const [newNoteText, setNewNoteText] = useState('')
  const [activeResolutionType, setActiveResolutionType] = useState(null)
  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false)

  if (!report) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-rose-600 font-bold text-lg">Report Ticket Not Found</p>
        <Link to="/admin/reports" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold inline-block">
          Return to Moderation Queue
        </Link>
      </div>
    )
  }

  // Handlers
  const handleAddInternalNote = (e) => {
    e.preventDefault()
    if (!newNoteText.trim()) return

    const newNote = {
      id: `n-${Date.now()}`,
      author: 'Sarah Admin',
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      text: newNoteText,
    }

    setReports((prev) =>
      prev.map((r) =>
        r.id === report.id
          ? {
              ...r,
              internalNotes: [newNote, ...r.internalNotes],
              auditTimeline: [
                {
                  id: `l-${Date.now()}`,
                  time: newNote.time,
                  action: `Admin note added by Sarah Admin`,
                },
                ...r.auditTimeline,
              ],
            }
          : r
      )
    )
    setNewNoteText('')
  }

  const handleConfirmResolution = (id, actionType, note) => {
    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 16)
    const actionLabels = {
      warning: 'Formal Warning Issued',
      remove_listing: 'Listing Removed',
      suspend_7d: '7-Day Account Suspension Applied',
      ban_permanent: 'Permanent Account IconBan Executed',
    }

    const actionText = actionLabels[actionType] || 'Resolution Executed'

    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Resolved',
              auditTimeline: [
                { id: `l-${Date.now()}`, time: timeStr, action: `${actionText} by Sarah Admin: ${note}` },
                ...r.auditTimeline,
              ],
            }
          : r
      )
    )

    setIsResolutionModalOpen(false)
  }

  return (
    <div data-screen-id="39c9512e1e314a8db8d7c3b8d15c2207" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/reports')}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
            isDark ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-xs'
          }`}
        >
          <IconArrowLeft className="w-4 h-4" /> Back to Moderation Queue
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-indigo-700 font-bold px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-xl">
            {report.ticketNumber}
          </span>
          <span
            className={`px-3 py-1 rounded-xl text-xs font-bold uppercase border ${
              report.severity === 'High'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {report.severity} Severity
          </span>
        </div>
      </div>

      {/* Case Header Box */}
      <div
        className={`border rounded-3xl p-6 sm:p-8 shadow-xs space-y-4 ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block">
              {report.category} Investigation
            </span>
            <h1 className={`text-xl sm:text-2xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{report.title}</h1>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Reported Listing: "{report.listingTitle}"
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                report.status === 'Resolved'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {report.status}
            </span>
          </div>
        </div>

        <p className={`text-xs sm:text-sm p-4 rounded-2xl border leading-relaxed ${isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
          {report.description}
        </p>
      </div>

      {/* Main IconLayoutGrid */}
      <div className="IconLayoutGrid IconLayoutGrid-cols-1 lg:IconLayoutGrid-cols-3 gap-6">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* IconUser Side-by-Side Comparison */}
          <div className="IconLayoutGrid IconLayoutGrid-cols-1 md:IconLayoutGrid-cols-2 gap-4">
            {/* Reported IconUser Profile */}
            <div className={`border rounded-2xl p-5 shadow-xs space-y-4 ${isDark ? 'bg-slate-900/90 border-rose-500/30' : 'bg-white border-rose-200'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-rose-600 tracking-wider flex items-center gap-1.5">
                  <IconShieldExclamation className="w-4 h-4" /> Reported Subject
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md font-bold">
                  Trust Score: {report.reportedUser.trustScore}/100
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={report.reportedUser.avatar}
                  alt={report.reportedUser.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-rose-300"
                />
                <div>
                  <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{report.reportedUser.name}</h4>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{report.reportedUser.campus}</p>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Previous Flags: {report.reportedUser.reportsCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Reporter Profile */}
            <div className={`border rounded-2xl p-5 shadow-xs space-y-4 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-indigo-600 tracking-wider flex items-center gap-1.5">
                  <IconUser className="w-4 h-4" /> Reporter Details
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md font-bold">
                  {report.reporter.role}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={report.reporter.avatar}
                  alt={report.reporter.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-300"
                />
                <div>
                  <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{report.reporter.name}</h4>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{report.reporter.campus}</p>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Submitted: {report.createdAt}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Context Snippet */}
          <div className={`border rounded-2xl p-6 shadow-xs space-y-4 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              <IconMessage className="w-4 h-4 text-indigo-600" /> Flagged Chat / Context Snippet
            </h3>

            <div className={`p-4 border rounded-2xl text-xs font-mono italic leading-relaxed ${isDark ? 'bg-slate-950 border-slate-800 text-amber-300/90' : 'bg-amber-50/70 border-amber-200 text-amber-900'}`}>
              {report.contextSnippet}
            </div>

            {report.attachedEvidence && report.attachedEvidence.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Attached Evidence</h4>
                <div className="IconLayoutGrid IconLayoutGrid-cols-2 gap-3">
                  {report.attachedEvidence.map((imgUrl, i) => (
                    <a
                      key={i}
                      href={imgUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`group relative overflow-hidden rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}
                    >
                      <img
                        src={imgUrl}
                        alt="Evidence"
                        className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg flex items-center gap-1">
                          <IconEye className="w-3.5 h-3.5" /> Enlarge
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Internal Notes Feed */}
          <div className={`border rounded-2xl p-6 shadow-xs space-y-4 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              <IconFileText className="w-4 h-4 text-indigo-600" /> Admin Internal Notes
            </h3>

            <form onSubmit={handleAddInternalNote} className="flex gap-2">
              <input
                type="text"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Add confidential internal admin note..."
                className={`flex-1 px-4 py-2.5 rounded-xl text-xs outline-none border transition-all ${
                  isDark
                    ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-indigo-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white'
                }`}
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <IconPlus className="w-4 h-4" /> Add Note
              </button>
            </form>

            <div className="space-y-3 pt-2">
              {report.internalNotes.map((note) => (
                <div key={note.id} className={`p-3.5 rounded-xl border text-xs space-y-1 ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-indigo-600">{note.author}</span>
                    <span className={`font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{note.time}</span>
                  </div>
                  <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col) */}
        <div className="space-y-6">
          {/* Resolution Audit Control */}
          <div className={`border rounded-2xl p-6 shadow-xs space-y-5 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className={`flex items-center gap-2 border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="p-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg">
                <IconShieldExclamation className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Resolution Audit Panel</h3>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Execute administrative action</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <button
                onClick={() => {
                  setActiveResolutionType('warning')
                  setIsResolutionModalOpen(true)
                }}
                className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-bold flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-2">
                  <IconAlertTriangle className="w-4 h-4" /> Issue Formal Warning
                </span>
                <span>→</span>
              </button>

              <button
                onClick={() => {
                  setActiveResolutionType('remove_listing')
                  setIsResolutionModalOpen(true)
                }}
                className="w-full py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-2">
                  <IconTrash className="w-4 h-4" /> Remove Marketplace Listing
                </span>
                <span>→</span>
              </button>

              <button
                onClick={() => {
                  setActiveResolutionType('suspend_7d')
                  setIsResolutionModalOpen(true)
                }}
                className="w-full py-2.5 px-3 bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 rounded-xl font-bold flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-2">
                  <IconSlash className="w-4 h-4" /> Temp 7-Day Suspension
                </span>
                <span>→</span>
              </button>

              <button
                onClick={() => {
                  setActiveResolutionType('ban_permanent')
                  setIsResolutionModalOpen(true)
                }}
                className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold flex items-center justify-between transition-all shadow-md shadow-rose-500/20"
              >
                <span className="flex items-center gap-2">
                  <IconBan className="w-4 h-4" /> Permanent Account IconBan
                </span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Chronological Audit Timeline */}
          <div className={`border rounded-2xl p-6 shadow-xs space-y-4 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              <IconClock className="w-4 h-4 text-indigo-600" /> Audit Activity Timeline
            </h3>

            <div className={`space-y-4 border-l-2 pl-4 text-xs ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              {report.auditTimeline.map((item) => (
                <div key={item.id} className="relative">
                  <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-white" />
                  <span className={`text-[10px] font-mono block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.time}</span>
                  <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resolution Modal */}
      <ResolutionActionModal
        report={report}
        actionType={activeResolutionType}
        isOpen={isResolutionModalOpen}
        onClose={() => setIsResolutionModalOpen(false)}
        onConfirmResolution={handleConfirmResolution}
      />
    </div>
  )
}
