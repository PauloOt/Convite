import * as XLSX from 'xlsx'

export function exportToXlsx(entries) {
  const toRows = (list) =>
    list.map((e) => {
      // suporte ao formato antigo (guestNames string) e novo (companionDetails array)
      const companions = e.companionDetails
        ? e.companionDetails.map((c) => `${c.name}${c.age ? ` (${c.age} anos)` : ''}`).join(', ')
        : (e.guestNames || '')

      return {
        Nome: e.name,
        Idade: e.age ?? '',
        Status: e.confirmed ? 'Confirmado' : 'Recusou',
        'Nr. Acompanhantes': e.guests ?? 0,
        Acompanhantes: companions,
        'Data/Hora': new Date(e.createdAt).toLocaleString('pt-BR'),
      }
    })

  const wb = XLSX.utils.book_new()

  const confirmed = entries.filter((e) => e.confirmed)
  const declined  = entries.filter((e) => !e.confirmed)

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(confirmed.length ? toRows(confirmed) : [{ Info: 'Nenhuma confirmação ainda' }]),
    'Confirmados'
  )
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(declined.length ? toRows(declined) : [{ Info: 'Nenhuma recusa ainda' }]),
    'Recusados'
  )

  XLSX.writeFile(wb, 'confirmacoes-bruna-rodrigo.xlsx')
}
