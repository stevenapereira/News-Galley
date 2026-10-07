export function Scoop({ line = 'I read the site before anyone writes.' }) {
  return (
    <figure className="cast-card scoop">
      <svg viewBox="0 0 220 240" className="cast-svg" aria-hidden="true">
        <ellipse className="shadow" cx="110" cy="222" rx="58" ry="10" />
        <g className="bob">
          <ellipse cx="110" cy="148" rx="62" ry="58" fill="#f4d27a" stroke="#1a1208" strokeWidth="4" />
          <ellipse cx="78" cy="132" rx="16" ry="28" fill="#e8b85a" stroke="#1a1208" strokeWidth="3" />
          <ellipse cx="142" cy="132" rx="16" ry="28" fill="#e8b85a" stroke="#1a1208" strokeWidth="3" />
          <g className="glasses">
            <circle cx="86" cy="128" r="26" fill="#dff7ff" stroke="#1a1208" strokeWidth="4" />
            <circle cx="134" cy="128" r="26" fill="#dff7ff" stroke="#1a1208" strokeWidth="4" />
            <path d="M112 128 h10" stroke="#1a1208" strokeWidth="4" />
            <rect className="scan-beam" x="64" y="118" width="92" height="8" rx="4" />
            <circle className="pupil" cx="90" cy="130" r="7" />
            <circle className="pupil" cx="138" cy="130" r="7" />
          </g>
          <path d="M96 156 q14 12 28 0" fill="none" stroke="#1a1208" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="110" cy="92" rx="34" ry="16" fill="#c9842a" stroke="#1a1208" strokeWidth="3" />
          <path d="M78 86 q-18 -28 8 -40" fill="none" stroke="#1a1208" strokeWidth="4" strokeLinecap="round" />
          <path d="M142 86 q18 -28 -8 -40" fill="none" stroke="#1a1208" strokeWidth="4" strokeLinecap="round" />
          <circle cx="70" cy="46" r="6" fill="#5ce1ff" stroke="#1a1208" strokeWidth="3" />
          <circle cx="150" cy="46" r="6" fill="#ff6bd6" stroke="#1a1208" strokeWidth="3" />
        </g>
      </svg>
      <figcaption>
        <strong>Scoop</strong>
        <span>{line}</span>
      </figcaption>
    </figure>
  )
}

export function Nib({ line = 'I write the keyword. Not your life story.' }) {
  return (
    <figure className="cast-card nib">
      <svg viewBox="0 0 220 240" className="cast-svg" aria-hidden="true">
        <ellipse className="shadow" cx="110" cy="222" rx="58" ry="10" />
        <g className="bob delay">
          <ellipse cx="110" cy="118" rx="54" ry="50" fill="#7ad0c5" stroke="#1a1208" strokeWidth="4" />
          <circle cx="92" cy="112" r="10" fill="#fff" stroke="#1a1208" strokeWidth="3" />
          <circle cx="128" cy="112" r="10" fill="#fff" stroke="#1a1208" strokeWidth="3" />
          <circle className="pupil" cx="94" cy="114" r="4" />
          <circle className="pupil" cx="130" cy="114" r="4" />
          <ellipse cx="110" cy="132" rx="10" ry="7" fill="#ff8f6b" stroke="#1a1208" strokeWidth="2" />
          <g className="tentacle t1">
            <path d="M70 150 q-40 30 -20 62" fill="none" stroke="#1a1208" strokeWidth="10" strokeLinecap="round" />
            <path d="M70 150 q-40 30 -20 62" fill="none" stroke="#7ad0c5" strokeWidth="6" strokeLinecap="round" />
          </g>
          <g className="tentacle t2">
            <path d="M150 150 q40 28 24 60" fill="none" stroke="#1a1208" strokeWidth="10" strokeLinecap="round" />
            <path d="M150 150 q40 28 24 60" fill="none" stroke="#7ad0c5" strokeWidth="6" strokeLinecap="round" />
          </g>
          <g className="tentacle t3">
            <path d="M88 168 q-10 40 18 52" fill="none" stroke="#1a1208" strokeWidth="10" strokeLinecap="round" />
            <path d="M88 168 q-10 40 18 52" fill="none" stroke="#5bb8ad" strokeWidth="6" strokeLinecap="round" />
          </g>
          <g className="pen-arm">
            <path d="M142 150 q46 -8 62 -46" fill="none" stroke="#1a1208" strokeWidth="10" strokeLinecap="round" />
            <path d="M142 150 q46 -8 62 -46" fill="none" stroke="#7ad0c5" strokeWidth="6" strokeLinecap="round" />
            <g transform="translate(196 86) rotate(-28)">
              <rect x="-6" y="-28" width="12" height="46" rx="3" fill="#1a1208" />
              <rect x="-4" y="-26" width="8" height="30" fill="#ffd36a" />
              <path d="M-4 4 L0 18 L4 4 Z" fill="#5ce1ff" stroke="#1a1208" strokeWidth="1.5" />
            </g>
          </g>
          <g className="ink-drop">
            <path d="M168 58 q8 14 0 22 q-8 -6 0 -22z" fill="#5ce1ff" />
          </g>
        </g>
      </svg>
      <figcaption>
        <strong>Nib</strong>
        <span>{line}</span>
      </figcaption>
    </figure>
  )
}

export function Dash({ line = 'I walk the draft to a real desk.' }) {
  return (
    <figure className="cast-card dash">
      <svg viewBox="0 0 220 240" className="cast-svg" aria-hidden="true">
        <ellipse className="shadow" cx="110" cy="222" rx="58" ry="10" />
        <g className="plane">
          <path d="M40 48 L92 62 L48 70 Z" fill="#fff6d8" stroke="#1a1208" strokeWidth="3" />
          <path d="M92 62 L70 66" stroke="#1a1208" strokeWidth="2" />
        </g>
        <g className="bob">
          <ellipse cx="118" cy="142" rx="46" ry="40" fill="#f2a65a" stroke="#1a1208" strokeWidth="4" />
          <ellipse cx="128" cy="108" rx="32" ry="28" fill="#ffd19a" stroke="#1a1208" strokeWidth="4" />
          <circle cx="138" cy="104" r="8" fill="#fff" stroke="#1a1208" strokeWidth="3" />
          <circle className="pupil" cx="140" cy="105" r="3.5" />
          <path d="M154 110 l22 -4 l-18 12z" fill="#ff6b4a" stroke="#1a1208" strokeWidth="3" />
          <g className="wing">
            <ellipse cx="96" cy="138" rx="28" ry="14" fill="#e0893c" stroke="#1a1208" strokeWidth="3" />
          </g>
          <path d="M100 86 q18 -18 40 0 q-22 8 -40 0z" fill="#2b3a8f" stroke="#1a1208" strokeWidth="3" />
          <rect x="112" y="70" width="28" height="10" rx="3" fill="#ffd36a" stroke="#1a1208" strokeWidth="3" />
          <path d="M108 180 q8 18 0 28" stroke="#1a1208" strokeWidth="4" fill="none" />
          <path d="M128 180 q8 18 0 28" stroke="#1a1208" strokeWidth="4" fill="none" />
        </g>
      </svg>
      <figcaption>
        <strong>Dash</strong>
        <span>{line}</span>
      </figcaption>
    </figure>
  )
}

export function Gizmo({ line = 'I stamp the ledger so nobody loses the plot.' }) {
  return (
    <figure className="cast-card gizmo">
      <svg viewBox="0 0 220 240" className="cast-svg" aria-hidden="true">
        <ellipse className="shadow" cx="110" cy="222" rx="58" ry="10" />
        <g className="stamp">
          <rect x="78" y="28" width="64" height="22" rx="6" fill="#ff6bd6" stroke="#1a1208" strokeWidth="3" />
          <text x="110" y="44" textAnchor="middle" fontSize="9" fontFamily="Bangers, cursive" fill="#1a1208">PLACED</text>
        </g>
        <g className="bob delay2">
          <path d="M60 150 q20 -70 50 -70 q30 0 50 70 q-50 30 -100 0z" fill="#b38bff" stroke="#1a1208" strokeWidth="4" />
          <circle cx="92" cy="118" r="14" fill="#fff" stroke="#1a1208" strokeWidth="3" />
          <circle cx="128" cy="118" r="18" fill="#fff" stroke="#1a1208" strokeWidth="3" />
          <circle className="pupil" cx="94" cy="120" r="5" />
          <circle className="pupil" cx="132" cy="122" r="6" />
          <path d="M98 146 q12 14 28 0" fill="none" stroke="#1a1208" strokeWidth="3" strokeLinecap="round" />
          <circle cx="70" cy="150" r="10" fill="#7a8bff" stroke="#1a1208" strokeWidth="3" />
          <circle cx="154" cy="148" r="12" fill="#7a8bff" stroke="#1a1208" strokeWidth="3" />
        </g>
      </svg>
      <figcaption>
        <strong>Gizmo</strong>
        <span>{line}</span>
      </figcaption>
    </figure>
  )
}

export function CastRow({ look }) {
  if (look === 'gremlins') {
    return (
      <div className="cast-row">
        <Gizmo line="Scan the domain. I eat the noise." />
        <Nib line="Then I squeeze a publication-ready draft." />
        <Dash line="Then I fling it at a real desk." />
      </div>
    )
  }
  if (look === 'crew') {
    return (
      <div className="cast-row">
        <Scoop />
        <Nib />
        <Dash />
      </div>
    )
  }
  return (
    <div className="cast-row quiet">
      <Scoop line="Scan." />
      <Nib line="Write." />
      <Dash line="Pitch." />
    </div>
  )
}

export const LOOKS = [
  { id: 'aurora', name: 'Aurora', blurb: 'Dark blue floor. Quiet glimmer. Current live look.' },
  { id: 'crew', name: 'Ink Crew', blurb: 'Saturday-morning newsroom. Scoop, Nib and Dash run the floor.' },
  { id: 'gremlins', name: 'Gremlin Press', blurb: 'Halftone print shop. Ink blobs stamp PLACED and steal the ladder.' }
]
