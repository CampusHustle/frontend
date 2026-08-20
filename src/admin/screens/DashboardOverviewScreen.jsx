import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  ShieldCheck,
  Flag,
  DollarSign,
  Zap,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Sparkles,
  Clock,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react'
import { INITIAL_KPIS, RECENT_ACTIVITIES } from '../mockData'
import { RevenueTrendChart, CampusDistributionChart } from '../components/InteractiveCharts'
import { useAdminTheme } from '../context/AdminThemeContext'

export default function DashboardOverviewScreen() {
  const { isDark } = useAdminTheme()
  const [kpis] = useState(INITIAL_KPIS)
  const [activities] = useState(RECENT_ACTIVITIES)

  const kpiIcons = {
    'kpi-active-users': Users,
    'kpi-pending-verifications': ShieldCheck,
    'kpi-open-reports': Flag,
    'kpi-total-volume': DollarSign,
    'kpi-daily-hustles': Zap,
  }

  return (
    <div data-screen-id="98267591b48d48a082e9acb381f6efec" className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div
        className={`border rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xs transition-all ${
          isDark
            ? 'bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 border-indigo-500/20 text-white'
            : 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 border-indigo-500 text-white'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 text-white rounded-full text-xs font-bold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" /> CampusHustle Core Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Marketplace Executive Analytics
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100/90 max-w-xl">
              Live monitoring of student ID verifications, active campus hustles, transaction volume, and platform moderation activity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/verifications"
              className="px-4 py-2.5 bg-white hover:bg-slate-100 text-indigo-950 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all hover:scale-105"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> Review Queue (48)
            </Link>
            <Link
              to="/admin/reports"
              className="px-4 py-2.5 bg-black/20 hover:bg-black/30 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center gap-2 transition-all backdrop-blur-xs"
            >
              <Flag className="w-4 h-4 text-rose-300" /> Moderation Queue
            </Link>
          </div>
        </div>
      </div>

      {/* --- High Level KPI Grid (5 Cards) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => {
          const IconComponent = kpiIcons[kpi.id] || Users

          return (
            <div
              key={kpi.id}
              className={`border rounded-2xl p-5 shadow-xs transition-all hover:shadow-md group ${
                isDark
                  ? 'bg-slate-900/90 border-slate-800 text-slate-100'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{kpi.title}</span>
                <div
                  className={`p-2 rounded-xl border transition-colors ${
                    isDark
                      ? 'bg-slate-800/80 border-slate-700/60 text-indigo-400 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30'
                      : 'bg-indigo-50 border-indigo-200 text-indigo-600 group-hover:bg-indigo-100'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <span className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {kpi.value}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs">
                <span
                  className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-md border ${
                    kpi.isPositive
                      ? isDark
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : isDark
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {kpi.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.change}
                </span>
                <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{kpi.timeframe}</span>
              </div>

              <p className={`text-[11px] mt-3 pt-2 border-t truncate ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                {kpi.subtext}
              </p>
            </div>
          )
        })}
      </div>

      {/* --- Interactive Metric Charts Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueTrendChart />
        </div>
        <div>
          <CampusDistributionChart />
        </div>
      </div>

      {/* --- Quick Activity Feed & Platform Security --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div
          className={`lg:col-span-2 border rounded-2xl p-6 shadow-xs ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  Live Campus Activity Stream
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Real-time student transactions, ID submissions, and alerts
                </p>
              </div>
            </div>
            <Link
              to="/admin/users"
              className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1"
            >
              View Users <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {activities.map((act) => (
              <div
                key={act.id}
                className={`flex items-start justify-between p-3.5 rounded-xl border text-xs transition-colors ${
                  isDark
                    ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-start gap-3">
                  <img src={act.avatar} alt={act.user} className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-300" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{act.user}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'}`}>
                        {act.campus}
                      </span>
                    </div>
                    <p className={`mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{act.action}</p>
                    <span className={`text-[10px] mt-1 block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{act.time}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase border ${
                    act.status === 'pending'
                      ? isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-800 border-amber-200'
                      : act.status === 'high_priority'
                      ? isDark ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-800 border-rose-200'
                      : isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
                >
                  {act.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Health Widget */}
        <div
          className={`border rounded-2xl p-6 shadow-xs space-y-6 ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Platform Security</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Automated safety parameters</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className={`p-3 rounded-xl border flex justify-between items-center ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>AI Spam Filter</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active (99.8%)
              </span>
            </div>
            <div className={`p-3 rounded-xl border flex justify-between items-center ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>ID OCR Accuracy</span>
              <span className="text-indigo-600 font-bold">96.4%</span>
            </div>
            <div className={`p-3 rounded-xl border flex justify-between items-center ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Escalation Rate</span>
              <span className="text-amber-600 font-bold">2.1%</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl border text-xs space-y-2 ${isDark ? 'bg-indigo-950/40 border-indigo-500/30' : 'bg-indigo-50/80 border-indigo-200'}`}>
            <h4 className="font-bold text-indigo-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Action Required
            </h4>
            <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
              48 student verification requests are currently in the queue. 14 from ASTU require student ID badge checks.
            </p>
            <Link
              to="/admin/verifications"
              className="inline-block pt-1 font-bold text-indigo-600 hover:text-indigo-700"
            >
              Open Verification Queue →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
