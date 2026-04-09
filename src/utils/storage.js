const STORAGE_KEY = 'rsvp_bruna_rodrigo'

export function getEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

export function saveEntry(entry) {
  const entries = getEntries()
  entries.push(entry)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}
