import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PampasDecor from '../components/PampasDecor'

function Ornament({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #c8b99a)' }} />
      <div className="w-[5px] h-[5px] rotate-45 flex-shrink-0" style={{ background: '#7A5C32' }} />
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #c8b99a)' }} />
    </div>
  )
}

export default function Obrigado() {
  const [data, setData]   = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('rsvp_last')
      if (raw) setData(JSON.parse(raw))
    } catch { /* ignore */ }
    const t = setTimeout(() => setReady(true), 60)
    return () => clearTimeout(t)
  }, [])

  const confirmed = data?.confirmed ?? true
  const name      = data?.name || 'Convidado'

  return (
    <div className="min-h-screen" style={{ background: '#F6F1E7' }}>
      <PampasDecor />

      <div
        className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-6 sm:px-8 py-14 sm:py-16 text-center"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, #ede2cc44 0%, transparent 60%)' }}
      >
        <div
          className="w-full max-w-[540px] flex flex-col items-center justify-between text-center gap-8 sm:gap-0"
          style={{ minHeight: 'calc(100vh - 112px)' }}
        >

          {/* Topo — badge de status */}
          <div className={ready ? 'fade-up' : 'opacity-0'}>
            <span
              className="inline-block text-[8px] sm:text-[9px] tracking-[6px] sm:tracking-[8px] uppercase font-normal text-sand2 px-4 sm:px-5 py-2"
              style={{ border: '1px solid #d4c4a8' }}
            >
              {confirmed ? 'Presença Confirmada' : 'Recebemos sua resposta'}
            </span>
          </div>

          {/* Centro */}
          <div className="w-full flex flex-col items-center">
            <p
              className={`font-script text-dark ${ready ? 'fade-up delay-200' : 'opacity-0'}`}
              style={{ fontSize: 'clamp(36px,9vw,58px)', lineHeight: 1.15 }}
            >
              {confirmed ? 'Que alegria,' : 'Sentiremos sua falta,'}
            </p>

            <p
              className={`font-cormorant italic font-light text-dark mt-1 ${ready ? 'fade-up delay-300' : 'opacity-0'}`}
              style={{ fontSize: 'clamp(50px,12vw,88px)', lineHeight: 1.05 }}
            >
              {name}
            </p>

            <Ornament className={`max-w-[220px] sm:max-w-[240px] w-full my-6 sm:my-8 ${ready ? 'fade-up delay-400' : 'opacity-0'}`} />

            <p
              className={`font-cormorant italic font-light text-dark leading-[1.85] ${ready ? 'fade-up delay-500' : 'opacity-0'}`}
              style={{ fontSize: 'clamp(16px,3vw,21px)', whiteSpace: 'pre-line', color: '#2e2c28' }}
            >
              {confirmed
                ? 'Sua presença foi confirmada.\nAguardamos você com muita alegria!'
                : 'Agradecemos por nos avisar.\nEsperamos celebrar juntos em breve.'}
            </p>
          </div>

          {/* Rodapé */}
          <div className={`w-full flex flex-col items-center gap-4 sm:gap-5 ${ready ? 'fade-up delay-600' : 'opacity-0'}`}>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-6 sm:w-8 h-px" style={{ background: '#d4c8b8' }} />
              <p className="font-cormorant text-[14px] sm:text-[15px] italic font-light text-sand2 tracking-[2px]">
                16 de Janeiro de 2027
              </p>
              <div className="w-6 sm:w-8 h-px" style={{ background: '#d4c8b8' }} />
            </div>

            <Link
              to="/"
              className="text-[8px] sm:text-[9px] tracking-[3px] sm:tracking-[4px] uppercase font-light no-underline pb-0.5 transition-colors hover:text-dark"
              style={{ color: '#5A5650', borderBottom: '1px solid #C4A882', minHeight: '44px', display: 'flex', alignItems: 'center' }}
            >
              Voltar ao início
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
