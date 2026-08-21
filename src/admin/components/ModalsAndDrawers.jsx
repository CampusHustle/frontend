import { useState } from 'react'
import {
  IconX,
  IconCircleCheck,
  IconCircleX,
  IconHelpCircle,
  IconShieldCheck,
  IconShieldExclamation,
  IconFileText,
  IconSchool,
  IconMail,
  IconAlertTriangle,
  IconSend,
  IconLock,
  IconRefresh,
  IconClock,
  IconEye,
  IconTrash,
  IconBan,
  IconSlash,
} from '@tabler/icons-react'
import { useAdminTheme } from '../context/AdminThemeContext'

export function DocumentPreviewDrawer({ item, isOpen, onClose, onApprove, onOpenRejectModal, onOpenInfoModal }) {
  const { isDark } = useAdminTheme()
  if (!isOpen || !item) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className={`w-screen max-w-xl border-l shadow-2xl flex flex-col ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
          <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-slate-50'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-600'}`}>
                <IconShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Verification Document</h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Review student identity & credentials</p>
              </div>
            </div>
            <button onClick={onClose} className={`p-2 rounded-xl transition-colors ${isDark ? 'text-slate-400 hover:text-white bg-slate-800' : 'text-slate-500 hover:text-slate-900 bg-slate-200'}`}>
              <IconX className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className={`border rounded-2xl p-5 space-y-4 ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-4">
                <img src={item.avatar} alt={item.userName} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/40" />
                <div>
                  <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.userName}</h4>
                  <p className={`text-xs flex items-center gap-1.5 mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <IconMail className="w-3.5 h-3.5" /> {item.userEmail}
                  </p>
                  <p className={`text-xs flex items-center gap-1.5 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <IconSchool className="w-3.5 h-3.5" /> {item.campus} — {item.major}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <IconFileText className="w-4 h-4 text-indigo-600" /> Submitted Documents
              </h5>
              <div className={`border rounded-2xl p-3 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`relative group overflow-hidden rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <img src={item.idCardImage} alt="ID Card" className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a href={item.idCardImage} target="_blank" rel="noreferrer" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                      <IconEye className="w-4 h-4" /> Full View
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 border-t ${isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-slate-50'}`}>
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => onApprove(item.id)} className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all">
                <IconCircleCheck className="w-4 h-4" /> Approve
              </button>
              <button onClick={() => onOpenRejectModal(item)} className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
                <IconCircleX className="w-4 h-4" /> Reject
              </button>
              <button onClick={() => onOpenInfoModal(item)} className="py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
                <IconHelpCircle className="w-4 h-4" /> Need Info
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function RejectReasonModal({ item, isOpen, onClose, onConfirmReject }) {
  const { isDark } = useAdminTheme()
  const [selectedReason, setSelectedReason] = useState('Blurred ID image')
  const [customReason, setCustomReason] = useState('')
  if (!isOpen || !item) return null

  const presetReasons = [
    'Blurred or unreadable ID image',
    'Expired student registration badge',
    'Mismatched name or university email',
    'Unverifiable enrollment document',
    'Other / Fraudulent submission',
  ]

  const handleConfirm = () => {
    const finalReason = selectedReason === 'Other / Fraudulent submission' && customReason ? customReason : selectedReason
    onConfirmReject(item.id, finalReason)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`border w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5 ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
        <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl">
              <IconShieldExclamation className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Reject Verification</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Select reason for {item.userName}</p>
            </div>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-lg ${isDark ? 'text-slate-400 hover:text-white bg-slate-800' : 'text-slate-500 hover:text-slate-900 bg-slate-100'}`}>
            <IconX className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          {presetReasons.map((reason) => (
            <label key={reason} className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${selectedReason === reason ? 'bg-rose-50 border-rose-300 text-rose-900 font-semibold' : isDark ? 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}>
              <input type="radio" name="rejectReason" checked={selectedReason === reason} onChange={() => setSelectedReason(reason)} className="accent-rose-600" />
              <span>{reason}</span>
            </label>
          ))}
          {selectedReason === 'Other / Fraudulent submission' && (
            <textarea value={customReason} onChange={(e) => setCustomReason(e.target.value)} placeholder="Explain..." rows={3} className={`w-full border rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-rose-500 ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
          )}
        </div>

        <div className={`flex justify-end gap-3 pt-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <button onClick={onClose} className={`px-4 py-2 rounded-xl text-xs font-semibold ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>Cancel</button>
          <button onClick={handleConfirm} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md">Confirm Rejection</button>
        </div>
      </div>
    </div>
  )
}

export function RequestInfoModal({ item, isOpen, onClose, onConfirmInfoRequest }) {
  const { isDark } = useAdminTheme()
  const [message, setMessage] = useState('Please provide a clearer photo of your student ID.')
  if (!isOpen || !item) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`border w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5 ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
        <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl">
              <IconHelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Request More Information</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Send notice to {item.userEmail}</p>
            </div>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-lg ${isDark ? 'text-slate-400 hover:text-white bg-slate-800' : 'text-slate-500 hover:text-slate-900 bg-slate-100'}`}>
            <IconX className="w-4 h-4" />
          </button>
        </div>

        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className={`w-full border rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-amber-500 ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />

        <div className={`flex justify-end gap-3 pt-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <button onClick={onClose} className={`px-4 py-2 rounded-xl text-xs font-semibold ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>Cancel</button>
          <button onClick={() => onConfirmInfoRequest(item.id, message)} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
            <IconSend className="w-3.5 h-3.5" /> Send Request
          </button>
        </div>
      </div>
    </div>
  )
}

export function ResolutionActionModal({ report, actionType, isOpen, onClose, onConfirmResolution }) {
  const { isDark } = useAdminTheme()
  const [note, setNote] = useState('')
  if (!isOpen || !report || !actionType) return null

  const actionMeta = {
    warning: { title: 'Issue Formal Warning', icon: IconAlertTriangle },
    remove_listing: { title: 'Remove Reported Listing', icon: IconTrash },
    suspend_7d: { title: '7-Day Suspension', icon: IconClock },
    ban_permanent: { title: 'Permanent Account Ban', icon: IconBan },
  }

  const current = actionMeta[actionType] || actionMeta.warning
  const IconComponent = current.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`border w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5 ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
        <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{current.title}</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Subject: {report.reportedUser.name}</p>
            </div>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-lg ${isDark ? 'text-slate-400 hover:text-white bg-slate-800' : 'text-slate-500 hover:text-slate-900 bg-slate-100'}`}>
            <IconX className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <label className={`font-bold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Audit Note:</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Document rationale for audit trail..." rows={3} className={`w-full border rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-rose-500 ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
        </div>

        <div className={`flex justify-end gap-3 pt-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <button onClick={onClose} className={`px-4 py-2 rounded-xl text-xs font-semibold ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>Cancel</button>
          <button onClick={() => onConfirmResolution(report.id, actionType, note)} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md">Execute Action</button>
        </div>
      </div>
    </div>
  )
}

export function UserActionDrawer({ user, isOpen, onClose, onUpdateRole, onResetPassword, onToggleUserStatus }) {
  const { isDark } = useAdminTheme()
  const [selectedRole, setSelectedRole] = useState(user?.role || 'Student')
  const [statusMessage, setStatusMessage] = useState('')
  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className={`w-screen max-w-lg border-l shadow-2xl flex flex-col ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
          <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-slate-50'}`}>
            <div className="flex items-center gap-3">
              <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/40" />
              <div>
                <h3 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{user.name}</h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{user.email}</p>
              </div>
            </div>
            <button onClick={onClose} className={`p-2 rounded-xl transition-colors ${isDark ? 'text-slate-400 hover:text-white bg-slate-800' : 'text-slate-500 hover:text-slate-900 bg-slate-200'}`}>
              <IconX className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className={`border rounded-2xl p-4 space-y-3 text-xs ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className={`font-bold flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                <IconShieldCheck className="w-4 h-4 text-indigo-600" /> Role & Permissions
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {['Student', 'Tutor', 'Seller', 'Admin'].map((roleOption) => (
                  <button key={roleOption} onClick={() => { setSelectedRole(roleOption); onUpdateRole(user.id, roleOption) }}
                    className={`py-2 px-3 rounded-xl border font-bold transition-all ${(selectedRole || user.role) === roleOption ? 'bg-indigo-600 text-white border-indigo-500' : isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'}`}>
                    {roleOption}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <button onClick={() => { onResetPassword(user.id); setStatusMessage('Password reset link sent to ' + user.email) }}
                className={`w-full p-3 border rounded-xl flex items-center justify-between font-semibold transition-colors ${isDark ? 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'}`}>
                <div className="flex items-center gap-2.5"><IconRefresh className="w-4 h-4 text-indigo-600" /> <span>Reset Password</span></div>
                <IconLock className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button onClick={() => { const s = user.status === 'Active' ? 'Suspended' : 'Active'; onToggleUserStatus(user.id, s); setStatusMessage(`Status changed to ${s}`) }}
                className={`w-full p-3 border rounded-xl flex items-center justify-between text-xs font-bold transition-colors ${user.status === 'Active' ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                <div className="flex items-center gap-2.5"><IconSlash className="w-4 h-4" /> <span>{user.status === 'Active' ? 'Suspend Account' : 'Reactivate Account'}</span></div>
                <IconShieldExclamation className="w-3.5 h-3.5" />
              </button>
            </div>

            {statusMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2 font-semibold">
                <IconCircleCheck className="w-4 h-4" /> {statusMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
