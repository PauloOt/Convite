// ▼ URL do Apps Script
export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyyflF1RobdkuZjSh7Duby5KmjE0k2lOJEBOqgHnmeXMOyA8qaivY2teBvliykFfwCS/exec'

// ▼ URL da planilha Google Sheets (abrir no botão "Ver Planilha" do admin)
export const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1XbGqZAusqMxPQEzF5-BioF9wN3icNPCQMzuavgbUZoA/edit?gid=784267051#gid=784267051'

/**
 * Envia uma resposta de RSVP para o Google Sheets.
 * Usa mode:'no-cors' porque o Apps Script não aceita preflight OPTIONS.
 * A resposta é opaca (não podemos ler), mas os dados chegam na planilha.
 */
export async function submitRSVP(entry) {
  if (!APPS_SCRIPT_URL) return
  await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode:   'no-cors',
    body:   JSON.stringify(entry),
  })
}

/**
 * Busca todas as respostas do Google Sheets.
 * Requer o PIN do painel admin como parâmetro.
 */
export async function fetchRSVPs(pin) {
  if (!APPS_SCRIPT_URL) throw new Error('URL do Apps Script não configurada.')
  const res = await fetch(`${APPS_SCRIPT_URL}?pin=${encodeURIComponent(pin)}`)
  if (!res.ok) throw new Error(`Erro de rede: ${res.status}`)
  const data = await res.json()
  if (data && data.error) throw new Error(data.error)
  return Array.isArray(data) ? data : []
}
