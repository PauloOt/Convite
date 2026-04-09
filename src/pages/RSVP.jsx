import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PampasDecor from '../components/PampasDecor'
import { submitRSVP } from '../utils/api'

/* ── Campo com label + barra animada ─────────────────── */
function Field({ label, children, error, className = '' }) {
  return (
    <div className={`field-group ${className}`}>
      <label className="field-label">{label}</label>
      <div className="input-wrap">
        {children}
        <span className="focus-bar" aria-hidden="true" />
      </div>
      {error && (
        <p className="mt-2 text-[10px] tracking-[1.5px]" style={{ color: '#b05050' }}>{error}</p>
      )}
    </div>
  )
}

/* ── Ornamento: linha com losango ─────────────────────── */
function Ornament({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #c8b99a)' }} />
      <div className="w-[5px] h-[5px] rotate-45 flex-shrink-0" style={{ background: '#7A5C32' }} />
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #c8b99a)' }} />
    </div>
  )
}

/* ── Input de idade: numérico, sem setas, mobile-first ── */
function AgeInput({ value, onChange, label = 'Idade' }) {
  return (
    <Field label={label} className="w-[76px] sm:w-[84px] shrink-0">
      <input
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        min="1"
        max="120"
        value={value}
        onChange={onChange}
        placeholder="—"
        className="input-line input-age"
        style={{ minHeight: '48px' }}
      />
    </Field>
  )
}

export default function RSVP() {
  const navigate = useNavigate()

  const [name, setName]             = useState('')
  const [age, setAge]               = useState('')
  const [guests, setGuests]         = useState(0)
  const [companions, setCompanions] = useState([])
  const [error, setError]           = useState('')

  function handleGuestsChange(e) {
    const n = parseInt(e.target.value)
    setGuests(n)
    setCompanions(
      Array.from({ length: n }, (_, i) => companions[i] || { name: '', age: '' })
    )
  }

  function updateCompanion(index, field, value) {
    setCompanions((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  function submit(confirmed) {
    if (!name.trim()) {
      setError('Por favor, informe seu nome.')
      return
    }
    const entry = {
      id: Date.now(),
      name: name.trim(),
      age: age ? parseInt(age) : null,
      guests,
      companionDetails: companions.map((c) => ({
        name: c.name.trim(),
        age: c.age ? parseInt(c.age) : null,
      })),
      confirmed,
      createdAt: new Date().toISOString(),
    }
    // Navega imediatamente; o envio acontece em background
    sessionStorage.setItem('rsvp_last', JSON.stringify({ name: entry.name, confirmed }))
    navigate('/obrigado')
    submitRSVP(entry).catch(console.error)
  }

  return (
    <div className="min-h-screen" style={{ background: '#F6F1E7' }}>
      <PampasDecor />

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section
        className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center text-center px-5 py-14 sm:px-8 sm:py-16"
        style={{ background: 'radial-gradient(ellipse at 50% 20%, #ede2cc55 0%, transparent 65%)' }}
      >
        <div
          className="w-full max-w-[560px] flex flex-col items-center justify-between gap-10"
          style={{ minHeight: 'calc(100vh - 112px)' }}
        >

          {/* Supertítulo */}
          <p className="text-[9px] sm:text-[10px] tracking-[8px] sm:tracking-[10px] uppercase font-normal text-sand2 fade-up">
            Save the Date
          </p>

          {/* Nomes + data */}
          <div className="w-full flex flex-col items-center">
            <span className="font-script block leading-none text-dark fade-up delay-100"
              style={{ fontSize: 'clamp(68px,16vw,114px)' }}>Bruna</span>
            <span className="font-script block text-dark opacity-45 fade-up delay-200"
              style={{ fontSize: 'clamp(30px,7vw,50px)' }}>&amp;</span>
            <span className="font-script block leading-none text-dark fade-up delay-300"
              style={{ fontSize: 'clamp(68px,16vw,114px)' }}>Rodrigo</span>

            <Ornament className="w-full max-w-[240px] my-4 sm:my-5 fade-up delay-400" />

            <div className="fade-up delay-400">
              <p className="text-[9px] sm:text-[10px] tracking-[8px] sm:tracking-[10px] font-light text-dark mb-2">
                J A N E I R O
              </p>
              <div className="flex items-center justify-center max-w-[280px] sm:max-w-[310px] mx-auto">
                <span
                  className="flex-1 text-[9px] sm:text-[10px] tracking-[3px] sm:tracking-[4px] uppercase font-light text-dark px-2 py-2 text-center leading-snug"
                  style={{ borderTop: '1px solid #b8afa4', borderBottom: '1px solid #b8afa4' }}
                >Sábado</span>
                <span className="font-cormorant font-light italic px-4 sm:px-6 leading-none text-dark"
                  style={{ fontSize: 'clamp(48px,12vw,74px)' }}>16</span>
                <span
                  className="flex-1 text-[9px] sm:text-[10px] tracking-[3px] sm:tracking-[4px] uppercase font-light text-dark px-2 py-2 text-center leading-snug"
                  style={{ borderTop: '1px solid #b8afa4', borderBottom: '1px solid #b8afa4' }}
                >15:00</span>
              </div>
              <p className="text-[9px] sm:text-[10px] tracking-[8px] sm:tracking-[10px] font-light text-dark mt-2">2 0 2 7</p>
            </div>

            <div className="flex flex-col items-center gap-1.5 mt-4 sm:mt-5 fade-up delay-500">
              <span className="text-[9px] sm:text-[10px] tracking-[6px] sm:tracking-[8px] font-light uppercase text-dark">Cotia · SP</span>
              <span className="text-[8px] sm:text-[9px] tracking-[2.5px] font-light uppercase" style={{ color: '#5A5650' }}>
                Endereço completo no convite
              </span>
            </div>
          </div>

          {/* Versículo + CTA */}
          <div className="w-full flex flex-col items-center fade-up delay-600">
            <div className="w-full max-w-[380px] sm:max-w-[400px] pt-5 mb-4" style={{ borderTop: '1px solid #cfc8bc' }}>
              <p className="font-cormorant text-[15px] sm:text-[16px] italic font-light leading-[1.9] text-dark">
                "Para que todos vejam, e saibam,<br />
                e considerem e juntamente entendam<br />
                que a mão do Senhor fez isto."
                <span className="block mt-3 font-sans not-italic text-[8px] sm:text-[9px] tracking-[3px] sm:tracking-[4px] uppercase font-normal text-sand2">
                  — Isaías 41:20
                </span>
              </p>
            </div>

            <a href="#rsvp"
              className="inline-flex flex-col items-center gap-3 mt-6 sm:mt-8 no-underline text-[8px] sm:text-[9px] tracking-[5px] sm:tracking-[6px] uppercase font-normal text-dark transition-opacity hover:opacity-50"
            >
              Confirme sua presença
              <svg className="animate-bob" width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden="true">
                <line x1="6" y1="0" x2="6" y2="14" stroke="currentColor" strokeWidth="1"/>
                <polyline points="2,11 6,16 10,11" stroke="currentColor" strokeWidth="1" fill="none" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

        </div>
      </section>

      {/* ══ FORMULÁRIO ════════════════════════════════════════════ */}
      <section
        id="rsvp"
        className="relative z-10 w-full px-5 pt-14 pb-20 sm:px-8 sm:pt-20 sm:pb-28"
        style={{ borderTop: '1.5px solid #C4A882', background: '#F6F1E7' }}
      >
        <div className="w-full max-w-[520px] mx-auto">

          {/* Cabeçalho */}
          <div className="text-center mb-12 sm:mb-14">
            <p className="text-[8px] sm:text-[9px] tracking-[5px] sm:tracking-[6px] uppercase font-normal text-sand2 mb-3 sm:mb-4">
              16 · 01 · 2027
            </p>
            <h2 className="font-cormorant italic font-light text-dark leading-none"
              style={{ fontSize: 'clamp(32px,7vw,52px)' }}>
              Confirme sua Presença
            </h2>
            <Ornament className="mt-4 sm:mt-5 max-w-[180px] mx-auto" />
          </div>

          {/* Nome + Idade */}
          <div className="flex gap-3 sm:gap-4 items-start mb-10 sm:mb-12">
            <Field label="Nome completo" error={error} className="flex-1 min-w-0">
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError('') }}
                placeholder="Como prefere ser chamado(a)"
                autoComplete="name"
                className="input-line"
                style={{ minHeight: '48px' }}
              />
            </Field>
            <AgeInput
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          {/* Acompanhantes */}
          <div className="mb-10 sm:mb-12">
            <Field label="Acompanhantes">
              <div className="relative">
                <select
                  value={guests}
                  onChange={handleGuestsChange}
                  className="input-line cursor-pointer"
                  style={{ minHeight: '48px' }}
                >
                  <option value={0}>Vou sozinho(a)</option>
                  <option value={1}>+ 1 acompanhante</option>
                  <option value={2}>+ 2 acompanhantes</option>
                  <option value={3}>+ 3 acompanhantes</option>
                  <option value={4}>+ 4 acompanhantes</option>
                  <option value={5}>+ 5 acompanhantes</option>
                </select>
                <span className="absolute right-2 bottom-[14px] text-sm pointer-events-none" style={{ color: '#7A7468' }}>▾</span>
              </div>
            </Field>
          </div>

          {/* Campos por acompanhante */}
          {companions.length > 0 && (
            <div className="mb-10 sm:mb-12 pt-5 pl-3 sm:pl-4" style={{ borderLeft: '1.5px solid #d4cbbe' }}>
              {companions.map((companion, i) => (
                <div key={i} className="flex gap-3 sm:gap-4 items-start mb-8 sm:mb-10 last:mb-0">
                  <Field label={`Acompanhante ${i + 1}`} className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={companion.name}
                      onChange={(e) => updateCompanion(i, 'name', e.target.value)}
                      placeholder="Nome completo"
                      className="input-line"
                      style={{ minHeight: '48px' }}
                    />
                  </Field>
                  <AgeInput
                    value={companion.age}
                    onChange={(e) => updateCompanion(i, 'age', e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Botões */}
          <div className="mt-8 flex flex-col gap-3">
            <button onClick={() => submit(true)} className="btn-primary">
              Confirmar Presença
            </button>
            <button
              onClick={() => submit(false)}
              className="w-full py-3.5 px-6 font-sans font-light tracking-[3px] text-[9px] uppercase cursor-pointer transition-colors hover:text-dark"
              style={{ background: 'transparent', border: 'none', color: '#5A5650', textDecoration: 'underline', textUnderlineOffset: '5px', minHeight: '48px' }}
            >
              Não poderei comparecer
            </button>
          </div>

        </div>
      </section>
    </div>
  )
}
