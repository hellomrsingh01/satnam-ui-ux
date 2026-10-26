export default function Work() {
  return (
    <section className="work wrap" id="work">
      <div className="work-head">
        <div>
          <p className="kicker mono">01 · Selected work</p>
          <h2 className="section-title pop">Pick a card.<br />Any card.</h2>
          <button className="mixtape" type="button" data-mix-open aria-haspopup="dialog" aria-label="Play the mixtape: all six case studies as 40-second videos"><svg viewBox="0 0 150 96" aria-hidden="true"><rect x={3} y={3} width={144} height={90} rx={12} fill="var(--sun)" stroke="var(--ink)" strokeWidth={3} /><rect x={18} y={14} width={114} height={22} rx={5} fill="var(--cream)" stroke="var(--ink)" strokeWidth="2.5" /><text x={75} y={30} textAnchor="middle" fontFamily="Space Mono, monospace" fontWeight={700} fontSize={12} fill="var(--ink)">MIXTAPE · 6</text><rect x={30} y={44} width={90} height={30} rx={15} fill="var(--cream-2)" stroke="var(--ink)" strokeWidth="2.5" /><g className="mix-reel"><circle cx={50} cy={59} r={11} fill="var(--cream)" stroke="var(--ink)" strokeWidth="2.5" /><path d="M50 50v18M41 59h18" stroke="var(--ink)" strokeWidth="2.5" /></g><g className="mix-reel"><circle cx={100} cy={59} r={11} fill="var(--cream)" stroke="var(--ink)" strokeWidth="2.5" /><path d="M100 50v18M91 59h18" stroke="var(--ink)" strokeWidth="2.5" /></g><path d="M40 93l8-12h54l8 12" fill="var(--cream-2)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" /></svg><span className="hand">Too long; watched</span></button>
        </div>
        <p className="pop">Six projects and the business results they delivered. Flip a card for the context, then open the full story.</p>
      </div>
      <div className="deck" data-deck>
        <article className="card pop" style={{'--bg': 'var(--cream)', '--back': 'var(--pink)', '--back-fg': 'var(--ink)', '--accent': 'var(--cobalt)'}}>
          <div className="card-inner">
            <div className="face-f">
              <div className="art"><img src="/assets/card-byu.webp" style={{objectPosition: '50% 0%'}} alt="The wallet ledger in the Circles operator console, with the by.U Pulsa wallet screen in front" loading="lazy" /><span className="scope mono">Revenue growth</span></div>
              <button className="flip corner" type="button" aria-pressed="false">Flip ↻</button>
              <div className="meta"><div><h3>Turning a payments wallet into a growth engine</h3><p className="co">by.U, Telkomsel · Indonesia</p></div><span className="meta-acts"><a className="go" href="https://rishabhyadav.space/byu.html">Read <span aria-hidden="true">→</span></a></span></div>
            </div>
            <div className="face-b">
              <div className="top"><p className="mono">by.U · via Circles.Life</p><button className="flip" type="button" aria-pressed="true">↺</button></div>
              <p className="why">Value that stays in the ecosystem.</p>
              <div className="stat"><p className="num">+6%</p><p className="lbl">ARPU among wallet adopters</p></div>
              <p className="mono">Senior Design Manager</p>
              <a className="btn sm read" href="https://rishabhyadav.space/byu.html">Read the story →</a>
            </div>
          </div>
        </article>
        <article className="card pop" style={{'--bg': 'var(--cream)', '--back': 'var(--lilac)', '--back-fg': 'var(--ink)', '--accent': 'var(--cobalt)', '--d': '80ms'}}>
          <div className="card-inner">
            <div className="face-f">
              <div className="art"><img src="/assets/card-leadership-team.webp" style={{objectPosition: '47% 50%'}} alt="The Apollo design team workshopping design principles at a whiteboard" loading="lazy" /><span className="scope mono">Delivery speed</span></div>
              <button className="flip corner" type="button" aria-pressed="false">Flip ↻</button>
              <div className="meta"><div><h3>Scaling design capacity for a healthcare platform</h3><p className="co">Apollo 24/7 &amp; Apollo Pharmacy · India</p></div><span className="meta-acts"><a className="go" href="https://rishabhyadav.space/leadership.html">Read <span aria-hidden="true">→</span></a></span></div>
            </div>
            <div className="face-b">
              <div className="top"><p className="mono">Apollo 24/7 &amp; Apollo Pharmacy</p><button className="flip" type="button" aria-pressed="true">↺</button></div>
              <p className="why">A team built to ship twice as fast.</p>
              <div className="stat"><p className="num"><span className="b">12</span><span className="arr">→</span>6</p><p className="lbl">Months to deliver a major project</p></div>
              <p className="mono">Design Lead</p>
              <a className="btn sm read" href="https://rishabhyadav.space/leadership.html">Read the story →</a>
            </div>
          </div>
        </article>
        <article className="card pop" style={{'--bg': 'var(--cream)', '--back': 'var(--mint)', '--back-fg': 'var(--ink)', '--accent': 'var(--cobalt)', '--d': '80ms'}}>
          <div className="card-inner">
            <div className="face-f">
              <div className="art"><img src="/assets/card-dayup-cover.webp" style={{objectPosition: '50% 0%'}} alt="DayUp logo above the app home screen on an iPhone" loading="lazy" /><span className="scope mono">Launch readiness</span></div>
              <button className="flip corner" type="button" aria-pressed="false">Flip ↻</button>
              <div className="meta"><div><h3>Taking a new telco brand from research to build-ready</h3><p className="co">DayUp for VNPT · Vietnam</p></div><span className="meta-acts"><a className="go" href="https://rishabhyadav.space/dayup.html">Read <span aria-hidden="true">→</span></a></span></div>
            </div>
            <div className="face-b">
              <div className="top"><p className="mono">DayUp · via Circles.Life</p><button className="flip" type="button" aria-pressed="true">↺</button></div>
              <p className="why">Listening to customers before building.</p>
              <div className="stat"><p className="num"><span className="b">22</span><span className="arr">→</span>10%</p><p className="lbl">Design issues as a share of QA bugs</p></div>
              <p className="mono">Senior Design Manager</p>
              <a className="btn sm read" href="https://rishabhyadav.space/dayup.html">Read the story →</a>
            </div>
          </div>
        </article>
        <article className="card pop" style={{'--bg': 'var(--cream)', '--back': 'var(--sun)', '--back-fg': 'var(--ink)', '--accent': 'var(--cobalt)', '--d': '160ms'}}>
          <div className="card-inner">
            <div className="face-f">
              <div className="art"><img src="/assets/card-leadership-capsule.webp" style={{objectPosition: '50% 0%'}} alt="Capsule v1 design system cover and its typography foundations page" loading="lazy" /><span className="scope mono">Design efficiency</span></div>
              <button className="flip corner" type="button" aria-pressed="false">Flip ↻</button>
              <div className="meta"><div><h3>Scaling design without scaling the chaos</h3><p className="co">Apollo 24/7 · India</p></div><span className="meta-acts"><a className="go" href="https://rishabhyadav.space/capsule.html">Read <span aria-hidden="true">→</span></a></span></div>
            </div>
            <div className="face-b">
              <div className="top"><p className="mono">Capsule · Apollo 24/7</p><button className="flip" type="button" aria-pressed="true">↺</button></div>
              <p className="why">One shared language across the teams we worked with.</p>
              <div className="stat"><p className="num"><span className="b">Days</span><span className="arr">→</span>hours</p><p className="lbl">Interface design time</p></div>
              <p className="mono">Design Lead</p>
              <a className="btn sm read" href="https://rishabhyadav.space/capsule.html">Read the story →</a>
            </div>
          </div>
        </article>
        <article className="card pop" style={{'--bg': 'var(--cream)', '--back': 'var(--cream-2)', '--back-fg': 'var(--ink)', '--accent': 'var(--tomato)', '--d': '160ms'}}>
          <div className="card-inner">
            <div className="face-f">
              <div className="art"><img src="/assets/card-waahjobs-trust.webp" style={{objectPosition: '50% 0%'}} alt="Waah Jobs logo above the sign-up screen promising no fees and verified jobs" loading="lazy" /><span className="scope mono">User trust</span></div>
              <button className="flip corner" type="button" aria-pressed="false">Flip ↻</button>
              <div className="meta"><div><h3>Making first-time app users feel safe</h3><p className="co">Waah Jobs, OLX Group · India</p></div><span className="meta-acts"><a className="go" href="https://rishabhyadav.space/uplifting.html">Read <span aria-hidden="true">→</span></a></span></div>
            </div>
            <div className="face-b">
              <div className="top"><p className="mono">Waah Jobs · OLX Group</p><button className="flip" type="button" aria-pressed="true">↺</button></div>
              <p className="why">Every lost star traced to a real problem.</p>
              <div className="stat"><p className="num"><span className="b">2.2</span><span className="arr">→</span>4.2</p><p className="lbl">Play Store rating</p></div>
              <p className="mono">UX Designer II</p>
              <a className="btn sm read" href="https://rishabhyadav.space/uplifting.html">Read the story →</a>
            </div>
          </div>
        </article>
        <article className="card pop" style={{'--bg': 'var(--cream)', '--back': 'var(--tomato)', '--back-fg': 'var(--ink)', '--accent': 'var(--ink)'}}>
          <div className="card-inner">
            <div className="face-f">
              <div className="art"><img src="/assets/card-waahjobs-onboarding.webp" style={{objectPosition: '50% 0%'}} alt="Waah Jobs logo above the job-category picker on an iPhone" loading="lazy" /><span className="scope mono">Conversion</span></div>
              <button className="flip corner" type="button" aria-pressed="false">Flip ↻</button>
              <div className="meta"><div><h3>Asking less, so more people get started</h3><p className="co">Waah Jobs, OLX Group · India</p></div><span className="meta-acts"><a className="go" href="https://rishabhyadav.space/onboarding.html">Read <span aria-hidden="true">→</span></a></span></div>
            </div>
            <div className="face-b">
              <div className="top"><p className="mono">Waah Jobs · OLX Group</p><button className="flip" type="button" aria-pressed="true">↺</button></div>
              <p className="why">Getting people to a job, not through a form.</p>
              <div className="stat"><p className="num"><span className="b">61.7</span><span className="arr">→</span>82.4%</p><p className="lbl">Onboarding conversion</p></div>
              <p className="mono">UX Designer II</p>
              <a className="btn sm read" href="https://rishabhyadav.space/onboarding.html">Read the story →</a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
