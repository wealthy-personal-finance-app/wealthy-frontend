import {getAuthToken} from "../utils/auth"

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000"

export function apiUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}

type ApiFetchOptions = RequestInit & {
  auth?: boolean
  token?: string | null
}

export async function apiFetch(
  path: string,
  options: ApiFetchOptions = {}
): Promise<Response> {
  const {auth = false, token: explicitToken, headers, ...rest} = options
  const token = explicitToken ?? (auth ? getAuthToken() : null)

  if (auth && !token) {
    throw new Error("No auth token found")
  }

  return fetch(apiUrl(path), {
    ...rest,
    headers: {
      ...(headers || {}),
      ...(token ? {Authorization: `Bearer ${token}`} : {}),
    },
  })
}

export async function apiFetchJson<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<{response: Response; data: T | null}> {
  const response = await apiFetch(path, options)
  let data: T | null = null
  try {
    data = (await response.json()) as T
  } catch {
    data = null
  }
  return {response, data}
}

export {API_BASE_URL}
