import { useEffect, useRef } from 'react';

export default function Quests() {
  // React's JSX attribute handling warns about `inert` regardless of whether
  // it's passed as a boolean or an empty string, so it's set as a plain DOM
  // property instead (this iframe is a non-interactive autoplaying preview).
  const peekRef = useRef(null);
  useEffect(() => {
    if (peekRef.current) peekRef.current.inert = true;
  }, []);

  return (
    <section className="quests" id="quests">
      <div className="wrap">
        <div className="quests-head">
          <div>
            <p className="kicker mono">04 · Side quests</p>
            <h2 className="section-title pop">Spreadsheets<br />and sketchbooks.</h2>
          </div>
          <div className="pop">
            <p>I’m happiest with a metric tree in one tab and a sketch in the other. I still draw: illustrations for Apollo 24/7, motion pieces, posters, and two games at magicpin.</p>
            <p>Making things keeps my critique honest.</p>
          </div>
        </div>
        <div className="gallery">
          <figure className="tile pop" style={{'--r': '-1deg'}}><video style={{aspectRatio: '576 / 1024'}} src="/assets/video/creative-13.mp4" poster="/assets/poster/creative-13-poster.webp" width={576} height={1024} muted loop playsInline preload="none" aria-label="Rewards explainer animation" data-play /></figure>
          <figure className="tile pop" style={{'--r': '1.5deg'}}><img src="/assets/creative-03.webp" width={2032} height={1524} alt="Apollo 24/7 healthcare illustration set" loading="lazy" /></figure>
          <figure className="tile pop" style={{'--r': '-2deg'}}><video style={{aspectRatio: '712 / 1264'}} src="/assets/video/creative-14.mp4" poster="/assets/poster/creative-14-poster.webp" width={712} height={1264} muted loop playsInline preload="none" aria-label="magicpin splash screen animation: a location pin pulsing out of concentric rings" data-play /></figure>
          <figure className="tile pop" style={{'--r': '1deg'}}><img src="/assets/creative-04.webp" width={2036} height={1526} alt="404 illustration for Apollo 24/7" loading="lazy" /></figure>
          <figure className="tile pop" style={{'--r': '2deg'}}><video style={{aspectRatio: '360 / 640'}} src="/assets/video/creative-10.mp4" poster="/assets/poster/creative-10-poster.webp" width={360} height={640} muted loop playsInline preload="none" aria-label="Animated social profile screens" data-play /></figure>
          <figure className="tile pop" style={{'--r': '-1.5deg'}}><img src="/assets/creative-01.webp" width={985} height={745} alt="Hypergro.ai Growth AI landing page" loading="lazy" /></figure>
          <figure className="tile pop" style={{'--r': '-1deg'}}><img src="/assets/creative-15.webp" width={720} height={1280} alt="magicpin superhero collecting game loading screen with the game emblem" loading="lazy" /></figure>
          <figure className="tile pop" style={{'--r': '1.5deg'}}><img src="/assets/creative-12.webp" width={1400} height={1200} alt="Rigkno dashboard for school operators: plan tasks for school in advance" loading="lazy" /></figure>
          <figure className="tile pop" style={{'--r': '-2deg'}}><img src="/assets/creative-06.webp" width={2030} height={1520} alt="Apollo 24/7 Circle membership screens" loading="lazy" /></figure>
          <figure className="tile pop" style={{'--r': '1deg'}}><img src="/assets/creative-08.webp" width={800} height={600} alt="Waah Jobs logo reveal animation" loading="lazy" /></figure>
          <figure className="tile pop" style={{'--r': '2deg'}}><video style={{aspectRatio: '1600 / 1200'}} src="/assets/video/creative-09.mp4" poster="/assets/poster/creative-09-poster.webp" width={1600} height={1200} muted loop playsInline preload="none" aria-label="Waah Jobs onboarding prototype animation" data-play /></figure>
          <figure className="tile pop" style={{'--r': '-1.5deg'}}><img src="/assets/creative-02.webp" width={985} height={745} alt="Hypergro.ai Target AI landing page" loading="lazy" /></figure>
          <figure className="tile pop" style={{'--r': '-1deg'}}><video style={{aspectRatio: '1600 / 1200'}} src="/assets/video/creative-07.mp4" poster="/assets/poster/creative-07-poster.webp" width={1600} height={1200} muted loop playsInline preload="none" aria-label="Motion design study" data-play /></figure>
          <figure className="tile pop" style={{'--r': '1.5deg'}}><img src="/assets/creative-05.webp" width={2028} height={1518} alt="Apollo Pharmacy product page" loading="lazy" /></figure>
          <figure className="tile pop" style={{'--r': '-2deg'}}><img src="/assets/creative-11.webp" width={1400} height={800} alt="Minimal landscape poster triptych" loading="lazy" /></figure>
        </div>
        <div className="gallery-wide">
          <figure className="tile pop" style={{'--r': '0.4deg'}}><img src="/assets/creative-16.webp" width={2280} height={1026} alt="magicpin collecting game screens: card collection, quests at nearby outlets, booster shop and a caught-character reward" loading="lazy" /></figure>
        </div>
        <div className="game pop" data-game>
          <div className="game-top">
            <div>
              <h3><svg className="ei ei-controller" viewBox="0 0 24 24" aria-hidden="true"><g className="e-pad"><path className="eo" d="M7 7.5h10a4.5 4.5 0 0 1 4.5 4.5v1.8a3.4 3.4 0 0 1-6 2.2l-1.3-1.6H9.8L8.5 16a3.4 3.4 0 0 1-6-2.2V12A4.5 4.5 0 0 1 7 7.5z" fill="var(--cobalt)" /><path d="M5.9 10.7h1.6V9.1h1.4v1.6h1.6v1.4H8.9v1.6H7.5v-1.6H5.9z" fill="var(--cream)" /><circle className="e-b1" cx={16} cy="10.8" r="1.25" fill="var(--tomato)" stroke="var(--ink)" strokeWidth=".8" /><circle className="e-b2" cx="18.3" cy={13} r="1.25" fill="var(--sun)" stroke="var(--ink)" strokeWidth=".8" /></g></svg> Ship it!</h3>
              <p>I designed games once. So here is a side quest: run, jump and stomp the blockers every design team knows.</p>
            </div>
            <div className="score" hidden><span>Best time <b data-best /></span></div>
          </div>
          <a className="stage" href="/play.html" aria-label="Start the sprint: open the full-screen Ship it game">
            <iframe ref={peekRef} src="/play.html?peek" title="Ship it, playing itself" loading="lazy" tabIndex={-1} aria-hidden="true" />
            <span className="overlay">
              <span className="btn sun"><svg className="play-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="var(--ink)" stroke="var(--ink)" strokeWidth="1.6" strokeLinejoin="round" /></svg> Start the sprint</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
