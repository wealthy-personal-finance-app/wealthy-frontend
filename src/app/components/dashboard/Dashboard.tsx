/// <reference types="vite/client" />
import React, {useState, useEffect, useCallback} from "react"
import {
  ChevronDown,
  ChevronLeft,
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
import {getAuthToken} from "../../utils/auth"
import {apiFetchJson} from "../../apis/client"

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken()
  const {response: res, data} = await apiFetchJson<T>(path, {
    auth: Boolean(token),
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  })

  if (!res.ok) {
    const err: any = data || {}
    throw new Error(err.message || `HTTP ${res.status}`)
  }

  return data as T
}

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

type SpendingDrilldownMap = Record<string, SpendingItem[]>

interface RawTransactionItem {
  amount?: number
  type?: string
  subCategory?: string
  parentCategory?: string
  date?: string
}

function toDayKey(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, "0")
  const d = String(date.getUTCDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function getSignedBalanceDelta(tx: RawTransactionItem): number {
  const amount = Number(tx.amount)
  if (!Number.isFinite(amount) || amount === 0) return 0

  const type = String(tx.type || "").toLowerCase()
  const abs = Math.abs(amount)

  if (type === "income" || type === "asset") return abs
  if (type === "expense" || type === "liability") return -abs
  return 0
}

function buildBalanceOverTime(
  transactions: RawTransactionItem[],
  currentTotalBalance?: number
): ChartPoint[] {
  const deltaByDay = new Map<string, number>()

  for (const tx of transactions) {
    const dayKey = toDayKey(tx.date)
    if (!dayKey) continue

    const delta = getSignedBalanceDelta(tx)
    if (!delta) continue

    const prev = deltaByDay.get(dayKey) || 0
    deltaByDay.set(dayKey, prev + delta)
  }

  const sortedDays = Array.from(deltaByDay.keys()).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  )

  let running = 0
  const points: ChartPoint[] = sortedDays.map((day) => {
    running += deltaByDay.get(day) || 0
    return {_id: day, total: running}
  })

  if (points.length === 0) return []

  if (Number.isFinite(currentTotalBalance)) {
    const offset = Number(currentTotalBalance) - points[points.length - 1].total
    return points.map((point) => ({
      ...point,
      total: point.total + offset,
    }))
  }

  return points
}

interface AutopilotFlow {
  _id: string
  flowName: string
  amount: number
  type: "income" | "expense" | "asset" | "liability"
  parentCategory: string
  subCategory: string
  frequency: "daily" | "weekly" | "monthly" | "yearly"
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
  spendingDrilldown: SpendingDrilldownMap
  autopilot: AutopilotTask[]
  loading: boolean
  error: string | null
}

function aggregateExpenseHierarchy(transactions: RawTransactionItem[]): {
  parents: SpendingItem[]
  drilldown: SpendingDrilldownMap
} {
  const parentMap = new Map<string, {total: number; count: number}>()
  const subMapByParent = new Map<
    string,
    Map<string, {total: number; count: number}>
  >()

  for (const tx of transactions) {
    const type = String(tx.type || "").toLowerCase()
    if (type !== "expense" && type !== "liability") continue

    const amount = Number(tx.amount)
    if (!Number.isFinite(amount) || amount === 0) continue

    const parent =
      (typeof tx.parentCategory === "string" && tx.parentCategory.trim()) ||
      "Other"
    const sub =
      (typeof tx.subCategory === "string" && tx.subCategory.trim()) ||
      parent ||
      "Other"

    const parentPrev = parentMap.get(parent) || {total: 0, count: 0}
    parentMap.set(parent, {
      total: parentPrev.total + Math.abs(amount),
      count: parentPrev.count + 1,
    })

    if (!subMapByParent.has(parent)) {
      subMapByParent.set(parent, new Map())
    }

    const subMap = subMapByParent.get(parent)!
    const subPrev = subMap.get(sub) || {total: 0, count: 0}
    subMap.set(sub, {
      total: subPrev.total + Math.abs(amount),
      count: subPrev.count + 1,
    })
  }

  const parents = Array.from(parentMap.entries())
    .map(([name, value]) => ({
      _id: name,
      total: value.total,
      count: value.count,
    }))
    .sort((a, b) => b.total - a.total)

  const drilldown: SpendingDrilldownMap = {}
  for (const [parent, subMap] of subMapByParent.entries()) {
    drilldown[parent] = Array.from(subMap.entries())
      .map(([name, value]) => ({
        _id: name,
        total: value.total,
        count: value.count,
      }))
      .sort((a, b) => b.total - a.total)
  }

  return {parents, drilldown}
}

function aggregateSimpleSpending(items: SpendingItem[]): SpendingItem[] {
  const map = new Map<string, {total: number; count: number}>()
  for (const item of items) {
    const key = (item._id || "Other").trim() || "Other"
    const normalizedTotal = Number.isFinite(item.total)
      ? Math.abs(item.total)
      : 0
    const prev = map.get(key) || {total: 0, count: 0}
    map.set(key, {
      total: prev.total + normalizedTotal,
      count: prev.count + (Number.isFinite(item.count) ? item.count : 1),
    })
  }

  return Array.from(map.entries())
    .map(([name, value]) => ({
      _id: name,
      total: value.total,
      count: value.count,
    }))
    .sort((a, b) => b.total - a.total)
}

const TIME_FILTERS = ["1W", "1M", "3M", "6M", "1Y"]
const BALANCE_TIME_FILTERS = ["1M", "3M", "6M", "1Y", "ALL"]

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

function fmtDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
  })
}

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
    if (scheduledDay) {
      next.setDate(scheduledDay)
    }
  } else if (frequency === "yearly") {
    next.setFullYear(next.getFullYear() + 1)
    if (scheduledDay) {
      next.setDate(scheduledDay)
    }
  }
  return next
}

function parseScheduledDay(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value)
  }
  if (typeof value === "string") {
    const match = value.match(/\d+/)
    if (match) return Number(match[0])
  }
  return fallback
}

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

function DashboardHeader({
  summary,
  loading,
}: {
  summary: SummaryData | null
  loading: boolean
}) {
  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return "Good morning 👋"
    if (hour >= 12 && hour < 18) return "Good afternoon 👋"
    if (hour >= 18 && hour < 22) return "Good evening 👋"
    return "Good night 👋"
  }

  return (
    <div className="flex flex-col gap-[16px] w-full mb-[32px]">
      <h1 className="text-[18px] font-medium text-[#717784] font-['Inter_Tight',sans-serif]">
        {getGreeting()}
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

function ExpenseAllocationWidget({
  data,
  drilldown,
  loading,
}: {
  data: SpendingItem[]
  drilldown: SpendingDrilldownMap
  loading: boolean
}) {
  const [selectedParent, setSelectedParent] = useState<string | null>(null)

  useEffect(() => {
    setSelectedParent(null)
  }, [data])

  const isDrilldown = selectedParent !== null
  const sourceData = isDrilldown ? drilldown[selectedParent] || [] : data
  const total = sourceData.reduce((a, d) => a + d.total, 0)
  const chartData = sourceData.map((d, i) => ({
    category: d._id,
    percentage: total > 0 ? Number(((d.total / total) * 100).toFixed(2)) : 0,
    color: COLORS[i % COLORS.length],
    amount: d.total,
  }))

  const handleCategoryClick = (category: string) => {
    if (isDrilldown) return
    if (!drilldown[category] || drilldown[category].length === 0) return
    setSelectedParent(category)
  }

  return (
    <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[16px] p-[24px] flex-1 flex flex-col gap-[24px]">
      <div className="flex items-center gap-[12px]">
        <div className="w-[24px] h-[24px] bg-[#2e2f33] rounded-[6px] flex items-center justify-center">
          <PieChartIcon size={14} className="text-[#99a0ae]" />
        </div>
        <h2 className="text-[16px] font-medium text-white font-['Inter_Tight',sans-serif]">
          {isDrilldown
            ? `${selectedParent} — Subcategories`
            : "Expense Allocation"}
        </h2>
        {isDrilldown && (
          <button
            onClick={() => setSelectedParent(null)}
            className="ml-auto flex items-center gap-[4px] text-[12px] text-[#99a0ae] hover:text-white transition-colors"
          >
            <ChevronLeft size={14} />
            Back
          </button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : chartData.length === 0 || total <= 0 ? (
        <div className="flex items-center justify-center h-[200px]">
          <span className="text-[16px] text-[#717784] font-['Inter_Tight',sans-serif]">
            No Expenses
          </span>
        </div>
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
                  <button
                    onClick={() => handleCategoryClick(item.category)}
                    className={`text-[13px] text-left font-['Inter_Tight',sans-serif] truncate max-w-[140px] transition-colors ${
                      !isDrilldown && drilldown[item.category]?.length
                        ? "text-[#99a0ae] hover:text-white"
                        : "text-[#99a0ae]"
                    }`}
                  >
                    {item.category}
                  </button>
                </div>
                <span className="text-[13px] text-white font-medium font-['Inter_Tight',sans-serif]">
                  {item.percentage.toFixed(2)}%
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
                  onClick={(entry: any) =>
                    handleCategoryClick(entry?.category || "")
                  }
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
                    `LKR ${props.payload.amount?.toLocaleString()} (${Number(
                      val
                    ).toFixed(2)}%)`,
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
          {isDrilldown ? "Total in selected parent:" : "Total Expenses:"}{" "}
          <span className="text-[#ef4444]">LKR {total.toLocaleString()}</span>
        </div>
      )}
    </div>
  )
}

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
            <span className="text-[16px] text-[#717784] font-['Inter_Tight',sans-serif]">
              No pending autopilot tasks
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

function NetWorthWidget({
  data,
  loading,
}: {
  data: ChartPoint[]
  loading: boolean
}) {
  const [activeFilter, setActiveFilter] = useState("6M")

  const sortedData = [...data].sort(
    (a, b) => new Date(a._id).getTime() - new Date(b._id).getTime()
  )

  const filteredData =
    activeFilter === "ALL"
      ? sortedData
      : (() => {
          const {startDate} = getPeriodRange(activeFilter)
          const start = new Date(startDate)
          return sortedData.filter((point) => new Date(point._id) >= start)
        })()

  const chartData = filteredData.map((d) => ({
    month: fmtDate(d._id),
    value: d.total,
  }))
  const latest = filteredData[filteredData.length - 1]?.total ?? 0
  const prev = filteredData[filteredData.length - 2]?.total ?? 0
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
        <div className="flex items-center gap-[12px]">
          <div className="flex justify-between items-center bg-[#101214] p-[4px] rounded-[8px] border border-[#2e2f33]">
            {BALANCE_TIME_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-[10px] py-[4px] rounded-[6px] text-[12px] font-medium transition-colors ${
                  activeFilter === filter
                    ? "bg-[#2e2f33] text-white"
                    : "text-[#717784] hover:text-[#99a0ae]"
                }`}
              >
                {filter}
              </button>
            ))}
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
              {change}% vs prev point
            </div>
          )}
        </div>
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

export function Dashboard() {
  const [state, setState] = useState<DashboardState>({
    summary: null,
    incomeChart: [],
    balanceChart: [],
    spending: [],
    spendingDrilldown: {},
    autopilot: [],
    loading: true,
    error: null,
  })

  const fetchAll = useCallback(async () => {
    setState((prev) => ({...prev, loading: true, error: null}))

    try {
      const [
        summaryRes,
        balanceRes,
        spendingRes,
        autopilotRes,
        transactionsRes,
      ] = await Promise.allSettled([
        apiFetch<any>("/api/transactions/dashboard/summary"),
        apiFetch<any>("/api/transactions/dashboard/chart"),
        apiFetch<any>("/api/transactions/dashboard/spending"),
        apiFetch<any>("/api/transactions/autopilot/"),
        apiFetch<any>("/api/transactions"),
      ])

      const summaryData: SummaryData | null =
        summaryRes.status === "fulfilled"
          ? summaryRes.value?.data ?? null
          : null

      const rawTransactions: RawTransactionItem[] =
        transactionsRes.status === "fulfilled"
          ? transactionsRes.value?.data ?? []
          : []

      const spendingFromTransactions =
        transactionsRes.status === "fulfilled"
          ? aggregateExpenseHierarchy(rawTransactions)
          : {parents: [], drilldown: {}}

      const spendingFromEndpoint: SpendingItem[] =
        spendingRes.status === "fulfilled" ? spendingRes.value?.data ?? [] : []

      const finalSpendingData =
        spendingFromTransactions.parents.length > 0
          ? spendingFromTransactions.parents
          : aggregateSimpleSpending(spendingFromEndpoint)

      const finalSpendingDrilldown: SpendingDrilldownMap =
        spendingFromTransactions.parents.length > 0
          ? spendingFromTransactions.drilldown
          : {}

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

      console.log("Pending tasks:", pendingTasks)

      const balanceFromTransactions = buildBalanceOverTime(
        rawTransactions,
        summaryData?.totalBalance
      )

      const fallbackBalance: ChartPoint[] =
        balanceRes.status === "fulfilled" ? balanceRes.value?.data ?? [] : []

      const finalBalanceData =
        balanceFromTransactions.length > 0
          ? balanceFromTransactions
          : fallbackBalance

      setState({
        summary: summaryData,
        balanceChart: finalBalanceData,
        spending: finalSpendingData,
        spendingDrilldown: finalSpendingDrilldown,
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

  const syncAutopilotNextOccurrence = useCallback(
    async (task: AutopilotTask, includeLastRun: boolean) => {
      const nextOccurrence = calculateNextOccurrence(
        new Date(),
        task.frequency,
        parseScheduledDay(task.scheduledDay, 1)
      )

      const payload: Record<string, unknown> = {
        nextOccurrence: nextOccurrence.toISOString(),
      }

      if (includeLastRun) {
        payload.lastRun = new Date().toISOString()
      }

      await apiFetch(`/api/transactions/autopilot/${task._id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      })
    },
    []
  )

  const handleLogTask = async (id: string) => {
    try {
      const task = state.autopilot.find((t) => t._id === id)
      if (!task) return

      const transactionData = {
        amount: task.amount,
        type: task.type,
        parentCategory: task.parentCategory,
        subCategory: task.subCategory,
        date: new Date().toISOString(),
        note: `Autopilot: ${task.flowName}`,
        notes: `Autopilot: ${task.flowName}`,
      }

      await apiFetch("/api/transactions", {
        method: "POST",
        body: JSON.stringify(transactionData),
      })

      await syncAutopilotNextOccurrence(task, true)

      fetchAll()
    } catch (e) {
      console.error(e)
      setState((prev) => ({...prev, error: "Failed to log task"}))
    }
  }

  const handleSkipTask = async (id: string) => {
    try {
      const task = state.autopilot.find((t) => t._id === id)
      if (!task) return

      await syncAutopilotNextOccurrence(task, false)
      fetchAll()
    } catch (e) {
      console.error(e)
      setState((prev) => ({...prev, error: "Failed to skip task"}))
    }
  }

  const handleLogAll = async () => {
    try {
      const tasks = [...state.autopilot]
      for (const task of tasks) {
        const transactionData = {
          amount: task.amount,
          type: task.type,
          parentCategory: task.parentCategory,
          subCategory: task.subCategory,
          date: new Date().toISOString(),
          note: `Autopilot: ${task.flowName}`,
          notes: `Autopilot: ${task.flowName}`,
        }

        await apiFetch("/api/transactions", {
          method: "POST",
          body: JSON.stringify(transactionData),
        })
        await syncAutopilotNextOccurrence(task, true)
      }

      fetchAll()
    } catch (e) {
      console.error(e)
      setState((prev) => ({...prev, error: "Failed to log all tasks"}))
    }
  }

  const handleSkipAll = async () => {
    try {
      const tasks = [...state.autopilot]
      await Promise.all(
        tasks.map((task) => syncAutopilotNextOccurrence(task, false))
      )
      fetchAll()
    } catch (e) {
      console.error(e)
      setState((prev) => ({...prev, error: "Failed to skip all tasks"}))
    }
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
            drilldown={state.spendingDrilldown}
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
