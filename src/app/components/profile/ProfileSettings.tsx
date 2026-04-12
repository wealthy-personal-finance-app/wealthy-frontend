import React, {useCallback, useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import {Button} from "../ui/button"
import {toast} from "sonner"
import {getAuthToken} from "../../utils/auth"
import {apiFetch, apiFetchJson, apiUrl} from "../../apis/client"
import {ENDPOINTS} from "../../apis/endpoints"

const FONT = {fontFamily: "Inter Tight, sans-serif"}

const PROFILE_ENDPOINT = apiUrl(ENDPOINTS.auth.profile)
const LOGOUT_ENDPOINT = apiUrl(ENDPOINTS.auth.logout)
const PROFILE_UPDATED_EVENT = "wealthy:profile-updated"
const POSSIBLE_SESSION_KEYS = [
  "token",
  "accessToken",
  "authToken",
  "jwt",
  "wealthyToken",
  "wealthy_token",
  "user",
  "userProfile",
  "userData",
  "subscription",
  "plan",
]

function splitName(name: string): {firstName: string; lastName: string} {
  const normalized = name.trim()
  if (!normalized) return {firstName: "", lastName: ""}
  const [first, ...rest] = normalized.split(/\s+/)
  return {
    firstName: first ?? "",
    lastName: rest.join(" "),
  }
}

function parseProfile(payload: unknown): {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
} {
  if (!payload || typeof payload !== "object") return {}

  const root = payload as Record<string, unknown>
  const source =
    (root.user && typeof root.user === "object" ? root.user : null) ||
    (root.data && typeof root.data === "object" ? root.data : null) ||
    root

  const data = source as Record<string, unknown>

  const rawFirstName =
    typeof data.firstName === "string" ? data.firstName.trim() : ""
  const rawLastName =
    typeof data.lastName === "string" ? data.lastName.trim() : ""
  const fullName =
    (typeof data.name === "string" && data.name.trim()) ||
    (typeof data.fullName === "string" && data.fullName.trim()) ||
    ""

  const split = splitName(fullName)

  return {
    firstName: rawFirstName || split.firstName,
    lastName: rawLastName || split.lastName,
    email:
      (typeof data.email === "string" && data.email.trim()) ||
      (typeof data.mail === "string" && data.mail.trim()) ||
      undefined,
    phone:
      (typeof data.phone === "string" && data.phone.trim()) ||
      (typeof data.phoneNumber === "string" && data.phoneNumber.trim()) ||
      (typeof data.mobile === "string" && data.mobile.trim()) ||
      undefined,
  }
}

function extractErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null
  const data = payload as Record<string, unknown>
  const message =
    (typeof data.message === "string" && data.message) ||
    (typeof data.error === "string" && data.error) ||
    ""
  return message.trim() || null
}

export function ProfileSettings() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: "Alexander",
    lastName: "Jhoe",
    email: "alexanderjhoe@mail.com",
    phone: "",
  })
  const [initialForm, setInitialForm] = useState(form)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({...prev, [field]: value}))
  }

  const loadProfile = useCallback(async () => {
    setIsLoading(true)
    const token = getAuthToken()
    if (!token) {
      setIsLoading(false)
      toast.error("Please sign in to view your profile")
      return
    }

    try {
      const {response, data: payload} = await apiFetchJson<unknown>(
        PROFILE_ENDPOINT,
        {
          method: "GET",
          auth: true,
        }
      )

      if (!response.ok) {
        throw new Error(
          extractErrorMessage(payload) ||
            `Failed to load profile (${response.status})`
        )
      }

      const parsed = parseProfile(payload)
      const nextForm = {
        firstName: parsed.firstName || "",
        lastName: parsed.lastName || "",
        email: parsed.email || form.email,
        phone: parsed.phone || "",
      }

      setForm(nextForm)
      setInitialForm(nextForm)
    } catch (error) {
      console.error("Failed to load profile:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to load profile"
      )
    } finally {
      setIsLoading(false)
    }
  }, [form.email])

  useEffect(() => {
    void loadProfile()
  }, [loadProfile])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = getAuthToken()
    if (!token) {
      toast.error("Please sign in to update your profile")
      return
    }

    setIsSaving(true)

    const trimmedFirst = form.firstName.trim()
    const trimmedLast = form.lastName.trim()
    const displayName = `${trimmedFirst} ${trimmedLast}`.trim()
    const payload = {
      firstName: trimmedFirst,
      lastName: trimmedLast,
      name: displayName,
      fullName: displayName,
      phone: form.phone.trim(),
      phoneNumber: form.phone.trim(),
      mobile: form.phone.trim(),
    }

    const methods: Array<"PATCH" | "PUT"> = ["PATCH", "PUT"]
    let lastError = "Failed to update profile"

    for (const method of methods) {
      try {
        const {response, data: responsePayload} = await apiFetchJson<unknown>(
          PROFILE_ENDPOINT,
          {
            method,
            auth: true,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        )

        if (!response.ok) {
          lastError =
            extractErrorMessage(responsePayload) ||
            `Failed to update profile (${response.status})`
          continue
        }

        const parsed = parseProfile(responsePayload)
        const nextForm = {
          firstName: parsed.firstName || trimmedFirst,
          lastName: parsed.lastName || trimmedLast,
          email: parsed.email || form.email,
          phone: parsed.phone || form.phone,
        }

        setForm(nextForm)
        setInitialForm(nextForm)
        const nextDisplayName =
          `${nextForm.firstName} ${nextForm.lastName}`.trim() || "User"
        window.dispatchEvent(
          new CustomEvent(PROFILE_UPDATED_EVENT, {
            detail: {
              name: nextDisplayName,
              email: nextForm.email,
            },
          })
        )
        toast.success("Profile settings updated successfully")
        setIsSaving(false)
        return
      } catch {
        lastError = "Network error while updating profile"
      }
    }

    toast.error(lastError)
    setIsSaving(false)
  }

  const handleLogout = async () => {
    const token = getAuthToken()
    setIsLoggingOut(true)

    if (token) {
      try {
        await apiFetch(LOGOUT_ENDPOINT, {
          method: "POST",
          auth: true,
        })
      } catch {
        // Ignore network/logout endpoint errors; local session clear still signs user out.
      }
    }

    for (const key of POSSIBLE_SESSION_KEYS) {
      localStorage.removeItem(key)
      sessionStorage.removeItem(key)
    }

    window.dispatchEvent(
      new CustomEvent(PROFILE_UPDATED_EVENT, {
        detail: {
          name: "",
          email: "",
        },
      })
    )

    toast.success("Logged out successfully")
    navigate("/sign-in")
    setIsLoggingOut(false)
  }

  return (
    <div
      className="flex-1 flex flex-col h-full bg-[#141414] overflow-y-auto"
      style={FONT}
    >
      <div className="flex flex-1 justify-center py-8">
        <div className="flex w-full max-w-[800px] flex-col gap-8 px-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-white text-[24px] font-medium">
              Profile Settings
            </h2>
            <p className="text-[#717784] text-[14px]">
              Manage your personal information and profile visibility.
            </p>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-6">
            <div className="bg-[#191B1F] border border-[#2E2F33] rounded-[12px] p-6 flex flex-col gap-6">
              <h3 className="text-white text-[16px] font-medium border-b border-[#2E2F33] pb-4 -mx-6 px-6">
                Personal Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[#717784] text-[12px] font-medium">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    disabled={isLoading || isSaving}
                    className="bg-[#141414] border border-[#2E2F33] rounded-[8px] px-4 h-[42px] text-white text-[13px] outline-none focus:border-[#065f46] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#717784] text-[12px] font-medium">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    disabled={isLoading || isSaving}
                    className="bg-[#141414] border border-[#2E2F33] rounded-[8px] px-4 h-[42px] text-white text-[13px] outline-none focus:border-[#065f46] transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[#717784] text-[12px] font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  disabled
                  className="bg-[#141414]/50 border border-[#2E2F33] rounded-[8px] px-4 h-[42px] text-[#525866] text-[13px] cursor-not-allowed"
                />
                <p className="text-[#525866] text-[11px]">
                  Email cannot be changed. Contact support for assistance.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[#717784] text-[12px] font-medium">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  disabled={isLoading || isSaving}
                  className="bg-[#141414] border border-[#2E2F33] rounded-[8px] px-4 h-[42px] text-white text-[13px] outline-none focus:border-[#065f46] transition-colors"
                  placeholder="+1 (xxx) xxx-xxxx"
                />
              </div>
            </div>

            <div className="flex justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading || isSaving || isLoggingOut}
                onClick={handleLogout}
                className="bg-red-500 border-[#3a2a2a]  text-white  hover:bg-[#F24F33] h-[40px] px-6 text-[13px] font-medium rounded-[8px]"
              >
                <b>{isLoggingOut ? "Logging out..." : "Logout"}</b>
              </Button>

              <div className="flex gap-3">
                <Button
                  type="button"
                  disabled={isLoading || isSaving || isLoggingOut}
                  onClick={() => setForm(initialForm)}
                  variant="ghost"
                  className="text-[#99A0AE] hover:text-white hover:bg-white/5 h-[40px] px-6 text-[13px] font-medium rounded-[8px]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || isSaving || isLoggingOut}
                  className="bg-[#065f46] hover:bg-[#047857] text-white h-[40px] px-10 text-[13px] font-semibold rounded-[8px]"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
