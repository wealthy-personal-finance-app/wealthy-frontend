import {useState, useEffect, useCallback} from "react"
import {MainLayout} from "./components/layout/MainLayout"
import {TransactionsPage} from "./components/transactions/TransactionsPage"
import {AIAssistantPage} from "./components/ai-assistant/AIAssistantPage"
import {AutopilotFlowGroup} from "./components/transactions/AutopilotBaseView"
import {AddTransactionModal} from "./components/transactions/AddTransactionModal"
import {AddNewAutopilotDrawer} from "./components/transactions/AddNewAutopilotDrawer"
import {Dashboard} from "./components/dashboard/Dashboard"
import {ChatLink} from "./components/layout/Sidebar"
import {CashflowPage} from "./components/cashflow/CashflowPage"
import {ProfileSettings} from "./components/profile/ProfileSettings"
import {HelpCenterPage} from "./components/settings/HelpCenterPage"
import {AppSettings} from "./components/settings/AppSettings"
import {useLocation, useNavigate} from "react-router-dom"
import {getAuthToken, persistAuthToken} from "./utils/auth"
import {apiFetch, apiFetchJson} from "./apis/client"
import {ENDPOINTS} from "./apis/endpoints"
import {
  clearOAuthParamsFromUrl,
  extractStringValue,
  getPathFromSidebarLink,
  getSidebarLinkFromPath,
  groupAutopilotFlows,
  groupTransactionsByDate,
  parseChatLinks,
} from "./utils/appHelpers"

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

const PROFILE_UPDATED_EVENT = "wealthy:profile-updated"

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeSidebarLink, setActiveSidebarLink] = useState(() =>
    getSidebarLinkFromPath(window.location.pathname)
  )
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)
  const [isAddAutopilotOpen, setIsAddAutopilotOpen] = useState(false)

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

  useEffect(() => {
    setActiveSidebarLink(getSidebarLinkFromPath(location.pathname))
  }, [location.pathname])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const hashText = location.hash.startsWith("#")
      ? location.hash.slice(1)
      : location.hash
    const hashParams = new URLSearchParams(hashText)

    const hasTokenInUrl = Boolean(
      extractStringValue(params, [
        "token",
        "accessToken",
        "authToken",
        "jwt",
      ]) ||
        extractStringValue(hashParams, [
          "token",
          "access_token",
          "accessToken",
          "authToken",
          "jwt",
        ])
    )

    if (hasTokenInUrl) return
    if (getAuthToken()) return

    navigate("/sign-in", {replace: true})
  }, [location.search, location.hash, navigate])

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const hashText = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash
    const hashParams = new URLSearchParams(hashText)

    const token =
      extractStringValue(searchParams, [
        "token",
        "accessToken",
        "authToken",
        "jwt",
      ]) ||
      extractStringValue(hashParams, [
        "token",
        "access_token",
        "accessToken",
        "authToken",
        "jwt",
      ])

    if (!token) return

    persistAuthToken(token)

    const fullName =
      extractStringValue(searchParams, ["name", "fullName"]) ||
      extractStringValue(hashParams, ["name", "fullName"])
    const firstName =
      extractStringValue(searchParams, ["firstName"]) ||
      extractStringValue(hashParams, ["firstName"]) ||
      ""
    const lastName =
      extractStringValue(searchParams, ["lastName"]) ||
      extractStringValue(hashParams, ["lastName"]) ||
      ""
    const email =
      extractStringValue(searchParams, ["email"]) ||
      extractStringValue(hashParams, ["email"])

    const name = fullName || `${firstName} ${lastName}`.trim()

    window.dispatchEvent(
      new CustomEvent(PROFILE_UPDATED_EVENT, {
        detail: {name, email},
      })
    )

    clearOAuthParamsFromUrl()
    setActiveSidebarLink("dashboard")
    navigate("/dashboard", {replace: true})
  }, [navigate])

  const loadChatHistory = useCallback(async () => {
    if (!getAuthToken()) {
      setChatLinks([])
      return
    }

    try {
      const {response, data: payload} = await apiFetchJson<unknown>(
        ENDPOINTS.ai.history,
        {
          method: "GET",
          auth: true,
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to load chat history (${response.status})`)
      }

      setChatLinks(parseChatLinks(payload))
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
    navigate(getPathFromSidebarLink(linkId))
  }

  const handleUserMenuClick = () => {
    setActiveSidebarLink("profile")
    navigate("/profile")
  }

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoadingTransactions(true)
      try {
        if (!getAuthToken()) {
          navigate("/sign-in", {replace: true})
          setIsLoadingTransactions(false)
          return
        }

        const txResult = await apiFetchJson<any>(ENDPOINTS.transactions.base, {
          method: "GET",
          auth: true,
          headers: {"Content-Type": "application/json"},
        })

        if (txResult.response.ok) {
          setRawTransactions(txResult.data?.data || [])
        }

        const autoResult = await apiFetchJson<any>(
          ENDPOINTS.transactions.autopilot,
          {
            method: "GET",
            auth: true,
            headers: {"Content-Type": "application/json"},
          }
        )

        if (autoResult.response.ok) {
          setAutopilotFlowGroups(
            groupAutopilotFlows(autoResult.data?.data || [])
          )
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoadingTransactions(false)
      }
    }

    void fetchAllData()
  }, [refreshTrigger, navigate])

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

  const handleAutopilotToggle = async (id: string) => {
    try {
      if (!getAuthToken()) return
      const res = await apiFetch(ENDPOINTS.transactions.autopilotToggle(id), {
        method: "PATCH",
        auth: true,
      })
      if (res.ok) setRefreshTrigger((prev) => prev + 1)
    } catch (error) {
      console.error("Failed to toggle autopilot flow:", error)
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    try {
      if (!getAuthToken()) return
      const res = await apiFetch(ENDPOINTS.transactions.transactionById(id), {
        method: "DELETE",
        auth: true,
      })

      if (res.ok) {
        setRefreshTrigger((prev) => prev + 1)
      } else {
        alert("Failed to delete transaction.")
      }
    } catch (error) {
      console.error("Error deleting transaction:", error)
    }
  }

  const handleUpdateTransaction = async (id: string, updatedData: any) => {
    try {
      if (!getAuthToken()) return

      const payload = {
        amount: Number(updatedData.amount),
        type: String(updatedData.type).toLowerCase(),
        note: updatedData.name,
        parentCategory: updatedData.parentCategory || "Uncategorized",
        subCategory: updatedData.subCategory || updatedData.category,
        date: updatedData.date,
      }

      const {response, data: errorData} = await apiFetchJson<any>(
        ENDPOINTS.transactions.transactionById(id),
        {
          method: "PATCH",
          auth: true,
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(payload),
        }
      )

      if (response.ok) {
        setRefreshTrigger((prev) => prev + 1)
      } else {
        alert(`Failed to update: ${errorData?.message || "Validation Error"}`)
      }
    } catch (error) {
      console.error("Error updating transaction:", error)
    }
  }

  const dynamicTotalSavings = autopilotFlowGroups.reduce((total, group) => {
    const groupSum = group.flows.reduce(
      (sum, flow) => (flow.enabled ? sum + flow.amount : sum),
      0
    )
    return total + groupSum
  }, 0)

  const handleNewChat = () => {
    setActiveSidebarLink("ai-assistant")
    navigate("/ai-assistant")
    setActiveChatId(null)
    setNewChatSignal((prev) => prev + 1)
  }

  const handleChatLinkClick = (chatId: string) => {
    setActiveSidebarLink("ai-assistant")
    navigate("/ai-assistant")
    setActiveChatId(chatId)
  }

  const handleConversationSynced = (conversationId: string | null) => {
    if (conversationId) setActiveChatId(conversationId)
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
      onAddTransaction={() => setIsAddTransactionOpen(true)}
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
      ) : activeSidebarLink === "profile" ? (
        <ProfileSettings />
      ) : activeSidebarLink === "settings" ? (
        <AppSettings />
      ) : activeSidebarLink === "help" ? (
        <HelpCenterPage />
      ) : (
        <TransactionsPage
          transactionGroups={transactionGroups}
          autopilotFlowGroups={autopilotFlowGroups}
          autopilotTotalSavings={dynamicTotalSavings}
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
              if (!getAuthToken())
                return alert("No auth token found in localStorage!")

              const {response, data: errorData} = await apiFetchJson<any>(
                ENDPOINTS.transactions.base,
                {
                  method: "POST",
                  auth: true,
                  headers: {"Content-Type": "application/json"},
                  body: JSON.stringify(data),
                }
              )

              if (response.ok) {
                setIsAddTransactionOpen(false)
                setRefreshTrigger((prev) => prev + 1)
              } else {
                alert(`Failed to save transaction: ${errorData?.message}`)
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
              if (!getAuthToken())
                return alert("No auth token found in localStorage!")

              const {response, data: errorData} = await apiFetchJson<any>(
                ENDPOINTS.transactions.autopilot,
                {
                  method: "POST",
                  auth: true,
                  headers: {"Content-Type": "application/json"},
                  body: JSON.stringify(payload),
                }
              )

              if (response.ok) {
                setIsAddAutopilotOpen(false)
                setRefreshTrigger((prev) => prev + 1)
              } else {
                alert(`Failed to save Autopilot Flow: ${errorData?.message}`)
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
