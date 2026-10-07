function Smoke({ className = '' }) {
  return (
    <svg className={`smoke-svg ${className}`} viewBox="0 0 320 220" aria-hidden="true">
      <g className="puff a"><ellipse cx="70" cy="150" rx="38" ry="22" /><ellipse cx="98" cy="128" rx="28" ry="18" /></g>
      <g className="puff b"><ellipse cx="170" cy="90" rx="46" ry="26" /><ellipse cx="204" cy="70" rx="24" ry="16" /></g>
      <g className="puff c"><ellipse cx="250" cy="150" rx="36" ry="20" /><ellipse cx="274" cy="132" rx="18" ry="12" /></g>
    </svg>
  )
}

export function Scoop({ size = 'card', caption = true, line = 'I sniff the site before anyone writes.' }) {
  return (
    <figure className={`cast-card scoop size-${size}`}>
      <svg viewBox="0 0 200 220" className="cast-svg" aria-hidden="true">
        <ellipse className="shadow" cx="100" cy="208" rx="48" ry="8" />
        <g className="bob">
          <path d="M62 168 q38 22 76 0 v18 q-38 14 -76 0z" fill="#2b3a8f" stroke="#1a1208" strokeWidth="3.5" />
          <path d="M70 150 q30 28 60 0 q4 28 -30 38 q-34 -10 -30 -38z" fill="#f4c56a" stroke="#1a1208" strokeWidth="3.5" />
          <ellipse cx="68" cy="132" rx="14" ry="22" fill="#e8b24a" stroke="#1a1208" strokeWidth="3" />
          <ellipse cx="132" cy="132" rx="14" ry="22" fill="#e8b24a" stroke="#1a1208" strokeWidth="3" />
          <circle cx="100" cy="118" r="46" fill="#ffd27a" stroke="#1a1208" strokeWidth="3.5" />
          <path d="M62 108 q38 -28 76 0" fill="#c9842a" stroke="#1a1208" strokeWidth="3" />
          <path d="M54 92 q-8 -38 28 -48" fill="none" stroke="#1a1208" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M146 92 q8 -38 -28 -48" fill="none" stroke="#1a1208" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="58" cy="42" r="7" fill="#ff5a1f" stroke="#1a1208" strokeWidth="3" />
          <circle cx="142" cy="42" r="7" fill="#2b3a8f" stroke="#1a1208" strokeWidth="3" />
          <path d="M56 86 h88 v18 h-88z" fill="#1c140c" />
          <path d="M64 70 h72 l8 16 h-88z" fill="#ff5a1f" stroke="#1a1208" strokeWidth="3" />
          <rect x="88" y="74" width="24" height="8" rx="2" fill="#ffd036" />
          <g className="glasses">
            <circle cx="80" cy="118" r="18" fill="#e8fbff" stroke="#1a1208" strokeWidth="3.5" />
            <circle cx="120" cy="118" r="18" fill="#e8fbff" stroke="#1a1208" strokeWidth="3.5" />
            <path d="M98 118 h4" stroke="#1a1208" strokeWidth="3.5" />
            <rect className="scan-beam" x="64" y="110" width="72" height="6" rx="3" />
            <circle className="pupil" cx="84" cy="120" r="5" />
            <circle className="pupil" cx="124" cy="120" r="5" />
            <circle cx="86" cy="116" r="2" fill="#fff" />
            <circle cx="126" cy="116" r="2" fill="#fff" />
          </g>
          <ellipse cx="100" cy="146" rx="8" ry="5" fill="#c9842a" stroke="#1a1208" strokeWidth="2" />
          <path d="M88 156 q12 10 24 0" fill="none" stroke="#1a1208" strokeWidth="3" strokeLinecap="round" />
          <g className="glass-hand">
            <circle cx="164" cy="148" r="22" fill="none" stroke="#1a1208" strokeWidth="5" />
            <circle cx="164" cy="148" r="16" fill="rgba(232,251,255,0.35)" stroke="#5ce1ff" strokeWidth="2" />
            <path d="M180 164 l16 16" stroke="#1a1208" strokeWidth="6" strokeLinecap="round" />
          </g>
        </g>
      </svg>
      {caption ? (
        <figcaption>
          <strong>Scoop</strong>
          {size !== 'baby' ? <span>{line}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  )
}

export function Nib({ size = 'card', caption = true, line = 'I write the keyword. Not your life story.' }) {
  return (
    <figure className={`cast-card nib size-${size}`}>
      <svg viewBox="0 0 200 220" className="cast-svg" aria-hidden="true">
        <ellipse className="shadow" cx="100" cy="208" rx="48" ry="8" />
        <g className="bob delay">
          <g className="tentacle t1">
            <path d="M58 150 q-36 24 -22 52" fill="none" stroke="#1a1208" strokeWidth="12" strokeLinecap="round" />
            <path d="M58 150 q-36 24 -22 52" fill="none" stroke="#5ecfc2" strokeWidth="8" strokeLinecap="round" />
          </g>
          <g className="tentacle t3">
            <path d="M78 168 q-8 34 16 42" fill="none" stroke="#1a1208" strokeWidth="12" strokeLinecap="round" />
            <path d="M78 168 q-8 34 16 42" fill="none" stroke="#4eb8ac" strokeWidth="8" strokeLinecap="round" />
          </g>
          <g className="tentacle t2">
            <path d="M128 168 q12 32 -8 44" fill="none" stroke="#1a1208" strokeWidth="12" strokeLinecap="round" />
            <path d="M128 168 q12 32 -8 44" fill="none" stroke="#5ecfc2" strokeWidth="8" strokeLinecap="round" />
          </g>
          <ellipse cx="100" cy="128" rx="48" ry="46" fill="#7ad8cc" stroke="#1a1208" strokeWidth="3.5" />
          <path d="M70 96 q30 -22 60 0 q-8 18 -30 18 q-22 0 -30 -18z" fill="#ff5a1f" stroke="#1a1208" strokeWidth="3" />
          <circle cx="78" cy="86" r="7" fill="#ffd036" stroke="#1a1208" strokeWidth="2.5" />
          <circle cx="82" cy="112" r="16" fill="#fff" stroke="#1a1208" strokeWidth="3" />
          <circle cx="118" cy="112" r="16" fill="#fff" stroke="#1a1208" strokeWidth="3" />
          <circle className="pupil" cx="86" cy="116" r="6" />
          <circle className="pupil" cx="122" cy="116" r="6" />
          <circle cx="88" cy="112" r="2.2" fill="#fff" />
          <circle cx="124" cy="112" r="2.2" fill="#fff" />
          <ellipse cx="72" cy="132" rx="8" ry="5" fill="#ff9aa2" opacity="0.85" />
          <ellipse cx="128" cy="132" rx="8" ry="5" fill="#ff9aa2" opacity="0.85" />
          <ellipse cx="100" cy="138" rx="9" ry="6" fill="#ff8f6b" stroke="#1a1208" strokeWidth="2" />
          <path d="M90 152 q10 8 20 0" fill="none" stroke="#1a1208" strokeWidth="3" strokeLinecap="round" />
          <g className="pen-arm">
            <path d="M138 148 q40 -6 56 -40" fill="none" stroke="#1a1208" strokeWidth="12" strokeLinecap="round" />
            <path d="M138 148 q40 -6 56 -40" fill="none" stroke="#7ad8cc" strokeWidth="8" strokeLinecap="round" />
            <g transform="translate(188 92) rotate(-32)">
              <rect x="-7" y="-34" width="14" height="52" rx="4" fill="#1a1208" />
              <rect x="-5" y="-32" width="10" height="34" fill="#ffd036" />
              <path d="M-5 2 L0 20 L5 2 Z" fill="#5ce1ff" stroke="#1a1208" strokeWidth="1.5" />
            </g>
          </g>
          <g className="ink-drop">
            <path d="M158 54 q8 14 0 22 q-8 -6 0 -22z" fill="#2b3a8f" />
          </g>
        </g>
      </svg>
      {caption ? (
        <figcaption>
          <strong>Nib</strong>
          {size !== 'baby' ? <span>{line}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  )
}

export function Dash({ size = 'card', caption = true, line = 'I walk the draft to a real desk.' }) {
  return (
    <figure className={`cast-card dash size-${size}`}>
      <svg viewBox="0 0 200 220" className="cast-svg" aria-hidden="true">
        <ellipse className="shadow" cx="100" cy="208" rx="48" ry="8" />
        <g className="plane">
          <path d="M28 44 L78 58 L36 68 Z" fill="#fff6d8" stroke="#1a1208" strokeWidth="3" />
        </g>
        <g className="bob">
          <ellipse cx="108" cy="156" rx="40" ry="34" fill="#f2a65a" stroke="#1a1208" strokeWidth="3.5" />
          <g className="wing">
            <ellipse cx="78" cy="150" rx="26" ry="12" fill="#e0893c" stroke="#1a1208" strokeWidth="3" />
          </g>
          <path d="M92 188 q6 16 0 24" stroke="#1a1208" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M118 188 q8 16 2 24" stroke="#1a1208" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="118" cy="112" r="30" fill="#ffd19a" stroke="#1a1208" strokeWidth="3.5" />
          <path d="M96 92 q22 -22 46 2 q-26 10 -46 -2z" fill="#2b3a8f" stroke="#1a1208" strokeWidth="3" />
          <rect x="108" y="78" width="26" height="9" rx="2" fill="#ffd036" stroke="#1a1208" strokeWidth="2.5" />
          <circle cx="128" cy="110" r="9" fill="#fff" stroke="#1a1208" strokeWidth="3" />
          <circle className="pupil" cx="131" cy="111" r="3.5" />
          <circle cx="132" cy="109" r="1.4" fill="#fff" />
          <path d="M142 116 l22 -6 l-18 14z" fill="#ff5a1f" stroke="#1a1208" strokeWidth="3" />
          <path d="M108 128 q10 8 18 2" fill="none" stroke="#1a1208" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M86 150 q-18 8 -8 28 h28 q-6 -18 0 -28z" fill="#2b3a8f" stroke="#1a1208" strokeWidth="3" />
          <rect x="78" y="162" width="22" height="8" rx="2" fill="#ffd036" />
        </g>
      </svg>
      {caption ? (
        <figcaption>
          <strong>Dash</strong>
          {size !== 'baby' ? <span>{line}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  )
}

export function Gizmo({ size = 'card', caption = true, line = 'I stamp the ledger.' }) {
  return (
    <figure className={`cast-card gizmo size-${size}`}>
      <svg viewBox="0 0 200 220" className="cast-svg" aria-hidden="true">
        <ellipse className="shadow" cx="100" cy="208" rx="48" ry="8" />
        <g className="stamp">
          <rect x="68" y="24" width="64" height="22" rx="6" fill="#ff6bd6" stroke="#1a1208" strokeWidth="3" />
          <text x="100" y="40" textAnchor="middle" fontSize="9" fontFamily="Bangers, cursive" fill="#1a1208">PLACED</text>
        </g>
        <g className="bob delay2">
          <path d="M52 154 q18 -68 48 -68 q30 0 48 68 q-48 28 -96 0z" fill="#b38bff" stroke="#1a1208" strokeWidth="3.5" />
          <circle cx="84" cy="118" r="14" fill="#fff" stroke="#1a1208" strokeWidth="3" />
          <circle cx="118" cy="118" r="17" fill="#fff" stroke="#1a1208" strokeWidth="3" />
          <circle className="pupil" cx="86" cy="120" r="5" />
          <circle className="pupil" cx="122" cy="122" r="6" />
          <path d="M90 146 q10 12 24 0" fill="none" stroke="#1a1208" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>
      {caption ? (
        <figcaption>
          <strong>Gizmo</strong>
          {size !== 'baby' ? <span>{line}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  )
}

export function HeroBabies({ look }) {
  const ScanBaby = look === 'gremlins' ? Gizmo : Scoop
  return (
    <div className="hero-stage">
      <Smoke />
      <div className="baby baby-tl"><ScanBaby size="baby" /></div>
      <div className="baby baby-tr"><Nib size="baby" /></div>
      <div className="baby baby-bl"><Dash size="baby" /></div>
    </div>
  )
}

export function StepCast({ who, look }) {
  if (who === 'scan') return look === 'gremlins' ? <Gizmo size="card" /> : <Scoop size="card" />
  if (who === 'write') return <Nib size="card" />
  return <Dash size="card" />
}

export const LOOKS = [
  { id: 'aurora', name: 'Aurora', blurb: 'Dark blue floor. Quiet glimmer. Current live look.' },
  { id: 'crew', name: 'Ink Crew', blurb: 'Saturday-morning newsroom. Scoop, Nib and Dash run the floor.' },
  { id: 'gremlins', name: 'Gremlin Press', blurb: 'Halftone print shop. Ink blobs stamp PLACED and steal the ladder.' }
]
