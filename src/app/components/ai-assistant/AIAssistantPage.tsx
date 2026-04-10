import {useState, useRef, useEffect, useCallback} from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  Sparkles,
  ArrowUpRight,
  User,
  BarChart,
  Zap,
  MoreHorizontal,
} from "lucide-react"
import svgPaths from "../../../imports/TransactionsHistory/svg-pq2oaob5wk"

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  text: string
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000"
const AI_CHAT_ENDPOINT = `${API_BASE_URL}/api/ai/chat`
const AI_HISTORY_ENDPOINT = `${API_BASE_URL}/api/ai/history`
const AI_SUGGESTIONS_ENDPOINT = `${API_BASE_URL}/api/ai/suggestions`

const FALLBACK_SUGGESTIONS = [
  "Compare food expenses to last month",
  "Am I on track for my savings goal?",
  "Show my biggest liability",
]

const POSSIBLE_TOKEN_KEYS = [
  "token",
  "accessToken",
  "authToken",
  "jwt",
  "wealthyToken",
]

function getAuthToken(): string | null {
  for (const key of POSSIBLE_TOKEN_KEYS) {
    const token = localStorage.getItem(key)
    if (token) return token
  }
  return null
}

function extractAssistantMessage(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    return "I could not read a response from the AI service."
  }

  const candidateFields = [
    "answer",
    "response",
    "reply",
    "text",
    "content",
    "output",
    "message",
  ]

  for (const field of candidateFields) {
    const value = (payload as Record<string, unknown>)[field]
    if (typeof value === "string" && value.trim().length > 0) {
      return value
    }
  }

  const data = (payload as Record<string, unknown>).data
  if (data && typeof data === "object") {
    for (const field of candidateFields) {
      const value = (data as Record<string, unknown>)[field]
      if (typeof value === "string" && value.trim().length > 0) {
        return value
      }
    }
  }

  return "I received a response, but it did not include readable text."
}

function normalizeMarkdown(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function extractConversationId(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null

  const root = payload as Record<string, unknown>
  const direct = root.conversationId ?? root.id ?? root._id
  if (typeof direct === "string" && direct.trim().length > 0) {
    return direct
  }

  const data = root.data
  if (data && typeof data === "object") {
    const nested = (data as Record<string, unknown>).conversationId
    if (typeof nested === "string" && nested.trim().length > 0) {
      return nested
    }
  }

  return null
}

function parseHistoryMessages(payload: unknown): ChatMessage[] {
  if (!payload || typeof payload !== "object") return []

  const root = payload as Record<string, unknown>
  const containers = [root.messages, root.history, root.conversation, root.data]

  for (const container of containers) {
    if (!container || typeof container !== "object") continue

    const listCandidates = [
      (container as Record<string, unknown>).messages,
      (container as Record<string, unknown>).items,
      container,
    ]

    const list = listCandidates.find((candidate) => Array.isArray(candidate))
    if (!Array.isArray(list)) continue

    return list
      .map((entry, index) => {
        if (!entry || typeof entry !== "object") return null
        const item = entry as Record<string, unknown>
        const roleRaw =
          (typeof item.role === "string" && item.role) ||
          (typeof item.sender === "string" && item.sender) ||
          (typeof item.type === "string" && item.type) ||
          "assistant"

        const normalizedRole = roleRaw.toLowerCase().includes("user")
          ? "user"
          : "assistant"

        const textRaw =
          (typeof item.content === "string" && item.content) ||
          (typeof item.text === "string" && item.text) ||
          (typeof item.message === "string" && item.message) ||
          (typeof item.answer === "string" && item.answer) ||
          ""

        const text = normalizeMarkdown(textRaw)
        if (!text) return null

        const id =
          (typeof item._id === "string" && item._id) ||
          (typeof item.id === "string" && item.id) ||
          `${normalizedRole}-${index}`

        return {
          id,
          role: normalizedRole,
          text,
        } as ChatMessage
      })
      .filter((message): message is ChatMessage => Boolean(message))
  }

  return []
}

function parseSuggestionTexts(payload: unknown): string[] {
  if (!payload || typeof payload !== "object") return []

  const root = payload as Record<string, unknown>
  const rawCollections: unknown[] = [
    root.suggestions,
    root.questions,
    root.prompts,
    root.data,
  ]

  const values: string[] = []

  for (const collection of rawCollections) {
    if (!collection) continue

    if (Array.isArray(collection)) {
      for (const entry of collection) {
        if (typeof entry === "string" && entry.trim()) {
          values.push(entry.trim())
          continue
        }

        if (entry && typeof entry === "object") {
          const item = entry as Record<string, unknown>
          const candidate =
            (typeof item.text === "string" && item.text) ||
            (typeof item.question === "string" && item.question) ||
            (typeof item.prompt === "string" && item.prompt) ||
            (typeof item.message === "string" && item.message) ||
            ""

          if (candidate.trim()) {
            values.push(candidate.trim())
          }
        }
      }
    }

    if (collection && typeof collection === "object") {
      const nested = collection as Record<string, unknown>
      const nestedArrays = [
        nested.suggestions,
        nested.questions,
        nested.prompts,
      ]

      for (const nestedCollection of nestedArrays) {
        if (!Array.isArray(nestedCollection)) continue
        for (const entry of nestedCollection) {
          if (typeof entry === "string" && entry.trim()) {
            values.push(entry.trim())
          }
        }
      }
    }
  }

  return [...new Set(values)].slice(0, 3)
}

interface AIAssistantPageProps {
  activeConversationId?: string | null
  resetSignal?: number
  onConversationSynced?: (conversationId: string | null) => void
}

export function AIAssistantPage({
  activeConversationId,
  resetSignal,
  onConversationSynced,
}: AIAssistantPageProps) {
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [suggestions, setSuggestions] = useState<string[]>(FALLBACK_SUGGESTIONS)
  const [isSending, setIsSending] = useState(false)
  const [isLoadingConversation, setIsLoadingConversation] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const requestIdRef = useRef(0)
  const loadRequestIdRef = useRef(0)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const loadSuggestions = useCallback(async () => {
    const token = getAuthToken()
    if (!token) {
      setSuggestions(FALLBACK_SUGGESTIONS)
      return
    }

    setIsLoadingSuggestions(true)

    try {
      const response = await fetch(AI_SUGGESTIONS_ENDPOINT, {
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
        throw new Error(`Failed to load suggestions (${response.status})`)
      }

      const parsed = parseSuggestionTexts(payload)
      if (parsed.length === 0) {
        setSuggestions(FALLBACK_SUGGESTIONS)
        return
      }

      if (parsed.length < 3) {
        const missing = FALLBACK_SUGGESTIONS.filter(
          (fallback) => !parsed.includes(fallback)
        )
        setSuggestions([...parsed, ...missing].slice(0, 3))
        return
      }

      setSuggestions(parsed)
    } catch {
      setSuggestions(FALLBACK_SUGGESTIONS)
    } finally {
      setIsLoadingSuggestions(false)
    }
  }, [])

  useEffect(() => {
    setMessages([])
    setErrorMessage(null)
  }, [resetSignal])

  useEffect(() => {
    void loadSuggestions()
  }, [loadSuggestions, activeConversationId, resetSignal])

  useEffect(() => {
    if (!activeConversationId) return

    const requestId = ++loadRequestIdRef.current
    const loadConversation = async () => {
      const token = getAuthToken()
      if (!token) {
        setErrorMessage("No auth token found. Please sign in first.")
        return
      }

      setIsLoadingConversation(true)
      setErrorMessage(null)

      try {
        const response = await fetch(
          `${AI_HISTORY_ENDPOINT}/${activeConversationId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        let payload: unknown = null
        try {
          payload = await response.json()
        } catch {
          payload = null
        }

        if (!response.ok) {
          const backendMessage =
            payload && typeof payload === "object" && "message" in payload
              ? String((payload as Record<string, unknown>).message)
              : `Failed to load chat (${response.status})`
          throw new Error(backendMessage)
        }

        const parsedMessages = parseHistoryMessages(payload)
        if (loadRequestIdRef.current === requestId) {
          setMessages(parsedMessages)
        }
      } catch (error) {
        const fallback = "Failed to load chat history."
        const message = error instanceof Error ? error.message : fallback
        if (loadRequestIdRef.current === requestId) {
          setErrorMessage(message)
        }
      } finally {
        if (loadRequestIdRef.current === requestId) {
          setIsLoadingConversation(false)
        }
      }
    }

    void loadConversation()
  }, [activeConversationId])

  const handleSend = async (text: string = inputValue) => {
    const trimmed = text.trim()
    if (!trimmed || isSending) return

    const currentRequestId = ++requestIdRef.current
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setErrorMessage(null)
    setIsSending(true)

    try {
      const token = getAuthToken()

      if (!token) {
        throw new Error("No auth token found. Please sign in first.")
      }

      const response = await fetch(AI_CHAT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: trimmed,
          ...(activeConversationId
            ? {conversationId: activeConversationId}
            : {}),
        }),
      })

      let payload: unknown = null
      try {
        payload = await response.json()
      } catch {
        payload = null
      }

      if (!response.ok) {
        const backendMessage =
          payload && typeof payload === "object" && "message" in payload
            ? String((payload as Record<string, unknown>).message)
            : `Request failed with status ${response.status}`
        throw new Error(backendMessage)
      }

      if (
        payload &&
        typeof payload === "object" &&
        "success" in payload &&
        (payload as Record<string, unknown>).success === false
      ) {
        const backendMessage =
          "message" in payload
            ? String((payload as Record<string, unknown>).message)
            : "AI service returned an unsuccessful response."
        throw new Error(backendMessage)
      }

      const assistantText = extractAssistantMessage(payload)
      const resolvedConversationId =
        extractConversationId(payload) ?? activeConversationId ?? null
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: normalizeMarkdown(assistantText),
      }

      if (requestIdRef.current === currentRequestId) {
        setMessages((prev) => [...prev, assistantMessage])
      }

      onConversationSynced?.(resolvedConversationId)
      void loadSuggestions()
    } catch (error) {
      const fallback = "Failed to reach AI service."
      const message = error instanceof Error ? error.message : fallback

      if (requestIdRef.current === currentRequestId) {
        setErrorMessage(message)
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-error-${Date.now()}`,
            role: "assistant",
            text: `I hit an error: ${message}`,
          },
        ])
      }
    } finally {
      if (requestIdRef.current === currentRequestId) {
        setIsSending(false)
      }
      inputRef.current?.focus()
    }
  }

  const handlePromptClick = (text: string) => {
    setInputValue(text)
    inputRef.current?.focus()
  }

  const showWelcomeBanner =
    !activeConversationId && messages.length === 0 && !isLoadingConversation

  const renderComposer = (isPinned: boolean, showSuggestions: boolean) => (
    <div
      className={`w-full max-w-[800px] mx-auto bg-[rgba(25,27,31,0.7)] border border-[#2e2f33] rounded-[16px] p-[16px] flex flex-col gap-4 ${
        isPinned ? "shrink-0 mb-4" : "mt-10"
      }`}
    >
      <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[16px] flex flex-col items-center shadow-[0_0_0_4px_#2e2f33] w-full min-w-0">
        <div className="flex items-center w-full p-4 gap-4">
          <Sparkles className="w-5 h-5 text-[#717784] shrink-0" />
          <div className="w-[1px] h-[12px] bg-[#2e2f33]"></div>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isSending) {
                void handleSend()
              }
            }}
            placeholder="Ask a question or make a request..."
            className="flex-1 bg-transparent border-none outline-none text-[#e1e4ea] placeholder:text-[#717784] font-['Inter_Tight',sans-serif] text-[16px]"
            autoFocus
            disabled={isSending}
          />
          <div className="flex items-center gap-2 shrink-0 h-[40px]">
            <button
              onClick={() => {
                void handleSend()
              }}
              disabled={isSending}
              className="flex items-center justify-center w-[40px] h-[40px] bg-[rgba(65,63,63,0.5)] border border-[#2e2f33] rounded-[8px] hover:bg-[rgba(65,63,63,0.8)] text-[#e1e4ea] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <p className="text-[#fca5a5] text-[13px] font-['Inter_Tight',sans-serif] px-1">
          {errorMessage}
        </p>
      )}

      {showSuggestions && (
        <>
          {/* Pills */}
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-2 w-full min-w-0">
            {suggestions.slice(0, 3).map((suggestion, index) => {
              const Icon = index === 0 ? User : index === 1 ? BarChart : Zap

              return (
                <button
                  key={`${suggestion}-${index}`}
                  onClick={() => handlePromptClick(suggestion)}
                  className="flex items-center gap-[4px] min-w-0 w-full px-[12px] py-[8px] border border-[#2e2f33] rounded-[8px] bg-transparent hover:bg-[rgba(65,63,63,0.3)] transition-colors text-[#e1e4ea]"
                >
                  <Icon className="w-[20px] h-[20px] text-[#e1e4ea] shrink-0" />
                  <span className="font-['Inter_Tight',sans-serif] font-medium text-[14px] truncate">
                    {suggestion}
                  </span>
                </button>
              )
            })}

            <button
              onClick={() => {
                void loadSuggestions()
              }}
              disabled={isLoadingSuggestions}
              className="flex items-center justify-center p-[8px] border border-[#2e2f33] rounded-[8px] bg-transparent hover:bg-[rgba(65,63,63,0.3)] transition-colors text-[#e1e4ea] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MoreHorizontal className="w-[20px] h-[20px] text-[#e1e4ea]" />
            </button>
          </div>
        </>
      )}
    </div>
  )

  return (
    <div className="flex flex-col h-full bg-[#141414] relative">
      <div className="flex-1 min-h-0 w-full flex flex-col">
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div
            className={`w-full max-w-[832px] mx-auto px-6 pt-8 pb-5 min-h-full ${
              showWelcomeBanner
                ? "flex flex-col items-center justify-center"
                : ""
            }`}
          >
            {showWelcomeBanner && (
              <div className="h-full flex flex-col items-center justify-center gap-1 w-full text-center">
                <div className="flex items-center gap-[4px] justify-center mb-1">
                  <div className="w-[32px] h-[32px] bg-[#064e3b] rounded-[9.6px] flex items-center justify-center relative overflow-hidden text-white">
                    {/* Wealthy Logo SVG */}
                    <svg
                      className="w-[19.2px] h-[19.2px] absolute"
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 24 24"
                    >
                      <g>
                        <g filter="url(#filter0_ai)">
                          <path d={svgPaths.p23f4d000} fill="currentColor" />
                        </g>
                        <g filter="url(#filter1_ai)">
                          <path d={svgPaths.p22496d80} fill="currentColor" />
                        </g>
                        <path d={svgPaths.p11000980} fill="currentColor" />
                      </g>
                      <defs>
                        <filter
                          colorInterpolationFilters="sRGB"
                          filterUnits="userSpaceOnUse"
                          height="13.6658"
                          id="filter0_ai"
                          width="11.1695"
                          x="14.0305"
                          y="10.3342"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            mode="normal"
                            result="shape"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            result="hardAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          />
                          <feOffset dx="2" />
                          <feGaussianBlur stdDeviation="0.6" />
                          <feComposite
                            in2="hardAlpha"
                            k2="-1"
                            k3="1"
                            operator="arithmetic"
                          />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0.0235294 0 0 0 0 0.305882 0 0 0 0 0.231373 0 0 0 0.07 0"
                          />
                          <feBlend
                            in2="shape"
                            mode="normal"
                            result="effect1_innerShadow"
                          />
                        </filter>
                        <filter
                          colorInterpolationFilters="sRGB"
                          filterUnits="userSpaceOnUse"
                          height="13.6462"
                          id="filter1_ai"
                          width="11.5439"
                          x="-1.2"
                          y="0"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            mode="normal"
                            result="shape"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            result="hardAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          />
                          <feOffset dx="-2" />
                          <feGaussianBlur stdDeviation="0.6" />
                          <feComposite
                            in2="hardAlpha"
                            k2="-1"
                            k3="1"
                            operator="arithmetic"
                          />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0.0235294 0 0 0 0 0.305882 0 0 0 0 0.231373 0 0 0 0.07 0"
                          />
                          <feBlend
                            in2="shape"
                            mode="normal"
                            result="effect1_innerShadow"
                          />
                        </filter>
                      </defs>
                    </svg>
                  </div>
                  <h2 className="text-[24px] font-medium text-[#e1e4ea] font-['Inter_Tight',sans-serif] leading-[30px]">
                    Hi, Alexander
                  </h2>
                </div>
                <h1 className="text-[40px] font-medium leading-[50px] font-['Inter_Tight',sans-serif] bg-clip-text text-transparent bg-gradient-to-r from-[#005b55] from-[38%] to-[#28fcae]">
                  Ask anything about your money.
                </h1>

                {renderComposer(false, true)}
              </div>
            )}

            {!showWelcomeBanner && (
              <div className="w-full max-w-[800px] mx-auto">
                {messages.length > 0 && (
                  <div className="w-full pr-2">
                    <div className="flex flex-col gap-3">
                      {messages.map((message) =>
                        message.role === "assistant" ? (
                          <div
                            key={message.id}
                            className="self-start max-w-[90%] text-[#e1e4ea]"
                          >
                            <div className="flex items-center gap-[6px] mb-2">
                              <div className="w-[18px] h-[18px] bg-[#064e3b] rounded-[5px] flex items-center justify-center text-white">
                                <svg
                                  className="w-[11px] h-[11px]"
                                  fill="none"
                                  preserveAspectRatio="none"
                                  viewBox="0 0 24 24"
                                >
                                  <g>
                                    <path
                                      d={svgPaths.p23f4d000}
                                      fill="currentColor"
                                    />
                                    <path
                                      d={svgPaths.p22496d80}
                                      fill="currentColor"
                                    />
                                    <path
                                      d={svgPaths.p11000980}
                                      fill="currentColor"
                                    />
                                  </g>
                                </svg>
                              </div>
                              <p className="text-[14px] leading-[20px] font-semibold text-[#e5e7eb] font-['Inter_Tight',sans-serif]">
                                Wealthy
                              </p>
                            </div>

                            <div className="text-[14px] leading-[20px] font-['Inter_Tight',sans-serif]">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  h1: ({children}) => (
                                    <h1 className="text-[14px] leading-[20px] font-semibold text-[#f3f4f6] mb-2 font-['Inter_Tight',sans-serif]">
                                      {children}
                                    </h1>
                                  ),
                                  h2: ({children}) => (
                                    <h2 className="text-[14px] leading-[20px] font-semibold text-[#f3f4f6] mb-2 font-['Inter_Tight',sans-serif]">
                                      {children}
                                    </h2>
                                  ),
                                  h3: ({children}) => (
                                    <h3 className="text-[14px] leading-[20px] font-semibold text-[#f3f4f6] mb-2 font-['Inter_Tight',sans-serif]">
                                      {children}
                                    </h3>
                                  ),
                                  p: ({children}) => (
                                    <p className="text-[14px] text-[#e5e7eb] leading-[20px] mb-2 last:mb-0 font-['Inter_Tight',sans-serif]">
                                      {children}
                                    </p>
                                  ),
                                  ul: ({children}) => (
                                    <ul className="list-disc pl-5 my-2 space-y-1 text-[14px] text-[#e5e7eb] font-['Inter_Tight',sans-serif]">
                                      {children}
                                    </ul>
                                  ),
                                  ol: ({children}) => (
                                    <ol className="list-decimal pl-5 my-2 space-y-1 text-[14px] text-[#e5e7eb] font-['Inter_Tight',sans-serif]">
                                      {children}
                                    </ol>
                                  ),
                                  li: ({children}) => (
                                    <li className="text-[14px] leading-[20px] font-['Inter_Tight',sans-serif]">
                                      {children}
                                    </li>
                                  ),
                                  strong: ({children}) => (
                                    <strong className="font-semibold text-[#f9fafb] font-['Inter_Tight',sans-serif]">
                                      {children}
                                    </strong>
                                  ),
                                  code: ({children}) => (
                                    <code className="bg-[#111318] border border-[#2e2f33] rounded px-1.5 py-0.5 text-[#bbf7d0] text-[14px] font-['Inter_Tight',sans-serif]">
                                      {children}
                                    </code>
                                  ),
                                }}
                              >
                                {message.text}
                              </ReactMarkdown>
                            </div>
                          </div>
                        ) : (
                          <div
                            key={message.id}
                            className="self-end rounded-[12px] px-4 py-3 text-[14px] leading-[20px] font-['Inter_Tight',sans-serif] bg-[#1b1d22] border border-[#2e2f33] text-[#e5e7eb] max-w-[80%]"
                          >
                            {message.text}
                          </div>
                        )
                      )}

                      {isSending && (
                        <div className="self-start bg-[#1b1d22] border border-[#2e2f33] text-[#99a0ae] rounded-[12px] px-4 py-3 text-[14px] leading-[20px] font-['Inter_Tight',sans-serif]">
                          Thinking...
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {isLoadingConversation && messages.length === 0 && (
                  <div className="w-full">
                    <div className="self-start bg-[#1b1d22] border border-[#2e2f33] text-[#99a0ae] rounded-[12px] px-4 py-3 text-[14px] leading-[20px] font-['Inter_Tight']">
                      Loading conversation...
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {!showWelcomeBanner && (
          <div className="w-full max-w-[832px] mx-auto px-6">
            {renderComposer(true, false)}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="w-full h-[72px] flex items-center justify-center shrink-0">
        <p className="text-[#717784] font-['Inter_Tight',sans-serif] text-[14px]">
          Wealthy can make mistakes. Check important info.
        </p>
      </div>
    </div>
  )
}
