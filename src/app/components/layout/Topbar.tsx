import {useEffect, useState, useCallback} from "react"
import svgPaths from "../../../imports/TransactionsHistory/svg-pq2oaob5wk"
import imgAvatar from "../../../imports/TransactionsHistory/3bf6d91fffb576176d4a0070882aa4c6d17189e7.png"
import {Plus} from "lucide-react"
import {getAuthToken, POSSIBLE_TOKEN_KEYS} from "../../utils/auth"
import {apiFetch, apiFetchJson, apiUrl} from "../../apis/client"
import {ENDPOINTS} from "../../apis/endpoints"

export interface User {
  name: string
  email: string
  badge?: string
  avatarUrl?: string
}

interface TopbarProps {
  user: User
  onAddTransaction?: () => void
  onUserMenuClick?: () => void
}

const AUTH_PROFILE_ENDPOINT = apiUrl(ENDPOINTS.auth.profile)
const PAYMENT_PLAN_ENDPOINT = apiUrl(ENDPOINTS.payments.subscription)
const PROFILE_UPDATED_EVENT = "wealthy:profile-updated"

function parseUserProfile(payload: unknown): {name?: string; email?: string} {
  if (!payload || typeof payload !== "object") return {}

  const root = payload as Record<string, unknown>
  const nestedData =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : null
  const nestedUser =
    nestedData?.user && typeof nestedData.user === "object"
      ? (nestedData.user as Record<string, unknown>)
      : null

  const data =
    (root.user && typeof root.user === "object"
      ? (root.user as Record<string, unknown>)
      : null) ||
    nestedUser ||
    nestedData ||
    root

  const firstName =
    (typeof data.firstName === "string" && data.firstName.trim()) ||
    (typeof data.given_name === "string" && data.given_name.trim()) ||
    ""
  const lastName =
    (typeof data.lastName === "string" && data.lastName.trim()) ||
    (typeof data.family_name === "string" && data.family_name.trim()) ||
    ""
  const fallbackFullName = `${firstName} ${lastName}`.trim()

  const nameCandidate =
    (typeof data.name === "string" && data.name) ||
    (typeof data.fullName === "string" && data.fullName) ||
    (typeof data.username === "string" && data.username) ||
    fallbackFullName ||
    ""

  const emailCandidate =
    (typeof data.email === "string" && data.email) ||
    (typeof data.mail === "string" && data.mail) ||
    ""

  return {
    name: nameCandidate.trim() || undefined,
    email: emailCandidate.trim() || undefined,
  }
}

function extractPlanName(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null

  const root = payload as Record<string, unknown>
  const candidates: unknown[] = [
    root.plan,
    root.tier,
    root.badge,
    root.subscription,
    root.data,
  ]

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate.trim()
    }

    if (!candidate || typeof candidate !== "object") continue

    const item = candidate as Record<string, unknown>
    const nested =
      (typeof item.plan === "string" && item.plan) ||
      (typeof item.tier === "string" && item.tier) ||
      (typeof item.name === "string" && item.name) ||
      (typeof item.status === "string" && item.status) ||
      ""

    if (nested.trim().length > 0) {
      return nested.trim()
    }
  }

  return null
}

async function fetchPaymentPlan(
  token: string
): Promise<string | null | undefined> {
  try {
    const {data: payload} = await apiFetchJson<unknown>(PAYMENT_PLAN_ENDPOINT, {
      method: "GET",
      auth: true,
    })

    const plan = extractPlanName(payload)
    if (plan) return plan
  } catch {
    // Try next endpoint candidate.
  }
}

function ChevronLeftIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute inset-[32%_41%]">
        <div className="absolute inset-[-10.42%_-20.83%]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 5.1 8.7"
          >
            <path
              d={svgPaths.p19f1a00}
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

function PlusIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute inset-[8.33%]">
        <div className="absolute inset-[-4.55%]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 18 18"
          >
            <path
              d={svgPaths.p253fc100}
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

function ChevronDownIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]">
      <div className="absolute inset-[41%_32%]">
        <div className="absolute inset-[-20.83%_-10.42%]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 6.96 4.08"
          >
            <path
              d="M0.6 0.6L3.48 3.48L6.36 0.6"
              stroke="#525866"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.2"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export function Topbar({user, onAddTransaction, onUserMenuClick}: TopbarProps) {
  const [displayedUser, setDisplayedUser] = useState<User>(user)

  useEffect(() => {
    setDisplayedUser(user)
  }, [user])

  const loadTopbarUser = useCallback(async () => {
    const token = getAuthToken()
    if (!token) {
      setDisplayedUser(user)
      return
    }

    const [profileResult, planResult] = await Promise.allSettled([
      apiFetch(AUTH_PROFILE_ENDPOINT, {
        method: "GET",
        auth: true,
      }),
      fetchPaymentPlan(token),
    ])

    let profilePayload: unknown = null
    if (profileResult.status === "fulfilled" && profileResult.value.ok) {
      try {
        profilePayload = await profileResult.value.json()
      } catch {
        profilePayload = null
      }
    }

    const parsedProfile = parseUserProfile(profilePayload)
    const parsedPlan =
      planResult.status === "fulfilled" ? planResult.value : null

    setDisplayedUser((prev) => ({
      ...prev,
      name: parsedProfile.name ?? prev.name,
      email: parsedProfile.email ?? prev.email,
      badge: parsedPlan ?? prev.badge,
    }))
  }, [user])

  useEffect(() => {
    void loadTopbarUser()
  }, [loadTopbarUser])

  useEffect(() => {
    const handleFocusRefresh = () => {
      void loadTopbarUser()
    }

    const handleVisibilityRefresh = () => {
      if (document.visibilityState === "visible") {
        void loadTopbarUser()
      }
    }

    const handleStorageRefresh = (event: StorageEvent) => {
      if (!event.key || POSSIBLE_TOKEN_KEYS.includes(event.key)) {
        void loadTopbarUser()
      }
    }

    window.addEventListener("focus", handleFocusRefresh)
    document.addEventListener("visibilitychange", handleVisibilityRefresh)
    window.addEventListener("storage", handleStorageRefresh)

    return () => {
      window.removeEventListener("focus", handleFocusRefresh)
      document.removeEventListener("visibilitychange", handleVisibilityRefresh)
      window.removeEventListener("storage", handleStorageRefresh)
    }
  }, [loadTopbarUser])

  useEffect(() => {
    const handleProfileUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{name?: string; email?: string}>
      const detail = customEvent.detail

      if (detail && (detail.name || detail.email)) {
        setDisplayedUser((prev) => ({
          ...prev,
          name: detail.name ?? prev.name,
          email: detail.email ?? prev.email,
        }))
      }

      void loadTopbarUser()
    }

    window.addEventListener(
      PROFILE_UPDATED_EVENT,
      handleProfileUpdated as EventListener
    )
    return () => {
      window.removeEventListener(
        PROFILE_UPDATED_EVENT,
        handleProfileUpdated as EventListener
      )
    }
  }, [loadTopbarUser])

  return (
    <div className="bg-[#191b1f] border-b border-[#2e2f33] w-full">
      <div className="flex items-center justify-between px-[24px] py-[16px]">
        {/* Add Transaction Button */}
        <button
          onClick={onAddTransaction}
          className="bg-[#065f46] hover:bg-[#047857] transition-colors rounded-[8px] flex items-center gap-[4px] px-[12px] py-[8px]"
        >
          <Plus color="white" />
          <span
            className="text-white"
            style={{
              fontFamily: "Inter Tight, sans-serif",
              fontSize: "16px",
              lineHeight: "24px",
              fontWeight: 500,
            }}
          >
            Add Transaction
          </span>
        </button>

        {/* User Profile */}
        <button
          onClick={onUserMenuClick}
          className="bg-[#1f2220] hover:bg-[#2a2d2b] transition-colors rounded-[8px] border border-[#2e2f33] shadow-[0px_2px_8px_-4px_rgba(10,13,20,0.2)] flex items-center gap-[8px] px-[6px] py-[6px] h-[40px]"
        >
          {/* Avatar */}
          <div className="relative shrink-0 size-[24px] rounded-full overflow-hidden">
            <img
              src={displayedUser.avatarUrl || imgAvatar}
              alt={displayedUser.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* User Info */}
          <div className="flex flex-col gap-[2px] items-start">
            <div className="flex items-center gap-[4px]">
              <p
                className="text-white"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "11px",
                  lineHeight: "normal",
                  fontWeight: 500,
                }}
              >
                {displayedUser.name}
              </p>
              {displayedUser.badge && (
                <div className="bg-[#047857] rounded-[999px] px-[5px] py-[2px] h-[12px] flex items-center justify-center">
                  <p
                    className="text-white uppercase"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "8px",
                      letterSpacing: "0.16px",
                      fontWeight: 500,
                    }}
                  >
                    {displayedUser.badge}
                  </p>
                </div>
              )}
            </div>
            <p
              className="text-[#717784]"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "10px",
                lineHeight: "normal",
              }}
            >
              {displayedUser.email}
            </p>
          </div>

          {/* Chevron */}
          <ChevronDownIcon />
        </button>
      </div>
    </div>
  )
}
