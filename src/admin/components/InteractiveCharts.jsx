import { useState } from 'react'
import { IconTrendingUp, IconCalendar, IconBuilding, IconCurrencyDollar, IconUsers } from '@tabler/icons-react'
import { REVENUE_TRENDS_DATA, CAMPUS_DISTRIBUTION } from '../mockData'
import { useAdminTheme } from '../context/AdminThemeContext'

export function RevenueTrendChart() {
  const { isDark } = useAdminTheme()
  const [timeframe, setTimeframe] = useState('7d')
  const [hoveredPoint, setHoveredPoint] = useState(null)

  const data = REVENUE_TRENDS_DATA[timeframe] || REVENUE_TRENDS_DATA['7d']
  const maxRevenue = Math.max(...data.map((d) => d.revenue)) * 1.15

  return (
    <div
      className={`border rounded-2xl p-6 transition-all shadow-sm ${isDark
          ? 'bg-slate-900/90 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
        }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-lg ${isDark ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                }`}
            >
              <IconTrendingUp className="w-5 h-5" />
            </div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Revenue & Volume Trends
            </h3>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Real-time marketplace revenue, volume, and active IconUser analytics
          </p>
        </div>

        {/* Timeframe selector */}
        <div
          className={`flex items-center p-1 rounded-xl border text-xs font-semibold ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
        >
          {['7d', '30d', '1y'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg transition-all ${timeframe === tf
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Line / Area Chart */}
      <div className="relative h-64 w-full mt-4">
        {/* Tooltip */}
        {hoveredPoint !== null && (
          <div
            className={`absolute top-2 right-4 text-xs rounded-xl p-3 shadow-xl z-10 border animate-in fade-in duration-150 ${isDark ? 'bg-slate-950 border-indigo-500/30 text-slate-200' : 'bg-white border-indigo-200 text-slate-800 shadow-indigo-100'
              }`}
          >
            <p className="font-bold text-indigo-600">{data[hoveredPoint].label}</p>
            <div className="mt-1 space-y-1">
              <p className="flex items-center gap-1.5">
                <IconCurrencyDollar className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  Revenue:{' '}
                  <strong className="text-emerald-600">
                    ETB {data[hoveredPoint].revenue.toLocaleString()}
                  </strong>
                </span>
              </p>
              <p className="flex items-center gap-1.5">
                <IconCalendar className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  Hustles: <strong className="text-blue-600">{data[hoveredPoint].volume} orders</strong>
                </span>
              </p>
              <p className="flex items-center gap-1.5">
                <IconUsers className="w-3.5 h-3.5 text-purple-600" />
                <span>
                  IconUsers:{' '}
                  <strong className="text-purple-600">
                    {data[hoveredPoint].activeUsers.toLocaleString()}
                  </strong>
                </span>
              </p>
            </div>
          </div>
        )}

        <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={isDark ? 0.35 : 0.25} />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          {/* IconLayoutGrid lines */}
          {[0, 50, 100, 150].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="600"
              y2={y}
              stroke={isDark ? '#334155' : '#e2e8f0'}
              strokeDasharray="4 4"
              strokeOpacity={isDark ? 0.4 : 0.8}
            />
          ))}

          {/* Paths */}
          {(() => {
            const points = data.map((d, index) => {
              const x = (index / (data.length - 1)) * 580 + 10
              const y = 180 - (d.revenue / maxRevenue) * 160
              return { x, y, data: d }
            })

            const pathD = points.reduce(
              (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
              ''
            )

            const areaD = `${pathD} L ${points[points.length - 1].x} 185 L ${points[0].x} 185 Z`

            return (
              <>
                <path d={areaD} fill="url(#revenueGradient)" />
                <path d={pathD} fill="none" stroke="url(#lineGradient)" strokeWidth="3.5" strokeLinecap="round" />

                {points.map((pt, i) => (
                  <g key={i} onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={hoveredPoint === i ? '7' : '4.5'}
                      className={`cursor-pointer transition-all duration-200 ${isDark ? 'fill-slate-900 stroke-emerald-400 stroke-[3]' : 'fill-white stroke-emerald-500 stroke-[3]'
                        }`}
                    />
                  </g>
                ))}
              </>
            )
          })()}
        </svg>

        {/* X Axis Labels */}
        <div className={`flex justify-between mt-2 text-xs font-semibold px-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {data.map((d, idx) => (
            <span key={idx} className={hoveredPoint === idx ? 'text-indigo-600 font-bold' : ''}>
              {d.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function CampusDistributionChart() {
  const { isDark } = useAdminTheme()

  return (
    <div
      className={`border rounded-2xl p-6 transition-all shadow-sm ${isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div
            className={`p-2 rounded-lg ${isDark ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border border-indigo-200 text-indigo-600'
              }`}
          >
            <IconBuilding className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Weekly Active Campuses
            </h3>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Top universities by student volume
            </p>
          </div>
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${isDark
              ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
              : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            }`}
        >
          6 Campuses
        </span>
      </div>

      <div className="space-y-4">
        {CAMPUS_DISTRIBUTION.map((item, idx) => {
          const colors = [
            'bg-indigo-600',
            'bg-emerald-500',
            'bg-blue-500',
            'bg-amber-500',
            'bg-purple-500',
            'bg-teal-500',
          ]
          const barColor = colors[idx % colors.length]

          return (
            <div key={item.campus} className="group">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span
                  className={`font-semibold transition-colors ${isDark ? 'text-slate-200 group-hover:text-indigo-400' : 'text-slate-800 group-hover:text-indigo-600'
                    }`}
                >
                  {item.campus}
                </span>
                <div className={`flex items-center gap-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span>{item.IconUsers.toLocaleString()} IconUsers</span>
                  <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                    {item.percentage}%
                  </span>
                </div>
              </div>
              <div
                className={`w-full h-3 rounded-full overflow-hidden p-0.5 border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                  }`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
                  style={{ width: `${item.percentage * 3.2}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
