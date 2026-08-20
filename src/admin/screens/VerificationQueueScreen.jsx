import { useState } from 'react'
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  List,
  Grid,
  Mail,
  FileText,
  Eye,
} from 'lucide-react'
import { INITIAL_VERIFICATIONS } from '../mockData'
import {
  DocumentPreviewDrawer,
  RejectReasonModal,
  RequestInfoModal,
} from '../components/ModalsAndDrawers'
import { useAdminTheme } from '../context/AdminThemeContext'

export default function VerificationQueueScreen() {
  const { isDark } = useAdminTheme()
  const [verifications, setVerifications] = useState(INITIAL_VERIFICATIONS)
  const [viewMode, setViewMode] = useState('table')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCampus, setSelectedCampus] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('Pending')

  // Drawer & Modal states
  const [previewItem, setPreviewItem] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const [rejectItem, setRejectItem] = useState(null)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)

  const [infoItem, setInfoItem] = useState(null)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)

  // Status badge style helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return isDark
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
      case 'Rejected':
        return isDark
          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          : 'bg-rose-50 text-rose-800 border-rose-200'
      case 'Info Requested':
        return isDark
          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
          : 'bg-blue-50 text-blue-800 border-blue-200'
      case 'Pending':
      default:
        return isDark
          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          : 'bg-amber-50 text-amber-800 border-amber-200'
    }
  }

  // Actions
  const handleApprove = (id) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'Approved' } : v))
    )
    if (previewItem?.id === id) setIsDrawerOpen(false)
  }

  const handleConfirmReject = (id, reason) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'Rejected', notes: `Rejected: ${reason}` } : v))
    )
    setIsRejectModalOpen(false)
    if (previewItem?.id === id) setIsDrawerOpen(false)
  }

  const handleConfirmInfoRequest = (id, msg) => {
    setVerifications((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, status: 'Info Requested', notes: `Requested info: ${msg}` } : v
      )
    )
    setIsInfoModalOpen(false)
    if (previewItem?.id === id) setIsDrawerOpen(false)
  }

  // Filtering
  const filteredItems = verifications.filter((item) => {
    const matchesSearch =
      item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.studentIdNum.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCampus = selectedCampus === 'All' || item.campus === selectedCampus
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus

    return matchesSearch && matchesCampus && matchesStatus
  })

  return (
    <div data-screen-id="8be87d2ab79f43c9b7da6ec475671d81" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border p-6 rounded-2xl shadow-xs ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600 border border-indigo-200'}`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Student & Seller Verification Queue
            </h1>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Review submitted student ID badges, .edu emails, and academic enrollment documents.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className={`flex items-center p-1 rounded-xl border text-xs ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              viewMode === 'table' ? 'bg-indigo-600 text-white shadow-xs' : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-4 h-4" /> Table View
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              viewMode === 'cards' ? 'bg-indigo-600 text-white shadow-xs' : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-4 h-4" /> Card View
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className={`grid grid-cols-1 sm:grid-cols-4 gap-3 border p-4 rounded-2xl ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
        <div className="relative sm:col-span-2">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, .edu email, or ID number..."
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs outline-none border transition-all ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-indigo-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white'
            }`}
          />
        </div>

        <select
          value={selectedCampus}
          onChange={(e) => setSelectedCampus(e.target.value)}
          className={`border rounded-xl px-3 py-2 text-xs outline-none font-semibold ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <option value="All">All Campuses / Universities</option>
          <option value="AAU 4k Main">AAU 4k Main</option>
          <option value="ASTU Adama">ASTU Adama</option>
          <option value="Hawassa Univ">Hawassa Univ</option>
          <option value="Jimma Univ">Jimma Univ</option>
          <option value="Bahir Dar Univ">Bahir Dar Univ</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className={`border rounded-xl px-3 py-2 text-xs outline-none font-semibold ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending Only</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Info Requested">Info Requested</option>
        </select>
      </div>

      {/* --- Table or Card View --- */}
      {viewMode === 'table' ? (
        <div className={`border rounded-2xl overflow-hidden shadow-xs ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className={`border-b font-bold uppercase tracking-wider ${isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                  <th className="py-3.5 px-4">Student Candidate</th>
                  <th className="py-3.5 px-4">University & Major</th>
                  <th className="py-3.5 px-4">Badge Request</th>
                  <th className="py-3.5 px-4">Submitted Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                {filteredItems.map((item) => (
                  <tr key={item.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.avatar}
                          alt={item.userName}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-300"
                        />
                        <div>
                          <span className={`font-bold block ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{item.userName}</span>
                          <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.userEmail}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-semibold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{item.campus}</span>
                      <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.major}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold border ${isDark ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className={`py-3.5 px-4 font-mono font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.submittedAt}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] border ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setPreviewItem(item)
                            setIsDrawerOpen(true)
                          }}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                          }`}
                          title="Preview Documents"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {item.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(item.id)}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-1 shadow-xs transition-all"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => {
                                setRejectItem(item)
                                setIsRejectModalOpen(true)
                              }}
                              className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-bold transition-all"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all ${
                isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] border ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                  <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.submittedAt}</span>
                </div>

                <div className="flex items-center gap-3">
                  <img src={item.avatar} alt={item.userName} className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-300" />
                  <div>
                    <h4 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{item.userName}</h4>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.campus}</p>
                    <span className="text-[11px] text-indigo-600 font-bold">{item.type}</span>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border space-y-1 text-xs ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <p className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {item.userEmail}
                  </p>
                  <p className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <FileText className="w-3.5 h-3.5 text-slate-400" /> ID: {item.studentIdNum}
                  </p>
                </div>
              </div>

              <div className={`pt-3 border-t flex items-center justify-between gap-2 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <button
                  onClick={() => {
                    setPreviewItem(item)
                    setIsDrawerOpen(true)
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  <Eye className="w-4 h-4" /> Preview Docs
                </button>
                {item.status === 'Pending' && (
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drawers & Modals */}
      <DocumentPreviewDrawer
        item={previewItem}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onApprove={handleApprove}
        onOpenRejectModal={(item) => {
          setRejectItem(item)
          setIsRejectModalOpen(true)
        }}
        onOpenInfoModal={(item) => {
          setInfoItem(item)
          setIsInfoModalOpen(true)
        }}
      />

      <RejectReasonModal
        item={rejectItem}
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirmReject={handleConfirmReject}
      />

      <RequestInfoModal
        item={infoItem}
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        onConfirmInfoRequest={handleConfirmInfoRequest}
      />
    </div>
  )
}
