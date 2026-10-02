const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api`
  : 'http://localhost:8000/api'

export function resourceUrl(resource) {
  return `${API_BASE_URL}/${resource}/`
}

function normalizeCollection(payload) {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return []
  if (Array.isArray(payload.results)) return payload.results
  if (Array.isArray(payload.items)) return payload.items
  if (Array.isArray(payload.data)) return payload.data
  if (payload.data && Array.isArray(payload.data.results)) return payload.data.results
  return []
}

export async function fetchCollection(resource, signal) {
  const response = await fetch(resourceUrl(resource), {
    headers: { Accept: 'application/json' },
    signal
  })
  if (!response.ok) throw new Error(`Request failed (${response.status})`)
  return normalizeCollection(await response.json())
}