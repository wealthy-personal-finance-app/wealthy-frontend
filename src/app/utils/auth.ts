export const POSSIBLE_TOKEN_KEYS = [
  "token",
  "accessToken",
  "authToken",
  "jwt",
  "wealthyToken",
  "wealthy_token",
]

export function getAuthToken(): string | null {
  for (const key of POSSIBLE_TOKEN_KEYS) {
    const token = localStorage.getItem(key)
    if (token) return token
  }
  return null
}

export function persistAuthToken(token: string): void {
  localStorage.setItem("token", token)
  localStorage.setItem("accessToken", token)
  localStorage.setItem("wealthyToken", token)
  localStorage.setItem("wealthy_token", token)
}
