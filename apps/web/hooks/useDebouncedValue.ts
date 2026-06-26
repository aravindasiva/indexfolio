import { useEffect, useState } from 'react'

// Returns value after it has stopped changing for delayMs. Used to debounce the
// search query so typing does not fire a request per keystroke.
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(id)
  }, [value, delayMs])

  return debounced
}
