import React, {useMemo, useState} from "react"
import {
  Search,
  MessageCircle,
  Bug,
  LifeBuoy,
  Shield,
  CreditCard,
  Wallet,
  BarChart3,
  Bot,
  ChevronDown,
} from "lucide-react"

const HELP_CATEGORIES = [
  {
    id: "account",
    title: "Account & Security",
    description: "Sign-in, password reset, profile, and privacy settings.",
    icon: Shield,
  },
  {
    id: "transactions",
    title: "Transactions",
    description: "Add, edit, categories, and autopilot transaction flows.",
    icon: Wallet,
  },
  {
    id: "dashboard",
    title: "Dashboard & Charts",
    description: "Balance trends, cash flow, and allocation widgets.",
    icon: BarChart3,
  },
  {
    id: "billing",
    title: "Billing & Plans",
    description: "Subscriptions, payment methods, invoices, and upgrades.",
    icon: CreditCard,
  },
  {
    id: "ai",
    title: "AI Assistant",
    description: "Prompts, history sync, and response troubleshooting.",
    icon: Bot,
  },
]

const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "Why am I being redirected to the sign-in page?",
    answer:
      "This happens when no valid auth token is available in storage. Please sign in again, and if it keeps happening, clear browser cache for this site and retry.",
  },
  {
    id: "faq-2",
    question: "How is Total Balance Over Time calculated?",
    answer:
      "The chart uses your transaction history and applies cumulative balance changes over time. Income/assets increase balance and expenses/liabilities decrease balance.",
  },
  {
    id: "faq-3",
    question: "How do I fix an autopilot flow that is not logging?",
    answer:
      "Check that the flow is active, next occurrence is due, and category/type are valid. You can also use Log/Skip actions in Pending Autopilot Tasks to force a cycle.",
  },
  {
    id: "faq-4",
    question: "Can I change a transaction category after saving?",
    answer:
      "Yes. Open the transaction row, edit it, and update parent/subcategory. The dashboard and allocation widgets will refresh after save.",
  },
  {
    id: "faq-5",
    question: "How can I contact support quickly?",
    answer:
      "Use the Contact Support action in this Help Center and include what you were doing, expected behavior, and screenshots if available.",
  },
]

export function HelpCenterPage() {
  const [query, setQuery] = useState("")
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQ_ITEMS[0].id)

  const normalizedQuery = query.trim().toLowerCase()

  const filteredFaq = useMemo(() => {
    if (!normalizedQuery) return FAQ_ITEMS
    return FAQ_ITEMS.filter(
      (item) =>
        item.question.toLowerCase().includes(normalizedQuery) ||
        item.answer.toLowerCase().includes(normalizedQuery)
    )
  }, [normalizedQuery])

  const filteredCategories = useMemo(() => {
    if (!normalizedQuery) return HELP_CATEGORIES
    return HELP_CATEGORIES.filter(
      (item) =>
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery)
    )
  }, [normalizedQuery])

  return (
    <div className="w-full flex justify-center pb-[100px] animate-in fade-in duration-300 font-['Inter_Tight',sans-serif]">
      <div className="w-full max-w-[1280px] px-[32px] pt-[32px] flex flex-col gap-[24px]">
        <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[16px] p-[24px] flex flex-col gap-[18px]">
          <div className="flex items-center justify-between gap-[12px] flex-wrap">
            <div className="flex flex-col gap-[6px]">
              <h1 className="text-[24px] text-white font-medium font-['Inter_Tight',sans-serif]">
                Help Center
              </h1>
              <p className="text-[13px] text-[#717784] font-['Inter_Tight',sans-serif]">
                Find answers quickly or reach support when you need help.
              </p>
            </div>
            <div className="flex gap-[10px] flex-wrap">
              <button className="px-[12px] py-[8px] bg-[#101214] border border-[#2e2f33] rounded-[8px] text-[12px] text-[#99a0ae] hover:text-white transition-colors flex items-center gap-[6px] font-['Inter_Tight',sans-serif]">
                <MessageCircle size={14} />
                Contact Support
              </button>
              <button className="px-[12px] py-[8px] bg-[#101214] border border-[#2e2f33] rounded-[8px] text-[12px] text-[#99a0ae] hover:text-white transition-colors flex items-center gap-[6px] font-['Inter_Tight',sans-serif]">
                <Bug size={14} />
                Report a Bug
              </button>
            </div>
          </div>

          <div className="bg-[#101214] border border-[#2e2f33] rounded-[10px] px-[12px] h-[44px] flex items-center gap-[8px]">
            <Search size={16} className="text-[#717784]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search help articles, billing, charts, autopilot..."
              className="bg-transparent w-full outline-none text-[13px] text-white placeholder:text-[#525866] font-['Inter_Tight',sans-serif]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[16px]">
          {filteredCategories.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className="bg-[#191b1f] border border-[#2e2f33] rounded-[14px] p-[18px] flex flex-col gap-[10px]"
              >
                <div className="size-[32px] rounded-[8px] bg-[#101214] border border-[#2e2f33] flex items-center justify-center">
                  <Icon size={16} className="text-[#40c4aa]" />
                </div>
                <h3 className="text-[15px] text-white font-medium font-['Inter_Tight',sans-serif]">
                  {item.title}
                </h3>
                <p className="text-[12px] text-[#717784] leading-[18px] font-['Inter_Tight',sans-serif]">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>

        <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[16px] p-[24px] flex flex-col gap-[14px]">
          <div className="flex items-center gap-[8px]">
            <LifeBuoy size={16} className="text-[#99a0ae]" />
            <h2 className="text-[16px] text-white font-medium font-['Inter_Tight',sans-serif]">
              Frequently Asked Questions
            </h2>
          </div>

          {filteredFaq.length === 0 ? (
            <div className="h-[110px] flex items-center justify-center text-[13px] text-[#717784] font-['Inter_Tight',sans-serif]">
              No help articles found for your search.
            </div>
          ) : (
            filteredFaq.map((item) => {
              const isOpen = openFaqId === item.id
              return (
                <div
                  key={item.id}
                  className="bg-[#101214] border border-[#2e2f33] rounded-[10px] overflow-hidden"
                >
                  <button
                    className="w-full px-[14px] py-[12px] text-left flex items-center justify-between gap-[12px]"
                    onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                  >
                    <span className="text-[13px] text-white font-medium font-['Inter_Tight',sans-serif]">
                      {item.question}
                    </span>
                    <ChevronDown
                      size={15}
                      className={`text-[#717784] transition-transform ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-[14px] pb-[12px] text-[12px] text-[#99a0ae] leading-[18px] font-['Inter_Tight',sans-serif]">
                      {item.answer}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
