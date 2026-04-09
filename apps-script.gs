// ─────────────────────────────────────────────────────────────────
//  Google Apps Script — RSVP Bruna & Rodrigo
//
//  COMO USAR:
//  1. Abra sua planilha no Google Sheets
//  2. Extensions → Apps Script
//  3. Apague o código padrão e cole este arquivo inteiro
//  4. Salve (Ctrl+S)
//  5. Clique em "Deploy" → "New deployment"
//     - Type: Web app
//     - Execute as: Me
//     - Who has access: Anyone
//  6. Autorize quando pedir permissão
//  7. Copie a URL gerada e cole em src/utils/api.js
// ─────────────────────────────────────────────────────────────────

const SHEET_NAME = 'RSVPs'
const ADMIN_PIN  = '2027'

// ── Recebe uma confirmação (POST) ────────────────────────────────
function doPost(e) {
  try {
    const data  = JSON.parse(e.postData.contents)
    const sheet = getOrCreateSheet()

    const companions = (data.companionDetails || [])
      .filter(c => c.name)
      .map(c => `${c.name}${c.age ? ` (${c.age})` : ''}`)
      .join(', ')

    sheet.appendRow([
      data.id,
      data.name,
      data.age    || '',
      data.confirmed ? 'Confirmado' : 'Recusou',
      data.guests || 0,
      companions,
      new Date(data.createdAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
    ])

    return json({ ok: true })
  } catch (err) {
    return json({ ok: false, error: err.toString() })
  }
}

// ── Retorna todas as respostas (GET) — requer PIN ─────────────────
function doGet(e) {
  if ((e.parameter.pin || '') !== ADMIN_PIN) {
    return json({ error: 'PIN inválido' })
  }

  try {
    const sheet  = getOrCreateSheet()
    const values = sheet.getDataRange().getValues()

    // Pula a linha de cabeçalho
    const entries = values.slice(1).map(r => ({
      id:        r[0],
      name:      r[1],
      age:       r[2] || null,
      confirmed: r[3] === 'Confirmado',
      guests:    r[4] || 0,
      companionDetails: r[5]
        ? String(r[5]).split(', ').filter(Boolean).map(c => {
            const m = c.match(/^(.+?)(?:\s*\((\d+)\))?$/)
            return m ? { name: m[1].trim(), age: m[2] ? parseInt(m[2]) : null } : { name: c, age: null }
          })
        : [],
      createdAt: r[6]
    }))

    return json(entries)
  } catch (err) {
    return json([])
  }
}

// ── Helpers ───────────────────────────────────────────────────────
function getOrCreateSheet() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet()
  let   sheet = ss.getSheetByName(SHEET_NAME)

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
  }

  // Cria cabeçalho se a aba estiver vazia
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['ID', 'Nome', 'Idade', 'Status', 'Acompanhantes', 'Detalhes Acomp.', 'Data/Hora'])
    sheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#1C1C1A').setFontColor('#F6F1E7')
    sheet.setFrozenRows(1)
  }

  return sheet
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
}
