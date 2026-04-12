export const ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    google: "/api/auth/google",
    profile: "/api/auth/profile",
    logout: "/api/auth/logout",
  },
  ai: {
    chat: "/api/ai/chat",
    history: "/api/ai/history",
    suggestions: "/api/ai/suggestions",
  },
  transactions: {
    base: "/api/transactions",
    categories: "/api/transactions/categories",
    autopilot: "/api/transactions/autopilot",
    autopilotById: (id: string) => `/api/transactions/autopilot/${id}`,
    autopilotToggle: (id: string) => `/api/transactions/autopilot/${id}/toggle`,
    transactionById: (id: string) => `/api/transactions/${id}`,
    dashboardSummary: "/api/transactions/dashboard/summary",
    dashboardSpending: "/api/transactions/dashboard/spending",
    dashboardChart: "/api/transactions/dashboard/chart",
    analyticsSankey: "/transactions/analytics/sankey",
  },
  payments: {
    subscription: "/api/payments/subscription",
    subscribe: "/api/payments/subscribe",
    checkout: "/api/payments/checkout",
    checkoutSession: "/api/payments/checkout-session",
  },
}
