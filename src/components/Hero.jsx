export default function Hero() {
  return (
    <section className="hero" id="top" data-hero>
      <div className="wrap">
        <div className="badge" aria-hidden="true">
          <svg className="ring" viewBox="0 0 100 100">
            <defs><path id="circ" d="M50,50 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" /></defs>
            <text><textPath href="#circ" textLength={274} lengthAdjust="spacing">Design leader ✦ Chandigarh, IST ✦ Open to remote ✦</textPath></text>
          </svg>
          <div className="face"><img src="/assets/portrait-avatar.webp" alt="" width={900} height={900} /></div>
        </div>
        <p className="hello">
          <span className="word" data-hello aria-hidden="true">
            <span className="on">Hi</span><span>Xin chào</span><span>こんにちは</span><span>नमस्ते</span>
          </span>
          <span className="sr-only">Hi,</span>
          <span>I’m Satnam</span> <svg className="ei ei-wave wave" viewBox="0 0 24 24" aria-hidden="true"><path className="e-mo" d="M20.6 3.2q1.7 1.3 1.7 3.2M2.3 6.4q.2-2.1 1.7-3.3" fill="none" stroke="var(--ink)" strokeWidth="1.3" strokeLinecap="round" /><rect className="eo" x="7.2" y="3.6" width={3} height={9} rx="1.5" fill="var(--sun)" /><rect className="eo" x="10.4" y="2.6" width={3} height={10} rx="1.5" fill="var(--sun)" /><rect className="eo" x="13.6" y="3.3" width={3} height="9.5" rx="1.5" fill="var(--sun)" /><rect className="eo" x="16.7" y="5.3" width="2.8" height={8} rx="1.4" fill="var(--sun)" /><rect className="eo" x="3.4" y="10.4" width={3} height={7} rx="1.5" fill="var(--sun)" transform="rotate(-38 4.9 13.9)" /><rect className="eo" x="6.6" y="9.6" width={13} height="11.6" rx={5} fill="var(--sun)" /></svg>
        </p>
        <h1 className="headline" data-split aria-label="I grow design teams that move revenue.">I grow design teams that <span className="hl">move revenue.</span></h1>
        <h2 className="sr-only">What I bring</h2>
        <ul className="bring">
          <li className="pop" style={{'--c': 'var(--sun)', '--tilt': '-1.5deg', '--d': '700ms'}}>
            <svg className="biz" viewBox="5 0 44 42" aria-hidden="true">
              <path className="biz-base" d="M8 38h32" />
              <rect className="biz-bar" x={10} y={29} width={7} height={9} rx="1.5" style={{'--b': '0'}} />
              <rect className="biz-bar" x={20} y={24} width={7} height={14} rx="1.5" style={{'--b': '1'}} />
              <rect className="biz-bar" x={30} y={18} width={7} height={20} rx="1.5" style={{'--b': '2'}} />
              <path className="biz-line biz-ink" pathLength={1} d="M7 18l8-6 7 3 13-11" />
              <path className="biz-arrow biz-ink" pathLength={1} d="M28.5 4h7v7" />
              <path className="biz-line" pathLength={1} d="M7 18l8-6 7 3 13-11" />
              <path className="biz-arrow" pathLength={1} d="M28.5 4h7v7" />
              <path className="biz-spark" d="M44.5 10.5l1.3 3.2 3.2 1.3-3.2 1.3-1.3 3.2-1.3-3.2-3.2-1.3 3.2-1.3z" />
            </svg>
            <h3>Design pointed at the business.</h3>
            <p>Payments, wallets, loyalty and growth for a global telco platform.</p>
          </li>
          <li className="pop" style={{'--c': 'var(--mint)', '--tilt': '1.2deg', '--d': '800ms'}}>
            <svg className="biz biz-team" viewBox="5 0 44 42" aria-hidden="true">
              <path className="dr" pathLength={1} style={{'--dl': '.35s', '--du': '.45s'}} d="M27 20.5v3.5M14 27v-3h26v3M27 24v3" />
              <g className="bp" style={{'--dl': '0s'}}><path className="body" style={{'--f': 'var(--cobalt)'}} d="M20.5 20q0-6.5 6.5-6.5t6.5 6.5z" /><circle className="head" cx={27} cy={8} r="4.2" /></g>
              <g className="bp bob" style={{'--dl': '.75s', '--bd': '2.2s'}}><path className="body" style={{'--f': 'var(--tomato)'}} d="M8.5 40q0-5 5.5-5t5.5 5z" /><circle className="head" cx={14} cy={31} r="3.4" /></g>
              <g className="bp bob" style={{'--dl': '.87s', '--bd': '2.45s'}}><path className="body" style={{'--f': 'var(--sun)'}} d="M21.5 40q0-5 5.5-5t5.5 5z" /><circle className="head" cx={27} cy={31} r="3.4" /></g>
              <g className="bp bob" style={{'--dl': '.99s', '--bd': '2.7s'}}><path className="body" style={{'--f': 'var(--lilac)'}} d="M34.5 40q0-5 5.5-5t5.5 5z" /><circle className="head" cx={40} cy={31} r="3.4" /></g>
            </svg>
            <h3>Teams and systems that scale.</h3>
            <p>Hiring and growing designers, design systems, a CX handbook with review gates, and AI in the everyday workflow.</p>
          </li>
          <li className="pop" style={{'--c': 'var(--lilac)', '--tilt': '-1deg', '--d': '900ms'}}>
            <svg className="biz biz-lang" viewBox="5 0 44 42" aria-hidden="true">
              <g className="bp" style={{'--dl': '0s', '--o': '0% 100%'}}><path className="bub" style={{'--f': 'var(--cobalt)'}} d="M12 4h12a5 5 0 0 1 5 5v5a5 5 0 0 1-5 5H15l-5 4v-4.6A5 5 0 0 1 7 14V9a5 5 0 0 1 5-5z" /><text className="gl" x={18} y="15.6" style={{'--t': 'var(--cream)'}}>A</text></g>
              <path className="dr" pathLength={1} style={{'--dl': '.4s', '--du': '.4s'}} d="M31 8.5q8-1 9.5 9" />
              <path className="dr" pathLength={1} style={{'--dl': '.78s', '--du': '.18s'}} d="M37.2 15.2l3.3 3.3 3-3.6" />
              <g className="bp" style={{'--dl': '.9s', '--o': '100% 100%'}}><path className="bub" style={{'--f': 'var(--tomato)'}} d="M27 21h13a5 5 0 0 1 5 5v5a5 5 0 0 1-1.5 3.6V39l-5-3H27a5 5 0 0 1-5-5v-5a5 5 0 0 1 5-5z" />
                <text className="gl cyc g0" x="33.5" y="32.6" style={{'--g': '0'}}>あ</text><text className="gl cyc" x="33.5" y="32.6" style={{'--g': '1'}}>अ</text><text className="gl cyc" x="33.5" y="32.6" style={{'--g': '2'}}>ơ</text></g>
            </svg>
            <h3>Work across languages and borders.</h3>
            <p>Shipped with a Vietnamese client, Japanese partners and an Indian build team, using prototypes as the shared language.</p>
          </li>
        </ul>
        <div className="hero-ctas pop" style={{'--d': '1000ms'}}>
          <a className="btn" href="#work">Pick a card <span aria-hidden="true">↓</span></a>
          <button className="btn cream" type="button" data-tldr-open>Short on time? 60-second version</button>
        </div>
      </div>
      {/* Draggable stickers (desktop) */}
      <span className="sticker round" style={{'--x': '66%', '--y': '33rem', '--c': 'var(--sun)', '--rot': '-10deg'}} data-sticker aria-hidden="true"><span><b>10</b>years in design</span></span>
      <span className="sticker" style={{'--x': '74%', '--y': '32.5rem', '--c': 'var(--pink)', '--rot': '6deg'}} data-sticker aria-hidden="true"><svg className="ei ei-controller" viewBox="0 0 24 24" aria-hidden="true"><g className="e-pad"><path className="eo" d="M7 7.5h10a4.5 4.5 0 0 1 4.5 4.5v1.8a3.4 3.4 0 0 1-6 2.2l-1.3-1.6H9.8L8.5 16a3.4 3.4 0 0 1-6-2.2V12A4.5 4.5 0 0 1 7 7.5z" fill="var(--cobalt)" /><path d="M5.9 10.7h1.6V9.1h1.4v1.6h1.6v1.4H8.9v1.6H7.5v-1.6H5.9z" fill="var(--cream)" /><circle className="e-b1" cx={16} cy="10.8" r="1.25" fill="var(--tomato)" stroke="var(--ink)" strokeWidth=".8" /><circle className="e-b2" cx="18.3" cy={13} r="1.25" fill="var(--sun)" stroke="var(--ink)" strokeWidth=".8" /></g></svg> shipped 2 games</span>
      <span className="sticker" style={{'--x': '71%', '--y': '38.5rem', '--c': 'var(--mint)', '--rot': '-4deg'}} data-sticker aria-hidden="true"><svg className="ei ei-robot" viewBox="0 0 40 40" aria-hidden="true"><path className="eo" d="M20 9V5.5" /><circle className="eo e-ant" cx={20} cy="4.5" r="2.6" fill="var(--sun)" /><rect x="3.5" y={15} width={4} height={8} rx="1.5" fill="var(--ink)" /><rect x="32.5" y={15} width={4} height={8} rx="1.5" fill="var(--ink)" /><path className="eo" d="M12 37q0-7 8-7t8 7z" fill="var(--lilac)" /><rect className="eo" x={7} y={9} width={26} height={21} rx={6} fill="var(--cobalt)" /><rect x={11} y={13} width={18} height={12} rx={4} fill="var(--cream)" /><g className="e-eyes"><circle cx={16} cy={18} r="2.2" fill="var(--ink)" /><circle cx={24} cy={18} r="2.2" fill="var(--ink)" /></g><path d="M17 21.6q3 2 6 0" fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" /></svg> AI in the workflow</span>
      <span className="sticker" style={{'--x': '84%', '--y': '36rem', '--c': 'var(--cream)', '--rot': '8deg'}} data-sticker aria-hidden="true"><svg className="ei ei-daynight" viewBox="0 0 24 24" aria-hidden="true"><g className="e-day"><path className="e-rays" d="M12 2.4v2.2M12 19.4v2.2M2.4 12h2.2M19.4 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M5.2 18.8l1.6-1.6M17.2 6.8l1.6-1.6" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" /><circle className="eo" cx={12} cy={12} r="4.6" fill="var(--sun)" /></g><g className="e-night"><path className="eo e-moon" d="M15 3.4a8.6 8.6 0 1 0 5.6 13.8A7 7 0 0 1 15 3.4z" fill="var(--lilac)" /><g transform="translate(19.4 5.4) scale(0.9)"><path className="e-tw" d="M0-3l.9 2.1L3 0l-2.1.9L0 3l-.9-2.1L-3 0l2.1-.9z" fill="var(--sun)" stroke="var(--ink)" strokeWidth="0.89" strokeLinejoin="round" /></g></g></svg><span data-clock>Chandigarh</span></span>
      <span className="drag-hint hand" style={{'--x': '66%', '--y': '30.4rem'}} aria-hidden="true">psst, these peel off →</span>
    </section>
  );
}
