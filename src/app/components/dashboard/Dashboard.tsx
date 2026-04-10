/// <reference types="vite/client" />
import React, {useState, useEffect, useCallback} from "react"
import {
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Activity,
  PieChart as PieChartIcon,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import {CategoryIcon} from "../transactions/CategoryIcon"

// ============================================================
// CONFIG — change base URL to match your gateway
// ============================================================
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000"

// ============================================================
// API HELPER — reads JWT from localStorage
// ============================================================

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("jwt") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("wealthy_token")

  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? {Authorization: `Bearer ${token}`} : {}),
    },
    ...options,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `HTTP ${res.status}`)
  }

  return res.json()
}

// ============================================================
// TYPES
// ============================================================
interface SummaryData {
  totalBalance: number
  income: number
  expense: number
  asset: number
  liability: number
  netFlow: number
}

interface ChartPoint {
  _id: string // "2026-04-06"
  total: number
}

interface SpendingItem {
  _id: string
  total: number
  count: number
}

interface AutopilotFlow {
  _id: string
  flowName: string
  amount: number
  type: "income" | "expense" | "asset" | "liability"
  parentCategory: string
  subCategory: string
  frequency: "daily" | "weekly" | "monthly"
  scheduledDay: number
  nextOccurrence: string // ISO date
  isActive: boolean
  lastRun?: string
  userId: string
}

interface AutopilotTask extends AutopilotFlow {
  name: string
  category: string
}

interface DashboardState {
  summary: SummaryData | null
  incomeChart: ChartPoint[]
  balanceChart: ChartPoint[]
  spending: SpendingItem[]
  autopilot: AutopilotTask[]
  loading: boolean
  error: string | null
}

// ============================================================
// CHART PERIOD NAV HELPER
// ============================================================
const TIME_FILTERS = ["1W", "1M", "3M", "6M", "1Y"]

function getPeriodRange(filter: string): {startDate: string; endDate: string} {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  const fmt = (d: Date, end = false) => {
    const y = d.getFullYear()
    const m = pad(d.getMonth() + 1)
    const dd = pad(d.getDate())
    return end
      ? `${y}-${m}-${dd}T23:59:59.999Z`
      : `${y}-${m}-${dd}T00:00:00.000Z`
  }

  const start = new Date(now)

  if (filter === "1W") start.setDate(now.getDate() - 7)
  else if (filter === "1M") start.setMonth(now.getMonth() - 1)
  else if (filter === "3M") start.setMonth(now.getMonth() - 3)
  else if (filter === "6M") start.setMonth(now.getMonth() - 6)
  else if (filter === "1Y") start.setFullYear(now.getFullYear() - 1)

  return {startDate: fmt(start), endDate: fmt(now, true)}
}

// Format "2026-04-06" → "Apr 6"
function fmtDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
  })
}

// Calculate next occurrence based on frequency
function calculateNextOccurrence(
  current: Date,
  frequency: string,
  scheduledDay: number
): Date {
  const next = new Date(current)
  if (frequency === "daily") {
    next.setDate(next.getDate() + 1)
  } else if (frequency === "weekly") {
    next.setDate(next.getDate() + 7)
  } else if (frequency === "monthly") {
    next.setMonth(next.getMonth() + 1)
    // If scheduledDay is set, use it, else keep the same day
    if (scheduledDay) {
      next.setDate(scheduledDay)
    }
  }
  return next
}

// ============================================================
// ALLOCATION COLORS (for spending chart)
// ============================================================
const COLORS = [
  "#40c4aa",
  "#005b55",
  "#f59e0b",
  "#6366f1",
  "#94a3b8",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
]

// ============================================================
// SUB-COMPONENTS
// ============================================================

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-[200px]">
      <RefreshCw size={24} className="text-[#40c4aa] animate-spin" />
    </div>
  )
}

function ErrorCard({message}: {message: string}) {
  return (
    <div className="flex items-center gap-[12px] bg-[#2a0a0a] border border-[#5a1a1a] rounded-[12px] p-[16px]">
      <AlertCircle size={20} className="text-[#ef4444] shrink-0" />
      <span className="text-[13px] text-[#ef4444] font-['Inter_Tight',sans-serif]">
        {message}
      </span>
    </div>
  )
}

// -------------------------------------------------------
// HEADER
// -------------------------------------------------------
function DashboardHeader({
  summary,
  loading,
}: {
  summary: SummaryData | null
  loading: boolean
}) {
  return (
    <div className="flex flex-col gap-[16px] w-full mb-[32px]">
      <h1 className="text-[18px] font-medium text-[#717784] font-['Inter_Tight',sans-serif]">
        Good morning 👋
      </h1>

      <div className="flex items-start justify-between w-full">
        <div className="flex flex-col gap-[8px]">
          <button className="bg-[rgba(65,63,63,0.5)] border border-[#2e2f33] rounded-[8px] px-[16px] py-[8px] flex items-center gap-[8px] w-fit hover:bg-[#2e2f33] transition-colors">
            <span className="text-[16px] text-[#99a0ae] font-['Inter_Tight',sans-serif]">
              All Accounts
            </span>
            <ChevronDown size={16} className="text-[#99a0ae]" />
          </button>

          <div className="flex items-baseline gap-[8px] mt-[4px]">
            <span className="text-[32px] text-white font-medium font-['Inter_Tight',sans-serif]">
              LKR
            </span>
            {loading ? (
              <span className="text-[32px] text-[#2e2f33] font-medium animate-pulse">
                ———
              </span>
            ) : (
              <span className="text-[32px] text-[#40c4aa] font-medium font-['Inter_Tight',sans-serif]">
                {(summary?.totalBalance ?? 0).toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-[12px] text-[#717784] font-medium font-['Inter_Tight',sans-serif]">
            Net Available Balance (Assets − Liabilities)
          </span>
        </div>

        {/* Net Flow Widget */}
        <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[12px] p-[16px] flex items-center gap-[12px]">
          <div className="w-[40px] h-[40px] rounded-[10px] bg-white/[0.03] border border-white/[0.03] flex items-center justify-center">
            {loading ? (
              <RefreshCw size={16} className="text-[#40c4aa] animate-spin" />
            ) : (
              <span className="text-[13px] font-bold text-white font-['Arimo',sans-serif]">
                {(summary?.netFlow ?? 0) >= 0 ? "+" : ""}
                {Math.round((summary?.netFlow ?? 0) / 1000)}k
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-medium text-white font-['Inter_Tight',sans-serif]">
              Net Flow
            </span>
            <span className="text-[12px] text-[#40c4aa] mt-[2px] font-['Inter_Tight',sans-serif]">
              Income − Expenses
            </span>
          </div>
        </div>
      </div>

      {/* Summary Pills */}
      {!loading && summary && (
        <div className="flex gap-[12px] flex-wrap">
          {[
            {label: "Income", value: summary.income, color: "#40c4aa"},
            {label: "Expenses", value: summary.expense, color: "#ef4444"},
            {label: "Assets", value: summary.asset, color: "#6366f1"},
            {label: "Liabilities", value: summary.liability, color: "#f59e0b"},
          ].map((item) => (
            <div
              key={item.label}
              className="bg-[#191b1f] border border-[#2e2f33] rounded-[10px] px-[16px] py-[10px] flex flex-col gap-[4px]"
            >
              <span className="text-[11px] text-[#717784] font-['Inter_Tight',sans-serif] uppercase tracking-wide">
                {item.label}
              </span>
              <span
                className="text-[16px] font-semibold font-['Inter_Tight',sans-serif]"
                style={{color: item.color}}
              >
                LKR {item.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------
// CHART CARD (Income / Expense bar chart)
// -------------------------------------------------------
function ChartCard({
  title,
  icon: Icon,
  color,
  type,
}: {
  title: string
  icon: React.ElementType
  color: string
  type: "income" | "expense"
}) {
  const [activeFilter, setActiveFilter] = useState("1M")
  const [data, setData] = useState<{name: string; amount: number}[]>([])
  const [loading, setLoading] = useState(false)

  const fetchChart = useCallback(
    async (filter: string) => {
      setLoading(true)
      try {
        const {startDate, endDate} = getPeriodRange(filter)
        const res: any = await apiFetch(
          `/api/transactions/dashboard/chart?type=${type}&startDate=${encodeURIComponent(
            startDate
          )}&endDate=${encodeURIComponent(endDate)}`
        )
        const raw: ChartPoint[] = res?.data || []
        setData(
          raw
            .filter((d) => d.total > 0)
            .map((d) => ({name: fmtDate(d._id), amount: d.total}))
        )
      } catch {
        setData([])
      } finally {
        setLoading(false)
      }
    },
    [type]
  )

  useEffect(() => {
    fetchChart(activeFilter)
  }, [activeFilter, fetchChart])

  return (
    <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[16px] p-[24px] flex-1 flex flex-col gap-[24px]">
      <div className="flex items-center gap-[12px]">
        <div className="w-[24px] h-[24px] bg-[#2e2f33] rounded-[6px] flex items-center justify-center">
          <Icon size={14} className="text-[#99a0ae]" />
        </div>
        <h2 className="text-[16px] font-medium text-white font-['Inter_Tight',sans-serif]">
          {title}
        </h2>
      </div>

      <div className="h-[200px] w-full">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{top: 0, right: 0, left: -20, bottom: 0}}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#2e2f33"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#717784"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#717784"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) =>
                  `${val >= 1000 ? `${val / 1000}k` : val}`
                }
              />
              <Tooltip
                cursor={{fill: "rgba(255,255,255,0.05)"}}
                contentStyle={{
                  backgroundColor: "#101214",
                  border: "1px solid #2e2f33",
                  borderRadius: "8px",
                }}
                itemStyle={{color: "#fff"}}
                formatter={(val: number) => [`LKR ${val.toLocaleString()}`, ""]}
              />
              <Bar
                dataKey="amount"
                fill={color}
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex justify-between items-center bg-[#101214] p-[4px] rounded-[8px] border border-[#2e2f33]">
        {TIME_FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-[12px] py-[4px] rounded-[6px] text-[12px] font-medium transition-colors ${
              activeFilter === filter
                ? "bg-[#2e2f33] text-white"
                : "text-[#717784] hover:text-[#99a0ae]"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  )
}

// -------------------------------------------------------
// EXPENSE ALLOCATION (Donut)
// -------------------------------------------------------
function ExpenseAllocationWidget({
  data,
  loading,
}: {
  data: SpendingItem[]
  loading: boolean
}) {
  const total = data.reduce((a, d) => a + d.total, 0)
  const chartData = data.map((d, i) => ({
    category: d._id,
    percentage: total > 0 ? Math.round((d.total / total) * 100) : 0,
    color: COLORS[i % COLORS.length],
    amount: d.total,
  }))

  return (
    <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[16px] p-[24px] flex-1 flex flex-col gap-[24px]">
      <div className="flex items-center gap-[12px]">
        <div className="w-[24px] h-[24px] bg-[#2e2f33] rounded-[6px] flex items-center justify-center">
          <PieChartIcon size={14} className="text-[#99a0ae]" />
        </div>
        <h2 className="text-[16px] font-medium text-white font-['Inter_Tight',sans-serif]">
          Expense Allocation
        </h2>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex items-center gap-[24px] h-[200px]">
          {/* Legend */}
          <div className="flex flex-col gap-[10px] flex-1 overflow-y-auto max-h-[200px]">
            {chartData.map((item) => (
              <div
                key={item.category}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-[8px]">
                  <div
                    className="w-[8px] h-[8px] rounded-full shrink-0"
                    style={{backgroundColor: item.color}}
                  />
                  <span className="text-[13px] text-[#99a0ae] font-['Inter_Tight',sans-serif] truncate max-w-[100px]">
                    {item.category}
                  </span>
                </div>
                <span className="text-[13px] text-white font-medium font-['Inter_Tight',sans-serif]">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>

          {/* Donut */}
          <div className="flex-1 h-full relative flex items-center justify-center">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="percentage"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#101214",
                    border: "1px solid #2e2f33",
                    borderRadius: "8px",
                  }}
                  itemStyle={{color: "#fff"}}
                  formatter={(val: number, name: string, props: any) => [
                    `LKR ${props.payload.amount?.toLocaleString()} (${val}%)`,
                    props.payload.category,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[20px] font-medium text-white">100%</span>
              <span className="text-[11px] text-[#717784]">Total</span>
            </div>
          </div>
        </div>
      )}

      {!loading && total > 0 && (
        <div className="text-[12px] text-[#717784] font-['Inter_Tight',sans-serif]">
          Total Expenses:{" "}
          <span className="text-[#ef4444]">LKR {total.toLocaleString()}</span>
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------
// AUTOPILOT TASKS
// -------------------------------------------------------
function AutopilotTasksWidget({
  tasks,
  loading,
  onLogTask,
  onSkipTask,
  onLogAll,
  onSkipAll,
}: {
  tasks: AutopilotTask[]
  loading: boolean
  onLogTask: (id: string) => void
  onSkipTask: (id: string) => void
  onLogAll: () => void
  onSkipAll: () => void
}) {
  return (
    <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[16px] flex-1 flex flex-col overflow-hidden">
      <div className="p-[24px] pb-[16px] flex items-center gap-[12px] border-b border-[#2e2f33]">
        <div className="w-[24px] h-[24px] bg-[#2e2f33] rounded-[6px] flex items-center justify-center">
          <Activity size={14} className="text-[#40c4aa]" />
        </div>
        <h2 className="text-[16px] font-medium text-white font-['Inter_Tight',sans-serif]">
          Pending Autopilot Tasks
        </h2>
        {tasks.length > 0 && (
          <span className="ml-auto bg-[#40c4aa] text-black text-[11px] font-bold px-[8px] py-[2px] rounded-full">
            {tasks.length}
          </span>
        )}
        
      </div>

      <div className="flex flex-col flex-1 p-[16px] gap-[8px] overflow-y-auto min-h-[120px]">
        {loading ? (
          <LoadingSpinner />
        ) : tasks.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-[13px] text-[#717784] font-['Inter_Tight',sans-serif]">
              ✅ No pending tasks today
            </span>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="bg-[#101214] border border-[#2e2f33] rounded-[12px] p-[16px] flex items-center justify-between"
            >
              <div className="flex items-center gap-[16px]">
                <div className="w-[40px] h-[40px] rounded-[10px] bg-white/[0.03] border border-white/[0.03] flex items-center justify-center shrink-0">
                  <CategoryIcon
                    icon={task.type === "income" ? "wallet" : "receipt"}
                    size={20}
                    color="#99a0ae"
                  />
                </div>
                <div className="flex flex-col gap-[2px]">
                  <span className="text-[14px] font-medium text-white font-['Inter_Tight',sans-serif]">
                    {task.name}
                  </span>
                  <span className="text-[12px] text-[#717784] font-['Inter_Tight',sans-serif]">
                    {task.frequency} • {task.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-[24px]">
                <span
                  className={`text-[14px] font-semibold font-['Inter_Tight',sans-serif] ${
                    task.type === "income" ? "text-[#40c4aa]" : "text-[#ef4444]"
                  }`}
                >
                  {task.type === "income" ? "+" : "-"}LKR{" "}
                  {task.amount.toLocaleString()}
                </span>
                <div className="flex items-center gap-[8px]">
                  <button
                    onClick={() => onSkipTask(task._id)}
                    className="px-[12px] py-[6px] rounded-[6px] text-[12px] font-medium text-[#99a0ae] hover:text-white transition-colors"
                  >
                    Skip
                  </button>
                  <button
                    onClick={() => onLogTask(task._id)}
                    className="px-[12px] py-[6px] bg-[#2e2f33] rounded-[6px] text-[12px] font-medium text-white hover:bg-[#3e3f43] transition-colors"
                  >
                    Log
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && tasks.length > 0 && (
        <div className="p-[16px] pt-0 flex gap-[12px]">
          <button
            onClick={onSkipAll}
            className="flex-1 py-[10px] text-center rounded-[8px] border border-[#2e2f33] text-[#717784] hover:text-white font-medium text-[14px] transition-colors"
          >
            Skip All Today
          </button>
          <button
            onClick={onLogAll}
            className="flex-1 py-[10px] text-center rounded-[8px] bg-[#065f46] border border-white/10 hover:bg-[#065f46]/90 text-white font-semibold font-['Inter_Tight',sans-serif] text-[14px] transition-colors"
          >
            Log All Tasks
          </button>
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------
// NET WORTH (Balance chart)
// -------------------------------------------------------
function NetWorthWidget({
  data,
  loading,
}: {
  data: ChartPoint[]
  loading: boolean
}) {
  const chartData = data.map((d) => ({month: fmtDate(d._id), value: d.total}))
  const latest = data[data.length - 1]?.total ?? 0
  const prev = data[data.length - 2]?.total ?? 0
  const change = prev > 0 ? (((latest - prev) / prev) * 100).toFixed(1) : null

  return (
    <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[16px] p-[24px] w-full flex flex-col gap-[24px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[12px]">
          <div className="w-[24px] h-[24px] bg-[#2e2f33] rounded-[6px] flex items-center justify-center">
            <Activity size={14} className="text-[#99a0ae]" />
          </div>
          <h2 className="text-[16px] font-medium text-white font-['Inter_Tight',sans-serif]">
            Total Balance Over Time
          </h2>
        </div>
        {change && (
          <div
            className={`flex items-center gap-[4px] text-[13px] font-medium ${
              Number(change) >= 0 ? "text-[#40c4aa]" : "text-[#ef4444]"
            }`}
          >
            {Number(change) >= 0 ? (
              <ArrowUpRight size={16} />
            ) : (
              <ArrowDownRight size={16} />
            )}
            {change}% vs prev period
          </div>
        )}
      </div>

      <div className="h-[240px] w-full">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{top: 10, right: 0, left: -20, bottom: 0}}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#40c4aa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#40c4aa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#2e2f33"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="#717784"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#717784"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) =>
                  `${val >= 1000 ? `${Math.round(val / 1000)}k` : val}`
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#101214",
                  border: "1px solid #2e2f33",
                  borderRadius: "8px",
                }}
                itemStyle={{color: "#fff"}}
                formatter={(val: number) => [
                  `LKR ${val.toLocaleString()}`,
                  "Balance",
                ]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#40c4aa"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

// ============================================================
// MAIN DASHBOARD COMPONENT
// ============================================================
export function Dashboard() {
  const [state, setState] = useState<DashboardState>({
    summary: null,
    incomeChart: [],
    balanceChart: [],
    spending: [],
    autopilot: [],
    loading: true,
    error: null,
  })

  const fetchAll = useCallback(async () => {
    setState((prev) => ({...prev, loading: true, error: null}))

    try {
      // Build date range for the current month (for balance chart)
      const now = new Date()
      const pad = (n: number) => String(n).padStart(2, "0")
      const monthStart = `${now.getFullYear()}-${pad(
        now.getMonth() + 1
      )}-01T00:00:00.000Z`
      const monthEnd = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
        new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
      )}T23:59:59.999Z`

      const [summaryRes, balanceRes, spendingRes, autopilotRes] =
        await Promise.allSettled([
          apiFetch<any>("/api/transactions/dashboard/summary"),
          apiFetch<any>(
            `/api/transactions/dashboard/chart?startDate=${encodeURIComponent(
              monthStart
            )}&endDate=${encodeURIComponent(monthEnd)}`
          ),
          apiFetch<any>("/api/transactions/dashboard/spending"),
          apiFetch<any>("/api/transactions/autopilot/"),
        ])

      const allFlows: AutopilotFlow[] =
        autopilotRes.status === "fulfilled"
          ? autopilotRes.value?.data ?? []
          : []
      console.log("All autopilot flows:", allFlows)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      console.log("Today:", today)
      let pendingTasks: AutopilotTask[] = allFlows
        .filter((flow) => {
          const nextOcc = new Date(flow.nextOccurrence)
          console.log(
            `Flow ${flow._id}: active=${
              flow.isActive
            }, nextOccurrence=${nextOcc}, <= today=${nextOcc <= today}`
          )
          return flow.isActive && nextOcc <= today
        })
        .map((flow) => ({
          ...flow,
          name: flow.flowName,
          category: `${flow.parentCategory}${
            flow.subCategory ? ` • ${flow.subCategory}` : ""
          }`,
        }))

      // Fallback mock data if no pending tasks from backend
      if (pendingTasks.length === 0 && allFlows.length === 0) {
        pendingTasks = [
          {
            _id: "mock1",
            flowName: "Apartment Rent",
            amount: -1250,
            type: "expense",
            parentCategory: "Housing",
            subCategory: "",
            frequency: "monthly",
            scheduledDay: 1,
            nextOccurrence: "2026-04-10T00:00:00.000Z",
            isActive: true,
            userId: "mock",
            name: "Apartment Rent",
            category: "Housing",
          },
          {
            _id: "mock2",
            flowName: "Monthly Salary",
            amount: 125000,
            type: "income",
            parentCategory: "Salary",
            subCategory: "",
            frequency: "monthly",
            scheduledDay: 1,
            nextOccurrence: "2026-04-10T00:00:00.000Z",
            isActive: true,
            userId: "mock",
            name: "Monthly Salary",
            category: "Salary",
          },
        ]
      }

      console.log("Pending tasks:", pendingTasks)

      setState({
        summary:
          summaryRes.status === "fulfilled"
            ? summaryRes.value?.data ?? null
            : null,
        balanceChart:
          balanceRes.status === "fulfilled" ? balanceRes.value?.data ?? [] : [],
        spending:
          spendingRes.status === "fulfilled"
            ? spendingRes.value?.data ?? []
            : [],
        autopilot: pendingTasks,
        incomeChart: [],
        loading: false,
        error: null,
      })
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err.message || "Failed to load dashboard",
      }))
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  // ===== AUTOPILOT ACTIONS =====
  const handleLogTask = async (id: string) => {
    if (id.startsWith("mock")) {
      // For mock data, just remove from state
      setState((prev) => ({
        ...prev,
        autopilot: prev.autopilot.filter((t) => t._id !== id),
      }))
      return
    }

    try {
      const task = state.autopilot.find((t) => t._id === id)
      if (!task) return

      // Create transaction
      const transactionData = {
        amount: task.amount,
        type: task.type,
        category: task.parentCategory,
        subCategory: task.subCategory,
        date: new Date().toISOString(),
        notes: `Autopilot: ${task.flowName}`,
      }
      await apiFetch("/api/transactions", {
        method: "POST",
        body: JSON.stringify(transactionData),
      })

      // Update autopilot nextOccurrence
      const nextOccurrence = calculateNextOccurrence(
        new Date(),
        task.frequency,
        task.scheduledDay
      )
      await apiFetch(`/api/autopilot/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          nextOccurrence: nextOccurrence.toISOString(),
          lastRun: new Date().toISOString(),
        }),
      })

      fetchAll()
    } catch (e) {
      console.error(e)
      setState((prev) => ({...prev, error: "Failed to log task"}))
    }
  }

  const handleSkipTask = async (id: string) => {
    // For skip, just remove from local state (skip for today)
    setState((prev) => ({
      ...prev,
      autopilot: prev.autopilot.filter((t) => t._id !== id),
    }))
  }

  const handleLogAll = async () => {
    try {
      for (const task of state.autopilot) {
        await handleLogTask(task._id)
      }
    } catch (e) {
      console.error(e)
      setState((prev) => ({...prev, error: "Failed to log all tasks"}))
    }
  }

  const handleSkipAll = async () => {
    setState((prev) => ({...prev, autopilot: []}))
  }

  return (
    <div className="w-full flex justify-center pb-[100px] animate-in fade-in duration-300">
      <div className="w-full max-w-[1280px] px-[32px] pt-[32px] flex flex-col gap-[24px]">
        {/* Refresh button */}
        <div className="flex justify-end">
          <button
            onClick={fetchAll}
            className="flex items-center gap-[8px] text-[13px] text-[#717784] hover:text-white transition-colors"
          >
            <RefreshCw
              size={14}
              className={state.loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {state.error && <ErrorCard message={state.error} />}

        {/* Header */}
        <DashboardHeader summary={state.summary} loading={state.loading} />

        {/* Top Row: Income vs Expenses */}
        <div className="grid grid-cols-2 gap-[24px] w-full">
          <ChartCard
            title="Income Overview"
            icon={ArrowUpRight}
            color="#40c4aa"
            type="income"
          />
          <ChartCard
            title="Expense Overview"
            icon={ArrowDownRight}
            color="#df1c41"
            type="expense"
          />
        </div>

        {/* Middle Row: Allocation & Autopilot */}
        <div className="grid grid-cols-2 gap-[24px] w-full">
          <ExpenseAllocationWidget
            data={state.spending}
            loading={state.loading}
          />
          <AutopilotTasksWidget
            tasks={state.autopilot}
            loading={state.loading}
            onLogTask={handleLogTask}
            onSkipTask={handleSkipTask}
            onLogAll={handleLogAll}
            onSkipAll={handleSkipAll}
          />
        </div>

        {/* Bottom Row: Balance over time */}
        <NetWorthWidget data={state.balanceChart} loading={state.loading} />
      </div>
    </div>
  )
}
