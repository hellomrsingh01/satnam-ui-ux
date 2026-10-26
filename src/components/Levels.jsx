export default function Levels() {
  return (
    <section className="levels wrap" id="levels">
      <div className="levels-head">
        <p className="kicker mono">03 · Career</p>
        <h2 className="section-title pop">Ten years,<br />six levels.</h2>
        <p className="pop">Every level unlocked something I still use. Scroll to play through it.</p>
      </div>
      <div className="map" data-map>
        <svg className="path" aria-hidden="true"><path data-path-base /><path className="done" data-path-done /></svg>
        <ol>
          <li className="level" data-level>
            <span className="node">1</span>
            <div className="lvl-card pop">
              <p className="top mono"><span>Level 1</span><span>2016 – 2018</span></p>
              <h3>Spineor</h3>
              <p className="role">Chief Designer · edtech startup, Hyderabad</p>
              <p className="story">First design hire. Built the brand and the product philosophy from scratch, and designed two web products and a mobile app for parents, teachers and students.</p>
              <p className="loot"><span style={{'--c': 'var(--mint)'}}>First design hire</span><span>Brand from zero</span><span>2 web + 1 mobile product</span></p>
            </div>
          </li>
          <li className="level" data-level>
            <span className="node">2</span>
            <div className="lvl-card pop">
              <p className="top mono"><span>Level 2</span><span>2018 – 2020</span></p>
              <h3>Harbinger</h3>
              <p className="role">Senior Associate Design · hyperlocal discovery, India</p>
              <p className="story">Led design across a hyperlocal discovery app and in-app gaming, helping establish the design system.</p>
              <p className="loot"><span style={{'--c': 'var(--pink)'}}><svg className="ei ei-controller" viewBox="0 0 24 24" aria-hidden="true"><g className="e-pad"><path className="eo" d="M7 7.5h10a4.5 4.5 0 0 1 4.5 4.5v1.8a3.4 3.4 0 0 1-6 2.2l-1.3-1.6H9.8L8.5 16a3.4 3.4 0 0 1-6-2.2V12A4.5 4.5 0 0 1 7 7.5z" fill="var(--cobalt)" /><path d="M5.9 10.7h1.6V9.1h1.4v1.6h1.6v1.4H8.9v1.6H7.5v-1.6H5.9z" fill="var(--cream)" /><circle className="e-b1" cx={16} cy="10.8" r="1.25" fill="var(--tomato)" stroke="var(--ink)" strokeWidth=".8" /><circle className="e-b2" cx="18.3" cy={13} r="1.25" fill="var(--sun)" stroke="var(--ink)" strokeWidth=".8" /></g></svg> 2 games shipped</span><span>Design system</span><span style={{'--c': 'var(--sun)'}}><svg className="ei ei-trophy" viewBox="0 0 24 24" aria-hidden="true"><path className="eo" d="M7 5.5H4.6V7a3 3 0 0 0 3 3M17 5.5h2.4V7a3 3 0 0 1-3 3" fill="none" /><path className="eo" d="M7 3.5h10v5a5 5 0 0 1-10 0z" fill="var(--sun)" /><path className="eo" d="M10.5 13.4h3l.6 3.1H9.9z" fill="var(--sun)" /><rect className="eo" x="7.5" y="16.5" width={9} height={4} rx={1} fill="var(--tomato)" /><path className="e-glint" d="M9.4 5.2v3" stroke="var(--cream)" strokeWidth="1.6" strokeLinecap="round" /><g transform="translate(20 2.6) scale(0.85)"><path className="e-spk" d="M0-3l.9 2.1L3 0l-2.1.9L0 3l-.9-2.1L-3 0l2.1-.9z" fill="var(--cream)" stroke="var(--ink)" strokeWidth="0.94" strokeLinejoin="round" /></g></svg> Most Valuable Player</span></p>
            </div>
          </li>
          <li className="level" data-level>
            <span className="node">3</span>
            <div className="lvl-card pop">
              <p className="top mono"><span>Level 3</span><span>2020 – 2022</span></p>
              <h3>Harman</h3>
              <p className="role">UX Designer II · jobs marketplace by OLX Group, India</p>
              <p className="story">Led UX and research for products serving blue- and grey-collar jobseekers.</p>
              <p className="loot"><span style={{'--c': 'var(--mint)'}}>2.2 → 4.2 rating</span><span style={{'--c': 'var(--mint)'}}>61.7% → 82.4% onboarding</span><span style={{'--c': 'var(--sun)'}}><svg className="ei ei-trophy" viewBox="0 0 24 24" aria-hidden="true"><path className="eo" d="M7 5.5H4.6V7a3 3 0 0 0 3 3M17 5.5h2.4V7a3 3 0 0 1-3 3" fill="none" /><path className="eo" d="M7 3.5h10v5a5 5 0 0 1-10 0z" fill="var(--sun)" /><path className="eo" d="M10.5 13.4h3l.6 3.1H9.9z" fill="var(--sun)" /><rect className="eo" x="7.5" y="16.5" width={9} height={4} rx={1} fill="var(--tomato)" /><path className="e-glint" d="M9.4 5.2v3" stroke="var(--cream)" strokeWidth="1.6" strokeLinecap="round" /><g transform="translate(20 2.6) scale(0.85)"><path className="e-spk" d="M0-3l.9 2.1L3 0l-2.1.9L0 3l-.9-2.1L-3 0l2.1-.9z" fill="var(--cream)" stroke="var(--ink)" strokeWidth="0.94" strokeLinejoin="round" /></g></svg> Outstanding Performance</span></p>
            </div>
          </li>
          <li className="level" data-level>
            <span className="node">4</span>
            <div className="lvl-card pop">
              <p className="top mono"><span>Level 4</span><span>2022 – 2023</span></p>
              <h3>EY</h3>
              <p className="role">Design Lead · digital healthcare, India</p>
              <p className="story">Led the end-to-end visual and UX revamp of a major healthcare ecosystem while growing the team.</p>
              <p className="loot"><span style={{'--c': 'var(--lilac)'}}>Capsule design system</span><span>Org 2× in 2 months</span><span>10+ designers mentored</span></p>
            </div>
          </li>
          <li className="level" data-level>
            <span className="node">5</span>
            <div className="lvl-card pop">
              <p className="top mono"><span>Level 5</span><span>2023 – 2024</span></p>
              <h3>Expandimo</h3>
              <p className="role">Design Lead · AI AdTech startup</p>
              <p className="story">Built the product-design function from zero, partnering directly with founders on product direction.</p>
              <p className="loot"><span>Design function from 0</span><span style={{'--c': 'var(--sun)'}}><svg className="ei ei-trophy" viewBox="0 0 24 24" aria-hidden="true"><path className="eo" d="M7 5.5H4.6V7a3 3 0 0 0 3 3M17 5.5h2.4V7a3 3 0 0 1-3 3" fill="none" /><path className="eo" d="M7 3.5h10v5a5 5 0 0 1-10 0z" fill="var(--sun)" /><path className="eo" d="M10.5 13.4h3l.6 3.1H9.9z" fill="var(--sun)" /><rect className="eo" x="7.5" y="16.5" width={9} height={4} rx={1} fill="var(--tomato)" /><path className="e-glint" d="M9.4 5.2v3" stroke="var(--cream)" strokeWidth="1.6" strokeLinecap="round" /><g transform="translate(20 2.6) scale(0.85)"><path className="e-spk" d="M0-3l.9 2.1L3 0l-2.1.9L0 3l-.9-2.1L-3 0l2.1-.9z" fill="var(--cream)" stroke="var(--ink)" strokeWidth="0.94" strokeLinejoin="round" /></g></svg> Top Performing Employee</span></p>
            </div>
          </li>
          <li className="level current" data-level>
            <span className="node">6</span>
            <div className="lvl-card pop">
              <p className="top mono"><span>Level 6 · current</span><span>2024 – today</span></p>
              <h3>Freelancer (Upwork)</h3>
              <p className="role">Freelance UI/UX Designer · remote, worldwide clients</p>
              <p className="story">Full-time freelancer on Upwork, designing end-to-end UI/UX for startups and businesses across industries, from research and wireframes to polished, ready-to-build interfaces.</p>
              <p className="loot"><span style={{'--c': 'var(--cream)'}}>Full-time freelancer</span><span style={{'--c': 'var(--cream)'}}>UI/UX design</span><span style={{'--c': 'var(--cream)'}}>Worldwide clients</span></p>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
