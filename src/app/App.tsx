import {useState, useEffect, useCallback} from "react"
import {MainLayout} from "./components/layout/MainLayout"
import {TransactionsPage} from "./components/transactions/TransactionsPage"
import {AIAssistantPage} from "./components/ai-assistant/AIAssistantPage"
import {TransactionGroup} from "./components/transactions/HistoryView"
import {AutopilotFlowGroup} from "./components/transactions/AutopilotBaseView"
import {FilterState} from "./components/transactions/FilterMenu"
import {AddTransactionModal} from "./components/transactions/AddTransactionModal"
import {AddNewAutopilotDrawer} from "./components/transactions/AddNewAutopilotDrawer"
import {Dashboard} from "./components/dashboard/Dashboard"
import {ChatLink} from "./components/layout/Sidebar"
import {CashflowPage} from "./components/cashflow/CashflowPage"
import {toast} from "sonner"

// Mock data - replace with API calls
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

function groupTransactionsByDate(transactions: any[]): TransactionGroup[] {
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

function groupAutopilotFlows(flows: any[]): AutopilotFlowGroup[] {
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

const DEFAULT_USER = {
  name: "Alexander Jhoe",
  email: "alexanderjhoe@mail.com",
  badge: "Free",
}

const mockSidebarLinks = {
  main: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "home" as const,
      href: "/dashboard",
    },
    {
      id: "ai-assistant",
      label: "AI Assistant",
      icon: "bot" as const,
      href: "/ai-assistant",
    },
    {
      id: "cash-flow",
      label: "Cash Flow",
      icon: "cash-flow" as const,
      href: "/cash-flow",
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: "list" as const,
      href: "/transactions",
    },
  ],
  secondary: [
    {
      id: "goals-habits",
      label: "Goals & Habits",
      icon: "target" as const,
      href: "/goals-habits",
    },
    {
      id: "advanced-planning",
      label: "Advanced Planning",
      icon: "folder" as const,
      href: "/advanced-planning",
    },
  ],
  bottom: [
    {id: "help", label: "Help Center", icon: "help" as const, href: "/help"},
    {
      id: "settings",
      label: "Settings",
      icon: "settings" as const,
      href: "/settings",
    },
  ],
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000"
const AI_HISTORY_ENDPOINT = `${API_BASE_URL}/api/ai/history`
const POSSIBLE_TOKEN_KEYS = [
  "token",
  "accessToken",
  "authToken",
  "jwt",
  "wealthyToken",
  "wealthy_token",
]

function getAuthToken(): string | null {
  for (const key of POSSIBLE_TOKEN_KEYS) {
    const token = localStorage.getItem(key)
    if (token) return token
  }
  return null
}

function parseChatLinks(payload: unknown): ChatLink[] {
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
export default function App() {
  const [activeSidebarLink, setActiveSidebarLink] = useState("transactions")
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)
  const [isAddAutopilotOpen, setIsAddAutopilotOpen] = useState(false)

  // Real Data & Filter State
  const [rawTransactions, setRawTransactions] = useState<any[]>([])
  const [autopilotFlowGroups, setAutopilotFlowGroups] = useState<
    AutopilotFlowGroup[]
  >([])
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "income" | "expenses"
  >("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [chatLinks, setChatLinks] = useState<ChatLink[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [newChatSignal, setNewChatSignal] = useState(0)

  const loadChatHistory = useCallback(async () => {
    const token = getAuthToken()
    if (!token) {
      setChatLinks([])
      return
    }

    try {
      const response = await fetch(AI_HISTORY_ENDPOINT, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      let payload: unknown = null
      try {
        payload = await response.json()
      } catch {
        payload = null
      }

      if (!response.ok) {
        throw new Error(`Failed to load chat history (${response.status})`)
      }

      const parsed = parseChatLinks(payload)
      setChatLinks(parsed)
    } catch (error) {
      console.error("Failed to load chat history:", error)
    }
  }, [])

  useEffect(() => {
    if (activeSidebarLink === "ai-assistant") {
      void loadChatHistory()
    }
  }, [activeSidebarLink, loadChatHistory])

  useEffect(() => {
    const handleGlobalFocus = (e: FocusEvent) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
      ) {
        // Use a tiny timeout to ensure focus is fully established before selecting
        setTimeout(() => {
          if (document.activeElement === target) {
            target.select()
          }
        }, 0)
      }
    }
    document.addEventListener("focus", handleGlobalFocus, true)
    return () => document.removeEventListener("focus", handleGlobalFocus, true)
  }, [])

  const handleSidebarLinkClick = (linkId: string) => {
    setActiveSidebarLink(linkId)
    console.log("Navigate to:", linkId)
  }

  const handleAddTransaction = () => {
    setIsAddTransactionOpen(true)
  }

  const handleUserMenuClick = () => {
    console.log("User menu clicked")
  }

  const handleTransactionMenuClick = (transactionId: string) => {
    console.log("Transaction menu clicked:", transactionId)
  }

  const handleNewAutopilotFlowClick = () => {
    console.log("New autopilot flow clicked")
  }

  // Fetch BOTH Transactions & Autopilot Flows
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoadingTransactions(true)
      try {
        const token = getAuthToken()
        if (!token) {
          console.warn("No auth token found in localStorage.")
          setIsLoadingTransactions(false)
          return
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }

        const txRes = await fetch("http://localhost:5000/api/transactions", {
          headers,
        })
        if (txRes.ok) {
          const txData = await txRes.json()
          setRawTransactions(txData.data || [])
        }

        const autoRes = await fetch(
          "http://localhost:5000/api/transactions/autopilot",
          {headers}
        )
        if (autoRes.ok) {
          const autoData = await autoRes.json()
          setAutopilotFlowGroups(groupAutopilotFlows(autoData.data || []))
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoadingTransactions(false)
      }
    }

    fetchAllData()
  }, [refreshTrigger])

  const filteredTransactions = rawTransactions.filter((tx) => {
    const txType = (tx.type || "").toLowerCase()
    const merchantName = (tx.note || tx.subCategory || "").toLowerCase()

    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "expenses" && txType === "expense") ||
      (selectedCategory === "income" && txType === "income")

    const matchesSearch = merchantName.includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  const transactionGroups = groupTransactionsByDate(filteredTransactions)

  const handleAutopilotToggle = async (id: string, enabled: boolean) => {
    try {
      const token = getAuthToken()
      if (!token) return
      const res = await fetch(
        `http://localhost:5000/api/transactions/autopilot/${id}/toggle`,
        {
          method: "PATCH",
          headers: {Authorization: `Bearer ${token}`},
        }
      )
      if (res.ok) setRefreshTrigger((prev) => prev + 1)
    } catch (error) {
      console.error("Failed to toggle autopilot flow:", error)
    }
  }

  // --- DELETE Transaction ---
  const handleDeleteTransaction = async (id: string) => {
    try {
      const token = getAuthToken()
      if (!token) return
      const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: "DELETE",
        headers: {Authorization: `Bearer ${token}`},
      })

      if (res.ok) {
        setRefreshTrigger((prev) => prev + 1) // Instantly updates UI
      } else {
        alert("Failed to delete transaction.")
      }
    } catch (error) {
      console.error("Error deleting transaction:", error)
    }
  }

  // --- UPDATE Transaction ---
  const handleUpdateTransaction = async (id: string, updatedData: any) => {
    try {
      const token = getAuthToken()
      if (!token) return

      const payload = {
        amount: Number(updatedData.amount),
        type: String(updatedData.type).toLowerCase(),
        note: updatedData.name,
        parentCategory: updatedData.parentCategory || "Uncategorized",
        subCategory: updatedData.subCategory || updatedData.category,
        date: updatedData.date,
      }

      const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setRefreshTrigger((prev) => prev + 1) // Instantly updates UI
      } else {
        const errorData = await res.json()
        console.error("Backend Error Details:", errorData)
        alert(`Failed to update: ${errorData.message || "Validation Error"}`)
      }
    } catch (error) {
      console.error("Error updating transaction:", error)
    }
  }

  // --- CALCULATE DYNAMIC SAVINGS ---
  const dynamicTotalSavings = autopilotFlowGroups.reduce((total, group) => {
    const groupSum = group.flows.reduce((sum, flow) => {
      // Only sum up flows that are currently active (enabled)
      return flow.enabled ? sum + flow.amount : sum
    }, 0)
    return total + groupSum
  }, 0)

  const handleAutopilotFlowToggle = (flowId: string, enabled: boolean) => {
    console.log("Autopilot flow toggled:", flowId, enabled)
  }

  const handleAutopilotFlowClick = (flowId: string) => {
    console.log("Autopilot flow clicked:", flowId)
  }

  const handleFilterChange = (filters: FilterState) => {
    console.log("Filters changed:", filters)
    // TODO: Apply filters to transaction data
  }

  const handleNewChat = () => {
    setActiveSidebarLink("ai-assistant")
    setActiveChatId(null)
    setNewChatSignal((prev) => prev + 1)
  }

  const handleChatLinkClick = (chatId: string) => {
    setActiveSidebarLink("ai-assistant")
    setActiveChatId(chatId)
  }

  const handleConversationSynced = (conversationId: string | null) => {
    if (conversationId) {
      setActiveChatId(conversationId)
    }
    void loadChatHistory()
  }

  return (
    <MainLayout
      user={DEFAULT_USER}
      sidebarLinks={mockSidebarLinks}
      chatLinks={chatLinks}
      activeChatId={activeChatId}
      activeSidebarLink={activeSidebarLink}
      onSidebarLinkClick={handleSidebarLinkClick}
      onAddTransaction={handleAddTransaction}
      onUserMenuClick={handleUserMenuClick}
      onNewChat={handleNewChat}
      onChatLinkClick={handleChatLinkClick}
    >
      {activeSidebarLink === "ai-assistant" ? (
        <AIAssistantPage
          activeConversationId={activeChatId}
          resetSignal={newChatSignal}
          onConversationSynced={handleConversationSynced}
        />
      ) : activeSidebarLink === "dashboard" ? (
        <Dashboard />
      ) : activeSidebarLink === "cash-flow" ? (
        <CashflowPage />
      ) : (
        <TransactionsPage
          transactionGroups={transactionGroups}
          autopilotFlowGroups={autopilotFlowGroups}
          autopilotTotalSavings={dynamicTotalSavings} // <-- DYNAMIC TOTAL ADDED HERE
          isLoading={isLoadingTransactions}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onCategoryChange={setSelectedCategory}
          onSearchChange={setSearchQuery}
          onUpdateTransaction={handleUpdateTransaction}
          onDeleteTransaction={handleDeleteTransaction}
          onNewAutopilotFlowClick={() => setIsAddAutopilotOpen(true)}
          onAutopilotFlowToggle={handleAutopilotToggle}
          onAutopilotFlowClick={(id) =>
            console.log("Autopilot flow clicked:", id)
          }
          onFilterChange={(filters) => console.log("Filters changed:", filters)}
          onAutopilotRefresh={() => setRefreshTrigger((prev) => prev + 1)}
        />
      )}

      {isAddTransactionOpen && (
        <AddTransactionModal
          onClose={() => setIsAddTransactionOpen(false)}
          onSave={async (data) => {
            try {
              const token = getAuthToken()
              if (!token) return alert("No auth token found in localStorage!")

              const response = await fetch(
                "http://localhost:5000/api/transactions",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(data),
                }
              )

              if (response.ok) {
                setIsAddTransactionOpen(false)
                setRefreshTrigger((prev) => prev + 1)
              } else {
                const errorData = await response.json()
                alert(`Failed to save transaction: ${errorData.message}`)
              }
            } catch (error) {
              console.error("Network error saving transaction:", error)
            }
          }}
        />
      )}

      {isAddAutopilotOpen && (
        <AddNewAutopilotDrawer
          onClose={() => setIsAddAutopilotOpen(false)}
          onSave={async (payload) => {
            try {
              const token = getAuthToken()
              if (!token) return alert("No auth token found in localStorage!")

              const response = await fetch(
                "http://localhost:5000/api/transactions/autopilot",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(payload),
                }
              )

              if (response.ok) {
                setIsAddAutopilotOpen(false)
                setRefreshTrigger((prev) => prev + 1)
              } else {
                const errorData = await response.json()
                alert(`Failed to save Autopilot Flow: ${errorData.message}`)
              }
            } catch (error) {
              console.error("Network error saving Autopilot Flow:", error)
            }
          }}
        />
      )}
    </MainLayout>
  )
}
