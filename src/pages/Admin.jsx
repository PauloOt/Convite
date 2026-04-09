import { useState, useEffect, useCallback } from 'react'
import PampasDecor from '../components/PampasDecor'
import { fetchRSVPs, SHEET_URL } from '../utils/api'

const ADMIN_PIN   = '2027'
const SESSION_KEY = 'admin_unlocked'

/* ── PIN Gate ──────────────────────────────────────────── */
function PinGate({ onUnlock }) {
  const [pin, setPin]     = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  function tryUnlock() {
    if (pin === ADMIN_PIN) {
      onUnlock()
    } else {
      setError(true)
      setShake(true)
      setPin('')
      setTimeout(() => setShake(false), 400)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: '#F6F1E7' }}>
      <PampasDecor />
      <div className="relative z-10 w-full max-w-[300px] flex flex-col items-center text-center fade-up">

        <div className="mb-8 sm:mb-10">
          <p className="font-script text-dark mb-1" style={{ fontSize: 'clamp(34px,9vw,44px)', lineHeight: 1 }}>
            Bruna &amp; Rodrigo
          </p>
          <p className="text-[8px] sm:text-[9px] tracking-[5px] sm:tracking-[6px] uppercase font-normal text-sand2">
            Painel Administrativo
          </p>
        </div>

        <label className="block text-[9px] sm:text-[10px] tracking-[2.5px] sm:tracking-[3px] uppercase font-light mb-4" style={{ color: '#5A5650' }}>
          PIN de acesso
        </label>

        <div style={{ transition: shake ? 'none' : 'transform 0.1s', transform: shake ? 'translateX(6px)' : 'none' }}>
          <input
            type="password"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setError(false) }}
            onKeyDown={(e) => e.key === 'Enter' && tryUnlock()}
            maxLength={6}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            placeholder="· · · ·"
            className="font-sans text-[24px] sm:text-[28px] tracking-[12px] sm:tracking-[14px] text-center w-40 bg-transparent outline-none text-dark"
            style={{
              borderBottom: error ? '1.5px solid #b05050' : '1.5px solid #1C1C1A',
              transition: 'border-color 0.2s',
              minHeight: '48px',
            }}
          />
        </div>

        {error && (
          <p className="text-[9px] tracking-[2px] uppercase mt-3 fade-in" style={{ color: '#b05050' }}>
            PIN incorreto
          </p>
        )}

        <button
          onClick={tryUnlock}
          className="btn-primary mt-7"
          style={{ maxWidth: '200px' }}
        >
          Entrar
        </button>
      </div>
    </div>
  )
}

/* ── Entry Card ─────────────────────────────────────────── */
function EntryCard({ entry }) {
  const dateStr = new Date(entry.createdAt).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  const guestLabel =
    !entry.guests || entry.guests === 0
      ? 'Sozinho(a)'
      : `+${entry.guests} acomp.`

  const companions = entry.companionDetails && entry.companionDetails.length > 0
    ? entry.companionDetails
    : entry.guestNames
      ? [{ name: entry.guestNames, age: null }]
      : []

  const borderColor = entry.confirmed ? '#6a9e7a' : '#c08080'

  return (
    <div
      className="mb-2 px-3 sm:px-4 py-3.5 sm:py-4 transition-colors"
      style={{ borderLeft: `2.5px solid ${borderColor}`, background: '#faf7f2' }}
      onMouseEnter={e => { e.currentTarget.style.background = '#f0ece3' }}
      onMouseLeave={e => { e.currentTarget.style.background = '#faf7f2' }}
    >
      {/* Nome + idade */}
      <div className="flex items-baseline gap-2 mb-1 flex-wrap">
        <span className="font-cormorant text-[20px] sm:text-[22px] italic font-light text-dark leading-tight">
          {entry.name}
        </span>
        {entry.age && (
          <span className="font-cormorant text-[13px] sm:text-[14px] font-light" style={{ color: '#5A5248' }}>
            {entry.age} anos
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 flex-wrap text-[8px] sm:text-[9px] tracking-[1.5px] uppercase font-light" style={{ color: '#4A4844' }}>
        <span>{guestLabel}</span>
        <span style={{ opacity: 0.4 }}>·</span>
        {entry.telefone && <><span>{entry.telefone}</span><span style={{ opacity: 0.4 }}>·</span></>}
        <span>{dateStr}</span>
      </div>

      {/* Acompanhantes */}
      {companions.length > 0 && (
        <div className="mt-2 flex flex-col gap-0.5 pl-2" style={{ borderLeft: '1px solid #ddd8d0' }}>
          {companions.map((c, i) => (
            <div key={i} className="text-[12px] sm:text-[13px] font-cormorant italic font-light" style={{ color: '#7a7870' }}>
              {c.name || '—'}
              {c.age ? (
                <span className="not-italic font-sans text-[8px] sm:text-[9px] ml-1.5 tracking-[1px]" style={{ color: '#5A5248' }}>
                  {c.age} anos
                </span>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Admin Panel ────────────────────────────────────────── */
export default function Admin() {
  const [unlocked, setUnlocked] = useState(false)
  const [entries, setEntries]   = useState([])
  const [loading, setLoading]   = useState(false)
  const [fetchErr, setFetchErr] = useState('')

  const loadEntries = useCallback(async () => {
    setLoading(true)
    setFetchErr('')
    try {
      const data = await fetchRSVPs(ADMIN_PIN)
      setEntries(data.sort((a, b) => Number(b.id) - Number(a.id)))
    } catch (err) {
      setFetchErr(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') {
      setUnlocked(true)
      loadEntries()
    }
  }, [loadEntries])

  function handleUnlock() {
    sessionStorage.setItem(SESSION_KEY, '1')
    setUnlocked(true)
    loadEntries()
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY)
    setUnlocked(false)
    setEntries([])
    setFetchErr('')
  }

  if (!unlocked) return <PinGate onUnlock={handleUnlock} />

  const confirmed   = entries.filter((e) => e.confirmed)
  const declined    = entries.filter((e) => !e.confirmed)
  const totalPeople = confirmed.reduce((acc, e) => acc + 1 + (e.guests || 0), 0)

  return (
    <div className="min-h-screen" style={{ background: '#F6F1E7' }}>
      <PampasDecor />

      <div className="relative z-10 w-full max-w-[600px] mx-auto px-4 sm:px-6 pt-10 sm:pt-12 pb-20 sm:pb-24">

        {/* Cabeçalho */}
        <div className="text-center mb-6 sm:mb-8 fade-up">
          <p className="font-script text-dark mb-1" style={{ fontSize: 'clamp(30px,8vw,38px)', lineHeight: 1.1 }}>
            Bruna &amp; Rodrigo
          </p>
          <p className="text-[8px] sm:text-[9px] tracking-[5px] sm:tracking-[6px] uppercase font-normal text-sand2">
            16 · 01 · 2027
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-10 fade-in">
            <p className="font-cormorant italic text-[18px] font-light" style={{ color: '#7A7468' }}>
              Carregando respostas…
            </p>
          </div>
        )}

        {/* Erro de fetch */}
        {!loading && fetchErr && (
          <div className="text-center py-8 fade-in">
            <p className="text-[10px] tracking-[2px] mb-3" style={{ color: '#a05050' }}>
              {fetchErr}
            </p>
            <button onClick={loadEntries} className="btn-primary" style={{ maxWidth: '180px', margin: '0 auto' }}>
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !fetchErr && (<>

        {/* Counter */}
        <div className="w-full text-center py-7 sm:py-8 mb-3 sm:mb-4 fade-up delay-100" style={{ background: '#1C1C1A' }}>
          <span className="font-cormorant italic font-light leading-none block" style={{ fontSize: 'clamp(56px,14vw,72px)', color: '#F6F1E7' }}>
            {totalPeople}
          </span>
          <span className="text-[8px] sm:text-[9px] tracking-[4px] sm:tracking-[5px] uppercase font-light block mt-1" style={{ color: '#F6F1E7', opacity: 0.5 }}>
            pessoas confirmadas
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-5 sm:mb-6 fade-up delay-200">
          <div className="text-center py-4 sm:py-5" style={{ background: '#f0f5f1', border: '1px solid #c0d4c4' }}>
            <span className="font-cormorant italic font-light leading-none block" style={{ fontSize: 'clamp(36px,10vw,44px)', color: '#4a7c59' }}>
              {confirmed.length}
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-[2.5px] sm:tracking-[3px] uppercase font-light text-dark block mt-1">
              Confirmados
            </span>
          </div>
          <div className="text-center py-4 sm:py-5" style={{ background: '#f5f0f0', border: '1px solid #d4c0c0' }}>
            <span className="font-cormorant italic font-light leading-none block" style={{ fontSize: 'clamp(36px,10vw,44px)', color: '#a05050' }}>
              {declined.length}
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-[2.5px] sm:tracking-[3px] uppercase font-light text-dark block mt-1">
              Recusados
            </span>
          </div>
        </div>

        {/* Ver Planilha */}
        <div className="mb-8 sm:mb-10 fade-up delay-300">
          <a
            href={SHEET_URL || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 font-sans font-normal text-[9px] sm:text-[10px] tracking-[3px] sm:tracking-[4px] uppercase flex items-center justify-center gap-2.5 transition-all no-underline"
            style={{ border: '1px solid #7A5C32', color: '#7A5C32', background: 'transparent', minHeight: '52px', display: 'flex', opacity: SHEET_URL ? 1 : 0.4, pointerEvents: SHEET_URL ? 'auto' : 'none' }}
            onMouseEnter={e => { if (SHEET_URL) { e.currentTarget.style.background = '#7A5C32'; e.currentTarget.style.color = '#F6F1E7' } }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#7A5C32' }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1 1h11M1 5h11M1 9h11M4 1v11M9 1v11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            Ver Planilha
          </a>
        </div>

        {/* Separador */}
        {entries.length > 0 && (
          <div className="w-full h-px mb-7 sm:mb-8" style={{ background: 'linear-gradient(to right, transparent, #c8b99a, transparent)' }} />
        )}

        {/* Confirmados */}
        {confirmed.length > 0 && (
          <div className="w-full mb-7 sm:mb-8 fade-up delay-400">
            <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
              <span className="text-[8px] sm:text-[9px] tracking-[3px] sm:tracking-[4px] uppercase font-normal" style={{ color: '#4a7c59' }}>
                Confirmados
              </span>
              <span className="font-cormorant italic text-[13px] sm:text-[14px] font-light px-1.5 sm:px-2"
                style={{ color: '#4a7c59', background: '#eaf2ec', borderRadius: '2px' }}>
                {confirmed.length}
              </span>
            </div>
            {confirmed.map((e) => <EntryCard key={e.id} entry={e} />)}
          </div>
        )}

        {/* Recusados */}
        {declined.length > 0 && (
          <div className="w-full mb-7 sm:mb-8 fade-up delay-500">
            <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
              <span className="text-[8px] sm:text-[9px] tracking-[3px] sm:tracking-[4px] uppercase font-normal" style={{ color: '#a05050' }}>
                Recusados
              </span>
              <span className="font-cormorant italic text-[13px] sm:text-[14px] font-light px-1.5 sm:px-2"
                style={{ color: '#a05050', background: '#f5ecec', borderRadius: '2px' }}>
                {declined.length}
              </span>
            </div>
            {declined.map((e) => <EntryCard key={e.id} entry={e} />)}
          </div>
        )}

        {entries.length === 0 && (
          <div className="text-center py-14 sm:py-16 fade-in">
            <p className="font-cormorant italic font-light" style={{ fontSize: '20px', color: '#7A7468' }}>
              Nenhuma resposta ainda.
            </p>
            <p className="text-[8px] sm:text-[9px] tracking-[2.5px] sm:tracking-[3px] uppercase mt-2" style={{ color: '#7A7468' }}>
              Compartilhe o link com os convidados
            </p>
          </div>
        )}

        {/* Atualizar */}
        <div className="mt-6 text-center">
          <button
            onClick={loadEntries}
            className="text-[8px] sm:text-[9px] tracking-[3px] uppercase font-light cursor-pointer transition-colors hover:text-dark"
            style={{ background: 'none', border: 'none', color: '#7A7468' }}
          >
            ↻ Atualizar lista
          </button>
        </div>

        </>)}

        {/* Sair */}
        <div className="mt-10 sm:mt-12 text-center">
          <button
            onClick={logout}
            className="bg-transparent text-[8px] sm:text-[9px] tracking-[2.5px] sm:tracking-[3px] uppercase font-light cursor-pointer transition-colors hover:text-dark pb-0.5"
            style={{ color: '#5A5650', border: 'none', borderBottom: '1px solid #C4A882', minHeight: '44px' }}
          >
            Sair
          </button>
        </div>

      </div>
    </div>
  )
}
