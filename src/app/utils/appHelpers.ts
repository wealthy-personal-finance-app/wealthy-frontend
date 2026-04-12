import type {TransactionGroup} from "../components/transactions/HistoryView"
import type {AutopilotFlowGroup} from "../components/transactions/AutopilotBaseView"
import type {ChatLink} from "../components/layout/Sidebar"

function getIconForCategory(subCategory: string): string {
  const cat = (subCategory || "").toLowerCase()
  if (
    cat.includes("food") ||
    cat.includes("restaurant") ||
    cat.includes("dining")
  )
    return "coffee"
  if (cat.includes("shop") || cat.includes("grocery")) return "shopping"
  if (cat.includes("salary") || cat.includes("income") || cat.includes("bonus"))
    return "wallet"
  if (cat.includes("transport") || cat.includes("gas") || cat.includes("uber"))
    return "car"
  if (cat.includes("house") || cat.includes("rent") || cat.includes("mortgage"))
    return "home"
  return "more-horizontal"
}

export function groupTransactionsByDate(transactions: any[]): TransactionGroup[] {
  const groups: Record<string, any[]> = {}

  transactions.forEach((tx) => {
    const dateKey = tx.date.split("T")[0]
    if (!groups[dateKey]) groups[dateKey] = []

    groups[dateKey].push({
      id: tx._id,
      merchant: tx.note || tx.subCategory || "Unknown",
      category: tx.parentCategory || "Uncategorized",
      subcategory: tx.subCategory || "General",
      amount: tx.amount,
      type: tx.type,
      icon: getIconForCategory(tx.subCategory),
      date: tx.date,
    })
  })

  return Object.keys(groups)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .map((dateStr) => {
      const dateObj = new Date(dateStr)
      const tzOffset = dateObj.getTimezoneOffset() * 60000
      const localDate = new Date(dateObj.getTime() + tzOffset)

      return {
        date: dateStr,
        label: localDate.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        transactions: groups[dateStr],
      }
    })
}

export function groupAutopilotFlows(flows: any[]): AutopilotFlowGroup[] {
  const grouped: Record<string, any[]> = {
    daily: [],
    weekly: [],
    monthly: [],
    yearly: [],
  }
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  flows.forEach((flow) => {
    const freq = (flow.frequency || "monthly").toLowerCase()
    let scheduleText = String(flow.scheduledDay || "")

    if (freq === "monthly") {
      scheduleText = `${flow.scheduledDay} of every month`
    } else if (freq === "weekly") {
      const mappedDays = scheduleText
        .split(",")
        .map((dayString) => parseInt(dayString.trim(), 10))
        .filter((num) => !isNaN(num) && num >= 0 && num <= 6)
        .map((num) => daysOfWeek[num])
        .join(", ")
      scheduleText = `Every ${mappedDays || flow.scheduledDay}`
    } else if (freq === "yearly") {
      scheduleText = `Every ${flow.scheduledDay}`
    } else if (freq === "daily") {
      scheduleText = "Every Day"
    }

    if (grouped[freq]) {
      grouped[freq].push({
        id: flow._id,
        title: flow.flowName,
        schedule: scheduleText,
        amount: flow.amount,
        type: flow.type,
        icon: getIconForCategory(flow.subCategory),
        category: flow.subCategory,
        enabled: flow.isActive !== false,
      })
    }
  })

  const finalGroups: AutopilotFlowGroup[] = []
  if (grouped.daily.length)
    finalGroups.push({
      frequency: "daily",
      label: "Daily Flows",
      flows: grouped.daily,
    })
  if (grouped.weekly.length)
    finalGroups.push({
      frequency: "weekly",
      label: "Weekly Flows",
      flows: grouped.weekly,
    })
  if (grouped.monthly.length)
    finalGroups.push({
      frequency: "monthly",
      label: "Monthly Flows",
      flows: grouped.monthly,
    })
  if (grouped.yearly.length)
    finalGroups.push({
      frequency: "yearly",
      label: "Yearly Flows",
      flows: grouped.yearly,
    })

  return finalGroups
}

export function extractStringValue(
  params: URLSearchParams,
  keys: string[]
): string | null {
  for (const key of keys) {
    const value = params.get(key)
    if (value && value.trim().length > 0) return value.trim()
  }
  return null
}

export function clearOAuthParamsFromUrl(): void {
  const url = new URL(window.location.href)
  const keysToRemove = [
    "token",
    "accessToken",
    "authToken",
    "jwt",
    "email",
    "name",
    "fullName",
    "firstName",
    "lastName",
  ]

  for (const key of keysToRemove) {
    url.searchParams.delete(key)
  }

  window.history.replaceState({}, document.title, url.toString())
}

export function parseChatLinks(payload: unknown): ChatLink[] {
  if (!payload || typeof payload !== "object") return []

  const root = payload as Record<string, unknown>
  const candidates = [root.history, root.conversations, root.data, root.items]
  const list = candidates.find((candidate) => Array.isArray(candidate))
  if (!Array.isArray(list)) return []

  return list
    .map((item) => {
      if (!item || typeof item !== "object") return null
      const entry = item as Record<string, unknown>
      const id =
        (typeof entry._id === "string" && entry._id) ||
        (typeof entry.id === "string" && entry.id) ||
        (typeof entry.conversationId === "string" && entry.conversationId) ||
        null

      if (!id) return null

      const labelCandidates = [
        entry.title,
        entry.label,
        entry.subject,
        entry.preview,
        entry.lastMessage,
        entry.lastUserMessage,
      ]

      const firstText = labelCandidates.find(
        (candidate) =>
          typeof candidate === "string" && candidate.trim().length > 0
      ) as string | undefined

      const label = firstText ? firstText.trim() : `Chat ${id.slice(-4)}`
      return {id, label: label.slice(0, 64)}
    })
    .filter((value): value is ChatLink => Boolean(value))
}

export function getSidebarLinkFromPath(pathname: string): string {
  if (pathname.startsWith("/dashboard")) return "dashboard"
  if (pathname.startsWith("/ai-assistant")) return "ai-assistant"
  if (pathname.startsWith("/cash-flow")) return "cash-flow"
  if (pathname.startsWith("/transactions")) return "transactions"
  if (pathname.startsWith("/help")) return "help"
  if (pathname.startsWith("/profile")) return "profile"
  if (pathname.startsWith("/settings") || pathname.startsWith("/billing")) {
    return "settings"
  }
  return "transactions"
}

export function getPathFromSidebarLink(linkId: string): string {
  if (linkId === "dashboard") return "/dashboard"
  if (linkId === "ai-assistant") return "/ai-assistant"
  if (linkId === "cash-flow") return "/cash-flow"
  if (linkId === "transactions") return "/transactions"
  if (linkId === "help") return "/help"
  if (linkId === "profile") return "/profile"
  if (linkId === "settings") return "/settings"
  return "/transactions"
}
