import { useEffect, useState } from 'react'
import { fetchCollection } from '../lib/api.js'

export function useCollection(resource) {
  const [result, setResult] = useState({ items: [], status: 'loading', error: '' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fetchCollection(resource, controller.signal)
      .then((items) => setResult({ items, status: 'success', error: '' }))
      .catch((error) => {
        if (error.name !== 'AbortError') setResult({ items: [], status: 'error', error: error.message })
      })
    return () => controller.abort()
  }, [resource, attempt])

  return { ...result, retry: () => setAttempt((value) => value + 1) }
}