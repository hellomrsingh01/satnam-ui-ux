export default function Nav() {
  return (
    <header className="nav" data-nav>
      <div className="wrap">
        <div className="nav-pill">
          <a className="logo" href="#top" aria-label="Satnam Yadav, back to top">SY</a>
          <nav aria-label="Primary">
            <a href="#work">Work</a>
            <a href="#manual">How I lead</a>
            <a href="#levels">Career</a>
            <a href="#quests">Side quests</a>
          </nav>
        </div>
        <div className="nav-actions">
          <button className="btn sm sun" type="button" data-tldr-open><span className="wiggle"><svg className="ei ei-stopwatch" viewBox="0 0 24 24" aria-hidden="true"><circle className="eo" cx={12} cy="13.5" r={8} fill="var(--cream)" /><rect className="eo" x={10} y="2.2" width={4} height="2.8" rx={1} fill="var(--tomato)" /><path className="eo" d="M18.3 6.8l1.3-1.3" /><path d="M12 7.3v1.1M12 18.6v1.1M5.8 13.5h1.1M17.1 13.5h1.1" stroke="var(--ink)" strokeWidth="1.2" strokeLinecap="round" /><path className="eo e-hand" d="M12 13.5V8.6" /><circle cx={12} cy="13.5" r="1.3" fill="var(--ink)" /></svg></span> <span>60<span className="nav-long">-second version</span><span className="nav-short"> sec</span></span></button>
          <a className="btn sm" href="#contact">Say hi</a>
        </div>
      </div>
    </header>
  );
}
